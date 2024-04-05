import { gameLoop } from "./game";
import "./styles.css";
import webIcon from "./assets/icon.png";

document.addEventListener("DOMContentLoaded", () => {
  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";
  link.href = webIcon;
  document.head.appendChild(link);
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("start")) {
    gameLoop();
  }
});
