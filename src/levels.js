export const LEVELS = [
  // ── Level 1: Introduction ──
  {
    spawn: { x: 60, y: 440 },
    door: { x: 60, y: 268 },
    platforms: [
      { x: 0, y: 472, w: 800, h: 32 },
      { x: 0, y: 280, w: 160, h: 32 },
      { x: 256, y: 376, w: 96, h: 32 },
      { x: 448, y: 248, w: 352, h: 32 },
      { x: 736, y: 280, w: 64, h: 192 },
    ],
    spikes: [
      { x: 340, y: 462 },
      { x: 370, y: 462 },
      { x: 400, y: 462 },
      { x: 520, y: 462 },
      { x: 550, y: 462 },
    ],
  },

  // ── Level 2: The Pit ──
  {
    spawn: { x: 60, y: 440 },
    door: { x: 740, y: 140 },
    key: { x: 400, y: 340 },
    platforms: [
      { x: 0, y: 472, w: 256, h: 32 },
      { x: 320, y: 376, w: 96, h: 32 },
      { x: 544, y: 472, w: 256, h: 32 },
      { x: 544, y: 344, w: 128, h: 32 },
      { x: 640, y: 248, w: 96, h: 32 },
      { x: 688, y: 152, w: 112, h: 32 },
      { x: 0, y: 312, w: 128, h: 32 },
    ],
    spikes: [
      { x: 150, y: 462 },
      { x: 180, y: 462 },
      { x: 210, y: 462 },
      { x: 580, y: 462 },
      { x: 610, y: 462 },
      { x: 700, y: 462 },
      { x: 730, y: 462 },
      { x: 760, y: 462 },
    ],
  },

  // ── Level 3: Moving Madness ──
  {
    spawn: { x: 60, y: 440 },
    door: { x: 740, y: 440 },
    key: { x: 400, y: 120 },
    platforms: [
      { x: 0, y: 472, w: 128, h: 32 },
      { x: 672, y: 472, w: 128, h: 32 },
      { x: 256, y: 472, w: 288, h: 32 },
      { x: 352, y: 152, w: 96, h: 32 },
      { x: 0, y: 280, w: 96, h: 32 },
      { x: 704, y: 248, w: 96, h: 32 },
    ],
    spikes: [
      { x: 280, y: 462 }, { x: 310, y: 462 }, { x: 340, y: 462 },
      { x: 370, y: 462 }, { x: 400, y: 462 }, { x: 430, y: 462 },
      { x: 460, y: 462 }, { x: 490, y: 462 }, { x: 520, y: 462 },
      { x: 170, y: 462 }, { x: 200, y: 462 },
      { x: 620, y: 462 }, { x: 650, y: 462 },
    ],
    movingPlatforms: [
      { x: 128, y: 408, w: 64, moveX: 80, moveY: 0, duration: 2000 },
      { x: 560, y: 408, w: 64, moveX: 80, moveY: 0, duration: 2500 },
      { x: 192, y: 340, w: 64, moveX: 0, moveY: -120, duration: 2200 },
      { x: 480, y: 220, w: 64, moveX: 160, moveY: 0, duration: 3000 },
    ],
  },

  // ── Level 4: The Gauntlet ──
  // Islands over death pits, key requires upper route, precise jumps
  {
    spawn: { x: 40, y: 440 },
    door: { x: 760, y: 440 },
    key: { x: 400, y: 216 },
    platforms: [
      // Start
      { x: 0, y: 472, w: 128, h: 32 },
      // Bottom islands
      { x: 256, y: 472, w: 96, h: 32 },
      { x: 480, y: 472, w: 96, h: 32 },
      // End
      { x: 672, y: 472, w: 128, h: 32 },
      // Upper route to key — overlaps start/end for accessible jumps
      { x: 96, y: 384, w: 96, h: 32 },
      { x: 288, y: 312, w: 96, h: 32 },
      { x: 480, y: 384, w: 96, h: 32 },
      // Key platform
      { x: 368, y: 248, w: 64, h: 32 },
    ],
    spikes: [
      // Death pits between islands
      { x: 160, y: 462 }, { x: 190, y: 462 }, { x: 220, y: 462 },
      { x: 380, y: 462 }, { x: 410, y: 462 }, { x: 440, y: 462 },
      { x: 600, y: 462 }, { x: 630, y: 462 }, { x: 660, y: 462 },
      // Spikes on bottom islands — one each side
      { x: 264, y: 462 }, { x: 336, y: 462 },
      { x: 488, y: 462 }, { x: 560, y: 462 },
      // End platform spike
      { x: 784, y: 462 },
      // Upper route hazards
      { x: 104, y: 374 },
      { x: 560, y: 374 },
    ],
  },

  // ── Level 5: The Climb ──
  // Vertical ascent — tiny platforms, key at top, door at bottom-right
  {
    spawn: { x: 40, y: 540 },
    door: { x: 750, y: 540 },
    key: { x: 400, y: 60 },
    platforms: [
      // Ground — split with death gap
      { x: 0, y: 568, w: 96, h: 32 },
      { x: 704, y: 568, w: 96, h: 32 },
      // Ascending platforms (zigzag)
      { x: 64, y: 472, w: 64, h: 32 },
      { x: 224, y: 408, w: 64, h: 32 },
      { x: 64, y: 344, w: 64, h: 32 },
      { x: 224, y: 280, w: 64, h: 32 },
      { x: 64, y: 216, w: 64, h: 32 },
      { x: 224, y: 152, w: 64, h: 32 },
      // Key platform at top
      { x: 368, y: 88, w: 64, h: 32 },
      // Descending platforms on right side
      { x: 512, y: 152, w: 64, h: 32 },
      { x: 672, y: 216, w: 64, h: 32 },
      { x: 512, y: 312, w: 64, h: 32 },
      { x: 672, y: 408, w: 64, h: 32 },
    ],
    spikes: [
      // Death pit across the bottom
      { x: 130, y: 558 }, { x: 160, y: 558 }, { x: 190, y: 558 }, { x: 220, y: 558 },
      { x: 250, y: 558 }, { x: 280, y: 558 }, { x: 310, y: 558 }, { x: 340, y: 558 },
      { x: 370, y: 558 }, { x: 400, y: 558 }, { x: 430, y: 558 }, { x: 460, y: 558 },
      { x: 490, y: 558 }, { x: 520, y: 558 }, { x: 550, y: 558 }, { x: 580, y: 558 },
      { x: 610, y: 558 }, { x: 640, y: 558 }, { x: 670, y: 558 },
      // Spikes on some platforms to narrow landing zone
      { x: 80, y: 462 },
      { x: 240, y: 398 },
      { x: 80, y: 334 },
      { x: 240, y: 270 },
      { x: 528, y: 302 },
      { x: 688, y: 398 },
    ],
  },

  // ── Level 6: Disappearing Act ──
  // Moving platforms are the ONLY way across huge spike pits — timing is everything
  {
    spawn: { x: 40, y: 440 },
    door: { x: 760, y: 440 },
    key: { x: 400, y: 200 },
    platforms: [
      // Start island
      { x: 0, y: 472, w: 96, h: 32 },
      // End island
      { x: 704, y: 472, w: 96, h: 32 },
      // Mid checkpoint island (tiny)
      { x: 384, y: 472, w: 32, h: 32 },
      // Upper key platform
      { x: 368, y: 232, w: 64, h: 32 },
      // Upper side ledges to reach key
      { x: 192, y: 312, w: 64, h: 32 },
      { x: 544, y: 312, w: 64, h: 32 },
    ],
    spikes: [
      // Massive spike pit left
      { x: 120, y: 462 }, { x: 150, y: 462 }, { x: 180, y: 462 }, { x: 210, y: 462 },
      { x: 240, y: 462 }, { x: 270, y: 462 }, { x: 300, y: 462 }, { x: 330, y: 462 }, { x: 360, y: 462 },
      // Massive spike pit right
      { x: 430, y: 462 }, { x: 460, y: 462 }, { x: 490, y: 462 }, { x: 520, y: 462 },
      { x: 550, y: 462 }, { x: 580, y: 462 }, { x: 610, y: 462 }, { x: 640, y: 462 }, { x: 670, y: 462 },
      // Spikes on upper ledges (narrow landing)
      { x: 200, y: 302 },
      { x: 552, y: 302 },
    ],
    movingPlatforms: [
      // Left pit crossers — offset timing
      { x: 96, y: 420, w: 64, moveX: 140, moveY: 0, duration: 1800 },
      { x: 240, y: 380, w: 64, moveX: 100, moveY: 0, duration: 2200 },
      // Right pit crossers
      { x: 440, y: 420, w: 64, moveX: 140, moveY: 0, duration: 2000 },
      { x: 580, y: 380, w: 64, moveX: 90, moveY: 0, duration: 1600 },
      // Vertical movers to key
      { x: 160, y: 440, w: 32, moveX: 0, moveY: -140, duration: 2500 },
      { x: 560, y: 440, w: 32, moveX: 0, moveY: -140, duration: 2500 },
    ],
  },

  // ── Level 7: The Saw Mill ──
  // Spike walls closing in — must navigate fast through tight gaps
  {
    spawn: { x: 40, y: 440 },
    door: { x: 760, y: 108 },
    key: { x: 750, y: 440 },
    platforms: [
      // Ground
      { x: 0, y: 472, w: 800, h: 32 },
      // Tier 1 — partial floors with gaps
      { x: 0, y: 376, w: 192, h: 32 },
      { x: 288, y: 376, w: 224, h: 32 },
      { x: 608, y: 376, w: 192, h: 32 },
      // Tier 2
      { x: 96, y: 280, w: 224, h: 32 },
      { x: 416, y: 280, w: 288, h: 32 },
      // Tier 3
      { x: 0, y: 184, w: 320, h: 32 },
      { x: 480, y: 184, w: 128, h: 32 },
      // Top — door ledge
      { x: 672, y: 120, w: 128, h: 32 },
    ],
    spikes: [
      // Spikes under tier 1 gaps — punish missed jumps
      { x: 210, y: 462 }, { x: 230, y: 462 }, { x: 250, y: 462 }, { x: 270, y: 462 },
      { x: 530, y: 462 }, { x: 550, y: 462 }, { x: 570, y: 462 }, { x: 590, y: 462 },
      // Spikes ON platforms (narrow safe zones)
      { x: 32, y: 366 }, { x: 64, y: 366 }, { x: 128, y: 366 }, { x: 160, y: 366 },
      { x: 320, y: 366 }, { x: 384, y: 366 }, { x: 448, y: 366 },
      { x: 640, y: 366 }, { x: 672, y: 366 }, { x: 736, y: 366 }, { x: 768, y: 366 },
      // Tier 2 spikes
      { x: 128, y: 270 }, { x: 192, y: 270 }, { x: 256, y: 270 },
      { x: 448, y: 270 }, { x: 544, y: 270 }, { x: 640, y: 270 },
      // Tier 3 spikes
      { x: 32, y: 174 }, { x: 96, y: 174 }, { x: 160, y: 174 }, { x: 224, y: 174 }, { x: 288, y: 174 },
      { x: 512, y: 174 }, { x: 544, y: 174 }, { x: 576, y: 174 },
    ],
  },

  // ── Level 8: Leap of Faith ──
  // Blind jumps — platforms barely visible, must commit
  {
    spawn: { x: 40, y: 540 },
    door: { x: 400, y: 60 },
    key: { x: 760, y: 280 },
    platforms: [
      // Start
      { x: 0, y: 568, w: 96, h: 32 },
      // Scattered tiny platforms — barely enough to land on
      { x: 192, y: 504, w: 32, h: 32 },
      { x: 320, y: 440, w: 32, h: 32 },
      { x: 192, y: 376, w: 32, h: 32 },
      { x: 384, y: 344, w: 32, h: 32 },
      // Right branch to key
      { x: 544, y: 376, w: 32, h: 32 },
      { x: 672, y: 312, w: 64, h: 32 },
      { x: 736, y: 312, w: 64, h: 32 },
      // Back across to door
      { x: 576, y: 248, w: 32, h: 32 },
      { x: 448, y: 184, w: 32, h: 32 },
      { x: 288, y: 152, w: 32, h: 32 },
      // Door platform
      { x: 368, y: 88, w: 64, h: 32 },
      // Decoy platforms near spikes
      { x: 128, y: 504, w: 32, h: 32 },
    ],
    spikes: [
      // Death floor
      { x: 120, y: 558 }, { x: 150, y: 558 }, { x: 180, y: 558 }, { x: 210, y: 558 },
      { x: 240, y: 558 }, { x: 270, y: 558 }, { x: 300, y: 558 }, { x: 330, y: 558 },
      { x: 360, y: 558 }, { x: 390, y: 558 }, { x: 420, y: 558 }, { x: 450, y: 558 },
      { x: 480, y: 558 }, { x: 510, y: 558 }, { x: 540, y: 558 }, { x: 570, y: 558 },
      { x: 600, y: 558 }, { x: 630, y: 558 }, { x: 660, y: 558 }, { x: 690, y: 558 },
      { x: 720, y: 558 }, { x: 750, y: 558 }, { x: 780, y: 558 },
      // Spikes on decoy
      { x: 136, y: 494 }, { x: 152, y: 494 },
      // Spikes near key
      { x: 680, y: 302 }, { x: 784, y: 302 },
    ],
  },

  // ── Level 9: The Grinder ──
  // Moving platforms + spikes everywhere — precision + timing combined
  {
    spawn: { x: 40, y: 440 },
    door: { x: 40, y: 108 },
    key: { x: 760, y: 108 },
    platforms: [
      // Bottom left start
      { x: 0, y: 472, w: 96, h: 32 },
      // Bottom right
      { x: 704, y: 472, w: 96, h: 32 },
      // Mid checkpoints (tiny)
      { x: 384, y: 408, w: 32, h: 32 },
      { x: 384, y: 280, w: 32, h: 32 },
      // Key platform top right
      { x: 704, y: 120, w: 96, h: 32 },
      // Door platform top left
      { x: 0, y: 120, w: 96, h: 32 },
      // Mid-level platforms
      { x: 192, y: 344, w: 64, h: 32 },
      { x: 576, y: 344, w: 64, h: 32 },
      { x: 192, y: 216, w: 64, h: 32 },
      { x: 576, y: 216, w: 64, h: 32 },
    ],
    spikes: [
      // Bottom death zone
      { x: 130, y: 462 }, { x: 160, y: 462 }, { x: 190, y: 462 }, { x: 220, y: 462 },
      { x: 250, y: 462 }, { x: 280, y: 462 }, { x: 310, y: 462 }, { x: 340, y: 462 },
      { x: 370, y: 462 },
      { x: 430, y: 462 }, { x: 460, y: 462 }, { x: 490, y: 462 }, { x: 520, y: 462 },
      { x: 550, y: 462 }, { x: 580, y: 462 }, { x: 610, y: 462 }, { x: 640, y: 462 },
      { x: 670, y: 462 },
      // On mid platforms
      { x: 200, y: 334 }, { x: 240, y: 334 },
      { x: 584, y: 334 }, { x: 624, y: 334 },
      { x: 200, y: 206 },
      { x: 624, y: 206 },
      // Near key/door
      { x: 40, y: 110 }, { x: 80, y: 110 },
      { x: 720, y: 110 }, { x: 784, y: 110 },
    ],
    movingPlatforms: [
      // Bottom crossers
      { x: 96, y: 420, w: 32, moveX: 100, moveY: 0, duration: 1500 },
      { x: 580, y: 420, w: 32, moveX: 100, moveY: 0, duration: 1500 },
      // Vertical lifts
      { x: 320, y: 400, w: 32, moveX: 0, moveY: -120, duration: 2000 },
      { x: 448, y: 400, w: 32, moveX: 0, moveY: -120, duration: 2000 },
      // Upper crossers
      { x: 96, y: 200, w: 32, moveX: 80, moveY: 0, duration: 1400 },
      { x: 640, y: 200, w: 32, moveX: 50, moveY: 0, duration: 1200 },
      // Top level movers
      { x: 288, y: 152, w: 32, moveX: 100, moveY: 0, duration: 1800 },
      { x: 480, y: 152, w: 32, moveX: 100, moveY: 0, duration: 1600 },
    ],
  },

  // ── Level 10: Devil's Gate ──
  // The final nightmare — everything combined, one wrong move = death
  {
    spawn: { x: 40, y: 540 },
    door: { x: 400, y: 44 },
    key: { x: 760, y: 540 },
    platforms: [
      // Bottom corners only
      { x: 0, y: 568, w: 64, h: 32 },
      { x: 736, y: 568, w: 64, h: 32 },
      // Ascending gauntlet — left side
      { x: 128, y: 504, w: 32, h: 32 },
      { x: 256, y: 440, w: 32, h: 32 },
      // Center checkpoint
      { x: 384, y: 408, w: 32, h: 32 },
      // Right side to key
      { x: 544, y: 472, w: 32, h: 32 },
      { x: 672, y: 536, w: 32, h: 32 },
      // Back up — right side
      { x: 640, y: 376, w: 32, h: 32 },
      { x: 544, y: 312, w: 32, h: 32 },
      // Center mid
      { x: 384, y: 280, w: 32, h: 32 },
      // Left upper
      { x: 192, y: 248, w: 32, h: 32 },
      { x: 64, y: 184, w: 32, h: 32 },
      // Upper mid
      { x: 224, y: 152, w: 32, h: 32 },
      // Right upper
      { x: 576, y: 184, w: 32, h: 32 },
      { x: 704, y: 120, w: 32, h: 32 },
      // Door platform — center top
      { x: 368, y: 72, w: 64, h: 32 },
    ],
    spikes: [
      // Full death floor
      { x: 80, y: 558 }, { x: 110, y: 558 }, { x: 140, y: 558 }, { x: 170, y: 558 },
      { x: 200, y: 558 }, { x: 230, y: 558 }, { x: 260, y: 558 }, { x: 290, y: 558 },
      { x: 320, y: 558 }, { x: 350, y: 558 }, { x: 380, y: 558 }, { x: 410, y: 558 },
      { x: 440, y: 558 }, { x: 470, y: 558 }, { x: 500, y: 558 }, { x: 530, y: 558 },
      { x: 560, y: 558 }, { x: 590, y: 558 }, { x: 620, y: 558 }, { x: 650, y: 558 },
      { x: 680, y: 558 }, { x: 710, y: 558 },
      // On platforms — shrink landing zones
      { x: 392, y: 398 },
      { x: 392, y: 270 },
      { x: 72, y: 174 },
      { x: 584, y: 174 },
      { x: 712, y: 110 },
    ],
    movingPlatforms: [
      // Bottom section crossers
      { x: 300, y: 480, w: 32, moveX: 80, moveY: 0, duration: 1400 },
      // Mid vertical lifts
      { x: 448, y: 360, w: 32, moveX: 0, moveY: -80, duration: 1600 },
      { x: 128, y: 300, w: 32, moveX: 0, moveY: -60, duration: 1200 },
      // Upper crossers — fast
      { x: 320, y: 136, w: 32, moveX: 60, moveY: 0, duration: 1200 },
      { x: 448, y: 104, w: 32, moveX: 80, moveY: 0, duration: 1400 },
    ],
  },
];
