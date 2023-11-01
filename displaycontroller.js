import { Player } from "./main.js";

const computer = Player('Computer');
const player = Player('Player');

function statusMessage(message, color = '#f4f7f4') {
  const statusContainer = document.querySelector('.status-message');
  statusContainer.innerHTML = message;
  statusContainer.style.backgroundColor = color;
}

function playerAttack (x, y) {
  const pAttack = player.attack(computer, x, y);
  if (pAttack === 'Invalid target') return;

  const roundDot = document.getElementById('cdot'+x+y); 
  if (pAttack === 'miss') {
    roundDot.classList.toggle('hide');
    statusMessage('Miss');
  } else 
  if (pAttack === 'hit!') {
    roundDot.classList.toggle('hide');
    roundDot.classList.add('dot-hit');
    statusMessage('Hit!', 'lightblue');
  } else 
  if (pAttack === 'destroyed!') {
    roundDot.classList.toggle('hide');
    roundDot.classList.add('dot-hit');
    statusMessage('Ship destroyed!', 'red');
  }
  console.log(pAttack);

}

function boardRender(container, className, id) {

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const boardSquare = document.createElement('div');
      const roundDot = document.createElement('div');

      roundDot.className = 'round-dot';
      roundDot.classList.add('hide');
      roundDot.id = id+'dot'+i+j;
      boardSquare.className = className;
      boardSquare.id = id+i+j;
      boardSquare.dataset.x = i;
      boardSquare.dataset.y = j;
      boardSquare.appendChild(roundDot);
      container.appendChild(boardSquare);
    }    
  }
  if (className === 'computer-board')  {
    // add computer ships
    console.log(computer.placeShip( 3, 3, 3));
    
    container.addEventListener('click', (e) => {
      const cellX = e.target.dataset.x;
      const cellY = e.target.dataset.y;
      playerAttack(cellX, cellY);
    })
  }
}

function startBattle () {
  const shipsContainer = document.querySelector('.ships-container');
  const computerContainer = document.querySelector('.computer-container');
  const wrapper = document.querySelector('.wrapper');

  computerContainer.style.display = 'grid';
  shipsContainer.style.display = 'none';
  wrapper.style['flex-direction'] = 'row';
  wrapper.style.gap = '50px';

  boardRender(computerContainer, 'computer-board', 'c');
  statusMessage('Ready to fire!');
}

function shipsReady () {
  const shipField = document.querySelectorAll('.field-ship');
  const ships = document.querySelectorAll('.ships');
  const prepareCounter = document.getElementById('prepare-counter');

  let shipsReady = 0;
  shipField.forEach((field) => {
    if (field.firstChild == null) shipsReady += 1;
  }) 
  prepareCounter.textContent = `${shipsReady}/5`;
  if (shipsReady > 4) {
    ships.forEach((ship) => {
      ship.setAttribute('draggable', 'false');
      ship.style.cursor = 'default';
    });
    statusMessage('Entering battle... ', '#f4f7f4');
    setTimeout(() => {
      startBattle();
    }, 2000);
  }
}

function playerController () {
  const playerContainer = document.querySelector('.player-container');
  let shipLength = 0;
  let verticalAxis = false;

  const addDragShip = (className, length) => {
    const ship = document.querySelector(className);
    const axis = document.getElementById('axis-y');
    ship.addEventListener('dragstart', (e) => {
      const parentElement = ship.parentNode;
      if (parentElement.className !== 'field-ship') cellColor(parentElement, 'white', length, true);

      verticalAxis = axis.checked;
      shipLength = length;
      e.dataTransfer.setData('id', e.target.id);
      e.target.classList.toggle('hide');
    })
    ship.addEventListener('dragend', (e) => {
      e.target.classList.toggle('hide');
    })
  }

  const cellColor = (cell, color, shipLength, erase = false) => {
    const cellX = cell.dataset.x;
    const cellY = cell.dataset.y;
    let cellColor = color;
  
    if (!erase) {
      if (verticalAxis) { 
        if (parseInt(cellX)+shipLength > 10) cellColor = '#f0cccc';
      } else {
        if (parseInt(cellY)+shipLength > 10) cellColor = '#f0cccc';
      }
    }
  
    let neighborId = '';
    for (let i = 0; i < shipLength; i++) {
      if (verticalAxis) neighborId = 'p'+(parseInt(cellX)+parseInt(i))+cellY 
      else neighborId = 'p'+cellX+(parseInt(cellY)+parseInt(i));
      const neighbor = document.getElementById(neighborId);
      if (neighbor !== null)
      neighbor.style.backgroundColor = cellColor;
    }
    cell.style.backgroundColor = cellColor;
  
  }
  
  playerContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    const cell = e.target;
    if (cell.className !== 'round-dot')
    cellColor(cell, '#f4f7f4', shipLength);
  })
  
  playerContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    const cell = e.target;
    const cellX = cell.dataset.x;
    const cellY = cell.dataset.y;

    const ship = document.getElementById(e.dataTransfer.getData('id'));
    if (verticalAxis) {
      if (parseInt(cellX)+shipLength > 10) {
        cellColor(cell, 'white', shipLength, true);
        return;
      };
      ship.style.transformOrigin = '10% 70%';
      ship.style.transform = 'rotate(90deg)';
    } else {
      if (parseInt(cellY)+shipLength > 10) {
        cellColor(cell, 'white', shipLength, true);
        return;
      };
      ship.style.transformOrigin = '';
      ship.style.transform = '';
    }
    cell.appendChild(ship); 
    shipsReady();
  })
  
  
  playerContainer.addEventListener('dragleave', (e) => {
    e.preventDefault();
    const cell = e.target;
    cellColor(cell, 'white', shipLength, true);
  
  })

  
  boardRender(playerContainer, 'player-board', 'p');
  addDragShip('.ship-carrier', 5);
  addDragShip('.ship-battleship', 4);
  addDragShip('.ship-destroyer', 3);
  addDragShip('.ship-submarine', 3);
  addDragShip('.ship-patrol', 2);

}

playerController();