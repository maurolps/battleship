const playerContainer = document.querySelector('.player-container');

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

playerContainer.addEventListener('mouseout', (e) => {
  const cell = e.target;
  const shipLength = 5;
  for (let i = 0; i < shipLength; i++) {
    const neighborId = 'p'+cell.dataset.x+(parseInt(cell.dataset.y)+i);
    const neighbor = document.getElementById(neighborId);
    if (neighbor !== null)
    neighbor.style.backgroundColor = 'white';
  }

  cell.style.backgroundColor = 'white';

})

playerContainer.addEventListener('mouseover', (e) => {
  const cell = e.target;
  const cellX = cell.dataset.x;
  const cellY = cell.dataset.y;
  const shipLength = 5;
  let cellColor = 'gray';

  if (parseInt(cellY)+shipLength > 10) cellColor = 'red';

  for (let i = 0; i < shipLength; i++) {
    const neighborId = 'p'+cellX+(parseInt(cellY)+parseInt(i));
    const neighbor = document.getElementById(neighborId);
    if (neighbor !== null)
    neighbor.style.backgroundColor = cellColor;
  }
  cell.style.backgroundColor = cellColor;

})

