import "phaser";
import { SpriteButton } from "../ui-elements/SpriteButton";

var playerGraphics;
var blockGraphics;

var player;
var keyLeft;
var keyRight;
var moveSpeed;
var playerMinX;
var playerMaxX;

var blocks;
var spawnRate;
var spawnRateOfDescent;
var lastSpawn;
var removeBlocksYAxis;

var score;
var scoreText;
var scoreFontStyle;

var isGameOver = false;

var gameEndContainer;

var retryBtn;
var homeBtn;

var gameOverText;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");

    player = {
      x: 380,
      y: 550,
      width: 18,
      height: 18
    };

    moveSpeed = 2.5;
    playerMinX = 0;
    playerMaxX = 782;

    blocks = [];

    spawnRate = 150;
    spawnRateOfDescent = 1.7;
    lastSpawn = -1;
    removeBlocksYAxis = 600;

    score = 0;
    scoreFontStyle = {
      font: "bold 28px Helvetica",
      align: "center",
      fill: "#000000"
    };

    menuFontStyle = {
      font: "bold 30px Helvetica",
      align: "center",
      color: "#A37950"
    };

    btnStateColors = {
      hover: "#6F4400",
      rest: "#A37950"
    };
  }

  preload() {
    this.load.image("gameover", "assets/gameover.png");
    this.load.spritesheet("retry", "assets/retry.png", {
      frameWidth: 140,
      frameHeight: 44
    });

    this.load.spritesheet("home", "assets/home.png", {
      frameWidth: 119,
      frameHeight: 43.5
    });
    // this.load.image("home", "assets/home.png");
  }

  create() {
    this.cameras.main.setBackgroundColor("#e8ecf2");

    // gameOverImg.setVisible(false);

    blockGraphics = this.add.graphics({
      fillStyle: { color: 0x000000 } //0x000000
    });

    playerGraphics = this.add.graphics({
      fillStyle: { color: 0x744040 }
    });

    playerGraphics.fillRectShape(player);

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    scoreText = this.add
      .text(400, 20, "Score: 0", scoreFontStyle)
      .setOrigin(0.5, 0.5);

    // gameOverText = this.add
    //   .text(400, 300, "Game Over", gameOverFontStyle)
    //   .setOrigin(0.5, 0.5);

    gameOverText = this.add.image(400, 300, "gameover");

    // retryBtn = new TextButton(
    //   this,
    //   400,
    //   355,
    //   "Retry",
    //   menuFontStyle,
    //   btnStateColors,
    //   () => this.resetGame()
    // ).setOrigin(0.5, 0.5);

    // retryBtn = new ImgButton(this, 400, 355, "Retry", 0);

    retryBtn = new SpriteButton(this, 400, 365, "retry", 0, () =>
      this.resetGame()
    );

    this.add.existing(retryBtn);

    // homeBtn = new TextButton(
    //   this,
    //   400,
    //   400,
    //   "Home",
    //   menuFontStyle,
    //   btnStateColors,
    //   () => this.goHome()
    // ).setOrigin(0.5, 0.5);

    homeBtn = new SpriteButton(this, 400, 420, "home", 0, () => this.goHome());

    this.add.existing(homeBtn);

    // gameEndContainer = this.add.container(0, 0, [
    //   gameOverText,
    //   retryBtn,
    //   homeBtn
    // ]);

    gameEndContainer = this.add.container(0, 0, [
      gameOverText,
      retryBtn,
      homeBtn
    ]);

    gameEndContainer.setVisible(false);
  }

  update() {
    this.collisionCheck();

    if (!isGameOver) {
      this.addScore();
      this.crashBlocks();
      this.movePlayer();
    } else {
      gameEndContainer.setVisible(true);
      // gameOverImg.setVisible(true);

      if (player.y < 600) {
        player.y += 1;
        playerGraphics.clear();
        playerGraphics.fillRectShape(player);
      }
    }
  }

  addScore() {
    score += 10;
    scoreText.setText("Score: " + score);
  }

  movePlayer() {
    if (player.x <= playerMinX) {
      player.x += 1;
    } else if (player.x >= playerMaxX) {
      player.x -= 1;
    } else if (keyLeft.isDown) {
      player.x -= moveSpeed;
    } else if (keyRight.isDown) {
      player.x += moveSpeed;
    }

    playerGraphics.clear();
    playerGraphics.fillRectShape(player);

    player.x += 0;
  }

  collisionCheck() {
    for (var i = 0; i < blocks.length; i++) {
      if (this.rectOverlap(player, blocks[i])) {
        isGameOver = true;
      }
    }
  }

  crashBlocks() {
    var time = Date.now();

    if (time > lastSpawn + spawnRate) {
      lastSpawn = time;
      this.addBlock();
      this.removeOldBlocks(removeBlocksYAxis);
    }

    blockGraphics.clear();

    for (var i = 0; i < blocks.length; i++) {
      blocks[i].y += spawnRateOfDescent;
      blockGraphics.fillRectShape(blocks[i]);
    }
  }

  addBlock() {
    var locationX = Phaser.Math.Between(-20, 800);
    var locationY = Phaser.Math.Between(80, 90);

    var width = Phaser.Math.Between(70, 110);

    var block = {
      x: locationX,
      y: locationY,
      width: width, //was fixed 80
      height: 8
    };

    blocks.push(block);
  }

  removeOldBlocks(limitY) {
    for (var i = 0; i < blocks.length; i++) {
      if (blocks[i].y > limitY) {
        blocks.splice(i, 1);
      }
    }
  }

  rectOverlap(A, B) {
    var xOverlap =
      this.valueInRange(A.x, B.x, B.x + B.width) ||
      this.valueInRange(B.x, A.x, A.x + A.width);
    var yOverlap =
      this.valueInRange(A.y, B.y, B.y + B.height) ||
      this.valueInRange(B.y, A.y, A.y + A.height);
    return xOverlap && yOverlap;
  }

  valueInRange(value, min, max) {
    return value <= max && value >= min;
  }

  resetGame() {
    isGameOver = false;
    gameEndContainer.setVisible(false);
    player = {
      x: 380,
      y: 550,
      width: 18,
      height: 18
    };
    blocks = [];
    score = 0;
  }

  goHome() {
    this.resetGame();
    this.scene.start("Home");
  }
}
