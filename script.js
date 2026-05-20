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
}
];

let score = 0;
let lives = 3;
let speed = 5;
let gear = 1;

let gameStarted = false;
let gamePaused = true;

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: "gameContainer",
    physics:{
        default:"arcade",
        arcade:{
            debug:false
        }
    },
    scene:{
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

function preload(){

    this.load.image(
        "player",
        "assets/images/player.png"
    );

    this.load.image(
        "enemy",
        "assets/images/enemy.png"
    );

}

function create(){

    // ROAD
    this.add.rectangle(
        window.innerWidth/2,
        window.innerHeight/2,
        420,
        window.innerHeight,
        0x222222
    );

    // ROAD LINES
    for(let i=0;i<20;i++){

        let line = this.add.rectangle(
            window.innerWidth/2,
            i*80,
            10,
            50,
            0xffffff
        );

        roadLines.push(line);
    }

    // PLAYER
    player = this.physics.add.sprite(
        window.innerWidth/2,
        window.innerHeight - 150,
        "player"
    );

    player.setScale(1.2);

    // ENEMIES
    enemies = this.physics.add.group();

    // KEYBOARD
    cursors = this.input.keyboard.createCursorKeys();

    // SPAWN ENEMIES
    this.time.addEvent({
        delay:1500,
        callback:()=>{

            if(!gamePaused){

                let x = Phaser.Math.Between(
                    window.innerWidth/2 - 150,
                    window.innerWidth/2 + 150
                );

                let enemy = enemies.create(
                    x,
                    -100,
                    "enemy"
                );

                enemy.setScale(1.2);

            }

        },
        loop:true
    });

    // COLLISION
    this.physics.add.overlap(
        player,
        enemies,
        crash,
        null,
        this
    );

}

function update(){

    if(gamePaused) return;

    // ROAD MOVEMENT
    roadLines.forEach(line=>{

        line.y += speed;

        if(line.y > window.innerHeight){

            line.y = -50;
        }

    });

    // PLAYER CONTROLS
    if(cursors.left.isDown){

        player.x -= 7;
    }

    if(cursors.right.isDown){

        player.x += 7;
    }

    // ENEMY MOVEMENT
    enemies.getChildren().forEach(enemy=>{

        enemy.y += speed;

        if(enemy.y > window.innerHeight){

            enemy.destroy();

            score += 10;

            updateHUD();
        }

    });

    score += 0.05;

    updateHUD();

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

}

function crash(){

    if(gamePaused) return;

    gamePaused = true;

    showQuiz();

}

function showQuiz(){

    const modal =
        document.getElementById("quizModal");

    modal.classList.remove("hidden");

    const q =
        questions[
            Math.floor(Math.random()*questions.length)
        ];

    document.getElementById("question").innerText =
        q.question;

    const answers =
        document.getElementById("answers");

    answers.innerHTML = "";

    q.answers.forEach((ans,index)=>{

        const div =
            document.createElement("div");

        div.classList.add("answer");

        div.innerText = ans;

        div.onclick = ()=>{

            if(index === q.correct){

                div.classList.add("correct");

                setTimeout(()=>{

                    modal.classList.add("hidden");

                    gamePaused = false;

                },1500);

            }else{

                div.classList.add("wrong");

                lives--;

                resetGame();

            }

        };

        answers.appendChild(div);

    });

}

function resetGame(){

    score = 0;

    setTimeout(()=>{

        document.getElementById("quizModal")
            .classList.add("hidden");

        if(lives <= 0){

            alert("GAME OVER");

            location.reload();

        }else{

            enemies.clear(true,true);

            player.x = window.innerWidth/2;

            gamePaused = false;
        }

    },1500);

}

document
.getElementById("startBtn")
.addEventListener("click",()=>{

    document
    .getElementById("startScreen")
    .classList.add("hidden");

    gamePaused = false;

});
