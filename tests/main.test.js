import { Player } from "../main.js";
const player1 = Player("Player 1");
const player2 = Player("Player 2");

test("Player should attack another player and miss", () => {
  expect(player1.attack(player2, 0, 0)).toBe("miss");
});

test("Player cant attack same spot", () => {
  expect(player1.attack(player2, 0, 0)).toBe("Invalid target");
});

test("Player should receive a hit attack", () => {
  player2.placeShip(1, 0, 3, false, "ship1");
  expect(player1.attack(player2, 1, 0)).toBe("hit");
});

test("Ship should initialize correctly", () => {
  player1.placeShip(2, 0, 4, false, "ship1");
  const isSunk = player1.isShipSunk(2, 3);
  expect(isSunk).toBe(false);
});

test("Ship should sink after enough hits", () => {
  player1.placeShip(3, 0, 4, false, "ship1");
  player2.attack(player1, 3, 0);
  player2.attack(player1, 3, 1);
  player2.attack(player1, 3, 2);
  player2.attack(player1, 3, 3);
  const isSunk = player1.isShipSunk(3, 0);
  expect(isSunk).toBe(true);
});
