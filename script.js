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
let shooting = false;

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
    aimText.textContent = "LEFT CORNER";
    aimLine.style.transform =
      "translateX(-50%) rotate(-19deg)";
  } else if (selectedAim === "right") {
    aimText.textContent = "RIGHT CORNER";
    aimLine.style.transform =
      "translateX(-50%) rotate(19deg)";
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

function chooseKeeperDirection() {
  const random = Math.random();

  if (random < 0.34) return "left";
  if (random < 0.67) return "center";
  return "right";
}

function getKeeperPosition(direction) {
  if (direction === "left") return 23;
  if (direction === "right") return 77;
  return 50;
}

function makeKeeperDive(direction) {
  const position = getKeeperPosition(direction);

  keeper.style.left = `calc(${position}% - 27px)`;

  if (direction === "left") {
    keeper.style.transform =
      "rotate(-58deg) translate(-8px, -5px) scale(1.04)";
  } else if (direction === "right") {
    keeper.style.transform =
      "rotate(58deg) translate(8px, -5px) scale(1.04)";
  } else {
    keeper.style.transform = "scale(1.08)";
  }
}

function resetBallAndKeeper() {
  ball.style.left = "calc(50% - 14px)";
  ball.style.bottom = "72px";
  ball.style.transform = "rotate(0deg) scale(1)";

  keeper.style.left = "calc(50% - 27px)";
  keeper.style.transform = "rotate(0deg) scale(1)";
}

function shootBall() {
  if (shooting) return;

  shooting = true;
  shootBtn.disabled = true;

  shots++;
  shotsDisplay.textContent = shots;

  const power = Number(powerSlider.value);
  const targetPosition = aimPositions[selectedAim];

  const keeperDirection = chooseKeeperDirection();
  const keeperPosition = getKeeperPosition(keeperDirection);

  const distanceFromKeeper =
    Math.abs(targetPosition - keeperPosition);

  /*
    Shots aimed close to the keeper are easier to save.
    High power slightly reduces the save chance.
  */
  let saveChance;

  if (distanceFromKeeper < 12) {
    saveChance = 0.78 - power / 230;
  } else if (distanceFromKeeper < 28) {
    saveChance = 0.34 - power / 400;
  } else {
    saveChance = 0.08;
  }

  saveChance = Math.max(0.04, Math.min(0.85, saveChance));

  const saved = Math.random() < saveChance;

  makeKeeperDive(keeperDirection);

  const randomAccuracy = Math.random() * 5 - 2.5;
  const finalTarget = targetPosition + randomAccuracy;

  const ballHeight = 155 + power * 0.75;

  ball.style.left = `calc(${finalTarget}% - 14px)`;
  ball.style.bottom = `${ballHeight}px`;

  if (selectedAim === "left") {
    ball.style.transform =
      "rotate(-900deg) scale(1.12)";
  } else if (selectedAim === "right") {
    ball.style.transform =
      "rotate(900deg) scale(1.12)";
  } else {
    ball.style.transform =
      "rotate(650deg) scale(1.12)";
  }

  setTimeout(() => {
    if (saved) {
      saves++;
      savesDisplay.textContent = saves;
      message.textContent = "🧤 SAVED! Great goalkeeping!";
      message.style.color = "#ff7777";
    } else {
      goals++;
      goalsDisplay.textContent = goals;
      message.textContent = "⚽ GOAL! Into the corner!";
      message.style.color = "#55ef91";
    }
  }, 560);

  setTimeout(() => {
    resetBallAndKeeper();
  }, 1350);

  setTimeout(() => {
    shooting = false;
    shootBtn.disabled = false;
    message.textContent = "Choose your aim and power.";
    message.style.color = "#ffdb2f";
  }, 1750);
}

function resetGame() {
  goals = 0;
  saves = 0;
  shots = 0;

  goalsDisplay.textContent = "0";
  savesDisplay.textContent = "0";
  shotsDisplay.textContent = "0";

  resetBallAndKeeper();

  shooting = false;
  shootBtn.disabled = false;

  message.textContent = "Choose your aim and power.";
  message.style.color = "#ffdb2f";
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
