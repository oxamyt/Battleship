import Gameboard from "./gameboard";
import Player from "./players";

export default function gameLoop() {
  const playerOne = new Player("Daniel");
  const plyaerTwo = new Player("AI");
  const boardOne = new Gameboard();
  const boardTwo = new Gameboard();
  boardOne.generateBoard();
  boardTwo.generateBoard();
  boardOne.placeShip([0, 0], 5, "vertical");
  boardOne.placeShip([6, 0], 4, "horizontal");
  boardOne.placeShip([3, 3], 3, "vertical");
  boardOne.placeShip([6, 7], 2, "horizontal");

  boardTwo.placeShip([0, 0], 5, "vertical");
  boardTwo.placeShip([6, 0], 4, "horizontal");
  boardTwo.placeShip([3, 3], 3, "vertical");
  boardTwo.placeShip([6, 7], 2, "horizontal");
}
