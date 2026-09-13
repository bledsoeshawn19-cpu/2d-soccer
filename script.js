const ball = document.getElementById("ball");
const keeper = document.getElementById("keeper");
const target = document.getElementById("target");
const message = document.getElementById("message");

const aimSlider = document.getElementById("aim");
const powerSlider = document.getElementById("power");
const curveSlider = document.getElementById("curve");
const difficultySelect = document.getElementById("difficulty");

const shootButton = document.getElementById("shootButton");
const resetButton = document.getElementById("resetButton");

const goalsText = document.getElementById("goals");
const savesText = document.getElementById("saves");
const shotsText = document.getElementById("shots");
const streakText = document.getElementById("streak");

const shotName = document.getElementById("shotName");
const shotDescription = document.getElementById("shotDescription");

const shotButtons = document.querySelectorAll(".shot-button");

let goals = 0;
let saves = 0;
let shots = 0;
let streak = 0;
let shooting = false;
let selectedShot = "normal";

const shotTypes = {
  normal: {
    name: "Normal Shot",
    description: "A balanced shot with average power, accuracy, and curve.",
    accuracy: 1,
    power: 1,
    curve: 1,
    height: 0,
    spin: 0
  },

  power: {
    name: "Power Shot",
    description: "Very fast and difficult to stop, but less accurate.",
    accuracy: 0.72,
    power: 1.35,
    curve: 0.4,
    height: 5,
    spin: 0
  },

  finesse: {
    name: "Finesse Shot",
    description: "A controlled curling shot designed for the corners.",
    accuracy: 1.15,
    power: 0.85,
    curve: 1.8,
    height: 10,
    spin: 1
  },

  chip: {
    name: "Chip Shot",
    description: "Lifts the ball over the goalkeeper.",
    accuracy: 0.9,
    power: 0.7,
    curve: 0.5,
    height: 55,
    spin: 0
  },

  knuckle: {
    name: "Knuckleball",
    description: "A strange shot with unpredictable movement.",
    accuracy: 0.82,
    power: 1.1,
    curve: 1.2,
    height: 20,
    spin: 2
  }
};

shotButtons.forEach(button => {
  button.addEventListener("click", () => {
    selectedShot = button.dataset.shot;

    shotButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    const shot = shotTypes[selectedShot];
    shotName.textContent = shot.name;
    shotDescription.textContent = shot.description;
  });
});

shootButton.addEventListener("click", shoot);
resetButton.addEventListener("click", resetGame);

function shoot() {
  if (shooting) return;

  shooting = true;

  const shot = shotTypes[selectedShot];
  const aim = Number(aimSlider.value);
  const power = Number(powerSlider.value);
  const curve = Number(curveSlider.value);
  const difficulty = difficultySelect.value;

  shots++;
  shotsText.textContent = shots;

  let difficultyMultiplier = 1;

  if (difficulty === "easy") {
    difficultyMultiplier = 0.65;
  } else if (difficulty === "hard") {
    difficultyMultiplier = 1.35;
  }

  let finalAim = aim + curve * shot.curve * 0.35;

  if (selectedShot === "knuckle") {
    finalAim += (Math.random() - 0.5) * 18;
  }

  finalAim = Math.max(8, Math.min(92, finalAim));

  const keeperPosition =
    Math.random() * 75 + 12.5;

  const distanceFromKeeper =
    Math.abs(finalAim - keeperPosition);

  const powerDifficulty =
    power > 90 ? 8 : 0;

  const shotAccuracyPenalty =
    (1 - shot.accuracy) * 22 * difficultyMultiplier;

  const saveZone =
    9 +
    shotAccuracyPenalty +
    powerDifficulty;

  const chipBonus =
    selectedShot === "chip" ? 18 : 0;

  const keeperReaction =
    Math.random() * 25 * difficultyMultiplier;

  const saved =
    distanceFromKeeper < saveZone + keeperReaction / 4 - chipBonus;

  let targetHeight = 260 + shot.height + power * shot.power * 0.8;

  if (selectedShot === "chip") {
    targetHeight += 70;
  }

  ball.style.left = `calc(${finalAim}% - 22px)`;
  ball.style.bottom = `${targetHeight}px`;

  let rotation = curve * 7 * shot.curve;

  if (selectedShot === "knuckle") {
    rotation += (Math.random() - 0.5) * 100;
  }

  ball.style.transform =
    `rotate(${rotation}deg)`;

  keeper.style.left =
    `calc(${keeperPosition}% - 24px)`;

  if (saved) {
    keeper.style.transform =
      `rotate(${finalAim > keeperPosition ? 25 : -25}deg)`;
  } else {
    keeper.style.transform = "scale(1.1)";
  }

  setTimeout(() => {
    if (saved) {
      saves++;
      streak = 0;

      savesText.textContent = saves;
      streakText.textContent = streak;

      message.textContent =
        selectedShot === "chip"
          ? "🧤 SAVED! The goalkeeper caught your chip!"
          : "🧤 SAVED! The goalkeeper made a great stop!";

      message.style.color = "#ff5555";
    } else {
      goals++;
      streak++;

      goalsText.textContent = goals;
      streakText.textContent = streak;

      message.textContent =
        streak >= 3
          ? `🔥 ${streak} GOALS IN A ROW!`
          : "⚽ GOOOOAL! What a finish!";

      message.style.color = "#58ff8b";
    }

    setTimeout(resetBall, 1300);
  }, 700);
}

function resetBall() {
  ball.style.left = "calc(50% - 22px)";
  ball.style.bottom = "35px";
  ball.style.transform = "rotate(0deg)";

  keeper.style.left = "calc(50% - 24px)";
  keeper.style.transform = "rotate(0deg) scale(1)";

  shooting = false;
}

function resetGame() {
  goals = 0;
  saves = 0;
  shots = 0;
  streak = 0;

  goalsText.textContent = "0";
  savesText.textContent = "0";
  shotsText.textContent = "0";
  streakText.textContent = "0";

  message.textContent = "Choose your shot!";
  message.style.color = "white";

  resetBall();
}
