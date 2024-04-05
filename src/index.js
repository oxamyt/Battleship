import { gameLoop } from "./game";
import "./styles.css";
import githubLogo from "./assets/github-logo.svg";
import webIcon from "./assets/icon.png";

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("start")) {
    gameLoop();
  }
});
