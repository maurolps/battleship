const Ship = (length, id = "ship") => {
  let hits = 0;

  const hit = () => {
    hits += 1;
  };

  const getId = () => id;

  const isSunk = () => hits >= length;

  return { hit, isSunk, getId };
};

const Gameboard = () => {
  const board = [];

  for (let i = 0; i < 10; i++) {
    board[i] = [];
    for (let j = 0; j < 10; j++) {
      board[i][j] = 0;
    }
  }

  const validPlace = (x, y, length, vertical = false) => {
    if (vertical) {
      if (x + length > 10) {
        return false;
      }
    } else {
      if (y + length > 10) {
        return false;
      }
    }

    for (let i = 0; i < length; i++) {
      if (vertical) {
        if (board[x + i][y] !== 0) {
          return false;
        }
      } else {
        if (board[x][y + i] !== 0) {
          return false;
        }
      }
    }

    return true;
  };

  const placeShip = (x, y, length, vertical = false, id) => {
    if (!validPlace(x, y, length, vertical)) {
      return false;
    }

    const newShip = Ship(length, id);
    for (let i = 0; i < length; i++) {
      if (vertical) {
        board[x + i][y] = newShip;
      } else {
        board[x][y + i] = newShip;
      }
    }

    return true;
  };

  const placeShipRandom = (length, id) => {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    const vertical = Math.random() < 0.5;

    if (!validPlace(x, y, length, vertical)) {
      return placeShipRandom(length, id);
    }

    const newShip = Ship(length, id);
    for (let i = 0; i < length; i++) {
      if (vertical) {
        board[x + i][y] = newShip;
      } else {
        board[x][y + i] = newShip;
      }
    }

    return { x, y, vertical };
  };

  const receiveAttack = (x, y) => {
    const target = board[x][y];
    if (target === 1) return "Invalid target";
    if (typeof target == "object") {
      target.hit();
      if (target.isSunk()) return target;
      return "hit";
    } else {
      board[x][y] = 1;
      return "miss";
    }
  };

  const isShipSunk = (x, y) => {
    const ship = board[x][y];
    return ship.isSunk();
  };

  return { isShipSunk, receiveAttack, placeShip, placeShipRandom };
};

export const Player = (name) => {
  const playerName = name;
  const board = Gameboard();

  const attack = (player, x, y) => {
    return player.receiveAttack(x, y);
  };

  const receiveAttack = (x, y) => {
    return board.receiveAttack(x, y);
  };

  const placeShip = (x, y, length, vertical = false, id) => {
    return board.placeShip(x, y, length, vertical, id);
  };

  const placeShipRandom = (length, id) => {
    return board.placeShipRandom(length, id);
  };

  const isShipSunk = (x, y) => {
    return board.isShipSunk(x, y);
  };

  return {
    isShipSunk,
    attack,
    receiveAttack,
    placeShip,
    placeShipRandom,
    playerName,
  };
};
