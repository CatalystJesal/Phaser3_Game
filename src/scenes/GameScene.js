import "phaser";

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
var gameOverText;
var gameOverFontStyle;

var gameEndContainer;

var retryBtn;
var homeBtn;

var menuFontStyle;

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

    spawnRate = 100;
    spawnRateOfDescent = 1.7;
    lastSpawn = -1;
    removeBlocksYAxis = 600;

    score = 0;
    scoreFontStyle = { fontSize: 32, fontFamily: "Helvetica", align: "center" };
    gameOverFontStyle = {
      fontSize: 32,
      fontFamily: "Helvetica",
      align: "center",
      color: "#661400"
    };

    menuFontStyle = {
      fontSize: 25,
      fontFamily: "Helvetica",
      align: "center",
      color: "#661400"
    };
  }

  preload() {
    this.load.setBaseURL("http://labs.phaser.io");
  }

  create() {
    blockGraphics = this.add.graphics({
      fillStyle: { color: 0xffffff },
      lineStyle: { color: 0x38761d }
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

    gameOverText = this.add
      .text(400, 300, "Game Over", gameOverFontStyle)
      .setOrigin(0.5, 0.5);

    retryBtn = this.add
      .text(400, 350, "Retry", menuFontStyle, () => this.onRetry())
      .setOrigin(0.5, 0.5);

    this.add.existing(retryBtn);

    homeBtn = this.add
      .text(400, 390, "Home", menuFontStyle, () => this.onHome())
      .setOrigin(0.5, 0.5);

    this.add.existing(homeBtn);

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

    var block = {
      x: locationX,
      y: locationY,
      width: 80,
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

  onRetry() {
    this.scene.start("Game");
  }

  onHome() {
    this.scene.start("Home");
  }
}
