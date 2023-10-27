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



function playerController () {
  const playerContainer = document.querySelector('.player-container');
  let shipLength = 0;

  const addDragShip = (className, length) => {
    const ship = document.querySelector(className);
    ship.addEventListener('dragstart', (e) => {
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
      if (parseInt(cellY)+shipLength > 10) cellColor = 'red';
    }
  
    for (let i = 0; i < shipLength; i++) {
      const neighborId = 'p'+cellX+(parseInt(cellY)+parseInt(i));
      const neighbor = document.getElementById(neighborId);
      if (neighbor !== null)
      neighbor.style.backgroundColor = cellColor;
    }
    cell.style.backgroundColor = cellColor;
  
  }
  
  playerContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    const cell = e.target;
    cellColor(cell, '#eeeeee', shipLength);
  })
  
  playerContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    const cell = e.target;
    const cellX = cell.dataset.x;
    const cellY = cell.dataset.y;
    cellColor(cell, 'white', shipLength, true);
    if (parseInt(cellY)+shipLength > 10) return;
    
    const ship = document.getElementById(e.dataTransfer.getData('id'));
    cell.appendChild(ship); 
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