
let gameScene = new Phaser.Scene('Game');

console.log('start!');
var bird;
var pipes;
var timer = 50;
var timedEvent;
var score = 0;   
var bestScore = 0;
var click = false;
var rotateUp = true;
var startg = true;
var jumpSound;
var soundTime = 0;
var soundSwitch = true;




gameScene.init = function() {
  this.isPlayerAlive = true;
};


gameScene.preload = function() {


  this.load.image('pipe', 'assets/pipe.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('sky', 'assets/sky.png');
  this.load.image('button', 'assets/button.png');
  this.load.image('go', 'assets/go.png');
  this.load.spritesheet('bird_anim', 'assets/br.png', { frameWidth: 34, frameHeight: 23 });
  this.load.audio('jump', 'assets/jump.wav'); 
};



gameScene.create = function() {

// фон
  let bg = this.add.image(0, 0, 'sky');

  bg.setOrigin(0, 0);

// игрок
  bird = this.physics.add.sprite(300, 245, 'bird');

  this.anims.create({
        key: 'fly',
        frames: this.anims.generateFrameNumbers('bird_anim', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

  bird.anims.play('fly', true);
  bird.setScale(2);

  jumpSound = this.sound.add('jump'); 

  
  keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
 
  pipes = this.physics.add.group();

// если птица касается трубы, то она умирает (если она была жива)
  if (this.isPlayerAlive == true) {this.physics.add.overlap(bird, pipes, death, null, this);};
  scoreText = this.add.text(16, 16, 'Score:'+ score, { fontSize: '32px', fill: '#FFF' });

// если первый запуск, то текст-подсказка к началу игры
  if (startg == true) {
  starttext = this.add.text(200, 250, 'PRESS SPACE', { fontSize: '52px', fill: '#FFF' });};

  this.add.text(700, 580, 'ds,2018', { fontSize: '20px', fill: '#FFF' });

};


gameScene.update = function() {


// таймер для звука, чтобы отсрочка была и чтобы он не накладывался один на другой 
  soundTime++

  // наклон птицы в свободном полёте

  if (bird.angle < 45) {
bird.angle += 1;};

//затемнение экрана, рестарт после нажатия на кнопку
  if (this.isPlayerAlive == false && click == true) {
      this.time.delayedCall(550, function() {
    this.cameras.main.fade(250);
  }, [], this); click = false;

  
  this.time.delayedCall(1000, function() {this.gameRestart()
  }, [], this);

  };
  // столкновение с верхом или низом
  if ((bird.y <0 || bird.y>600 ) && this.isPlayerAlive == true) {  this.gameOver();  };
 
 // взмах крыльев, наклон, звук, скорость вверх
  if (keySpace.isDown && this.isPlayerAlive) {
   console.log('aaaa!!'); 
  bird.setVelocityY (-200);
  if (soundTime >10) {
  jumpSound.play(); soundTime = 0}; 
  if (bird.angle > - 40) {rotateUp = true; bird.angle -=8}};

// старт, после нажатия на пробел в начале игры
  if (keySpace.isDown && startg == true) {
  startg = false;
  starttext.setText(''); };
// пока не началась игра,птица не падает
  if (startg == true) {bird.setVelocityY (0)}

// запуск таймера, который отсчитывает появление труб
  if (startg == false) {
  timer = timer + 1;}

// генерация труб каждый 120 единиц, если живы и игра началась, обновление очков, добавление очков с каждой трубы
  if (timer == 120 && this.isPlayerAlive == true && startg == false) { score += 1;
  scoreText.setText('Score: ' + score); timer = 0; addRowOfPipes();  }

  
};


gameScene.gameOver = function() {

  this.isPlayerAlive = false;
  
  this.cameras.main.shake(100);
// рекорд
  if (bestScore < score) {bestScore = score};

  bestScoreText = this.add.text(250, 200, 'BEST SCORE:'+ bestScore, { fontSize: '40px', fill: '#FFF' });

// гейм овер экран
  this.add.sprite(400, 300, 'go')

// кнопка рестарта
  var button = this.add.sprite(400, 400, 'button').setInteractive();
  button.setScale(1.5);

      button.on('pointerdown', function (pointer) {

        this.setTint(0xff0000);
        click = true

    });

    button.on('pointerout', function (pointer) {

        this.clearTint();

    });

    button.on('pointerup', function (pointer) {

        this.clearTint();

    });

};

// рестарт, обнуление переменных
gameScene.gameRestart = function() {


  this.isPlayerAlive = true;

  timer =50;
  score = 0;
  this.scene.restart();

};

// одна труба, блок
function addOnePipe (x,y) {
  var pipe = pipes.create (x,y, 'pipe');
  pipe.body.allowGravity = false;
  pipe.setVelocityX (-200-(score*10));
  
};

// целостная труба, которая собирается из единичных кубиков, которые выстраиваются в ряд со случайным разрывом
function addRowOfPipes () {

  var hole = Math.floor(Math.random()*5) +1;

  for (var i=0; i<11; i++) {
    if (i != hole && i != hole +1){
    this.addOnePipe (800, i*60+10);
  }};
};

// смерть, трубы останавливаются, птица отбрасывается и падает, запускается функция конца игры
function death () { pipes.children.iterate(function (child) {

            child.setVelocityX (0);
            bird.setVelocityX (-50);
            bird.body.x = bird.body.x -1;

        }); this.gameOver()

};

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
  scene: gameScene
};


let game = new Phaser.Game(config);
