import "phaser";

export class TextButton extends Phaser.GameObjects.Text {
  constructor(scene, x, y, text, style, colors, callback) {
    super(scene, x, y, text, style);

    this.setInteractive({ useHandCursor: true })
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => this.hoverState(colors.hover))
      .on("pointerout", () => this.restState(colors.rest))
      .on("pointerup", () => {
        callback();
      });
  }

  hoverState(fill) {
    return this.setStyle({ fill: fill });
  }

  restState(fill) {
    this.setStyle({ fill: fill });
  }
}
