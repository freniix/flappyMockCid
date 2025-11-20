const spkrButtonIcon = document.querySelector("#speaker i");
const poles = document.querySelectorAll(".pole");
const topPoles = document.querySelectorAll(".top-pole");
const bottomPoles = document.querySelectorAll(".bottom-pole");

const char = document.querySelector("#character");
const scoreEl = document.querySelector("#score");
const gameOverScr = document.querySelector("#game-over");
const gameBoard = document.querySelector("#game-board");
//initializing audio
const cidAudio = [];
const gameOverAudio = new Audio("./assets/gameOver.mp3");

//variables
let isMuted = false;
let isJumping = false;
let jumpInterval = null;
let isGameOver = false;
let currAudioIndex = genRanNum(cidAudio.length);
let score = 0;

(() => {
  // initializing audio
  for (let i = 1; i <= 5; i++) {
    const audio = new Audio(`./assets/cid${i}.mp3`);
    cidAudio.push(audio);
  }

})();

// if(window.innerWidth === 500)
//initializing pole position for the first time
function initializePolesPos(){
    poles.forEach((item) => {
    const rand = genRanNum(200);
    item.style.top = `${-rand}px`;
  });
}

initializePolesPos();
function speakerToggle() {
  spkrButtonIcon.className = isMuted
    ? "ri-volume-up-line"
    : "ri-volume-mute-line";
  isMuted = !isMuted;
  cidAudio.forEach((item) => (item.volume = isMuted ? 0 : 1));
  gameOverAudio.volume = isMuted ? 0 : 1;
}

function playRandomAudio() {
  let curr = cidAudio[currAudioIndex];
  if (!curr.paused) {
    curr.pause();
    curr.currentTime = 0;
  }
  currAudioIndex = genRanNum(cidAudio.length);
  cidAudio[currAudioIndex].play();
}
function genRanNum(times) {
  return Math.floor(Math.random() * times);
}

function gameLogic(e) {
  if(isGameOver) return;
  if (
    e.target.closest("#reset-btn") ||
    e.target.closest("#speaker") ||
    e.target.closest("#game-over")
  )
    return;
  playRandomAudio();
  jump();
}
document.addEventListener("click", (e) => gameLogic(e));
document.addEventListener("keydown", (e) => gameLogic(e));



poles.forEach((item, index) => {
  item.addEventListener("animationiteration", () => {
    score += 10;
    random = genRanNum(200);
    item.style.top = `${-random}px`;
  });
});



setInterval(()=>{
  if (isJumping || isGameOver) return;
  const currentPos = parseInt(window.getComputedStyle(char).top);
  topPoles.forEach((elem) => {
    if (isHit(char, elem)) {
      gameOver();
    }
  });
  bottomPoles.forEach((elem) => {
    if (isHit(char, elem)) {
      gameOver();
    }
  });

  char.style.top = currentPos + 2 + "px";
},20);

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
    if (iterationCount > 20) {
      clearInterval(jumpInterval);
      isJumping = false;
    }
  }, 10);
}

function isHit(a, b) {
  const aPos = a.getBoundingClientRect();
  const bPos = b.getBoundingClientRect();
  return (
    aPos.top-10 < bPos.bottom &&
    aPos.left-10 < bPos.right &&
    aPos.bottom-10 > bPos.top &&
    aPos.right-10 > bPos.left
  );
}
setInterval(() => {
  let hi = char.getBoundingClientRect().bottom;
  console.log(hi);
}, 50);

function gameOver() {
  isGameOver = true;
  scoreEl.textContent = score;
  const curr = cidAudio[currAudioIndex];
  if (!curr.paused) {
    curr.pause();
    curr.currentTime = 0;
  }
  gameOverScr.style.display = "flex";
  gameOverAudio.play();
  poles.forEach((item) => (item.style.animationPlayState = "paused"));
}

function resetGame() {
  char.style.top = "200px";
  score = 0;
  isGameOver = false;
  isJumping = false;

  poles.forEach((item, index) => {
    item.style.animation = "none";
    item.offsetHeight;
    item.style.left = "0";
    item.style.animation = "pole 3s infinite linear";
    item.style.animationDelay = `${index * 0.75}s`;
  });
  gameOverAudio.currentTime = 0;
  gameOverAudio.pause();
  gameOverScr.style.display = "none";
  initializePolesPos();
}
