import kaboom from "kaboom"
// initialize context
kaboom()
        
// loading assets
loadSprite("rock", "sprites/rock.png");
loadSprite("alien2", "sprites/alien2.png");
loadSprite("bullet3", "sprites/bullet3.png");  // use  scale:0.15
loadSprite("ufo", "sprites/ufo.png");
loadSprite("player2", "sprites/player2.png");
loadSprite("player1", "sprites/player1.png");
loadSprite("alien", "sprites/alien.png");
loadSprite("bullet1", "sprites/bullet1.png");  // use  scale:0.1

// loading sounds
loadSound("bgmusic", "sounds/bgmusic.mp3");
loadSound("explosion", "sounds/explosion.wav");
loadSound("score", "sounds/score.mp3");
loadSound("gameover", "sounds/gameover.wav");
loadSound("shoot", "sounds/shoot.mp3");
loadSound("explosion2", "sounds/explosion2.wav");

// loading image
loadSprite("bgimage", "sprites/bgimage.jpg");

// define game variables
let speed = 500;
let ufoSpeed = 0.9;
let alienSpeed = 0.8;
let alien2Speed = 0.9;
let rockSpeed = 0.9;
let bulletSpeed = 10;
let score = 0;
let flag = false;
let backgroundMusic;
let scoreText;
let gameoverText;


// Adding background music
const playbg=()=>{
  if(!flag){
    backgroundMusic = play("bgmusic",{loop:true,volume:1})
  }
  flag = true;
}

// adding background motion
let bgImage = add([
  sprite("bgimage"),
  pos(0,0),
  "bgimage"
])

// Function to display score
const displayScore=()=>{
  destroy(scoreText)
  scoreText=add([
    text("Score: "+score,{size:80,font:"apl386o"}),
    pos(width()-131,41),
    color(0,0,255),
    scale(0.4),
    origin("center"),
  ])
}
displayScore()


// Function to display gameover
const displayGameover= ()=>{
  gameoverText = add([
    text("GAMEOVER"),
    pos(center()),
    origin("center"),
    scale(2),
    color(255,0,0),
  ])
  ufoSpeed = 0;
  alienSpeed = 0;
  alien2Speed = 0;
  rockSpeed = 0;
}


// adding player
let player1 = add([
  sprite("player1"),
  pos(center()),
  scale(0.12),
  area(),
  origin("center"),
  "player1",
])

// movement controls of spaceship
onKeyDown("left", () => {
    playbg()
    player1.move(-speed, 0)
})
onKeyDown("right", () => {
    playbg()
    player1.move(speed,0)
})
onKeyDown("up", () => {
    playbg()
    player1.move(0,-speed)
})
onKeyDown("down", () => {
    playbg()
    player1.move(0,speed)
})

// shooting bullets
onKeyPress("space",()=>{
  let bullet = add([
    sprite("bullet1"),
    pos(player1.pos.x-8,player1.pos.y-45),
    area(),
    scale(0.1),
    "bullet",
  ])
  
  bullet.onUpdate(()=>{
    bullet.moveTo(bullet.pos.x,bullet.pos.y-bulletSpeed)
    if (bullet.pos.y<0) {
        destroy(bullet);
    }
  })
  play("shoot")
})


// adding ufo
wait(2,()=>{
  loop(5,()=>{
    for(let i=0;i<5;i++){
      let x = rand(0,width())
  
      let ufo = add([
      sprite("ufo"),
      pos(x,-76.8),
      area(),
      solid(),
      scale(0.11),
      "ufo",
      ])
       
      ufo.onUpdate(()=>{
        ufo.moveTo(ufo.pos.x,ufo.pos.y+ufoSpeed)
      })
    }
  }) 
})


// adding alien2 spaceship
wait(5,()=>{
  loop(7,()=>{
    for(let i=0;i<4;i++){
      let x= rand(0,width())
  
      let alien2 = add([
      sprite("alien2"),
      pos(x,-102.4),
      area(),
      solid(),
      scale(0.2),
      "alien2",
      ])
      alien2.onUpdate(()=>{
        alien2.moveTo(alien2.pos.x,alien2.pos.y+alien2Speed)
      })
    }
  })
})


// adding alien spaceship
wait(15,()=>{
  loop(10,()=>{
    let x= rand(0,width())
  
    let alien = add([
    sprite("alien"),
    pos(x,-256),
    area(),
    solid(),
    scale(0.2),
    "alien",
    ])
    alien.onUpdate(()=>{
      alien.moveTo(alien.pos.x,alien.pos.y+alienSpeed)
    })  
  })
})


// adding rocks
wait(10,()=>{
  loop(8,()=>{
    for(let i=0;i<5;i++){
      let x = rand(0,width())
       let rock = add([
        sprite("rock"),
        pos(x,-128),
        area(),
        solid(),
        scale(0.3),
        "rock",
       ])
      rock.onUpdate(()=>{
        rock.moveTo(rock.pos.x,rock.pos.y+rockSpeed)
      })
    }
  })
})


// collision with bullet
onCollide("bullet","alien",(bullet,alien)=>{
  destroy(alien)
  destroy(bullet)
  score +=5
  play("explosion2")
  wait(1,()=>{
  play("score")
  })
  displayScore()
})
onCollide("bullet","alien2",(bullet,alien2)=>{
  destroy(alien2)
  destroy(bullet)
  score +=10
  play("explosion2")
  wait(1,()=>{
  play("score")
  })
  displayScore()
})
onCollide("bullet","ufo",(bullet,ufo)=>{
  destroy(ufo)
  destroy(bullet)
  score +=3
  play("explosion2")
  wait(1,()=>{
  play("score")
  })
  displayScore()
})
onCollide("bullet","rock",(bullet,rock)=>{
  destroy(rock)
  destroy(bullet)
  displayScore()
  play("explosion2")
})

// collision with player1
player1.onCollide("alien",()=>{
  play("gameover")
  destroy(player1)
  backgroundMusic.volume(0)
  displayGameover()
})
player1.onCollide("alien2",()=>{
  play("gameover")
  destroy(player1)
  backgroundMusic.volume(0)
  displayGameover()
})
player1.onCollide("ufo",()=>{
  play("gameover")
  destroy(player1)
  backgroundMusic.volume(0)
  displayGameover() 
})
player1.onCollide("rock",()=>{
  destroy(player1)
  backgroundMusic.volume(0)
  play("explosion")
  wait(1,()=>{
  play("gameover")
  })
  displayGameover() 
})

// increasing speed
loop(20,()=>{
  if(ufoSpeed<2){
    ufoSpeed += 0.1
  }
  if(alien2Speed< 2){
    alien2Speed += 0.1
  }
  if(alienSpeed< 2){
    alienSpeed += 0.1
  }
  if(rockSpeed< 2){
    rockSpeed += 0.1
  }
});