import Phaser from 'phaser';

export class UIScene extends Phaser.Scene {
  constructor() {
    super('UI');
  }

  create(data) {
    this.livesIcons = [];
    this.maxLives = 5;
    this.drawLives(data.lives ?? 5);

    this.levelText = this.add.text(400, 14, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#000000',
    }).setOrigin(0.5, 0);
    this.updateLevel(data.level ?? 1);

    const gameScene = this.scene.get('Game');
    gameScene.events.on('updateLives', (lives) => this.drawLives(lives));
    gameScene.events.on('updateLevel', (level) => this.updateLevel(level));
  }

  drawLives(lives) {
    this.livesIcons.forEach((icon) => icon.destroy());
    this.livesIcons = [];

    const startX = 340;
    const y = 16;
    for (let i = 0; i < this.maxLives; i++) {
      const g = this.add.graphics();
      const x = startX + i * 24;
      if (i < lives) {
        g.fillStyle(0x111111);
        g.fillRoundedRect(x, y, 16, 16, 3);
      } else {
        g.lineStyle(2, 0x111111);
        g.strokeRoundedRect(x, y, 16, 16, 3);
      }
      this.livesIcons.push(g);
    }
  }

  updateLevel(level) {
    this.levelText.setText(`LEVEL ${level}`);
  }
}
