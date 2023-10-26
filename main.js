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
    if (target === 1) return 'Invalid target';
    if (typeof(target) == 'object') {
      target.hit();
      if (target.isSunk()) return 'destroyed!';
      return 'hit!';
    } else {
      board[x][y] = 1;
      return 'miss';
    }
  }


  return { board, receiveAttack, placeShip }
}

const Player = (name) => {
 const playerName = name;
 const board = Gameboard();

 const attack = (player, x, y) => {
  return player.receiveAttack( x, y);
 }

 const receiveAttack = (x, y) => {
  return board.receiveAttack(x, y);
 }

 const placeShip = ( x, y , length) => {
  board.placeShip (x, y, length);
 }

 placeShip( 3, 3, 3);

 return { attack, receiveAttack, playerName}
}

const player = Player('Player 1');
const computer = Player('Computer');


player.attack(computer, 3, 3); // hit!








