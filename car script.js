const questions = [

{
question:"What does phishing mean in Cybersecurity?",
answers:[
"A. Physically stealing a computer",
"B. Tricking users into revealing sensitive information",
"C. Installing antivirus software",
"D. Encrypting files"
],
correct:1
},

{
question:"Which of the following is the strongest password?",
answers:[
"A. password123",
"B. qwerty",
"C. John1990",
"D. T#9vL!2xQ@7"
],
correct:3
},

{
question:"What is the main purpose of a firewall?",
answers:[
"A. To cool down computers",
"B. To block unauthorized network access",
"C. To increase internet speed",
"D. To store passwords"
],
correct:1
},

{
question:"What does 2FA stand for?",
answers:[
"A. Two-Factor Authentication",
"B. Two-File Access",
"C. Twice-Fast Approval",
"D. Two-Firewall Authorization"
],
correct:0
}

];

let score = 0;
let lives = 3;
let gear = 1;
let speed = 5;
let highScore = localStorage.getItem("highscore") || 0;

document.getElementById("highScore").innerText = highScore;

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "gameContainer",
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

let player;
let enemies;
let cursors;
let roadLines = [];
let gamePaused = false;
let moveLeft = false;
let moveRight = false;

function preload(){

  this.load.image("player","https://labs.phaser.io/assets/sprites/car90.png");
  this.load.image("enemy","https://labs.phaser.io/assets/sprites/carred.png");

}

function create(){

  // Road lines
  for(let i=0;i<20;i++){

    let line = this.add.rectangle(
      window.innerWidth/2,
      i*80,
      10,
      40,
      0xffffff
    );

    roadLines.push(line);
  }

  player = this.physics.add.sprite(
    window.innerWidth/2,
    window.innerHeight-120,
    "player"
  );

  player.setScale(1.2);

  enemies = this.physics.add.group();

  spawnEnemy.call(this);

  this.time.addEvent({
    delay:1200,
    callback:spawnEnemy,
    callbackScope:this,
    loop:true
  });

  this.physics.add.collider(player,enemies,()=>{
    if(!gamePaused){
      crash();
    }
  });

  cursors = this.input.keyboard.createCursorKeys();

  // Keyboard gears
  this.input.keyboard.on("keydown", (e)=>{

    if(e.key==="1") setGear(1);
    if(e.key==="2") setGear(2);
    if(e.key==="3") setGear(3);
    if(e.key==="4") setGear(4);

  });

}

function update(){

  if(gamePaused) return;

  // Road animation
  roadLines.forEach(line=>{

    line.y += speed;

    if(line.y > window.innerHeight){
      line.y = 0;
    }

  });

  // Movement
  if(cursors.left.isDown || moveLeft){
    player.x -= 7;
  }

  if(cursors.right.isDown || moveRight){
    player.x += 7;
  }

  Phaser.Actions.IncY(enemies.getChildren(), speed);

  enemies.getChildren().forEach(enemy=>{

    if(enemy.y > window.innerHeight+100){

      enemy.destroy();

      score += 10;

      updateHUD();
    }

  });

  score += gear * 0.05;

  updateHUD();

}

function spawnEnemy(){

  const x = Phaser.Math.Between(
    window.innerWidth/2 - 150,
    window.innerWidth/2 + 150
  );

  let enemy = enemies.create(x,-100,"enemy");

  enemy.setScale(1.2);

}

function updateHUD(){

  document.getElementById("score").innerText =
    Math.floor(score);

  document.getElementById("speed").innerText =
    speed;

  document.getElementById("lives").innerText =
    lives;

  document.getElementById("gear").innerText =
    gear;

  if(score > highScore){

    highScore = Math.floor(score);

    localStorage.setItem("highscore",highScore);

    document.getElementById("highScore").innerText =
      highScore;
  }

}

function setGear(g){

  gear = g;

  if(g===1) speed=5;
  if(g===2) speed=8;
  if(g===3) speed=11;
  if(g===4) speed=15;
  if(g===-1) speed=2;

}

document.querySelectorAll(".gearBtn").forEach(btn=>{

  btn.addEventListener("click",()=>{

    setGear(parseInt(btn.dataset.gear));

  });

});

document.getElementById("leftBtn").addEventListener("touchstart",()=>moveLeft=true);
document.getElementById("leftBtn").addEventListener("touchend",()=>moveLeft=false);

document.getElementById("rightBtn").addEventListener("touchstart",()=>moveRight=true);
document.getElementById("rightBtn").addEventListener("touchend",()=>moveRight=false);

function crash(){

  gamePaused = true;

  showQuiz();

}

function showQuiz(){

  const modal = document.getElementById("quizModal");

  modal.classList.remove("hidden");

  const q = questions[
    Math.floor(Math.random()*questions.length)
  ];

  document.getElementById("question").innerText =
    q.question;

  const answersDiv =
    document.getElementById("answers");

  answersDiv.innerHTML = "";

  let timer = 10;

  document.getElementById("timer").innerText =
    timer;

  const countdown = setInterval(()=>{

    timer--;

    document.getElementById("timer").innerText =
      timer;

    if(timer<=0){

      clearInterval(countdown);

      wrongAnswer();

    }

  },1000);

  q.answers.forEach((ans,index)=>{

    const div = document.createElement("div");

    div.classList.add("answer");

    div.innerText = ans;

    div.onclick = ()=>{

      clearInterval(countdown);

      if(index===q.correct){

        div.classList.add("correct");

        document.getElementById("result").innerText =
          "Correct Answer!";

        setTimeout(()=>{

          modal.classList.add("hidden");

          document.getElementById("result").innerText="";

          gamePaused = false;

        },2000);

      }else{

        div.classList.add("wrong");

        wrongAnswer();

      }

    };

    answersDiv.appendChild(div);

  });

}

function wrongAnswer(){

  lives--;

  updateHUD();

  document.getElementById("result").innerText =
    "Wrong Answer!";

  setTimeout(()=>{

    document.getElementById("quizModal")
      .classList.add("hidden");

    if(lives<=0){

      gameOver();

    }else{

      restartGame();

    }

  },2000);

}

function restartGame(){

  score = 0;

  enemies.clear(true,true);

  gamePaused = false;

}

function gameOver(){

  document.getElementById("gameOverScreen")
    .classList.remove("hidden");

}

document.getElementById("startBtn")
.addEventListener("click",()=>{

  document.getElementById("startScreen")
    .classList.add("hidden");

});

document.getElementById("restartBtn")
.addEventListener("click",()=>{

  location.reload();

});

document.getElementById("pauseBtn")
.addEventListener("click",()=>{

  gamePaused = true;

  document.getElementById("pauseScreen")
    .classList.remove("hidden");

});

document.getElementById("resumeBtn")
.addEventListener("click",()=>{

  gamePaused = false;

  document.getElementById("pauseScreen")
    .classList.add("hidden");

});
