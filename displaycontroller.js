import { Player } from "./main.js";

const computer = Player("Computer");
const player = Player("Player");

function statusMessage(message, color = "#e1fde1") {
  const statusContainer = document.querySelector(".status-message");
  statusContainer.innerHTML = message;
  statusContainer.style.backgroundColor = color;
}

function computerAttack() {
  const x = Math.floor(Math.random() * 10);
  const y = Math.floor(Math.random() * 10);

  const roundDot = document.getElementById("pdot" + x + y);
  if (!roundDot.classList.contains("hide")) {
    computerAttack();
    return;
  }

  const cAttack = computer.attack(player, x, y);
  if (cAttack === "Invalid target") {
    computerAttack();
    return;
  }

  const computerContainer = document.querySelector(".computer-container");

  if (cAttack === "miss") {
    roundDot.classList.toggle("hide");
    statusMessage("Miss", "#f0cccc");
  } else if (cAttack === "hit") {
    roundDot.classList.toggle("hide");
    roundDot.classList.add("dot-hit");
    statusMessage("Hit!", "#fa5757");
    setTimeout(() => {
      computerAttack();
    }, 1000);
    return;
  } else if (typeof cAttack == "object") {
    roundDot.classList.toggle("hide");
    roundDot.classList.add("dot-hit");
    const destroyedShip = document.getElementById(cAttack.getId());
    destroyedShip.classList.add("ship-destroyed");
    statusMessage("Ship destroyed!", "red");
    setTimeout(() => {
      if (checkGameOver(player)) return;
      computerAttack();
    }, 1000);
    return;
  }

  setTimeout(() => {
    computerContainer.style.pointerEvents = "auto";
    statusMessage("Your turn!");
  }, 1000);
}

function checkGameOver(loser = computer) {
  let shipsSelector = ".c-ship";
  let shipsDestroyed = 0;

  if (loser !== computer) shipsSelector = ".js-ships";

  const computerShips = document.querySelectorAll(shipsSelector);
  computerShips.forEach((ship) => {
    const x = parseInt(ship.dataset.x);
    const y = parseInt(ship.dataset.y);
    if (loser.isShipSunk(x, y)) shipsDestroyed += 1;
  });
  if (shipsDestroyed > 4) {
    const playAgain = document.querySelector(".play-again");
    playAgain.classList.toggle("hide");
    playAgain.addEventListener("click", () => {
      location.reload();
    });
    if (loser === computer) {
      statusMessage("You Win!", "lightgreen");
      return true;
    } else {
      statusMessage("You Lose!", "#ff7f7f");
      return true;
    }
  }
}

function playerAttack(x, y) {
  const pAttack = player.attack(computer, x, y);
  if (pAttack === "Invalid target") return;

  const computerContainer = document.querySelector(".computer-container");
  const roundDot = document.getElementById("cdot" + x + y);
  roundDot.parentElement.style.pointerEvents = "none";

  if (pAttack === "miss") {
    roundDot.classList.toggle("hide");
    statusMessage("Miss");
  } else if (pAttack === "hit") {
    roundDot.classList.toggle("hide");
    roundDot.classList.add("dot-hit");
    statusMessage("Hit!", "lightgreen");
    setTimeout(() => {
      computerContainer.style.pointerEvents = "auto";
      statusMessage("Your Turn");
    }, 1000);
    return;
  } else if (typeof pAttack == "object") {
    roundDot.classList.toggle("hide");
    roundDot.classList.add("dot-hit");
    const destroyedShip = document.getElementById(pAttack.getId());
    destroyedShip.classList.toggle("hide");
    destroyedShip.classList.add("ship-destroyed");
    statusMessage("Ship destroyed!", "#ff7f7f");
    setTimeout(() => {
      if (checkGameOver()) return;
      computerContainer.style.pointerEvents = "auto";
      statusMessage("Your Turn");
    }, 1000);
    return;
  }
  setTimeout(() => {
    computerAttack();
  }, 500);
}

function placeComputerShips() {
  const ships = [
    { id: "cCarrier", length: 5 },
    { id: "cBattleship", length: 4 },
    { id: "cDestroyer", length: 3 },
    { id: "cSubmarine", length: 3 },
    { id: "cPatrol", length: 2 },
  ];

  ships.forEach((ship) => {
    const { x, y, vertical } = computer.placeShipRandom(ship.length, ship.id);
    const shipImg = document.getElementById(ship.id);
    if (vertical) {
      shipImg.style.transformOrigin = "10% 70%";
      shipImg.style.transform = "rotate(90deg)";
      shipImg.classList.add("ships-v");
    }
    shipImg.dataset.x = x;
    shipImg.dataset.y = y;
    const cell = document.getElementById("c" + x + y);
    cell.appendChild(shipImg);
  });
}

