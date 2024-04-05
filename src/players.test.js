import Player from "./players";
import Gameboard from "./gameboard";

test("check for working ai", () => {
  const aiPlayer = new Player("AI");
  const boardOne = new Gameboard();
  boardOne.generateBoard();
  boardOne.placeShip([0, 0], 9, "horizontal");
  expect(aiPlayer.aiTurn(boardOne)).toBe(false);
});
