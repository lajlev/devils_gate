import Phaser from 'phaser';
import { LEVELS } from '../levels.js';
import { playJump, playDoor, playDeath, playFirework, playKey, startMusic, stopMusic, setMusicVolume } from '../sound.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init(data) {
    this.currentLevel = data.level ?? 1;
    this.lives = data.lives ?? 5;
    this.maxLives = 5;
    this.isDead = false;
    this.hasKey = false;
    this.reachedDoor = false;
    this.hudGroup = null;
    this.isTeleporting = false;
  }

  create() {
    const level = LEVELS[this.currentLevel - 1];

    this.cameras.main.setBackgroundColor(level.bgColor ?? 0xc87c1e);
    startMusic();

    // Platforms
    this.platforms = this.physics.add.staticGroup();
    for (const p of level.platforms) {
      const tilesX = Math.ceil(p.w / 32);
      const tilesY = Math.ceil(p.h / 32);
      for (let tx = 0; tx < tilesX; tx++) {
        for (let ty = 0; ty < tilesY; ty++) {
          const tile = this.platforms.create(p.x + tx * 32 + 16, p.y + ty * 32 + 16, 'platform');
          tile.body.checkCollision.down = false;
        }
      }
    }

    // Spikes
    this.spikes = this.physics.add.staticGroup();
    for (const s of level.spikes) {
      const spike = this.spikes.create(s.x, s.y, 'spike');
      spike.body.setSize(12, 10);
      spike.body.setOffset(2, 6);
    }

    // Door
    this.door = this.physics.add.staticSprite(level.door.x, level.door.y, 'door');
    this.door.body.setSize(20, 24);

    // Key (if level has one)
    if (level.key) {
      this.key = this.physics.add.staticSprite(level.key.x, level.key.y, 'key');
      this.tweens.add({
        targets: this.key,
        y: level.key.y - 6,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    } else {
      this.hasKey = true;
    }

    // Bounce pads
    if (level.bouncePads) {
      this.bouncePads = this.physics.add.staticGroup();
      for (const bp of level.bouncePads) {
        const pad = this.bouncePads.create(bp.x, bp.y, 'bounce');
        pad.body.checkCollision.down = false;
      }
    }

    // Crumbling platforms
    if (level.crumblingPlatforms) {
      this.crumbleGroup = this.physics.add.staticGroup();
      for (const cp of level.crumblingPlatforms) {
        const tilesX = Math.ceil(cp.w / 32);
        for (let tx = 0; tx < tilesX; tx++) {
          const tile = this.crumbleGroup.create(cp.x + tx * 32 + 16, cp.y + 16, 'crumble');
          tile.body.checkCollision.down = false;
          tile.setData('crumbling', false);
        }
      }
    }

    // Fake platforms (visual only — no physics body)
    if (level.fakePlatforms) {
      for (const fp of level.fakePlatforms) {
        const tilesX = Math.ceil(fp.w / 32);
        for (let tx = 0; tx < tilesX; tx++) {
          const tile = this.add.image(fp.x + tx * 32 + 16, fp.y + 16, 'platform');
          tile.setAlpha(0.92);
          this.tweens.add({
            targets: tile,
            alpha: 0.72,
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });
        }
      }
    }

    // Teleporters
    if (level.teleporters) {
      for (const tp of level.teleporters) {
        const pad1 = this.physics.add.staticSprite(tp.x1, tp.y1, 'teleporter');
        const pad2 = this.physics.add.staticSprite(tp.x2, tp.y2, 'teleporter');
        pad1.body.setCircle(12, 4, 4);
        pad2.body.setCircle(12, 4, 4);
        this.tweens.add({ targets: [pad1, pad2], alpha: 0.5, duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        this._telePads = this._telePads || [];
        this._telePads.push({ sprite: pad1, tx: tp.x2, ty: tp.y2 - 20 });
        this._telePads.push({ sprite: pad2, tx: tp.x1, ty: tp.y1 - 20 });
      }
    }

    // Player
    this.player = this.physics.add.sprite(level.spawn.x, level.spawn.y, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(14, 26);
    this.player.body.setOffset(5, 4);

    // Collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.spikes, this.hitSpike, null, this);
    this.physics.add.overlap(this.player, this.door, this.reachDoor, null, this);
    if (this.key) {
      this.physics.add.overlap(this.player, this.key, this.collectKey, null, this);
    }

    if (this.bouncePads) {
      this.physics.add.overlap(this.player, this.bouncePads, this.hitBounce, null, this);
    }

    if (this.crumbleGroup) {
      this.physics.add.collider(this.player, this.crumbleGroup, this.hitCrumble, null, this);
    }

    if (this._telePads) {
      for (const tp of this._telePads) {
        this.physics.add.overlap(this.player, tp.sprite, () => this.teleportTo(tp.tx, tp.ty), null, this);
      }
    }

    // Moving platforms
    if (level.movingPlatforms) {
      for (const mp of level.movingPlatforms) {
        const tilesX = Math.ceil(mp.w / 32);
        const group = [];
        for (let tx = 0; tx < tilesX; tx++) {
          const tile = this.physics.add.image(mp.x + tx * 32 + 16, mp.y + 16, 'platform');
          tile.setImmovable(true);
          tile.body.allowGravity = false;
          this.physics.add.collider(this.player, tile);
          group.push(tile);
        }
        this.tweens.add({
          targets: group,
          x: `+=${mp.moveX ?? 0}`,
          y: `+=${mp.moveY ?? 0}`,
          duration: mp.duration ?? 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }
    }

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.physics.world.setBounds(0, 0, 800, 600);

    // Dev shortcut: number keys jump to levels
    const numCodes = [
      Phaser.Input.Keyboard.KeyCodes.ONE,
      Phaser.Input.Keyboard.KeyCodes.TWO,
      Phaser.Input.Keyboard.KeyCodes.THREE,
      Phaser.Input.Keyboard.KeyCodes.FOUR,
      Phaser.Input.Keyboard.KeyCodes.FIVE,
      Phaser.Input.Keyboard.KeyCodes.SIX,
      Phaser.Input.Keyboard.KeyCodes.SEVEN,
      Phaser.Input.Keyboard.KeyCodes.EIGHT,
      Phaser.Input.Keyboard.KeyCodes.NINE,
      Phaser.Input.Keyboard.KeyCodes.ZERO,
    ];
    this.devKeys = numCodes.map((code) => this.input.keyboard.addKey(code));

    // M = toggle music, N = toggle SFX
    this.muteMusic = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    this.muteSfx = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);

    // HUD — drawn last so it's on top
    this.drawHUD();

    // Level name banner
    if (level.name) {
      const banner = this.add.text(400, 280, level.name, {
        fontFamily: 'monospace', fontSize: '28px', color: '#ffffff', fontStyle: 'bold',
      }).setOrigin(0.5).setScrollFactor(0).setAlpha(0);
      this.tweens.add({
        targets: banner, alpha: 1, duration: 400, yoyo: true, hold: 1200,
        onComplete: () => banner.destroy(),
      });
    }
  }

  drawHUD() {
    if (this.hudGroup) this.hudGroup.clear(true, true);
    this.hudGroup = this.add.group();

    const startX = 400 - (this.maxLives * 22) / 2;
    const y = 14;
    for (let i = 0; i < this.maxLives; i++) {
      const tex = i < this.lives ? 'life_full' : 'life_empty';
      const icon = this.add.image(startX + i * 22, y, tex).setScrollFactor(0);
      this.hudGroup.add(icon);
    }

    const musicOff = this.registry.get('musicMuted');
    const sfxOff = this.registry.get('sfxMuted');
    const musicLabel = musicOff ? 'M: MUSIC OFF' : 'M: music';
    const sfxLabel = sfxOff ? 'N: SFX OFF' : 'N: sfx';
    const musicColor = musicOff ? '#ff4444' : '#9a6a1a';
    const sfxColor = sfxOff ? '#ff4444' : '#9a6a1a';

    const mt = this.add.text(12, 6, musicLabel, {
      fontFamily: 'monospace', fontSize: '10px', color: musicColor,
    }).setScrollFactor(0);
    this.hudGroup.add(mt);

    const st = this.add.text(12, 18, sfxLabel, {
      fontFamily: 'monospace', fontSize: '10px', color: sfxColor,
    }).setScrollFactor(0);
    this.hudGroup.add(st);

    const lt = this.add.text(780, 8, `L${this.currentLevel}`, {
      fontFamily: 'monospace', fontSize: '12px', color: '#9a6a1a',
    }).setScrollFactor(0).setOrigin(1, 0);
    this.hudGroup.add(lt);
  }

  update() {
    // Dev level select (works even when dead)
    for (let i = 0; i < this.devKeys.length; i++) {
      if (Phaser.Input.Keyboard.JustDown(this.devKeys[i])) {
        const target = i + 1;
        if (target <= LEVELS.length) {
          this.scene.start('Game', { level: target, lives: 5 });
          return;
        }
      }
    }

    // Toggle music (M) and SFX (N)
    if (Phaser.Input.Keyboard.JustDown(this.muteMusic)) {
      this.registry.set('musicMuted', !this.registry.get('musicMuted'));
      if (this.registry.get('musicMuted')) {
        setMusicVolume(0);
      } else {
        setMusicVolume(0.6);
      }
      this.drawHUD();
    }
    if (Phaser.Input.Keyboard.JustDown(this.muteSfx)) {
      this.registry.set('sfxMuted', !this.registry.get('sfxMuted'));
      this.drawHUD();
    }

    if (this.isDead || this.reachedDoor) return;

    const onFloor = this.player.body.blocked.down;
    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const jump = Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.wasd.up);

    if (left) {
      this.player.setVelocityX(-200);
      this.player.setFlipX(true);
    } else if (right) {
      this.player.setVelocityX(200);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }

    if (jump && onFloor) {
      this.player.setVelocityY(-420);
      this.sfx(playJump);
    }

    if (this.player.y > 590) {
      this.die();
    }
  }

  sfx(fn) {
    if (!this.registry.get('sfxMuted')) fn();
  }

  hitBounce(player, pad) {
    if (player.body.velocity.y < 0) return;
    player.setVelocityY(-650);
    this.sfx(playJump);
    this.tweens.add({ targets: pad, scaleY: 0.6, duration: 80, yoyo: true });
  }

  hitCrumble(player, tile) {
    if (tile.getData('crumbling')) return;
    tile.setData('crumbling', true);
    this.time.delayedCall(800, () => {
      this.tweens.add({
        targets: tile, x: tile.x + 2, duration: 40, yoyo: true, repeat: 5,
        onComplete: () => {
          this.tweens.add({
            targets: tile, alpha: 0, y: tile.y + 20, duration: 300,
            onComplete: () => tile.destroy(),
          });
        },
      });
    });
  }

  teleportTo(x, y) {
    if (this.isTeleporting || this.isDead) return;
    this.isTeleporting = true;
    this.player.setPosition(x, y);
    this.player.setVelocity(0, 0);
    this.sfx(playDoor);
    this.cameras.main.flash(200, 140, 60, 220);
    this.time.delayedCall(800, () => { this.isTeleporting = false; });
  }

  collectKey() {
    if (this.hasKey) return;
    this.hasKey = true;
    this.key.destroy();
    this.sfx(playKey);
    this.tweens.add({
      targets: this.door,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 200,
      yoyo: true,
    });
  }

  hitSpike() {
    if (this.isDead) return;
    this.die();
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.lives--;
    this.sfx(playDeath);

    this.player.setTint(0xff0000);
    this.player.setVelocity(0, -300);
    this.player.body.checkCollision.none = true;

    this.time.delayedCall(800, () => {
      if (this.lives <= 0) {
        this.scene.start('Game', { level: 1, lives: 5 });
      } else {
        this.scene.start('Game', { level: this.currentLevel, lives: this.lives });
      }
    });
  }

  reachDoor() {
    if (this.reachedDoor || !this.hasKey) return;
    this.reachedDoor = true;
    this.sfx(playDoor);

    this.player.setVelocity(0);
    this.player.body.enable = false;

    this.tweens.add({
      targets: this.player,
      alpha: 0,
      scaleX: 0.5,
      scaleY: 0.5,
      duration: 400,
      onComplete: () => {
        this.launchFireworks(() => {
          const nextLevel = this.currentLevel + 1;
          if (nextLevel > LEVELS.length) {
            this.showWin();
          } else {
            this.scene.start('Game', { level: nextLevel, lives: this.lives });
          }
        });
      },
    });
  }

  launchFireworks(onComplete) {
    const colors = [0xff4444, 0x44ff44, 0x4488ff, 0xffff44, 0xff44ff, 0x44ffff, 0xffffff, 0xff8800];
    const burstCount = 5;
    let done = 0;

    for (let b = 0; b < burstCount; b++) {
      const cx = 120 + Math.random() * 560;
      const cy = 80 + Math.random() * 300;
      const delay = b * 200;

      this.time.delayedCall(delay, () => {
        this.sfx(playFirework);
        const sparks = 20 + Math.floor(Math.random() * 15);
        for (let i = 0; i < sparks; i++) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          const size = 2 + Math.random() * 4;
          const g = this.add.graphics();
          g.fillStyle(color);
          g.fillCircle(0, 0, size);
          g.setPosition(cx, cy);

          const angle = (Math.PI * 2 * i) / sparks + (Math.random() - 0.5) * 0.5;
          const dist = 40 + Math.random() * 100;

          this.tweens.add({
            targets: g,
            x: cx + Math.cos(angle) * dist,
            y: cy + Math.sin(angle) * dist + 30,
            alpha: 0,
            duration: 500 + Math.random() * 400,
            ease: 'Cubic.easeOut',
            onComplete: () => g.destroy(),
          });
        }

        done++;
        if (done === burstCount) {
          this.time.delayedCall(600, onComplete);
        }
      });
    }
  }

  showWin() {
    stopMusic();
    this.cameras.main.setBackgroundColor(0x1a1a1a);

    this.add.text(400, 240, 'YOU ESCAPED', {
      fontFamily: 'monospace',
      fontSize: '48px',
      color: '#ff8800',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(400, 300, "DEVIL'S GATE", {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#c87c1e',
    }).setOrigin(0.5);

    this.add.text(400, 360, 'Press SPACE to play again', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#888888',
    }).setOrigin(0.5);

    const loop = () => {
      this.launchFireworks(() => {
        this.time.delayedCall(400, loop);
      });
    };
    loop();

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('Game', { level: 1, lives: 5 });
    });
  }
}
