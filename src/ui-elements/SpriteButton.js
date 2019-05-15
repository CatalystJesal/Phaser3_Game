import "phaser";

export class SpriteButton extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, callback) {
    super(scene, x, y, texture, frame);
    this.setInteractive({ useHandCursor: true })
      .on("pointerover", () => this.hoverState())
      .on("pointerout", () => this.restState())
      .on("pointerup", () => {
        callback();
      });
  }

  hoverState() {
    this.setFrame(1);
  }

  restState() {
    this.setFrame(0);
  }
}
