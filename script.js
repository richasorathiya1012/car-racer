const questions = [
{
question:"What does phishing mean in Cybersecurity?",
answers:[
"Physically stealing a computer",
"Tricking users into revealing sensitive information",
"Installing antivirus software",
"Encrypting files"
],
correct:1
},
{
question:"Which protocol is commonly used for secure web browsing?",
answers:[
"HTTP",
"FTP",
"HTTPS",
"SMTP"
],
correct:2
}
];

let score = 0;
let lives = 3;
let speed = 6;
let gear = 1;
let gamePaused = true;

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
let roadGraphics;
let lines = [];

function preload() {

    this.load.image(
        "player",
        "assets/images/player.png"
    );

    this.load.image(
        "enemy",
        "assets/images/enemy.png"
    );
}

function create() {

    // ROAD
    this.add.rectangle(
        window.innerWidth / 2,
        window.innerHeight / 2,
        420,
        window.innerHeight,
        0x222222
    );

    // ROAD LINES
    for (let i = 0; i < 20; i++) {

        let line = this.add.rectangle(
            window.innerWidth / 2,
            i * 80,
            10,
            40,
            0xffffff
        );

        lines.push(line);
    }

    // PLAYER CAR
    player = this.physics.add.sprite(
        window.innerWidth / 2,
        window.innerHeight - 120,
        "player"
    );

    player.setScale(0.7);

    player.setCollideWorldBounds(true);

    // ENEMIES GROUP
    enemies = this.physics.add.group();

    // KEYBOARD
    cursors = this.input.keyboard.createCursorKeys();

    // SPAWN ENEMIES
    this.time.addEvent({
        delay: 1500,
        loop: true,
        callback: () => {

            if (!gamePaused) {

                let x = Phaser.Math.Between(
                    window.innerWidth / 2 - 140,
                    window.innerWidth / 2 + 140
                );

                let enemy = enemies.create(
                    x,
                    -100,
                    "enemy"
                );

                enemy.setScale(0.7);

                enemy.setVelocityY(300);
            }

        }
    });

    // COLLISION
    this.physics.add.overlap(
        player,
        enemies,
        handleCrash,
        null,
        this
    );

    // MOBILE BUTTONS
    document.getElementById("leftBtn")
    .addEventListener("touchstart", () => {
        player.x -= 50;
    });

    document.getElementById("rightBtn")
    .addEventListener("touchstart", () => {
        player.x += 50;
    });

}

function update() {

    if (gamePaused) return;

    // ROAD MOVEMENT
    lines.forEach(line => {

        line.y += speed;

        if (line.y > window.innerHeight) {
            line.y = -40;
        }
    });

    // KEYBOARD CONTROLS
    if (cursors.left.isDown) {
        player.x -= 7;
    }

    if (cursors.right.isDown) {
        player.x += 7;
    }

    // REMOVE ENEMIES
    enemies.getChildren().forEach(enemy => {

        if (enemy.y > window.innerHeight + 100) {

            enemy.destroy();

            score += 10;
        }
    });

    // SCORE
    score += 0.05;

    updateHUD();
}

function updateHUD() {

    document.getElementById("score").innerText =
        Math.floor(score);

    document.getElementById("speed").innerText =
        speed;

    document.getElementById("lives").innerText =
        lives;

    document.getElementById("gear").innerText =
        gear;
}

function handleCrash() {

    if (gamePaused) return;

    gamePaused = true;

    showQuiz();
}

function showQuiz() {

    const modal =
        document.getElementById("quizModal");

    modal.classList.remove("hidden");

    const q =
        questions[
            Math.floor(Math.random() * questions.length)
        ];

    document.getElementById("question").innerText =
        q.question;

    const answers =
        document.getElementById("answers");

    answers.innerHTML = "";

    let timer = 10;

    document.getElementById("timer").innerText =
        timer;

    const countdown = setInterval(() => {

        timer--;

        document.getElementById("timer").innerText =
            timer;

        if (timer <= 0) {

            clearInterval(countdown);

            wrongAnswer();
        }

    }, 1000);

    q.answers.forEach((ans, index) => {

        const div =
            document.createElement("div");

        div.classList.add("answer");

        div.innerText = ans;

        div.onclick = () => {

            clearInterval(countdown);

            if (index === q.correct) {

                div.classList.add("correct");

                setTimeout(() => {

                    modal.classList.add("hidden");

                    gamePaused = false;

                }, 1500);

            } else {

                div.classList.add("wrong");

                wrongAnswer();
            }
        };

        answers.appendChild(div);
    });
}

function wrongAnswer() {

    lives--;

    score = 0;

    enemies.clear(true, true);

    document.getElementById("quizModal")
    .classList.add("hidden");

    if (lives <= 0) {

        alert("GAME OVER");

        location.reload();

    } else {

        gamePaused = false;
    }
}

// START BUTTON
document
.getElementById("startBtn")
.addEventListener("click", () => {

    document
    .getElementById("startScreen")
    .classList.add("hidden");

    gamePaused = false;
});
