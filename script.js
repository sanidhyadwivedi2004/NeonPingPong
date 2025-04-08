const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const toggleBotBtn = document.querySelector("#toggleBotBtn");
const victoryScreen = document.getElementById("victoryScreen");
const victoryMessage = document.getElementById("victoryMessage");
const playAgainBtn = document.getElementById("playAgainBtn");


const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

const boardBackground = "#0f3460";
const paddle1Color = "#00adb5";
const paddle2Color = "#ff2e63";
const paddleBorder = "#eeeeee";
const ballColor = "#f5f5f5";
const ballBorderColor = "#e94560";

const ballRadius = 12.5;
const paddleSpeed = 50;

let intervalID;
let ballSpeed;
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
let ballXDirection = 0;
let ballYDirection = 0;
let player1Score = 0;
let player2Score = 0;
let botMode = false; // AI mode toggle

let paddle1 = {
    width: 25,
    height: 100,
    x: 0,
    y: gameHeight / 2 - 50
};

let paddle2 = {
    width: 25,
    height: 100,
    x: gameWidth - 25,
    y: gameHeight / 2 - 50
};

window.onload = () => {
    window.addEventListener("keydown", changeDirection);
    resetBtn.addEventListener("click", resetGame);
    toggleBotBtn.addEventListener("click", toggleBot);
    gameStart();
};

function toggleBot() {
    botMode = !botMode;
    toggleBotBtn.textContent = botMode ? "Disable Bot" : "Enable Bot";
}

function gameStart() {
    createBall();
    nextTick();
}

function nextTick() {
    intervalID = setTimeout(() => {
        clearBoard();
        drawPaddles();
        moveBall();

        if (botMode) controlBot();

        drawBall(ballX, ballY);
        checkCollision();
        nextTick();
    }, 10);
}

function clearBoard() {
    ctx.fillStyle = "rgba(15, 52, 96, 0.2)"; // semi-transparent for trail
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}


function drawPaddles() {
    ctx.strokeStyle = paddleBorder;

    ctx.fillStyle = paddle1Color;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

    ctx.fillStyle = paddle2Color;
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}

function createBall() {
    ballSpeed = 2;
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    ballXDirection = Math.random() > 0.5 ? 1 : -1;
    ballYDirection = (Math.random() * 2 - 1);
}

function moveBall() {
    ballX += ballSpeed * ballXDirection;
    ballY += ballSpeed * ballYDirection;
}

function drawBall(x, y) {
    ctx.fillStyle = ballColor;
    ctx.strokeStyle = ballBorderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
}

function checkCollision() {
    if (ballY <= ballRadius || ballY >= gameHeight - ballRadius) {
        ballYDirection *= -1;
    }

    if (ballX <= 0) {
        player2Score++;
        updateScore();
        if (player2Score >= 5) {
            showVictory("Player 2 Wins!");
            return;
        }
        createBall();
        return;
    }

    if (ballX >= gameWidth) {
        player1Score++;
        updateScore();
        if (player1Score >= 5) {
            showVictory("Player 1 Wins!");
            return;
        }
        createBall();
        return;
    }

    if (ballX - ballRadius <= paddle1.x + paddle1.width &&
        ballY >= paddle1.y &&
        ballY <= paddle1.y + paddle1.height) {
        ballXDirection = 1;
        ballSpeed += 0.5;
    }

    if (ballX + ballRadius >= paddle2.x &&
        ballY >= paddle2.y &&
        ballY <= paddle2.y + paddle2.height) {
        ballXDirection = -1;
        ballSpeed += 0.5;
    }
}


function changeDirection(event) {
    const key = event.keyCode;
    const paddle1Up = 87;
    const paddle1Down = 83;
    const paddle2Up = 38;
    const paddle2Down = 40;

    switch (key) {
        case paddle1Up:
            if (paddle1.y > 0) paddle1.y -= paddleSpeed;
            break;
        case paddle1Down:
            if (paddle1.y < gameHeight - paddle1.height) paddle1.y += paddleSpeed;
            break;
        case paddle2Up:
            if (!botMode && paddle2.y > 0) paddle2.y -= paddleSpeed;
            break;
        case paddle2Down:
            if (!botMode && paddle2.y < gameHeight - paddle2.height) paddle2.y += paddleSpeed;
            break;
    }
}

function controlBot() {
    const botCenter = paddle2.y + paddle2.height / 2;
    if (botCenter < ballY - 10) {
        paddle2.y += 3;
    } else if (botCenter > ballY + 10) {
        paddle2.y -= 3;
    }
}

function updateScore() {
    scoreText.textContent = `${player1Score} : ${player2Score}`;
}

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    paddle1.y = gameHeight / 2 - paddle1.height / 2;
    paddle2.y = gameHeight / 2 - paddle2.height / 2;
    ballSpeed = 2;
    ballXDirection = 0;
    ballYDirection = 0;
    updateScore();
    clearInterval(intervalID);
    victoryScreen.classList.remove("show");
    gameStart();
}

function showVictory(message) {
    clearInterval(intervalID);
    victoryMessage.textContent = message;
    victoryScreen.classList.add("show");
}
playAgainBtn.addEventListener("click", resetGame);


