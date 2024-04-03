import { gameLoop } from "./game";
import "./styles.css";

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("start")) {
    gameLoop();
  }
});