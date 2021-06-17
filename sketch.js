let ground;
let cloud;
let cloudImage;
let groundAnimation;
let trex;
let trex_running;
let trexAnimation;
let score;
let obstacle1;
let obstacle2;
let obstacle3;
let obstacle4;
let obstacle5;
let obstacle6;
let cloudsGroup;
let obstaclesGroup;
let PLAY = 1;
let END = 0;
let gameState = PLAY;
let gameOver;
let restart;
let gameOverImage;
let restartImage;
let invisibleGround;
let dieSound;
let checkPointSound;
let jumpSound;

function preload() {
  dieSound = loadSound('die.mp3');
  checkPointSound = loadSound('checkPoint.mp3');
  jumpSound = loadSound('jump.mp3');
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexAnimation = loadAnimation('trex_collided.png');
  groundAnimation = loadImage('ground2.png');
  gameOverImage = loadImage('gameOver.png');
  restartImage = loadImage('restart.png');
  cloudImage = loadImage('cloud.png'); 
  obstacle1 = loadImage('obstacle1.png');
  obstacle2 = loadImage('obstacle2.png');
  obstacle3 = loadImage('obstacle3.png');
  obstacle4 = loadImage('obstacle4.png');
  obstacle5 = loadImage('obstacle5.png');
  obstacle6 = loadImage('obstacle6.png');
}

function setup() {
  createCanvas(600,400);
  ground = createSprite(300, 380, width, 40);
  ground.addImage('groundAnimation', groundAnimation);
  ground.velocityX = -10;
  invisibleGround = createSprite(300, 390, width, 10);
  invisibleGround.visible = false;  
  gameOver = createSprite(300, 180, 10, 10);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.7;
  restart = createSprite(300, 260, 10, 10);
  restart.addImage(restartImage);
  restart.scale = 0.7;
  trex = createSprite(50,335,20,30);
  trex.scale = 0.7;
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trexAnimation);
  score = 0;
  cloudsGroup = createGroup();
  obstaclesGroup = createGroup();
}

function cloudAnimation() {
  if (frameCount % 60 === 0) {
    cloud = createSprite(600, 250, 20, 20);
    cloud.velocityX = -5;
    cloud.addImage(cloudImage);
    cloud.y = Math.round(random(200, 300));
    cloud.depth = trex.depth;
    cloud.lifetime = 120; 
    cloudsGroup.add(cloud);
    trex.depth = trex.depth + 1;
  }
}

function displayObstalce() {
  if (frameCount % 60 === 0) {
    obstacle = createSprite(600, 360, 10, 60);
    obstacle.velocityX = -(8 + score / 100);    
    obstacle.lifetime = 70;
    obstaclesGroup.add(obstacle);
    let r = Math.round(random(1, 6));
    
    switch(r) {
      case 1:
        obstacle.addImage(obstacle1)
        break;
        
      case 2: 
        obstacle.addImage(obstacle2)
        break;
        
        
      case 3: 
        obstacle.addImage(obstacle3)
        break;
        
        
      case 4: 
        obstacle.addImage(obstacle4)
        break;
        
        
      case 5: 
        obstacle.addImage(obstacle5)
        break;
        
      case 6: 
        obstacle.addImage(obstacle6)
        break;
        
      default: break;
    }
    
    obstacle.scale = 0.7;
    
  }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false; 
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score = 0;
}

function draw() {
  background("white");
  
  if (gameState === PLAY) {
    if (keyDown('space') && trex.y >= 351) {
      trex.velocityY = -16;
      jumpSound.play();
    }
    
    if (score > 0 && score % 100 === 0) {
      checkPointSound.play();
    }
    
    trex.velocityY = trex.velocityY + 0.8;
    score = score + Math.round(World.frameRate / 60);
    ground.velocityX = -(8 + score / 100);    
    
    if (ground.x < 0) {
      ground.x = 300;
    } 

    cloudAnimation();
    displayObstalce();  

    gameOver.visible = false;
    restart.visible = false;
    
    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
      dieSound.play();
    }
    
  } else if (gameState === END) {
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    trex.velocityY = 0;
    trex.changeAnimation("collided", trexAnimation);
    gameOver.visible = true;
    restart.visible = true;
    restart.depth = cloud.depth;
    restart.depth = restart.depth + 1;
    
    if (mousePressedOver(restart) || keyDown('space')) {
     reset();     
    }
  }
  
  textSize(20);
  text(`Score: ${score}`, 450, 100);
  
  trex.collide(invisibleGround);
  
  drawSprites();
}