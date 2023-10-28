function boardRender(container, className, id) {

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const boardSquare = document.createElement('div');
      boardSquare.className = className;
      boardSquare.id = id+i+j;
      boardSquare.dataset.x = i;
      boardSquare.dataset.y = j;
      container.appendChild(boardSquare);
    }    
  }
}

function startBattle (statusContainer) {
  const shipsContainer = document.querySelector('.ships-container');
  const computerContainer = document.querySelector('.computer-container');
  const wrapper = document.querySelector('.wrapper');

  computerContainer.style.display = 'grid';
  shipsContainer.style.display = 'none';
  wrapper.style['flex-direction'] = 'row';
  wrapper.style.gap = '50px';

  boardRender(computerContainer, 'computer-board', 'c');
  statusContainer.innerHTML = 'Ready to fire!';
}

function shipsReady () {
  const shipField = document.querySelectorAll('.field-ship');
  const prepareCounter = document.getElementById('prepare-counter');
  const statusContainer = document.querySelector('.status-message');

  let shipsReady = 0;
  shipField.forEach((field) => {
    if (field.firstChild == null) shipsReady += 1;
  }) 
  prepareCounter.textContent = `${shipsReady}/5`;
  if (shipsReady > 4) {
    statusContainer.innerHTML = 'Entering battle...';
    statusContainer.style.backgroundColor = '#f4f7f4';
    setTimeout(() => {
      startBattle(statusContainer);
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