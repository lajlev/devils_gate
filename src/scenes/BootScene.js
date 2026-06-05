import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    const g = this.make.graphics({ add: false });

    // Player — black oval
    g.clear();
    g.fillStyle(0x111111);
    g.fillEllipse(12, 16, 18, 28);
    g.generateTexture('player', 24, 32);

    // Platform tile — lighter orange
    g.clear();
    g.fillStyle(0xd9a04e);
    g.fillRect(0, 0, 32, 32);
    g.generateTexture('platform', 32, 32);

    // Spike
    g.clear();
    g.fillStyle(0x8b5e14);
    g.beginPath();
    g.moveTo(0, 16);
    g.lineTo(8, 0);
    g.lineTo(16, 16);
    g.closePath();
    g.fillPath();
    g.generateTexture('spike', 16, 16);

    // Door — blue square
    g.clear();
    g.fillStyle(0x4a9eed);
    g.fillRect(2, 2, 20, 24);
    g.lineStyle(2, 0xffffff);
    g.strokeRect(2, 2, 20, 24);
    g.generateTexture('door', 24, 28);

    // Key — small yellow diamond
    g.clear();
    g.fillStyle(0xffd700);
    g.beginPath();
    g.moveTo(8, 0);
    g.lineTo(16, 8);
    g.lineTo(8, 16);
    g.lineTo(0, 8);
    g.closePath();
    g.fillPath();
    g.generateTexture('key', 16, 16);

    // Life icon — filled dark square
    g.clear();
    g.fillStyle(0x111111);
    g.fillRect(1, 1, 14, 14);
    g.generateTexture('life_full', 16, 16);

    // Life icon — empty (outline only)
    g.clear();
    g.lineStyle(2, 0x111111);
    g.strokeRect(1, 1, 14, 14);
    g.generateTexture('life_empty', 16, 16);

    g.destroy();

    this.scene.start('Game', { level: 1, lives: 5 });
  }
}
