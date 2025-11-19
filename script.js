const spkrButtonIcon = document.querySelector("#score-board button i");
const pole = document.querySelector(".pole");
const hole = document.querySelector(".hole");
const char = document.querySelector("#character");
//initializing audio
const jumpAudio = new Audio("./assets/jumpAudio.mp3");
const gameOverAudio = new Audio("./assets/gameOver.mp3");

let isMuted = false;
let isJumping = false;
let jumpInterval = null;
let isGameOver = false;

function speakerToggle() {
  spkrButtonIcon.className = isMuted
    ? "ri-volume-up-line"
    : "ri-volume-mute-line";
  isMuted = !isMuted;
  jumpAudio.volume = isMuted ? 0 : 1;
  gameOverAudio.volume = isMuted? 0 : 1;
}

document.addEventListener("click", (e) => {
  if (e.target.closest("#reset-btn") || e.target.closest("#speaker")) return;
  if (!jumpAudio.paused) {
    jumpAudio.pause;
    jumpAudio.currentTime = 0;
  }
  if(!gameOverAudio.paused){
    gameOverAudio.pause();
    gameOverAudio.currentTime = 0;
  }
  jumpAudio.play();
  // if(!isMuted)  jumpAudio.play();
  //better if you want it not to play if speaker is off but i prefer it to play so i can hear it midway
  jump();
});

pole.addEventListener("animationiteration", () => {
  const random = Math.floor(Math.random() * 400);
  hole.style.top = random + "px";
});

setInterval(() => {
  if (isJumping || isGameOver) return;
  const currentPos = parseInt(window.getComputedStyle(char).top);
  if (currentPos === 600 - 60) {
    gameOver();
  }
  if (currentPos >= 600 - 60) {
    return;
  }
  char.style.top = currentPos + 2 + "px";
}, 10);

function jump() {
  if (jumpInterval) clearInterval(jumpInterval);
  isJumping = true;
  let iterationCount = 0;
  jumpInterval = setInterval(() => {
    const currentPos = parseInt(window.getComputedStyle(char).top);
    if (currentPos < 4) {
      clearInterval(jumpInterval);
      isJumping = false;
    }
    char.style.top = currentPos - 3 + "px";
    iterationCount++;
    if (iterationCount > 30) {
      clearInterval(jumpInterval);
      isJumping = false;
    }
  }, 10);
}

function gameOver() {
  isGameOver = true;
  if (!jumpAudio.paused) {
    jumpAudio.pause();
    jumpAudio.currentTime = 0;
  }
  // if(!isMuted)  gameOverAudio.play();
  gameOverAudio.play();
  pole.style.animationPlayState = "paused";
}

function resetGame() {
  char.style.top = "200px";
  pole.style.animation = "none";
  pole.offsetHeight;
  pole.style.left = "0";
  pole.style.animation = " pole 3s infinite linear";
  if (!gameOverAudio.paused) {
    gameOverAudio.pause();
    gameOver.currentTime = 0;
  }

  isGameOver = false;
  isJumping = false;
}
