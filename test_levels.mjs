// Level completability simulator
// Models player jump physics and checks reachability between all platforms
// Player: 14w x 26h collision box
// Jump: vy=-420, gravity=800, vx=200
// Max jump height: ~110px, max horizontal: ~210px

import { readFileSync } from 'fs';
const src = readFileSync('./src/levels.js', 'utf-8');
const code = src.replace('export const', 'const');
const LEVELS = new Function(code + '; return LEVELS;')();

const GRAVITY = 800;
const JUMP_VY = -420;
const MOVE_VX = 200;
const PLAYER_W = 14;
const PLAYER_H = 26;
const SPIKE_BODY_W = 12;
const SPIKE_BODY_H = 10;
const SPIKE_OFFSET_X = 2;
const SPIKE_OFFSET_Y = 6;

// Player stands on a platform: center y = platform_top - PLAYER_H/2
// collision bottom = center_y + PLAYER_H/2 = platform_top

function getPlatformSurfaces(level) {
  const surfaces = [];
  for (const p of level.platforms) {
    // Each platform definition creates tiles, but for reachability
    // we treat the whole rect as one surface
    surfaces.push({
      left: p.x,
      right: p.x + p.w,
      top: p.y,
      label: `plat(${p.x},${p.y},${p.w}x${p.h})`,
    });
  }
  // Moving platforms at their full sweep range
  if (level.movingPlatforms) {
    for (const mp of level.movingPlatforms) {
      const baseLeft = mp.x;
      const baseRight = mp.x + mp.w;
      const moveX = mp.moveX ?? 0;
      const moveY = mp.moveY ?? 0;
      // Platform sweeps between base and base+move
      const left = Math.min(baseLeft, baseLeft + moveX);
      const right = Math.max(baseRight, baseRight + moveX);
      const topMin = Math.min(mp.y, mp.y + moveY);
      const topMax = Math.max(mp.y, mp.y + moveY);
      // At some point the platform is at every y between topMin and topMax
      // For reachability, treat it as accessible at any point in its range
      surfaces.push({
        left, right,
        top: topMin,
        topMax: topMax,
        moving: true,
        moveX, moveY,
        label: `moving(${mp.x},${mp.y},${mp.w})`,
      });
    }
  }
  return surfaces;
}

function getSpikeRects(level) {
  return level.spikes.map(s => ({
    left: s.x - 8 + SPIKE_OFFSET_X,
    right: s.x - 8 + SPIKE_OFFSET_X + SPIKE_BODY_W,
    top: s.y - 8 + SPIKE_OFFSET_Y,
    bottom: s.y - 8 + SPIKE_OFFSET_Y + SPIKE_BODY_H,
  }));
}

