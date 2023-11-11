import { Player } from "../main.js";

test('Player should attack another player and miss', () => {
  const player1 = Player('Player 1');
  const player2 = Player('Player 2');
  expect(player1.attack(player2, 0, 0)).toBe('miss');
})