function boardRender(container, className, id) {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const boardSquare = document.createElement("div");
      const roundDot = document.createElement("div");

      roundDot.className = "round-dot";
      roundDot.classList.add("hide");
      roundDot.id = id + "dot" + i + j;
      boardSquare.className = className;
      boardSquare.id = id + i + j;
      boardSquare.dataset.x = i;
      boardSquare.dataset.y = j;
      boardSquare.appendChild(roundDot);
      container.appendChild(boardSquare);
    }
  }
  if (className === "computer-board") {
    placeComputerShips();

    container.addEventListener("click", (e) => {
      if (e.target.className !== "computer-board") return;
      const cellX = e.target.dataset.x;
      const cellY = e.target.dataset.y;
      container.style.pointerEvents = "none";
      playerAttack(cellX, cellY);
    });
  }
}

function startBattle() {
  const shipsContainer = document.querySelector(".ships-container");
  const computerContainer = document.querySelector(".computer-container");
  const wrapper = document.querySelector(".wrapper");

  computerContainer.style.display = "grid";
  shipsContainer.style.display = "none";
  wrapper.style["flex-direction"] = "row";
  wrapper.style.gap = "50px";

  boardRender(computerContainer, "computer-board", "c");
  statusMessage("Ready to fire!");
}

function shipsReady() {
  const shipField = document.querySelectorAll(".field-ship");
  const ships = document.querySelectorAll(".js-ships");
  const prepareCounter = document.getElementById("prepare-counter");
  let shipsReady = 0;
  shipField.forEach((field) => {
    if (field.firstChild == null) shipsReady += 1;
  });
  prepareCounter.textContent = `${shipsReady}/5`;
  if (shipsReady > 4) {
    ships.forEach((ship) => {
      const x = parseInt(ship.dataset.x);
      const y = parseInt(ship.dataset.y);
      const vertical = ship.dataset.vertical === "true";
      const length = parseInt(ship.dataset.length);
      ship.setAttribute("draggable", "false");
      ship.style.cursor = "default";
      player.placeShip(x, y, length, vertical, ship.id);
    });
    statusMessage("Entering battle... ", "#f4f7f4");
    setTimeout(() => {
      startBattle();
    }, 2000);
  }
}

function playerController() {
  const playerContainer = document.querySelector(".player-container");
  let shipLength = 0;
  let verticalAxis = false;

  const addDragShip = (className, length) => {
    const ship = document.querySelector(className);
    const axis = document.getElementById("axis-y");
    ship.addEventListener("dragstart", (e) => {
      const parentElement = ship.parentNode;
      if (parentElement.className !== "field-ship")
        cellColor(parentElement, "white", length, true);

      verticalAxis = axis.checked;
      shipLength = length;
      e.dataTransfer.setData("id", e.target.id);
      e.target.classList.toggle("hide");
    });
    ship.addEventListener("dragend", (e) => {
      e.target.classList.toggle("hide");
    });
  };

  const cellColor = (cell, color, shipLength, erase = false) => {
    const cellX = cell.dataset.x;
    const cellY = cell.dataset.y;
    let cellColor = color;

    if (!erase) {
      if (verticalAxis) {
        if (parseInt(cellX) + shipLength > 10) cellColor = "#f0cccc";
      } else {
        if (parseInt(cellY) + shipLength > 10) cellColor = "#f0cccc";
      }
    }

    let neighborId = "";
    for (let i = 0; i < shipLength; i++) {
      if (verticalAxis)
        neighborId = "p" + (parseInt(cellX) + parseInt(i)) + cellY;
      else neighborId = "p" + cellX + (parseInt(cellY) + parseInt(i));
      const neighbor = document.getElementById(neighborId);
      if (neighbor !== null) neighbor.style.backgroundColor = cellColor;
    }
    cell.style.backgroundColor = cellColor;
  };

  function dragOver(e) {
    const cell = e.target;
    if (cell.className !== "round-dot") cellColor(cell, "#f4f7f4", shipLength);
  }

  playerContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    dragOver(e);
  });

  function dragDrop(e) {
    const cell = e.target;
    const cellX = cell.dataset.x;
    const cellY = cell.dataset.y;

    const ship = document.getElementById(e.dataTransfer.getData("id"));
    if (verticalAxis) {
      if (parseInt(cellX) + shipLength > 10) {
        cellColor(cell, "white", shipLength, true);
        return;
      }
      ship.style.transformOrigin = "10% 70%";
      ship.style.transform = "rotate(90deg)";
      ship.classList.add("ships-v");
    } else {
      if (parseInt(cellY) + shipLength > 10) {
        cellColor(cell, "white", shipLength, true);
        return;
      }
      ship.style.transformOrigin = "";
      ship.style.transform = "";
      ship.classList.remove("ships-v");
    }
    ship.dataset.x = cellX;
    ship.dataset.y = cellY;
    ship.dataset.vertical = verticalAxis;
    ship.dataset.length = shipLength;
    cell.appendChild(ship);
    shipsReady();
  }

  playerContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    dragDrop(e);
  });

  function dragLeave(e) {
    const cell = e.target;
    cellColor(cell, "white", shipLength, true);
  }

  playerContainer.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dragLeave(e);
  });

  boardRender(playerContainer, "player-board", "p");
  addDragShip(".ship-carrier", 5);
  addDragShip(".ship-battleship", 4);
  addDragShip(".ship-destroyer", 3);
  addDragShip(".ship-submarine", 3);
  addDragShip(".ship-patrol", 2);
}

playerController();
