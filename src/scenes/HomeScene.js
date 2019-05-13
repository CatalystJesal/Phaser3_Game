import "phaser";
import { TextButton } from "../ui-elements/TextButton";

var fontStyle;
var playBtn;

var btnStateColors;

export default class HomeScene extends Phaser.Scene {
  constructor() {
    super("Home");
    fontStyle = {
      fontSize: 32,
      fontFamily: "Helvetica",
      align: "center"
    };

    btnStateColors = {
      hover: "#ccc9c9",
      rest: "#ffffff"
    };
  }

  create() {
    playBtn = new TextButton(
      this,
      400,
      300,
      "Play",
      fontStyle,
      btnStateColors,
      () => this.onPlay()
    ).setOrigin(0.5, 0.5);

    this.add.existing(playBtn);
  }

  update() {}

  onPlay() {
    this.scene.start("Game");
  }
}
