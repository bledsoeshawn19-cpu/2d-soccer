const keeper = document.getElementById("keeper");
const ball = document.getElementById("ball");
const target = document.getElementById("target");
const aimLine = document.getElementById("aimLine");

const powerSlider = document.getElementById("power");
const powerText = document.getElementById("powerText");
const aimText = document.getElementById("aimText");
const shootBtn = document.getElementById("shootBtn");
const resetBtn = document.getElementById("resetBtn");
const message = document.getElementById("message");

const goalsDisplay = document.getElementById("goals");
const savesDisplay = document.getElementById("saves");
const shotsDisplay = document.getElementById("shots");

let goals = 0;
let saves = 0;
let shots = 0;
let selectedAim = "center";
let isShooting = false;

const aimPositions = {
  left: 25,
  center: 50,
  right: 75
};

function updatePower() {
  powerText.textContent = `${powerSlider.value}%`;
}

function updateAim() {
  const position = aimPositions[selectedAim];

  target.style.left = `${position}%`;

  if (selectedAim === "left") {
    aimText.textContent = "LEFT";
    aimLine.style.transform =
      "translateX(-50%) rotate(-18deg)";
  } else if (selectedAim === "right") {
    aimText.textContent = "RIGHT";
    aimLine.style.transform =
      "translateX(-50%) rotate(18deg)";
  } else {
    aimText.textContent = "CENTER";
    aimLine.style.transform =
      "translateX(-50%) rotate(0deg)";
  }
}

function chooseAim(aim) {
  selectedAim = aim;

  document.querySelectorAll(".aim-buttons button").forEach(button => {
    button.classList.remove("active");
  });

  document
    .querySelector(`[data-aim="${aim}"]`)
    .classList.add("active");

  updateAim();
}

function moveKeeper() {
  const random = Math.random();

  if (random < 0.33) {
    return "left";
  }

  if (random < 0.66) {
    return "center";
  }

  return "right";
}

function keeperPositionFor(direction) {
  if (direction === "left") return 22;
  if (direction === "right") return 78;
  return 50;
}

function makeKeeperDive(direction) {
  const position = keeperPositionFor(direction);

  keeper.style.left = `calc(${position}% - 25px)`;

  if (direction === "left") {
    keeper.style.transform = "rotate(-55deg) translateY(-5px)";
  } else if (direction === "right") {
    keeper.style.transform = "rotate(55deg) translateY(-5px)";
  } else {
    keeper.style.transform = "scale(1.12)";
  }
}

function shootBall() {
  if (isShooting) return;

  isShooting = true;
  shootBtn.disabled = true;

  shots++;
  shotsDisplay.textContent = shots;

  const power = Number(powerSlider.value);
  const aimPosition = aimPositions[selectedAim];

  const keeperDirection = moveKeeper();
  const keeperPosition = keeperPositionFor(keeperDirection);

  const aimDifference = Math.abs(aimPosition - keeperPosition);

  /*
    Higher power makes the shot faster and slightly harder
    for the goalkeeper to save.
  */
  const saveChance =
    aimDifference < 12
      ? Math.max(0.2, 0.82 - power / 180)
      : aimDifference < 28
        ? 0.25
        : 0.08;

  const saved = Math.random() < saveChance;

  makeKeeperDive(keeperDirection);

  const ballTargetX =
    aimPosition + (Math.random() * 6 - 3);

  const ballHeight =
    125 + power * 0.65;

  ball.style.left = `calc(${ballTargetX}% - 13px)`;
  ball.style.bottom = `${ballHeight}px`;

  if (selectedAim === "left") {
    ball.style.transform = "rotate(-720deg) scale(1.15)";
  } else if (selectedAim === "right") {
    ball.style.transform = "rotate(720deg) scale(1.15)";
  } else {
    ball.style.transform = "rotate(540deg) scale(1.15)";
  }

  setTimeout(() => {
    if (saved) {
      saves++;
      savesDisplay.textContent = saves;
      message.textContent = "🧤 SAVED! The goalkeeper got it!";
      message.style.color = "#ff6b6b";
    } else {
      goals++;
      goalsDisplay.textContent = goals;
      message.textContent = "⚽ GOAL! What a finish!";
      message.style.color = "#55f28b";
    }
  }, 550);

  setTimeout(() => {
    resetBall();
  }, 1300);
}

function resetBall() {
  ball.style.left = "calc(50% - 13px)";
  ball.style.bottom = "48px";
  ball.style.transform = "rotate(0deg) scale(1)";

  keeper.style.left = "calc(50% - 25px)";
  keeper.style.transform = "rotate(0deg) scale(1)";

  setTimeout(() => {
    isShooting = false;
    shootBtn.disabled = false;
    message.textContent = "Choose your aim and power!";
    message.style.color = "#ffdf32";
  }, 350);
}

function resetGame() {
  goals = 0;
  saves = 0;
  shots = 0;

  goalsDisplay.textContent = "0";
  savesDisplay.textContent = "0";
  shotsDisplay.textContent = "0";

  resetBall();
}

powerSlider.addEventListener("input", updatePower);

document.querySelectorAll(".aim-buttons button").forEach(button => {
  button.addEventListener("click", () => {
    chooseAim(button.dataset.aim);
  });
});

shootBtn.addEventListener("click", shootBall);
resetBtn.addEventListener("click", resetGame);

updatePower();
updateAim();
