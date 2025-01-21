const img = document.getElementById("box");
const clickCountDisplay = document.getElementById("clickCount");
const lastClickValueDisplay = document.getElementById("lastClickValue");
const notification = document.getElementById("notification");
let clickCount = 0;
let clickMultiplier = 1;
const baseUpgradeCost = 100;
let upgradeCostMultiplier = 1;

// Load game state from localStorage
function loadGame() {
  const savedClickCount = localStorage.getItem("clickCount");
  const savedClickMultiplier = localStorage.getItem("clickMultiplier");
  const savedUpgradeCostMultiplier = localStorage.getItem(
    "upgradeCostMultiplier"
  );

  if (savedClickCount !== null) clickCount = parseInt(savedClickCount, 10);
  if (savedClickMultiplier !== null)
    clickMultiplier = parseInt(savedClickMultiplier, 10);
  if (savedUpgradeCostMultiplier !== null)
    upgradeCostMultiplier = parseFloat(savedUpgradeCostMultiplier);

  clickCountDisplay.textContent = clickCount;
  lastClickValueDisplay.textContent = clickMultiplier;
}

// Save game state to localStorage
function saveGame() {
  localStorage.setItem("clickCount", clickCount);
  localStorage.setItem("clickMultiplier", clickMultiplier);
  localStorage.setItem("upgradeCostMultiplier", upgradeCostMultiplier);
}

const shakeKeyframes = `
@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = shakeKeyframes;
document.head.appendChild(styleSheet);

img.addEventListener("click", (event) => {
  clickCount += clickMultiplier;
  clickCountDisplay.textContent = clickCount;
  lastClickValueDisplay.textContent = clickMultiplier;
  console.log(`Image clicked ${clickCount} times`);
  img.style.animation = "shake 0.5s";
  img.addEventListener(
    "animationend",
    () => {
      img.style.animation = "";
    },
    { once: true }
  );

  // Create floating image
  const floatingImg = document.createElement("img");
  floatingImg.src = img.src;
  floatingImg.classList.add("floating-img");
  floatingImg.style.left = `${event.clientX}px`;
  floatingImg.style.top = `${event.clientY}px`;
  document.body.appendChild(floatingImg);

  // Remove floating image after animation
  floatingImg.addEventListener("animationend", () => {
    floatingImg.remove();
  });

  saveGame(); // Save game state after each click
});

function buyUpgrade(multiplier, button) {
  let upgradeCostMultiplier = button.getAttribute("upgradeCostMultiplier");
  const cost = 100 * multiplier * upgradeCostMultiplier;
  if (clickCount >= cost) {
    clickCount -= Math.round(cost);
    clickMultiplier += multiplier;
    upgradeCostMultiplier = button.getAttribute("upgradeCostMultiplier");
    upgradeCostMultiplier *= 1.1;
    button.setAttribute("upgradeCostMultiplier", upgradeCostMultiplier);
    clickCountDisplay.textContent = clickCount;
    console.log(
      `Bought upgrade: x${multiplier} for ${Math.round(cost)} clicks`
    );
    showNotification(
      `Bought upgrade: x${multiplier} for ${Math.round(cost)} clicks`
    );
    button.querySelector(".cost").textContent = Math.round(cost * 1.1);
    lastClickValueDisplay.textContent = clickMultiplier;
    saveGame(); // Save game state after buying an upgrade
  } else {
    showNotification("Not enough clicks to buy this upgrade!");
  }
}

function showNotification(message) {
  notification.textContent = message;
  notification.classList.remove("hidden");
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
    notification.classList.add("hidden");
  }, 3000);
}

// Load game state when the page loads
window.onload = loadGame();
