import "phaser";

export class TextButton extends Phaser.GameObjects.Text {
  constructor(scene, x, y, text, style) {
    super(scene, x, y, text, style);

    this.setInteractive({ useHandCursor: true })
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => this.hoverState())
      .on("pointerout", () => this.restState())
      .on("pointerup", () => {
        callback();
      });
  }

  hoverState() {
    playBtn.setStyle({ fill: "#ccc9c9" });
  }

  restState() {
    playBtn.setStyle({ fill: "#ffffff" });
  }
}
