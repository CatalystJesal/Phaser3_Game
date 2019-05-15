import "phaser";
import { SpriteButton } from "../ui-elements/SpriteButton";

var playBtn;

export default class HomeScene extends Phaser.Scene {
  constructor() {
    super("Home");
  }

  preload() {
    this.load.image("title", "assets/title.png");

    this.load.spritesheet("play", "assets/play-sprite.png", {
      frameWidth: 66,
      frameHeight: 66
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
