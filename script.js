const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const scoreDisplay = document.getElementById("score");
const highscoreDisplay = document.getElementById("highscore");
const gameOverScreen = document.getElementById("gameover");
const playerWidth = 50;
const playerHeight = 50;
const obstacleWidth = 20;
const obstacleHeight = 40;

let playerY = 0;
let velocity = 0;
let gravity = -0.6;
let jumping = false;
let score = 0;
let highscore = localStorage.getItem("pixelHighScore") || 0;
let speed = 3.5;
let obstacleX = 600;
let gameOver = false;

highscoreDisplay.textContent = "High Score: " + highscore;

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (gameOver) restartGame();
    else if (!jumping) {
      jumping = true;
      velocity = 12;
    }
  }
});

function updatePlayer() {
  if (jumping) {
    playerY += velocity;
    velocity += gravity;
    if (playerY <= 0) {
      playerY = 0;
      velocity = 0;
      jumping = false;
    }
    player.style.bottom = playerY + "px";
  }
}

function moveObstacle() {
  if (gameOver) return;

  obstacleX -= speed;
  obstacle.style.left = obstacleX + "px";

  if (obstacleX <= -20) {
    obstacleX = 600;
    score++;
    scoreDisplay.textContent = "Score: " + score;

    // Speed increase logic
    if (score === 100) {
      speed += 1.5; // first speed boost at 100
    } else if (score > 100 && (score - 100) % 150 === 0) {
      speed += 1.5; // subsequent boosts every 150 points
    }
  }

  if (obstacleX < 20 + playerWidth &&
  obstacleX + obstacleWidth > 20 &&
  playerY < obstacleHeight) {
  triggerGameOver();
  }
}


function triggerGameOver() {
  gameOver = true;
  gameOverScreen.classList.remove("hidden");

  if (score > highscore) {
    highscore = score;
    localStorage.setItem("pixelHighScore", highscore);
  }
}

function restartGame() {
  gameOver = false;
  score = 0;
  speed = 3.5;
  obstacleX = 600;
  playerY = 0;
  velocity = 0;
  jumping = false;
  gameOverScreen.classList.add("hidden");
  scoreDisplay.textContent = "Score: 0";
  highscoreDisplay.textContent = "High Score: " + highscore;
  player.style.bottom = "0px";
}

function gameLoop() {
  updatePlayer();
  moveObstacle();
  requestAnimationFrame(gameLoop);
}

gameLoop();
