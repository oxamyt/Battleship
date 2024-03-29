import Gameboard from "./gameboard";
import Player from "./players";
import { renderPage } from "./render";

export default function gameLoop() {
  const playerOne = new Player("Daniel");
  const plyaerTwo = new Player("AI");
  const players = [playerOne, plyaerTwo];
  const boardOne = new Gameboard(false);
  const boardTwo = new Gameboard(true);
  const boards = [boardOne, boardTwo];
  boardOne.generateBoard();
  boardTwo.generateBoard();
  boardOne.placeShip([0, 0], 5, "vertical");
  boardOne.placeShip([6, 0], 4, "horizontal");
  boardOne.placeShip([3, 3], 3, "vertical");
  boardOne.placeShip([6, 7], 2, "horizontal");

  boardTwo.placeShip([0, 0], 5, "vertical");
  boardTwo.placeShip([2, 3], 4, "horizontal");
  boardTwo.placeShip([9, 3], 3, "vertical");
  boardTwo.placeShip([2, 7], 2, "horizontal");

  renderPage(boards);
}
