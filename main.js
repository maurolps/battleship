const Ship = (length) => {
  let hits = 0;
  const hit = () => {
    hits += 1;
  }
  const isSunk = hits >= length;

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

  const receiveAttack = ( x, y) => {

  }

  return { board, receiveAttack }
}

const Player = () => {

}