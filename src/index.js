import "phaser";
import config from "./config/config";
import HomeScene from "./scenes/HomeScene";
import GameScene from "./scenes/GameScene";

class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.add("Home", HomeScene);
    this.scene.add("Game", GameScene);
    this.scene.start("Home");
  }
}

window.onload = function() {
  window.game = new Game();
};
