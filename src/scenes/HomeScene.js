import "phaser";
import { TextButton } from "../ui-elements/TextButton";
import { SpriteButton } from "../ui-elements/SpriteButton";

var playBtn;

export default class HomeScene extends Phaser.Scene {
  constructor() {
    super("Home");
  }

  preload() {
    this.load.image("title", "assets/title2.png");

    this.load.spritesheet("play", "assets/play.png", {
      frameWidth: 112,
      frameHeight: 45.5
    });
  }

  create() {
    this.cameras.main.setBackgroundColor("#e8ecf2");

    this.add.image(400, 60, "title");

    playBtn = new SpriteButton(this, 400, 300, "play", 0, () => this.onPlay());

    this.add.existing(playBtn);
  }

  update() {}

  onPlay() {
    this.scene.start("Game");
  }
}