function rectsOverlap(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

// Get safe x-ranges on a platform surface (not blocked by spikes)
function getSafeZones(surface, spikes, standingY) {
  // Player collision box when standing at position x on this surface:
  // center_y = surface.top - PLAYER_H/2 (for static) or varies for moving
  const playerTop = standingY - PLAYER_H / 2;
  const playerBottom = standingY + PLAYER_H / 2;

  // Start with full platform range (accounting for player width)
  const minX = surface.left + PLAYER_W / 2;
  const maxX = surface.right - PLAYER_W / 2;
  if (minX >= maxX) return [];

  // Find spike-blocked x ranges
  const blocked = [];
  for (const spike of spikes) {
    // Check vertical overlap with player standing on this surface
    const playerRect = { left: 0, right: 800, top: playerTop, bottom: playerBottom };
    const spikeVOverlap = playerRect.top < spike.bottom && playerRect.bottom > spike.top;
    if (!spikeVOverlap) continue;

    // Horizontal: player at x has collision [x-7, x+7]
    // Spike body is [spike.left, spike.right]
    // Overlap when: x-7 < spike.right && x+7 > spike.left
    // So blocked when: spike.left - 7 < x < spike.right + 7
    const bLeft = spike.left - PLAYER_W / 2;
    const bRight = spike.right + PLAYER_W / 2;
    blocked.push({ left: bLeft, right: bRight });
  }

  // Subtract blocked ranges from [minX, maxX]
  blocked.sort((a, b) => a.left - b.left);
  const safe = [];
  let cursor = minX;
  for (const b of blocked) {
    if (b.left > cursor) {
      safe.push({ left: cursor, right: Math.min(b.left, maxX) });
    }
    cursor = Math.max(cursor, b.right);
  }
  if (cursor < maxX) {
    safe.push({ left: cursor, right: maxX });
  }

  return safe.filter(z => z.right - z.left >= 1); // at least 1px
}

// Can the player jump from surface A to surface B?
// Player starts anywhere in safe zones of A, jumps with fixed vy=-420, vx=±200
function canReach(surfA, surfB, spikes) {
  const standA = surfA.top - PLAYER_H / 2;
  const safeA = getSafeZones(surfA, spikes, standA);
  if (safeA.length === 0) return false;

  // For moving platforms, check multiple y positions
  const bTops = [];
  if (surfB.moving && surfB.topMax !== undefined) {
    // Sample several positions
    for (let t = 0; t <= 1; t += 0.1) {
      bTops.push(surfB.top + (surfB.topMax - surfB.top) * t);
    }
  } else {
    bTops.push(surfB.top);
  }

  for (const bTop of bTops) {
    const standB = bTop - PLAYER_H / 2;
    const safeB = getSafeZones(surfB, spikes, standB);
    if (safeB.length === 0) continue;

    const heightDiff = standA - standB; // positive = B is higher

    // Can player walk directly? (same height, overlapping x)
    if (Math.abs(surfA.top - bTop) < 2) {
      for (const zA of safeA) {
        for (const zB of safeB) {
          if (zA.right >= zB.left && zA.left <= zB.right) return true;
        }
      }
    }

    // Can player fall to B? (B is lower, overlapping or reachable x)
    if (bTop > surfA.top) {
      const fallHeight = bTop - surfA.top;
      // Time to fall fallHeight: fallHeight = 0.5 * g * t^2, t = sqrt(2*h/g)
      const fallTime = Math.sqrt(2 * fallHeight / GRAVITY);
      // With a jump, time is longer — max horizontal with jump
      const maxJumpTime = JUMP_VY / -GRAVITY + Math.sqrt((JUMP_VY * JUMP_VY + 2 * GRAVITY * fallHeight)) / GRAVITY;
      const maxDist = MOVE_VX * Math.max(fallTime, maxJumpTime);

      for (const zA of safeA) {
        for (const zB of safeB) {
          // Can reach by walking off edge
          const distRight = zB.left - zA.right;
          const distLeft = zA.left - zB.right;
          const minDist = Math.min(Math.abs(distRight), Math.abs(distLeft));
          if (minDist <= maxDist || (zA.right >= zB.left && zA.left <= zB.right)) return true;
        }
      }
    }

    // Jump arc check for B higher or same level
    if (heightDiff >= -20) { // B is higher or nearly same
      // Time to reach height: standA - 420t + 400t² = standB
      // 400t² - 420t + (standA - standB) = 0
      // 400t² - 420t - heightDiff = 0 (heightDiff = standA - standB > 0 for B higher)
      const a = GRAVITY / 2; // 400
      const b = JUMP_VY;     // -420
      const c = -(standA - standB); // = standB - standA = -heightDiff

      const disc = b * b - 4 * a * c;
      if (disc < 0) continue;

      const sqrtDisc = Math.sqrt(disc);
      const t1 = (-b - sqrtDisc) / (2 * a); // going up
      const t2 = (-b + sqrtDisc) / (2 * a); // coming down

      for (const zA of safeA) {
        for (const zB of safeB) {
          // Check both directions (left and right)
          for (const dir of [1, -1]) {
            for (const t of [t1, t2]) {
              if (t < 0) continue;
              // Player x at time t
              const dx = dir * MOVE_VX * t;
              // Range of start positions on A
              const startMin = zA.left;
              const startMax = zA.right;
              // End position = start + dx
              // Need end in [zB.left, zB.right]
              // start + dx in [zB.left, zB.right]
              // start in [zB.left - dx, zB.right - dx]
              const needMin = zB.left - dx;
              const needMax = zB.right - dx;
              // Intersection with [startMin, startMax]
              const overlapMin = Math.max(startMin, needMin);
              const overlapMax = Math.min(startMax, needMax);
              if (overlapMin < overlapMax) return true;
            }

            // Also check if player can reach by partially holding direction
            // (less than full speed, arriving at any time between t1 and t2)
            if (t1 > 0 && t2 > t1) {
              const minDx = dir * MOVE_VX * t1;
              const maxDx = dir * MOVE_VX * t2;
              const dxRange = [Math.min(minDx, maxDx), Math.max(minDx, maxDx)];
              // Also can do 0 to max horizontal (partial speed)
              const fullRange = [Math.min(0, dxRange[0]), Math.max(0, dxRange[1])];

              for (const startX of [zA.left, zA.right, (zA.left + zA.right) / 2]) {
                if (startX < zA.left || startX > zA.right) continue;
                const endMin = startX + fullRange[0];
                const endMax = startX + fullRange[1];
                if (endMax >= zB.left && endMin <= zB.right) return true;
              }
            }
          }
        }
      }
    }

    // Falling to lower platform with horizontal movement
    if (bTop > surfA.top) {
      const fallH = bTop - surfA.top;
      // Jump then fall: total time from jump to reaching bTop on way down
      // y(t) = standA + JUMP_VY*t + 0.5*GRAVITY*t² = standB
      // 400t² - 420t + (standA-standB) = 0
      const a = GRAVITY / 2;
      const b = JUMP_VY;
      const c = standA - standB;
      const disc = b * b - 4 * a * c;
      if (disc >= 0) {
        const t2 = (-b + Math.sqrt(disc)) / (2 * a); // later time (on way down)
        if (t2 > 0) {
          const maxDx = MOVE_VX * t2;
          for (const zA of safeA) {
            for (const zB of safeB) {
              for (const dir of [1, -1]) {
                const endMin = zA.left + (dir > 0 ? 0 : -maxDx);
                const endMax = zA.right + (dir > 0 ? maxDx : 0);
                if (endMax >= zB.left && endMin <= zB.right) return true;
              }
            }
          }
        }
      }
    }
  }

  return false;
}

// Check if a point (key/door) is accessible from any surface
function pointOnSurface(point, surfaces) {
  for (let i = 0; i < surfaces.length; i++) {
    const s = surfaces[i];
    const tops = [];
    if (s.moving && s.topMax !== undefined) {
      for (let t = 0; t <= 1; t += 0.1) tops.push(s.top + (s.topMax - s.top) * t);
    } else {
      tops.push(s.top);
    }
    for (const top of tops) {
      if (point.x >= s.left && point.x <= s.right) {
        const standY = top - PLAYER_H / 2;
        if (Math.abs(point.y - standY) < 40) return i;
      }
    }
  }
  return -1;
}

// BFS to find if there's a path from spawn to target through surfaces
function findPath(surfaces, startIdx, endIdx, spikes) {
  const n = surfaces.length;
  const visited = new Set();
  const queue = [startIdx];
  visited.add(startIdx);

  while (queue.length > 0) {
    const cur = queue.shift();
    if (cur === endIdx) return true;

    for (let next = 0; next < n; next++) {
      if (visited.has(next)) continue;
      if (canReach(surfaces[cur], surfaces[next], spikes) ||
          canReach(surfaces[next], surfaces[cur], spikes) === false && canReach(surfaces[cur], surfaces[next], spikes)) {
        // Just check cur->next
      }
      if (canReach(surfaces[cur], surfaces[next], spikes)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  return false;
}

// Run tests
console.log('=== Level Completability Test ===\n');
let allPass = true;

for (let i = 0; i < LEVELS.length; i++) {
  const level = LEVELS[i];
  const surfaces = getPlatformSurfaces(level);
  const spikes = getSpikeRects(level);

  // Find which surface the spawn is on
  const spawnIdx = pointOnSurface(level.spawn, surfaces);
  const doorIdx = pointOnSurface(level.door, surfaces);

  const issues = [];
  if (spawnIdx === -1) issues.push('Spawn not on any platform');
  if (doorIdx === -1) issues.push('Door not on any platform');

  let keyIdx = -1;
  if (level.key) {
    keyIdx = pointOnSurface(level.key, surfaces);
    if (keyIdx === -1) issues.push('Key not on any platform');
  }

  if (issues.length === 0) {
    // Check if spawn can reach key (if exists) and door
    if (level.key) {
      const canGetKey = findPath(surfaces, spawnIdx, keyIdx, spikes);
      if (!canGetKey) issues.push(`Cannot reach key from spawn (plat ${spawnIdx} -> ${keyIdx})`);

      const canGetDoor = findPath(surfaces, keyIdx, doorIdx, spikes);
      if (!canGetDoor) issues.push(`Cannot reach door from key (plat ${keyIdx} -> ${doorIdx})`);
    } else {
      const canGetDoor = findPath(surfaces, spawnIdx, doorIdx, spikes);
      if (!canGetDoor) issues.push(`Cannot reach door from spawn (plat ${spawnIdx} -> ${doorIdx})`);
    }
  }

  // Check safe zones on each surface
  for (let s = 0; s < surfaces.length; s++) {
    const surf = surfaces[s];
    const standY = surf.top - PLAYER_H / 2;
    const safe = getSafeZones(surf, spikes, standY);
    const totalSafe = safe.reduce((sum, z) => sum + (z.right - z.left), 0);
    if (totalSafe < 1 && (s === spawnIdx || s === doorIdx || s === keyIdx)) {
      issues.push(`Critical platform ${s} (${surf.label}) has no safe landing zone`);
    }
  }

  const status = issues.length === 0 ? 'PASS' : 'FAIL';
  if (status === 'FAIL') allPass = false;

  console.log(`Level ${i + 1}: ${status}`);
  if (issues.length > 0) {
    issues.forEach(issue => console.log(`  - ${issue}`));
  }

  // Print reachability matrix summary
  const reachable = new Set();
  const q = [spawnIdx];
  reachable.add(spawnIdx);
  while (q.length > 0) {
    const cur = q.shift();
    for (let next = 0; next < surfaces.length; next++) {
      if (reachable.has(next)) continue;
      if (canReach(surfaces[cur], surfaces[next], spikes)) {
        reachable.add(next);
        q.push(next);
      }
    }
  }
  console.log(`  Reachable: ${reachable.size}/${surfaces.length} platforms from spawn`);
}

console.log(`\n${allPass ? 'ALL LEVELS PASS' : 'SOME LEVELS HAVE ISSUES'}`);
