// Elements
const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const scoreDisplay = document.getElementById("score");
const highscoreDisplay = document.getElementById("highscore");
const gameOverScreen = document.getElementById("gameover");

// Sizes
const playerWidth = 50;
const playerHeight = 50;
const obstacleWidth = 20;
const obstacleHeight = 40;

// Game variables
let playerY = 0;
let velocity = 0;
let gravity = -0.6;
let jumping = false;
let score = 0;
let highscore = localStorage.getItem("pixelHighScore") || 0;
let speed = 3.5;
let obstacleX = 600;
let gameOver = false;

// Initialize highscore display
highscoreDisplay.textContent = "High Score: " + highscore;

// -----------------------------
// Jump function (used for all inputs)
function jump() {
  if (gameOver) return restartGame();
  if (!jumping) {
    jumping = true;
    velocity = 12;
  }
}

// -----------------------------
// Event listeners
// PC: spacebar
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});

// PC & Mobile: click or tap anywhere
document.addEventListener("click", jump);
document.addEventListener("touchstart", jump);

// -----------------------------
// Update player position
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

// -----------------------------
// Move obstacle and handle scoring / collision
function moveObstacle() {
  if (gameOver) return;

  obstacleX -= speed;
  obstacle.style.left = obstacleX + "px";

  // Reset obstacle when off screen
  if (obstacleX <= -obstacleWidth) {
    obstacleX = 600; // reset to right
    score++;
    scoreDisplay.textContent = "Score: " + score;

    // Increase speed over time
    if (score === 100) speed += 1.5;
    else if (score > 100 && (score - 100) % 150 === 0) speed += 1.5;
  }

  // Collision detection
  if (
    obstacleX < 20 + playerWidth && 
    obstacleX + obstacleWidth > 20 && 
    playerY < obstacleHeight
  ) {
    triggerGameOver();
  }
}

// -----------------------------
// Game over logic
function triggerGameOver() {
  gameOver = true;
  gameOverScreen.classList.remove("hidden");

  if (score > highscore) {
    highscore = score;
    localStorage.setItem("pixelHighScore", highscore);
  }
}

// -----------------------------
// Restart game
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

// -----------------------------
// Main game loop
function gameLoop() {
  updatePlayer();
  moveObstacle();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
