const Ship = (length) => {
  let hits = 0;
  const hit = () => {
    hits += 1;
    hits
  }
  const isSunk = () => hits >= length;

  return { hit, isSunk }
}

const Gameboard = () => {
  const board = [];

  for (let i = 0; i < 10; i++) {
    board[i] = [];
    for (let j = 0; j < 10; j++) {
      board[i][j] = 0;
    } 
  }

  const placeShip = ( x, y, length) => {
    const newShip = Ship(length);
    board[x][y] = newShip;
    board[x+1][y] = newShip;
    board[x+2][y] = newShip;
  }

  const receiveAttack = ( x, y) => {
    const target = board[x][y];
    if (typeof(target) == 'object') {
      target.hit();
      if (target.isSunk()) return 'destroyed!';
      return 'hit!';
    }
    return 'miss';
  }


  return { board, receiveAttack, placeShip }
}

const Player = () => {

}

const board = Gameboard();
board.placeShip (3, 3, 3);
board.receiveAttack(3, 3); // hit!
board.receiveAttack(3, 3); // hit!
board.receiveAttack(2, 3); // miss
board.receiveAttack(3, 3); // destroyed!





