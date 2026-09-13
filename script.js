const ball = document.getElementById("ball");
const keeper = document.getElementById("keeper");
const message = document.getElementById("message");

const aimSlider = document.getElementById("aim");
const powerSlider = document.getElementById("power");
const curveSlider = document.getElementById("curve");

const shootButton = document.getElementById("shootButton");
const resetButton = document.getElementById("resetButton");

const goalsText = document.getElementById("goals");
const savesText = document.getElementById("saves");
const shotsText = document.getElementById("shots");

let goals = 0;
let saves = 0;
let shots = 0;
let shooting = false;

shootButton.addEventListener("click", shoot);
resetButton.addEventListener("click", resetGame);

function shoot() {
  if (shooting) return;

  shooting = true;
  shots++;
  shotsText.textContent = shots;

  const aim = Number(aimSlider.value);
  const power = Number(powerSlider.value);
  const curve = Number(curveSlider.value);

  const keeperPosition = Math.random() * 80 + 10;
  const keeperGuess = Math.random() * 100;

  keeper.style.left = `calc(${keeperPosition}% - 24px)`;

  const targetX = aim;
  const targetY = 40 - power * 0.22;

  ball.style.left = `calc(${targetX}% - 22px)`;
  ball.style.bottom = `${targetY + 250}px`;
  ball.style.transform = `rotate(${curve * 8}deg)`;

  const distance = Math.abs(aim - keeperPosition);
  const curveDifficulty = Math.abs(curve) * 0.35;
  const powerDifficulty = power > 90 ? 10 : 0;

  const saveChance =
    distance < 12 + curveDifficulty + powerDifficulty ||
    keeperGuess > 94;

  setTimeout(() => {
    if (saveChance) {
      saves++;
      savesText.textContent = saves;
      message.textContent = "🧤 SAVED! The goalkeeper read it!";
      message.style.color = "#ff5555";
    } else {
      goals++;
      goalsText.textContent = goals;
      message.textContent = "⚽ GOOOOAL! What a finish!";
      message.style.color = "#55ff88";
    }

    setTimeout(resetBall, 1200);
  }, 700);
}

function resetBall() {
  ball.style.left = "calc(50% - 22px)";
  ball.style.bottom = "35px";
  ball.style.transform = "rotate(0deg)";
  keeper.style.left = "calc(50% - 24px)";
  shooting = false;
}

function resetGame() {
  goals = 0;
  saves = 0;
  shots = 0;

  goalsText.textContent = "0";
  savesText.textContent = "0";
  shotsText.textContent = "0";

  message.textContent = "Choose where to shoot!";
  message.style.color = "white";

  resetBall();
}
