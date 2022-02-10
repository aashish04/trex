var trex,trex_running,trex_collided;
var ground,invisibleGround,groundImage;
var obstacles1,obstacles2,obstacles3,obstacles4,obstacles5,obstacles6,obstaclesGroup
var cloudsGroup
var PLAY=1;
var END=0;
var gameState = PLAY;
var score
var gameOver,restart;

function preload(){
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png")
  trex_collided=loadAnimation("trex_collided.png")
  groundImage=loadImage("ground2.png")
  cloudImage=loadImage("cloud.png")
  obstacles1=loadImage("obstacle1.png")
  obstacles2=loadImage("obstacle2.png")
  obstacles3=loadImage("obstacle3.png")
  obstacles4=loadImage("obstacle4.png")
  obstacles5=loadImage("obstacle5.png")
  obstacles6=loadImage("obstacle6.png")
  restartImg=loadImage("restart.png")
  gameOverImg=loadImage("gameOver.png")
  jumpSound=loadSound("jump.mp3")
  dieSound=loadSound("die.mp3")
  checkPointSound=loadSound("checkPoint.mp3")
}

function setup(){
  createCanvas(600,200);
  trex=createSprite(50,180,20,50);
  trex.addAnimation("running",trex_running)
  trex.addAnimation("collided",trex_collided)
  trex.scale=0.5;
  trex.x=50;

  score=0
  ground =createSprite(200,180,400,200)
  ground.addImage("ground",groundImage)
  ground.x=ground.width/2

  invisibleGround=createSprite(200,190,400,10)
  invisibleGround.visible=false;
//var r =Math.round(random(10,60))
//console.log( r)
obstaclesGroup=new Group();
cloudsGroup =new Group();

//trex.debug=true;
trex.setCollider("circle",0,0,40);
//trex.setCollider("rectangle",0,0,400,trex.height);

gameOver=createSprite(300,100);
gameOver.addImage(gameOverImg);
gameOver.scale=0.5;

restart= createSprite(300,140);
restart.addImage(restartImg);
restart.scale=0.5
}


function draw (){
  background(180);
console.log("this is", gameState)
text("score:  " +score ,500,50);

  if (gameState === PLAY){
    gameOver.visible=false;
    restart.visible=false;

    score= score+Math.round(frameCount /60);
      if(score>0 && score%100===0){
        checkPointSound.play();
      }

    ground.velocityX=-(2 + 3*score/100);
    
    if(ground.x<0){
      ground.x=ground.width/2
    }
  
   if(keyDown("space") && trex.y>=100){
      trex.velocityY=-10
      jumpSound.play();
    }
    trex.velocityY=trex.velocityY+0.8

    spawnCloud();
    spawnObstacles();

    if(obstaclesGroup.isTouching(trex)){
     // trex.velocityY=-12;
     // jumpSound.play();
      gameState= END;
     dieSound.play();
    }
  }

  else if(gameState === END){

    gameOver.visible=true;
    restart.visible=true;

    ground.velocityX=0

    trex.velocityY=0

    trex.changeAnimation("collided",trex_collided )

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)

    if(mousePressedOver(restart)){
      reset()
    }

  }
 // console.log(trex.y)
  trex.collide(invisibleGround)

  
  drawSprites()
}

function spawnCloud(){
  if(frameCount%60 === 0){
  cloud=createSprite(600,100,40,10)
  cloud.addImage(cloudImage)
  cloud.y=Math.round(random(10,60))
  cloud.scale=0.4;
  cloud.velocityX=-3
  cloud.lifetime=200
  cloud.depth=trex.depth;
  trex.depth=trex.depth+1
  console.log(trex.depth)
  console.log(cloud.depth)
  cloudsGroup.add(cloud);
}
}

function spawnObstacles(){
  if(frameCount%60 === 0){
    var obstacles =createSprite(600,165,10,40);
    
    obstacles.velocityX=-(6+ score/100);

    var r=Math.round(random(1,6))
    switch(r){
        case 1 :
        obstacles.addImage(obstacles1)
        break;
        case 2 :
        obstacles.addImage(obstacles2)
        break;
        case 3 :
        obstacles.addImage(obstacles3)
        break;
        case 4 :
        obstacles.addImage(obstacles4)
        break;
        case 5 :
        obstacles.addImage(obstacles5)
        break;
        case 6 :
        obstacles.addImage(obstacles6)
        break;

        default: break;
    }
obstacles.lifetime=100
obstacles.scale=0.5
obstaclesGroup.add(obstacles);
  }
}

function reset(){
  gameState= PLAY;
  gameOver.visible=false;
  restart.visibe=false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score=0;
}
