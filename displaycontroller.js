const playerContainer = document.querySelector('.player-container');
const shipCarrier = document.querySelector('.ship-carrier');

for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    const boardSquare = document.createElement('div');
    boardSquare.className = 'player-board';
    boardSquare.id = 'p'+i+j;
    boardSquare.dataset.x = i;
    boardSquare.dataset.y = j;
    playerContainer.appendChild(boardSquare);
  }    
}

shipCarrier.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text', e.target.id);
})

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
  const shipLength = 5;
  cellColor(cell, '#eeeeee', shipLength);
})

playerContainer.addEventListener('drop', (e) => {
  e.preventDefault();
  const cell = e.target;
  const cellX = cell.dataset.x;
  const cellY = cell.dataset.y;
  const shipLength = 5;
  cellColor(cell, 'white', shipLength, true);
  if (parseInt(cellY)+shipLength > 10) return;
  
  const ship = document.getElementById(e.dataTransfer.getData('text'));
  cell.appendChild(ship); 
})


playerContainer.addEventListener('dragleave', (e) => {
  e.preventDefault();
  const cell = e.target;
  const shipLength = 5;
  cellColor(cell, 'white', shipLength, true);

})



