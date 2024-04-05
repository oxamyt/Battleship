/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkForStartingGame: () => (/* binding */ checkForStartingGame),
/* harmony export */   gameLoop: () => (/* binding */ gameLoop)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");
/* harmony import */ var _players__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./players */ "./src/players.js");
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./render */ "./src/render.js");




// Main game loop func
function gameLoop() {
  const playerOne = new _players__WEBPACK_IMPORTED_MODULE_1__["default"]("Daniel");
  const playerTwo = new _players__WEBPACK_IMPORTED_MODULE_1__["default"]("AI");
  const players = [playerOne, playerTwo];
  const boardOne = new _gameboard__WEBPACK_IMPORTED_MODULE_0__["default"](false);
  const boardTwo = new _gameboard__WEBPACK_IMPORTED_MODULE_0__["default"](true);
  const boards = [boardOne, boardTwo];
  boardOne.generateBoard();
  boardTwo.generateBoard();
  (0,_render__WEBPACK_IMPORTED_MODULE_2__.renderPage)(boards, players);
}

// Place computer ships and allow player to shoot
function startGame(boards, webBoards, players) {
  if (boards[1].start === false) {
    let i = 5;
    while (boards[1].shipsLength !== 0) {
      const x = Math.round(Math.random() * 9);
      const y = Math.round(Math.random() * 9);
      const direction = Math.round(Math.random()) === 1 ? "horizontal" : "vertical";
      if (boards[1].placeShip([x, y], i, direction) === true) {
        i--;
      }
    }
    boards[1].start = true;
  }
  const container = document.querySelector(".container");
  container.addEventListener("click", e => {
    if (e.target.classList.contains("cell") && !e.target.classList.contains("miss") && !e.target.classList.contains("hit")) {
      const cell = e.target;
      const x = e.target.getAttribute("data-x");
      const y = e.target.getAttribute("data-y");
      if (cell.closest(".right-board")) {
        const board = boards[1];
        const attackWon = board.receiveAttack([x, y], players);
        (0,_render__WEBPACK_IMPORTED_MODULE_2__.renderBoards)(boards, webBoards, players);
        if (attackWon === true) {
          (0,_render__WEBPACK_IMPORTED_MODULE_2__.removeContainerEvents)();
        } else {
          setTimeout(() => {
            players[1].aiTurn(boards[0]);
            (0,_render__WEBPACK_IMPORTED_MODULE_2__.renderBoards)(boards, webBoards, players);
          }, 100);
        }
      }
    }
  });
}

// Checking if player placed all ships before starting game
function checkForStartingGame(boards, webBoards, players) {
  if (boards[0].shipsLength === 0) {
    (0,_render__WEBPACK_IMPORTED_MODULE_2__.changeRotateBtn)();
    startGame(boards, webBoards, players);
  }
}

/***/ }),

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Gameboard)
/* harmony export */ });
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./render */ "./src/render.js");
/* harmony import */ var _ships__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ships */ "./src/ships.js");


class Gameboard {
  constructor(isEnemy) {
    this.board = [];
    this.hitsBoard = [];
    this.isEnemy = isEnemy;
    this.shipsLength = 5;
    this.start = false;
  }

  // Generating 10x10 gameboard
  generateBoard() {
    let r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
    let c = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
    this.board = Array(r).fill(0).map(() => Array(c).fill(0));
    this.hitsBoard = Array(r).fill(false).map(() => Array(c).fill(false));
  }

  // Placing ship in gameboard
  placeShip(start, length, direction) {
    const newShip = new _ships__WEBPACK_IMPORTED_MODULE_1__["default"](length);
    if (direction === "horizontal") {
      if (start[0] + length > this.board.length) {
        return false;
      }
      for (let i = 0; i < length; i++) {
        if (this.board[start[0] + i][start[1]] !== 0) return false;
      }
      for (let i = 0; i < length; i++) {
        this.board[start[0] + i][start[1]] = newShip;
      }
      this.shipsLength--;
      return true;
    }
    if (direction === "vertical") {
      if (start[1] + length > this.board.length) {
        return false;
      }
      for (let i = 0; i < length; i++) {
        if (this.board[start[0]][start[1] + i] !== 0) return false;
      }
      for (let i = 0; i < length; i++) {
        this.board[start[0]][start[1] + i] = newShip;
      }
      this.shipsLength--;
      return true;
    }
    return false;
  }

  // Checking if received attack hit ship
  receiveAttack(coordinates) {
    const cell = this.board[coordinates[0]][coordinates[1]];
    const cellHit = this.hitsBoard[coordinates[0]][coordinates[1]];
    if (cellHit === false) {
      if (cell !== 0) {
        cell.hit();
        this.hitsBoard[coordinates[0]][coordinates[1]] = true;
        cell.isSunk();
        if (this.checkingWin() === true) {
          const winner = this.isEnemy === true ? "Player" : "Computer";
          (0,_render__WEBPACK_IMPORTED_MODULE_0__.showWinner)(winner);
          return true;
        }
      }
      this.hitsBoard[coordinates[0]][coordinates[1]] = true;
    }
    return false;
  }

  // Checking conditions for win
  checkingWin() {
    const ships = [];
    const destroyedShips = [];
    this.board.forEach(elememt => elememt.forEach(elem => {
      if (elem !== 0) {
        ships.push(elem);
      }
    }));
    for (let i = 0; i < ships.length; i++) {
      if (ships[i].sunk === true) {
        destroyedShips.push(ships[i]);
      }
    }
    if (ships.length === destroyedShips.length) {
      return true;
    }
    return false;
  }
}

/***/ }),

/***/ "./src/players.js":
/*!************************!*\
  !*** ./src/players.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Player)
/* harmony export */ });
class Player {
  constructor(name) {
    this.name = name;
  }

  // Generating random cords for computer ships
  generateRandomCords() {
    const x = Math.round(Math.random() * 9);
    const y = Math.round(Math.random() * 9);
    return [x, y];
  }

  // Computer makes attack at random coordinates
  aiTurn(enemyBoard) {
    let cords;
    do {
      cords = this.generateRandomCords();
    } while (enemyBoard.hitsBoard[cords[0]][cords[1]] === true);
    const turn = enemyBoard.receiveAttack([cords[0], cords[1]]);
    return turn;
  }
}

/***/ }),

/***/ "./src/render.js":
/*!***********************!*\
  !*** ./src/render.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   changeRotateBtn: () => (/* binding */ changeRotateBtn),
/* harmony export */   removeContainerEvents: () => (/* binding */ removeContainerEvents),
/* harmony export */   renderBoards: () => (/* binding */ renderBoards),
/* harmony export */   renderPage: () => (/* binding */ renderPage),
/* harmony export */   showWinner: () => (/* binding */ showWinner)
/* harmony export */ });
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/game.js");
/* harmony import */ var _assets_github_logo_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assets/github-logo.svg */ "./src/assets/github-logo.svg");



// Rendering page with boards
function renderPage(boards, players) {
  const container = document.querySelector(".container");
  container.innerHTML = "";
  const main = document.createElement("div");
  main.classList.add("main");
  const rotateDiv = document.createElement("div");
  rotateDiv.classList.add("rotate-div");
  const rotateBtn = document.createElement("button");
  rotateBtn.classList.add("rotate-btn");
  rotateBtn.textContent = "Rotate Ship";
  const gameboards = document.createElement("div");
  gameboards.classList.add("gameboards");
  const leftBoard = document.createElement("div");
  leftBoard.classList.add("left-board");
  const rightBoard = document.createElement("div");
  rightBoard.classList.add("right-board");
  const footer = document.createElement("div");
  footer.classList.add("footer");
  const restartBtn = document.createElement("button");
  restartBtn.classList.add("restart-btn");
  restartBtn.textContent = "Restart game";
  const copyrightDiv = document.createElement("div");
  copyrightDiv.classList.add("copyright-div");
  const copyrightText = document.createElement("h2");
  copyrightText.innerHTML = `<a href ="https://github.com/oxamyt">2024 Oxamyt  <img class="svg-logo" src="${_assets_github_logo_svg__WEBPACK_IMPORTED_MODULE_1__}" alt="github-logo"> </a>`;
  container.appendChild(main);
  container.appendChild(footer);
  footer.appendChild(restartBtn);
  footer.appendChild(copyrightDiv);
  copyrightDiv.appendChild(copyrightText);
  main.appendChild(rotateDiv);
  rotateDiv.appendChild(rotateBtn);
  main.appendChild(gameboards);
  gameboards.appendChild(leftBoard);
  gameboards.appendChild(rightBoard);
  attachRotateEvent(rotateBtn, boards, [leftBoard, rightBoard], players);
  attachRestartEvent(restartBtn);
  renderBoards(boards, [leftBoard, rightBoard], players);
}

// Rendering boards based on gameboards
function renderBoards(boards, webBoards, players) {
  for (let i = 0; i < boards.length; i++) {
    let isVertical = webBoards[i].closest(".main").querySelector(".rotate-btn");
    if (isVertical !== null) {
      isVertical = isVertical.hasAttribute("vertical");
    }
    webBoards[i].innerHTML = "";
    for (let x = 0; x < boards[i].board.length; x++) {
      for (let y = 0; y < boards[i].board.length; y++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        if (boards[i].board[x][y] !== 0 && boards[i].isEnemy === false) cell.classList.add("ship");
        if (boards[i].hitsBoard[x][y] !== false && boards[i].board[x][y] !== 0) {
          cell.classList.add("hit");
        }
        if (boards[i].hitsBoard[x][y] !== false && boards[i].board[x][y] === 0) {
          cell.classList.add("miss");
        }
        cell.setAttribute("data-x", x);
        cell.setAttribute("data-y", y);
        if (boards[i].shipsLength !== 0) {
          if (webBoards[i].classList.contains("left-board")) {
            attachCellsHighlight(boards, webBoards, cell, isVertical);
            cell.addEventListener("click", e => {
              const clickedX = parseInt(e.target.getAttribute("data-x"));
              const clickedY = parseInt(e.target.getAttribute("data-y"));
              const direction = isVertical ? "vertical" : "horizontal";
              if (!cell.classList.contains("ship")) {
                boards[i].placeShip([clickedX, clickedY], boards[i].shipsLength, direction);
                removeHighlight(webBoards[i]);
                (0,_game__WEBPACK_IMPORTED_MODULE_0__.checkForStartingGame)(boards, webBoards, players);
                renderBoards(boards, webBoards, players);
              }
            });
          }
        }
        webBoards[i].appendChild(cell);
      }
    }
  }
}

// Highlighting cells when player is placing ships
function highlightCells(boardDOM, hoverX, hoverY, direction, shipLength) {
  for (let i = 0; i < shipLength; i++) {
    const x = direction === "vertical" ? hoverX + i : hoverX;
    const y = direction === "vertical" ? hoverY : hoverY + i;
    const cell = boardDOM.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
    if (cell === null) return;
    if (!cell.classList.contains("ship")) {
      cell.classList.add("highlight");
    } else if (cell.classList.contains("ship") === null) {
      return;
    }
  }
}

// Remove highlighting cells
function removeHighlight(boardDOM) {
  boardDOM.querySelectorAll(".highlight").forEach(cell => {
    cell.classList.remove("highlight");
  });
}

// Attaching rotate event to rotate btn to allow player change direction when placing ships
function attachRotateEvent(rotateBtn, boards, webBoards, players) {
  rotateBtn.addEventListener("click", () => {
    rotateBtn.toggleAttribute("vertical");
    renderBoards(boards, [webBoards[0], webBoards[1]], players);
  });
}

// Calculating cells which are highlighted
function attachCellsHighlight(boards, webBoards, cell, isVertical) {
  cell.addEventListener("mouseenter", e => {
    const hoverX = parseInt(e.target.getAttribute("data-x"));
    const hoverY = parseInt(e.target.getAttribute("data-y"));
    const direction = isVertical ? "horizontal" : "vertical";
    highlightCells(webBoards[0], hoverX, hoverY, direction, boards[0].shipsLength);
  });
  cell.addEventListener("mouseleave", () => {
    removeHighlight(webBoards[0]);
  });
}

// Attaching restart game event to restart btn
function attachRestartEvent(restartBtn) {
  restartBtn.addEventListener("click", () => {
    (0,_game__WEBPACK_IMPORTED_MODULE_0__.gameLoop)();
  });
}

// Changing rotate btn to indicate to the player that he can start shooting
function changeRotateBtn() {
  const rotateDiv = document.querySelector(".rotate-div");
  const rotateBtn = document.querySelector(".rotate-btn");
  rotateDiv.removeChild(rotateBtn);
  const startShooting = document.createElement("h1");
  startShooting.textContent = "Start Shooting";
  startShooting.classList.add("start-shooting");
  rotateDiv.appendChild(startShooting);
}

// Rendering winner on page
function showWinner(winner) {
  const startShooting = document.querySelector(".start-shooting");
  startShooting.textContent = `${winner} won`;
}

// Disabling all events after someone won
function removeContainerEvents() {
  const container = document.querySelector(".container");
  container.replaceWith(container.cloneNode(true));
  attachRestartEvent(document.querySelector(".restart-btn"));
}

/***/ }),

/***/ "./src/ships.js":
/*!**********************!*\
  !*** ./src/ships.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Ship)
/* harmony export */ });
class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }

  // Adding hit to the ship
  hit() {
    this.hits++;
  }

  // Checking if ship has sunk
  isSunk() {
    if (this.hits === this.length) {
      this.sunk = true;
    }
  }
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/normalize.css/normalize.css":
/*!****************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/normalize.css/normalize.css ***!
  \****************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */

/* Document
   ========================================================================== */

/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */

html {
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}

/* Sections
   ========================================================================== */

/**
 * Remove the margin in all browsers.
 */

body {
  margin: 0;
}

/**
 * Render the \`main\` element consistently in IE.
 */

main {
  display: block;
}

/**
 * Correct the font size and margin on \`h1\` elements within \`section\` and
 * \`article\` contexts in Chrome, Firefox, and Safari.
 */

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

/* Grouping content
   ========================================================================== */

/**
 * 1. Add the correct box sizing in Firefox.
 * 2. Show the overflow in Edge and IE.
 */

hr {
  box-sizing: content-box; /* 1 */
  height: 0; /* 1 */
  overflow: visible; /* 2 */
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd \`em\` font sizing in all browsers.
 */

pre {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/* Text-level semantics
   ========================================================================== */

/**
 * Remove the gray background on active links in IE 10.
 */

a {
  background-color: transparent;
}

/**
 * 1. Remove the bottom border in Chrome 57-
 * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
 */

abbr[title] {
  border-bottom: none; /* 1 */
  text-decoration: underline; /* 2 */
  text-decoration: underline dotted; /* 2 */
}

/**
 * Add the correct font weight in Chrome, Edge, and Safari.
 */

b,
strong {
  font-weight: bolder;
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd \`em\` font sizing in all browsers.
 */

code,
kbd,
samp {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/**
 * Add the correct font size in all browsers.
 */

small {
  font-size: 80%;
}

/**
 * Prevent \`sub\` and \`sup\` elements from affecting the line height in
 * all browsers.
 */

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/* Embedded content
   ========================================================================== */

/**
 * Remove the border on images inside links in IE 10.
 */

img {
  border-style: none;
}

/* Forms
   ========================================================================== */

/**
 * 1. Change the font styles in all browsers.
 * 2. Remove the margin in Firefox and Safari.
 */

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0; /* 2 */
}

/**
 * Show the overflow in IE.
 * 1. Show the overflow in Edge.
 */

button,
input { /* 1 */
  overflow: visible;
}

/**
 * Remove the inheritance of text transform in Edge, Firefox, and IE.
 * 1. Remove the inheritance of text transform in Firefox.
 */

button,
select { /* 1 */
  text-transform: none;
}

/**
 * Correct the inability to style clickable types in iOS and Safari.
 */

button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}

/**
 * Remove the inner border and padding in Firefox.
 */

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

/**
 * Restore the focus styles unset by the previous rule.
 */

button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}

/**
 * Correct the padding in Firefox.
 */

fieldset {
  padding: 0.35em 0.75em 0.625em;
}

/**
 * 1. Correct the text wrapping in Edge and IE.
 * 2. Correct the color inheritance from \`fieldset\` elements in IE.
 * 3. Remove the padding so developers are not caught out when they zero out
 *    \`fieldset\` elements in all browsers.
 */

legend {
  box-sizing: border-box; /* 1 */
  color: inherit; /* 2 */
  display: table; /* 1 */
  max-width: 100%; /* 1 */
  padding: 0; /* 3 */
  white-space: normal; /* 1 */
}

/**
 * Add the correct vertical alignment in Chrome, Firefox, and Opera.
 */

progress {
  vertical-align: baseline;
}

/**
 * Remove the default vertical scrollbar in IE 10+.
 */

textarea {
  overflow: auto;
}

/**
 * 1. Add the correct box sizing in IE 10.
 * 2. Remove the padding in IE 10.
 */

[type="checkbox"],
[type="radio"] {
  box-sizing: border-box; /* 1 */
  padding: 0; /* 2 */
}

/**
 * Correct the cursor style of increment and decrement buttons in Chrome.
 */

[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}

/**
 * 1. Correct the odd appearance in Chrome and Safari.
 * 2. Correct the outline style in Safari.
 */

[type="search"] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/**
 * Remove the inner padding in Chrome and Safari on macOS.
 */

[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}

/**
 * 1. Correct the inability to style clickable types in iOS and Safari.
 * 2. Change font properties to \`inherit\` in Safari.
 */

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/* Interactive
   ========================================================================== */

/*
 * Add the correct display in Edge, IE 10+, and Firefox.
 */

details {
  display: block;
}

/*
 * Add the correct display in all browsers.
 */

summary {
  display: list-item;
}

/* Misc
   ========================================================================== */

/**
 * Add the correct display in IE 10+.
 */

template {
  display: none;
}

/**
 * Add the correct display in IE 10.
 */

[hidden] {
  display: none;
}
`, "",{"version":3,"sources":["webpack://./node_modules/normalize.css/normalize.css"],"names":[],"mappings":"AAAA,2EAA2E;;AAE3E;+EAC+E;;AAE/E;;;EAGE;;AAEF;EACE,iBAAiB,EAAE,MAAM;EACzB,8BAA8B,EAAE,MAAM;AACxC;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,SAAS;AACX;;AAEA;;EAEE;;AAEF;EACE,cAAc;AAChB;;AAEA;;;EAGE;;AAEF;EACE,cAAc;EACd,gBAAgB;AAClB;;AAEA;+EAC+E;;AAE/E;;;EAGE;;AAEF;EACE,uBAAuB,EAAE,MAAM;EAC/B,SAAS,EAAE,MAAM;EACjB,iBAAiB,EAAE,MAAM;AAC3B;;AAEA;;;EAGE;;AAEF;EACE,iCAAiC,EAAE,MAAM;EACzC,cAAc,EAAE,MAAM;AACxB;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,6BAA6B;AAC/B;;AAEA;;;EAGE;;AAEF;EACE,mBAAmB,EAAE,MAAM;EAC3B,0BAA0B,EAAE,MAAM;EAClC,iCAAiC,EAAE,MAAM;AAC3C;;AAEA;;EAEE;;AAEF;;EAEE,mBAAmB;AACrB;;AAEA;;;EAGE;;AAEF;;;EAGE,iCAAiC,EAAE,MAAM;EACzC,cAAc,EAAE,MAAM;AACxB;;AAEA;;EAEE;;AAEF;EACE,cAAc;AAChB;;AAEA;;;EAGE;;AAEF;;EAEE,cAAc;EACd,cAAc;EACd,kBAAkB;EAClB,wBAAwB;AAC1B;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,WAAW;AACb;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,kBAAkB;AACpB;;AAEA;+EAC+E;;AAE/E;;;EAGE;;AAEF;;;;;EAKE,oBAAoB,EAAE,MAAM;EAC5B,eAAe,EAAE,MAAM;EACvB,iBAAiB,EAAE,MAAM;EACzB,SAAS,EAAE,MAAM;AACnB;;AAEA;;;EAGE;;AAEF;QACQ,MAAM;EACZ,iBAAiB;AACnB;;AAEA;;;EAGE;;AAEF;SACS,MAAM;EACb,oBAAoB;AACtB;;AAEA;;EAEE;;AAEF;;;;EAIE,0BAA0B;AAC5B;;AAEA;;EAEE;;AAEF;;;;EAIE,kBAAkB;EAClB,UAAU;AACZ;;AAEA;;EAEE;;AAEF;;;;EAIE,8BAA8B;AAChC;;AAEA;;EAEE;;AAEF;EACE,8BAA8B;AAChC;;AAEA;;;;;EAKE;;AAEF;EACE,sBAAsB,EAAE,MAAM;EAC9B,cAAc,EAAE,MAAM;EACtB,cAAc,EAAE,MAAM;EACtB,eAAe,EAAE,MAAM;EACvB,UAAU,EAAE,MAAM;EAClB,mBAAmB,EAAE,MAAM;AAC7B;;AAEA;;EAEE;;AAEF;EACE,wBAAwB;AAC1B;;AAEA;;EAEE;;AAEF;EACE,cAAc;AAChB;;AAEA;;;EAGE;;AAEF;;EAEE,sBAAsB,EAAE,MAAM;EAC9B,UAAU,EAAE,MAAM;AACpB;;AAEA;;EAEE;;AAEF;;EAEE,YAAY;AACd;;AAEA;;;EAGE;;AAEF;EACE,6BAA6B,EAAE,MAAM;EACrC,oBAAoB,EAAE,MAAM;AAC9B;;AAEA;;EAEE;;AAEF;EACE,wBAAwB;AAC1B;;AAEA;;;EAGE;;AAEF;EACE,0BAA0B,EAAE,MAAM;EAClC,aAAa,EAAE,MAAM;AACvB;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,cAAc;AAChB;;AAEA;;EAEE;;AAEF;EACE,kBAAkB;AACpB;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,aAAa;AACf;;AAEA;;EAEE;;AAEF;EACE,aAAa;AACf","sourcesContent":["/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Render the `main` element consistently in IE.\n */\n\nmain {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\na {\n  background-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\nimg {\n  border-style: none;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\ndetails {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\ntemplate {\n  display: none;\n}\n\n/**\n * Add the correct display in IE 10.\n */\n\n[hidden] {\n  display: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles.css":
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles.css ***!
  \**************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_normalize_css_normalize_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../node_modules/css-loader/dist/cjs.js!../node_modules/normalize.css/normalize.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/normalize.css/normalize.css");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3__);
// Imports




var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! fonts/Roboto-Bold.ttf */ "./src/fonts/Roboto-Bold.ttf"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! fonts/Roboto-Regular.ttf */ "./src/fonts/Roboto-Regular.ttf"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_node_modules_normalize_css_normalize_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3___default()(___CSS_LOADER_URL_IMPORT_1___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@font-face {
  font-family: "Roboto";
  src: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
  src: url(${___CSS_LOADER_URL_REPLACEMENT_1___});
}

:root {
  --main-border-color: #495057;
  --main-text-color: #333333;
}

body {
  min-height: 100vh;
  background: linear-gradient(to left, #f8f6e3, #ace2e1);
  font-family: "Roboto";
  color: var(--main-text-color);
}

.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 5rem;
  width: 100%;
}

.game-name {
  font-size: 4rem;
}

.name {
  border: 1px solid var(--main-border-color);
  background-color: #a2d2ff;
  width: 20rem;
  text-align: center;
  border-radius: 0.2rem;
}

.start-btn {
  padding-top: 3rem;
}

.start {
  text-decoration: none;
  border: 1px solid var(--main-border-color);
  border-radius: 10px;
  font-size: 2rem;
  cursor: pointer;
  background-color: transparent;
  background-repeat: no-repeat;
  cursor: pointer;
  overflow: hidden;
  outline: none;
}

.start:hover {
  background-color: #c0faff;
  padding-left: 3rem;
  padding-right: 3rem;
  transition: 0.6s;
}

.main {
  margin-top: 3rem;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rotate-btn {
  text-decoration: none;
  font-size: 3.5rem;
  cursor: pointer;
  background-color: transparent;
  background-repeat: no-repeat;
  overflow: hidden;
  outline: none;
  width: 25rem;
  height: 5rem;
  text-align: center;
  border-radius: 9px;
  margin: 0;
  padding: 0;
}

.rotate-btn:hover {
  background-color: #e0fcff;
  transition: 0.6s;
}

.gameboards {
  display: flex;
  justify-content: space-between;
  width: 65%;
  height: 100%;
  margin-top: 2rem;
}

.right-board,
.left-board {
  background-color: transparent;
  background-repeat: no-repeat;
  overflow: hidden;
  outline: none;
  width: 90%;
  aspect-ratio: 1;
  max-width: 600px;
  max-height: 600px;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
  gap: 0;
  margin: 1rem;
  margin-top: 2rem;
}

.cell {
  border: 1px solid var(--main-border-color);
  max-height: 100%;
  max-width: 100%;
  cursor: pointer;
  margin: 0;
  padding: 0;
}

.right-board .cell {
  cursor: crosshair;
}

.right-board .cell:not(.miss):not(.hit):hover {
  background-color: #e0fcff;
}

.ship {
  background-color: #a2d2ff;
}

.hit {
  background-color: #ff4d6d;
}

.miss {
  background-color: #d5bdaf;
}

.highlight {
  background-color: rgb(144, 207, 231);
  border: none;
}

.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  margin-top: auto;
}

.restart-btn {
  text-decoration: none;
  font-size: 2rem;
  cursor: pointer;
  background-color: transparent;
  background-repeat: no-repeat;
  cursor: pointer;
  overflow: hidden;
  outline: none;
  width: 15rem;
  text-align: center;
  border-radius: 9px;
  border-color: var(--main-border-color);
  margin-bottom: 2rem;
}

.restart-btn:hover {
  background-color: #edede9;
  transition: 0.6s;
}

.start-shooting {
  font-size: 3.5rem;
  width: 25rem;
  height: 5rem;
  text-align: center;
  letter-spacing: 0.1rem;
  margin: 0;
  padding: 0;
}

.copyright-div {
  margin-top: 3rem;
  display: flex;
  height: 5rem;
  width: 100%;
  background-color: #edede9;
  opacity: 0.8;
  justify-content: center;
  align-items: center;
}

a {
  text-decoration: none;
  color: var(--main-text-color);
  display: flex;
  align-items: center;
  gap: 5px;
}

.svg-logo {
  width: 2rem;
  text-align: center;
}
`, "",{"version":3,"sources":["webpack://./src/styles.css"],"names":[],"mappings":"AACA;EACE,qBAAqB;EACrB,4CAA+B;EAC/B,4CAAkC;AACpC;;AAEA;EACE,4BAA4B;EAC5B,0BAA0B;AAC5B;;AAEA;EACE,iBAAiB;EACjB,sDAAsD;EACtD,qBAAqB;EACrB,6BAA6B;AAC/B;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,iBAAiB;AACnB;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,uBAAuB;EACvB,sBAAsB;EACtB,iBAAiB;EACjB,WAAW;AACb;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,0CAA0C;EAC1C,yBAAyB;EACzB,YAAY;EACZ,kBAAkB;EAClB,qBAAqB;AACvB;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,qBAAqB;EACrB,0CAA0C;EAC1C,mBAAmB;EACnB,eAAe;EACf,eAAe;EACf,6BAA6B;EAC7B,4BAA4B;EAC5B,eAAe;EACf,gBAAgB;EAChB,aAAa;AACf;;AAEA;EACE,yBAAyB;EACzB,kBAAkB;EAClB,mBAAmB;EACnB,gBAAgB;AAClB;;AAEA;EACE,gBAAgB;EAChB,gBAAgB;EAChB,aAAa;EACb,sBAAsB;EACtB,mBAAmB;AACrB;;AAEA;EACE,qBAAqB;EACrB,iBAAiB;EACjB,eAAe;EACf,6BAA6B;EAC7B,4BAA4B;EAC5B,gBAAgB;EAChB,aAAa;EACb,YAAY;EACZ,YAAY;EACZ,kBAAkB;EAClB,kBAAkB;EAClB,SAAS;EACT,UAAU;AACZ;;AAEA;EACE,yBAAyB;EACzB,gBAAgB;AAClB;;AAEA;EACE,aAAa;EACb,8BAA8B;EAC9B,UAAU;EACV,YAAY;EACZ,gBAAgB;AAClB;;AAEA;;EAEE,6BAA6B;EAC7B,4BAA4B;EAC5B,gBAAgB;EAChB,aAAa;EACb,UAAU;EACV,eAAe;EACf,gBAAgB;EAChB,iBAAiB;EACjB,aAAa;EACb,sCAAsC;EACtC,mCAAmC;EACnC,MAAM;EACN,YAAY;EACZ,gBAAgB;AAClB;;AAEA;EACE,0CAA0C;EAC1C,gBAAgB;EAChB,eAAe;EACf,eAAe;EACf,SAAS;EACT,UAAU;AACZ;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,oCAAoC;EACpC,YAAY;AACd;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,gBAAgB;EAChB,gBAAgB;AAClB;;AAEA;EACE,qBAAqB;EACrB,eAAe;EACf,eAAe;EACf,6BAA6B;EAC7B,4BAA4B;EAC5B,eAAe;EACf,gBAAgB;EAChB,aAAa;EACb,YAAY;EACZ,kBAAkB;EAClB,kBAAkB;EAClB,sCAAsC;EACtC,mBAAmB;AACrB;;AAEA;EACE,yBAAyB;EACzB,gBAAgB;AAClB;;AAEA;EACE,iBAAiB;EACjB,YAAY;EACZ,YAAY;EACZ,kBAAkB;EAClB,sBAAsB;EACtB,SAAS;EACT,UAAU;AACZ;;AAEA;EACE,gBAAgB;EAChB,aAAa;EACb,YAAY;EACZ,WAAW;EACX,yBAAyB;EACzB,YAAY;EACZ,uBAAuB;EACvB,mBAAmB;AACrB;;AAEA;EACE,qBAAqB;EACrB,6BAA6B;EAC7B,aAAa;EACb,mBAAmB;EACnB,QAAQ;AACV;;AAEA;EACE,WAAW;EACX,kBAAkB;AACpB","sourcesContent":["@import \"normalize.css\";\n@font-face {\n  font-family: \"Roboto\";\n  src: url(fonts/Roboto-Bold.ttf);\n  src: url(fonts/Roboto-Regular.ttf);\n}\n\n:root {\n  --main-border-color: #495057;\n  --main-text-color: #333333;\n}\n\nbody {\n  min-height: 100vh;\n  background: linear-gradient(to left, #f8f6e3, #ace2e1);\n  font-family: \"Roboto\";\n  color: var(--main-text-color);\n}\n\n.container {\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n}\n\n.header {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  padding-top: 5rem;\n  width: 100%;\n}\n\n.game-name {\n  font-size: 4rem;\n}\n\n.name {\n  border: 1px solid var(--main-border-color);\n  background-color: #a2d2ff;\n  width: 20rem;\n  text-align: center;\n  border-radius: 0.2rem;\n}\n\n.start-btn {\n  padding-top: 3rem;\n}\n\n.start {\n  text-decoration: none;\n  border: 1px solid var(--main-border-color);\n  border-radius: 10px;\n  font-size: 2rem;\n  cursor: pointer;\n  background-color: transparent;\n  background-repeat: no-repeat;\n  cursor: pointer;\n  overflow: hidden;\n  outline: none;\n}\n\n.start:hover {\n  background-color: #c0faff;\n  padding-left: 3rem;\n  padding-right: 3rem;\n  transition: 0.6s;\n}\n\n.main {\n  margin-top: 3rem;\n  min-height: 50vh;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.rotate-btn {\n  text-decoration: none;\n  font-size: 3.5rem;\n  cursor: pointer;\n  background-color: transparent;\n  background-repeat: no-repeat;\n  overflow: hidden;\n  outline: none;\n  width: 25rem;\n  height: 5rem;\n  text-align: center;\n  border-radius: 9px;\n  margin: 0;\n  padding: 0;\n}\n\n.rotate-btn:hover {\n  background-color: #e0fcff;\n  transition: 0.6s;\n}\n\n.gameboards {\n  display: flex;\n  justify-content: space-between;\n  width: 65%;\n  height: 100%;\n  margin-top: 2rem;\n}\n\n.right-board,\n.left-board {\n  background-color: transparent;\n  background-repeat: no-repeat;\n  overflow: hidden;\n  outline: none;\n  width: 90%;\n  aspect-ratio: 1;\n  max-width: 600px;\n  max-height: 600px;\n  display: grid;\n  grid-template-columns: repeat(10, 1fr);\n  grid-template-rows: repeat(10, 1fr);\n  gap: 0;\n  margin: 1rem;\n  margin-top: 2rem;\n}\n\n.cell {\n  border: 1px solid var(--main-border-color);\n  max-height: 100%;\n  max-width: 100%;\n  cursor: pointer;\n  margin: 0;\n  padding: 0;\n}\n\n.right-board .cell {\n  cursor: crosshair;\n}\n\n.right-board .cell:not(.miss):not(.hit):hover {\n  background-color: #e0fcff;\n}\n\n.ship {\n  background-color: #a2d2ff;\n}\n\n.hit {\n  background-color: #ff4d6d;\n}\n\n.miss {\n  background-color: #d5bdaf;\n}\n\n.highlight {\n  background-color: rgb(144, 207, 231);\n  border: none;\n}\n\n.footer {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  min-height: 100%;\n  margin-top: auto;\n}\n\n.restart-btn {\n  text-decoration: none;\n  font-size: 2rem;\n  cursor: pointer;\n  background-color: transparent;\n  background-repeat: no-repeat;\n  cursor: pointer;\n  overflow: hidden;\n  outline: none;\n  width: 15rem;\n  text-align: center;\n  border-radius: 9px;\n  border-color: var(--main-border-color);\n  margin-bottom: 2rem;\n}\n\n.restart-btn:hover {\n  background-color: #edede9;\n  transition: 0.6s;\n}\n\n.start-shooting {\n  font-size: 3.5rem;\n  width: 25rem;\n  height: 5rem;\n  text-align: center;\n  letter-spacing: 0.1rem;\n  margin: 0;\n  padding: 0;\n}\n\n.copyright-div {\n  margin-top: 3rem;\n  display: flex;\n  height: 5rem;\n  width: 100%;\n  background-color: #edede9;\n  opacity: 0.8;\n  justify-content: center;\n  align-items: center;\n}\n\na {\n  text-decoration: none;\n  color: var(--main-text-color);\n  display: flex;\n  align-items: center;\n  gap: 5px;\n}\n\n.svg-logo {\n  width: 2rem;\n  text-align: center;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/styles.css":
/*!************************!*\
  !*** ./src/styles.css ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./styles.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/assets/github-logo.svg":
/*!************************************!*\
  !*** ./src/assets/github-logo.svg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "04be58c17b3d5e974442.svg";

/***/ }),

/***/ "./src/assets/icon.png":
/*!*****************************!*\
  !*** ./src/assets/icon.png ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "f088534212aea0a0a01d.png";

/***/ }),

/***/ "./src/fonts/Roboto-Bold.ttf":
/*!***********************************!*\
  !*** ./src/fonts/Roboto-Bold.ttf ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "f80816a5455d171f948d.ttf";

/***/ }),

/***/ "./src/fonts/Roboto-Regular.ttf":
/*!**************************************!*\
  !*** ./src/fonts/Roboto-Regular.ttf ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "fc2b5060f7accec5cf74.ttf";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/game.js");
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles.css */ "./src/styles.css");
/* harmony import */ var _assets_icon_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./assets/icon.png */ "./src/assets/icon.png");



document.addEventListener("DOMContentLoaded", () => {
  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";
  link.href = _assets_icon_png__WEBPACK_IMPORTED_MODULE_2__;
  document.head.appendChild(link);
});
document.addEventListener("click", e => {
  if (e.target.classList.contains("start")) {
    (0,_game__WEBPACK_IMPORTED_MODULE_0__.gameLoop)();
  }
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLGlGQUFpRixZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLFdBQVcsTUFBTSxLQUFLLFVBQVUsT0FBTyxLQUFLLFlBQVksYUFBYSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxXQUFXLFlBQVksV0FBVyxNQUFNLEtBQUssWUFBWSxhQUFhLGFBQWEsYUFBYSxP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ZWJwYWNrOi8vcHJvamVjdHN0YXJ0ZXJ0ZW1wbGF0ZS8uL3NyYy9nYW1lLmpzIiwid2VicGFjazovL3Byb2plY3RzdGFydGVydGVtcGxhdGUvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL3Byb2plY3RzdGFydGVydGVtcGxhdGUvLi9zcmMvcGxheWVycy5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0c3RhcnRlcnRlbXBsYXRlLy4vc3JjL3JlbmRlci5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0c3RhcnRlcnRlbXBsYXRlLy4vc3JjL3NoaXBzLmpzIiwid2VicGFjazovL3Byb2plY3RzdGFydGVydGVtcGxhdGUvLi9ub2RlX21vZHVsZXMvbm9ybWFsaXplLmNzcy9ub3JtYWxpemUuY3NzIiwid2VicGFjazovL3Byb2plY3RzdGFydGVydGVtcGxhdGUvLi9zcmMvc3R5bGVzLmNzcyIsIndlYnBhY2s6Ly9wcm9qZWN0c3RhcnRlcnRlbXBsYXRlLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0c3RhcnRlcnRlbXBsYXRlLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0c3RhcnRlcnRlbXBsYXRlLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdHN0YXJ0ZXJ0ZW1wbGF0ZS8uL3NyYy9zdHlsZXMuY3NzPzQ0YjIiLCJ3ZWJwYWNrOi8vcHJvamVjdHN0YXJ0ZXJ0ZW1wbGF0ZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0c3RhcnRlcnRlbXBsYXRlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0c3RhcnRlcnRlbXBsYXRlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL3Byb2plY3RzdGFydGVydGVtcGxhdGUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdHN0YXJ0ZXJ0ZW1wbGF0ZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3Byb2plY3RzdGFydGVydGVtcGxhdGUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0c3RhcnRlcnRlbXBsYXRlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3Byb2plY3RzdGFydGVydGVtcGxhdGUvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vcHJvamVjdHN0YXJ0ZXJ0ZW1wbGF0ZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcHJvamVjdHN0YXJ0ZXJ0ZW1wbGF0ZS93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL3Byb2plY3RzdGFydGVydGVtcGxhdGUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wcm9qZWN0c3RhcnRlcnRlbXBsYXRlL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcHJvamVjdHN0YXJ0ZXJ0ZW1wbGF0ZS93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9wcm9qZWN0c3RhcnRlcnRlbXBsYXRlL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL3Byb2plY3RzdGFydGVydGVtcGxhdGUvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL3Byb2plY3RzdGFydGVydGVtcGxhdGUvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEdhbWVib2FyZCBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vcGxheWVyc1wiO1xuaW1wb3J0IHtcbiAgY2hhbmdlUm90YXRlQnRuLFxuICByZW1vdmVDb250YWluZXJFdmVudHMsXG4gIHJlbmRlckJvYXJkcyxcbiAgcmVuZGVyUGFnZSxcbn0gZnJvbSBcIi4vcmVuZGVyXCI7XG5cbi8vIE1haW4gZ2FtZSBsb29wIGZ1bmNcbmV4cG9ydCBmdW5jdGlvbiBnYW1lTG9vcCgpIHtcbiAgY29uc3QgcGxheWVyT25lID0gbmV3IFBsYXllcihcIkRhbmllbFwiKTtcbiAgY29uc3QgcGxheWVyVHdvID0gbmV3IFBsYXllcihcIkFJXCIpO1xuICBjb25zdCBwbGF5ZXJzID0gW3BsYXllck9uZSwgcGxheWVyVHdvXTtcbiAgY29uc3QgYm9hcmRPbmUgPSBuZXcgR2FtZWJvYXJkKGZhbHNlKTtcbiAgY29uc3QgYm9hcmRUd28gPSBuZXcgR2FtZWJvYXJkKHRydWUpO1xuICBjb25zdCBib2FyZHMgPSBbYm9hcmRPbmUsIGJvYXJkVHdvXTtcbiAgYm9hcmRPbmUuZ2VuZXJhdGVCb2FyZCgpO1xuICBib2FyZFR3by5nZW5lcmF0ZUJvYXJkKCk7XG4gIHJlbmRlclBhZ2UoYm9hcmRzLCBwbGF5ZXJzKTtcbn1cblxuLy8gUGxhY2UgY29tcHV0ZXIgc2hpcHMgYW5kIGFsbG93IHBsYXllciB0byBzaG9vdFxuZnVuY3Rpb24gc3RhcnRHYW1lKGJvYXJkcywgd2ViQm9hcmRzLCBwbGF5ZXJzKSB7XG4gIGlmIChib2FyZHNbMV0uc3RhcnQgPT09IGZhbHNlKSB7XG4gICAgbGV0IGkgPSA1O1xuICAgIHdoaWxlIChib2FyZHNbMV0uc2hpcHNMZW5ndGggIT09IDApIHtcbiAgICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiA5KTtcbiAgICAgIGNvbnN0IHkgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiA5KTtcbiAgICAgIGNvbnN0IGRpcmVjdGlvbiA9XG4gICAgICAgIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSkgPT09IDEgPyBcImhvcml6b250YWxcIiA6IFwidmVydGljYWxcIjtcbiAgICAgIGlmIChib2FyZHNbMV0ucGxhY2VTaGlwKFt4LCB5XSwgaSwgZGlyZWN0aW9uKSA9PT0gdHJ1ZSkge1xuICAgICAgICBpLS07XG4gICAgICB9XG4gICAgfVxuICAgIGJvYXJkc1sxXS5zdGFydCA9IHRydWU7XG4gIH1cbiAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb250YWluZXJcIik7XG4gIGNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICBpZiAoXG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJjZWxsXCIpICYmXG4gICAgICAhZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwibWlzc1wiKSAmJlxuICAgICAgIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImhpdFwiKVxuICAgICkge1xuICAgICAgY29uc3QgY2VsbCA9IGUudGFyZ2V0O1xuICAgICAgY29uc3QgeCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEteFwiKTtcbiAgICAgIGNvbnN0IHkgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXlcIik7XG4gICAgICBpZiAoY2VsbC5jbG9zZXN0KFwiLnJpZ2h0LWJvYXJkXCIpKSB7XG4gICAgICAgIGNvbnN0IGJvYXJkID0gYm9hcmRzWzFdO1xuICAgICAgICBjb25zdCBhdHRhY2tXb24gPSBib2FyZC5yZWNlaXZlQXR0YWNrKFt4LCB5XSwgcGxheWVycyk7XG4gICAgICAgIHJlbmRlckJvYXJkcyhib2FyZHMsIHdlYkJvYXJkcywgcGxheWVycyk7XG4gICAgICAgIGlmIChhdHRhY2tXb24gPT09IHRydWUpIHtcbiAgICAgICAgICByZW1vdmVDb250YWluZXJFdmVudHMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHBsYXllcnNbMV0uYWlUdXJuKGJvYXJkc1swXSk7XG4gICAgICAgICAgICByZW5kZXJCb2FyZHMoYm9hcmRzLCB3ZWJCb2FyZHMsIHBsYXllcnMpO1xuICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG4vLyBDaGVja2luZyBpZiBwbGF5ZXIgcGxhY2VkIGFsbCBzaGlwcyBiZWZvcmUgc3RhcnRpbmcgZ2FtZVxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrRm9yU3RhcnRpbmdHYW1lKGJvYXJkcywgd2ViQm9hcmRzLCBwbGF5ZXJzKSB7XG4gIGlmIChib2FyZHNbMF0uc2hpcHNMZW5ndGggPT09IDApIHtcbiAgICBjaGFuZ2VSb3RhdGVCdG4oKTtcbiAgICBzdGFydEdhbWUoYm9hcmRzLCB3ZWJCb2FyZHMsIHBsYXllcnMpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBzaG93V2lubmVyIH0gZnJvbSBcIi4vcmVuZGVyXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lYm9hcmQge1xuICBjb25zdHJ1Y3Rvcihpc0VuZW15KSB7XG4gICAgdGhpcy5ib2FyZCA9IFtdO1xuICAgIHRoaXMuaGl0c0JvYXJkID0gW107XG4gICAgdGhpcy5pc0VuZW15ID0gaXNFbmVteTtcbiAgICB0aGlzLnNoaXBzTGVuZ3RoID0gNTtcbiAgICB0aGlzLnN0YXJ0ID0gZmFsc2U7XG4gIH1cblxuICAvLyBHZW5lcmF0aW5nIDEweDEwIGdhbWVib2FyZFxuICBnZW5lcmF0ZUJvYXJkKHIgPSAxMCwgYyA9IDEwKSB7XG4gICAgdGhpcy5ib2FyZCA9IEFycmF5KHIpXG4gICAgICAuZmlsbCgwKVxuICAgICAgLm1hcCgoKSA9PiBBcnJheShjKS5maWxsKDApKTtcbiAgICB0aGlzLmhpdHNCb2FyZCA9IEFycmF5KHIpXG4gICAgICAuZmlsbChmYWxzZSlcbiAgICAgIC5tYXAoKCkgPT4gQXJyYXkoYykuZmlsbChmYWxzZSkpO1xuICB9XG5cbiAgLy8gUGxhY2luZyBzaGlwIGluIGdhbWVib2FyZFxuICBwbGFjZVNoaXAoc3RhcnQsIGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gICAgY29uc3QgbmV3U2hpcCA9IG5ldyBTaGlwKGxlbmd0aCk7XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgaWYgKHN0YXJ0WzBdICsgbGVuZ3RoID4gdGhpcy5ib2FyZC5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtzdGFydFswXSArIGldW3N0YXJ0WzFdXSAhPT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmJvYXJkW3N0YXJ0WzBdICsgaV1bc3RhcnRbMV1dID0gbmV3U2hpcDtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2hpcHNMZW5ndGgtLTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChkaXJlY3Rpb24gPT09IFwidmVydGljYWxcIikge1xuICAgICAgaWYgKHN0YXJ0WzFdICsgbGVuZ3RoID4gdGhpcy5ib2FyZC5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtzdGFydFswXV1bc3RhcnRbMV0gKyBpXSAhPT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmJvYXJkW3N0YXJ0WzBdXVtzdGFydFsxXSArIGldID0gbmV3U2hpcDtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2hpcHNMZW5ndGgtLTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBDaGVja2luZyBpZiByZWNlaXZlZCBhdHRhY2sgaGl0IHNoaXBcbiAgcmVjZWl2ZUF0dGFjayhjb29yZGluYXRlcykge1xuICAgIGNvbnN0IGNlbGwgPSB0aGlzLmJvYXJkW2Nvb3JkaW5hdGVzWzBdXVtjb29yZGluYXRlc1sxXV07XG4gICAgY29uc3QgY2VsbEhpdCA9IHRoaXMuaGl0c0JvYXJkW2Nvb3JkaW5hdGVzWzBdXVtjb29yZGluYXRlc1sxXV07XG4gICAgaWYgKGNlbGxIaXQgPT09IGZhbHNlKSB7XG4gICAgICBpZiAoY2VsbCAhPT0gMCkge1xuICAgICAgICBjZWxsLmhpdCgpO1xuICAgICAgICB0aGlzLmhpdHNCb2FyZFtjb29yZGluYXRlc1swXV1bY29vcmRpbmF0ZXNbMV1dID0gdHJ1ZTtcbiAgICAgICAgY2VsbC5pc1N1bmsoKTtcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tpbmdXaW4oKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGNvbnN0IHdpbm5lciA9IHRoaXMuaXNFbmVteSA9PT0gdHJ1ZSA/IFwiUGxheWVyXCIgOiBcIkNvbXB1dGVyXCI7XG4gICAgICAgICAgc2hvd1dpbm5lcih3aW5uZXIpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmhpdHNCb2FyZFtjb29yZGluYXRlc1swXV1bY29vcmRpbmF0ZXNbMV1dID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gQ2hlY2tpbmcgY29uZGl0aW9ucyBmb3Igd2luXG4gIGNoZWNraW5nV2luKCkge1xuICAgIGNvbnN0IHNoaXBzID0gW107XG4gICAgY29uc3QgZGVzdHJveWVkU2hpcHMgPSBbXTtcbiAgICB0aGlzLmJvYXJkLmZvckVhY2goKGVsZW1lbXQpID0+XG4gICAgICBlbGVtZW10LmZvckVhY2goKGVsZW0pID0+IHtcbiAgICAgICAgaWYgKGVsZW0gIT09IDApIHtcbiAgICAgICAgICBzaGlwcy5wdXNoKGVsZW0pO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzaGlwc1tpXS5zdW5rID09PSB0cnVlKSB7XG4gICAgICAgIGRlc3Ryb3llZFNoaXBzLnB1c2goc2hpcHNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2hpcHMubGVuZ3RoID09PSBkZXN0cm95ZWRTaGlwcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gIH1cblxuICAvLyBHZW5lcmF0aW5nIHJhbmRvbSBjb3JkcyBmb3IgY29tcHV0ZXIgc2hpcHNcbiAgZ2VuZXJhdGVSYW5kb21Db3JkcygpIHtcbiAgICBjb25zdCB4ID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogOSk7XG4gICAgY29uc3QgeSA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDkpO1xuICAgIHJldHVybiBbeCwgeV07XG4gIH1cblxuICAvLyBDb21wdXRlciBtYWtlcyBhdHRhY2sgYXQgcmFuZG9tIGNvb3JkaW5hdGVzXG4gIGFpVHVybihlbmVteUJvYXJkKSB7XG4gICAgbGV0IGNvcmRzO1xuICAgIGRvIHtcbiAgICAgIGNvcmRzID0gdGhpcy5nZW5lcmF0ZVJhbmRvbUNvcmRzKCk7XG4gICAgfSB3aGlsZSAoZW5lbXlCb2FyZC5oaXRzQm9hcmRbY29yZHNbMF1dW2NvcmRzWzFdXSA9PT0gdHJ1ZSk7XG4gICAgY29uc3QgdHVybiA9IGVuZW15Qm9hcmQucmVjZWl2ZUF0dGFjayhbY29yZHNbMF0sIGNvcmRzWzFdXSk7XG4gICAgcmV0dXJuIHR1cm47XG4gIH1cbn1cbiIsImltcG9ydCB7IGNoZWNrRm9yU3RhcnRpbmdHYW1lLCBnYW1lTG9vcCB9IGZyb20gXCIuL2dhbWVcIjtcbmltcG9ydCBnaXRodWJMb2dvIGZyb20gXCIuL2Fzc2V0cy9naXRodWItbG9nby5zdmdcIjtcblxuLy8gUmVuZGVyaW5nIHBhZ2Ugd2l0aCBib2FyZHNcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJQYWdlKGJvYXJkcywgcGxheWVycykge1xuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnRhaW5lclwiKTtcbiAgY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgY29uc3QgbWFpbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIG1haW4uY2xhc3NMaXN0LmFkZChcIm1haW5cIik7XG5cbiAgY29uc3Qgcm90YXRlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgcm90YXRlRGl2LmNsYXNzTGlzdC5hZGQoXCJyb3RhdGUtZGl2XCIpO1xuXG4gIGNvbnN0IHJvdGF0ZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gIHJvdGF0ZUJ0bi5jbGFzc0xpc3QuYWRkKFwicm90YXRlLWJ0blwiKTtcbiAgcm90YXRlQnRuLnRleHRDb250ZW50ID0gXCJSb3RhdGUgU2hpcFwiO1xuXG4gIGNvbnN0IGdhbWVib2FyZHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBnYW1lYm9hcmRzLmNsYXNzTGlzdC5hZGQoXCJnYW1lYm9hcmRzXCIpO1xuXG4gIGNvbnN0IGxlZnRCb2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGxlZnRCb2FyZC5jbGFzc0xpc3QuYWRkKFwibGVmdC1ib2FyZFwiKTtcblxuICBjb25zdCByaWdodEJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgcmlnaHRCb2FyZC5jbGFzc0xpc3QuYWRkKFwicmlnaHQtYm9hcmRcIik7XG5cbiAgY29uc3QgZm9vdGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgZm9vdGVyLmNsYXNzTGlzdC5hZGQoXCJmb290ZXJcIik7XG5cbiAgY29uc3QgcmVzdGFydEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gIHJlc3RhcnRCdG4uY2xhc3NMaXN0LmFkZChcInJlc3RhcnQtYnRuXCIpO1xuICByZXN0YXJ0QnRuLnRleHRDb250ZW50ID0gXCJSZXN0YXJ0IGdhbWVcIjtcblxuICBjb25zdCBjb3B5cmlnaHREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBjb3B5cmlnaHREaXYuY2xhc3NMaXN0LmFkZChcImNvcHlyaWdodC1kaXZcIik7XG5cbiAgY29uc3QgY29weXJpZ2h0VGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMlwiKTtcblxuICBjb3B5cmlnaHRUZXh0LmlubmVySFRNTCA9IGA8YSBocmVmID1cImh0dHBzOi8vZ2l0aHViLmNvbS9veGFteXRcIj4yMDI0IE94YW15dCAgPGltZyBjbGFzcz1cInN2Zy1sb2dvXCIgc3JjPVwiJHtnaXRodWJMb2dvfVwiIGFsdD1cImdpdGh1Yi1sb2dvXCI+IDwvYT5gO1xuXG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChtYWluKTtcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGZvb3Rlcik7XG4gIGZvb3Rlci5hcHBlbmRDaGlsZChyZXN0YXJ0QnRuKTtcbiAgZm9vdGVyLmFwcGVuZENoaWxkKGNvcHlyaWdodERpdik7XG4gIGNvcHlyaWdodERpdi5hcHBlbmRDaGlsZChjb3B5cmlnaHRUZXh0KTtcbiAgbWFpbi5hcHBlbmRDaGlsZChyb3RhdGVEaXYpO1xuICByb3RhdGVEaXYuYXBwZW5kQ2hpbGQocm90YXRlQnRuKTtcbiAgbWFpbi5hcHBlbmRDaGlsZChnYW1lYm9hcmRzKTtcbiAgZ2FtZWJvYXJkcy5hcHBlbmRDaGlsZChsZWZ0Qm9hcmQpO1xuICBnYW1lYm9hcmRzLmFwcGVuZENoaWxkKHJpZ2h0Qm9hcmQpO1xuXG4gIGF0dGFjaFJvdGF0ZUV2ZW50KHJvdGF0ZUJ0biwgYm9hcmRzLCBbbGVmdEJvYXJkLCByaWdodEJvYXJkXSwgcGxheWVycyk7XG4gIGF0dGFjaFJlc3RhcnRFdmVudChyZXN0YXJ0QnRuKTtcblxuICByZW5kZXJCb2FyZHMoYm9hcmRzLCBbbGVmdEJvYXJkLCByaWdodEJvYXJkXSwgcGxheWVycyk7XG59XG5cbi8vIFJlbmRlcmluZyBib2FyZHMgYmFzZWQgb24gZ2FtZWJvYXJkc1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckJvYXJkcyhib2FyZHMsIHdlYkJvYXJkcywgcGxheWVycykge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBpc1ZlcnRpY2FsID0gd2ViQm9hcmRzW2ldLmNsb3Nlc3QoXCIubWFpblwiKS5xdWVyeVNlbGVjdG9yKFwiLnJvdGF0ZS1idG5cIik7XG4gICAgaWYgKGlzVmVydGljYWwgIT09IG51bGwpIHtcbiAgICAgIGlzVmVydGljYWwgPSBpc1ZlcnRpY2FsLmhhc0F0dHJpYnV0ZShcInZlcnRpY2FsXCIpO1xuICAgIH1cblxuICAgIHdlYkJvYXJkc1tpXS5pbm5lckhUTUwgPSBcIlwiO1xuICAgIGZvciAobGV0IHggPSAwOyB4IDwgYm9hcmRzW2ldLmJvYXJkLmxlbmd0aDsgeCsrKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGJvYXJkc1tpXS5ib2FyZC5sZW5ndGg7IHkrKykge1xuICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKTtcblxuICAgICAgICBpZiAoYm9hcmRzW2ldLmJvYXJkW3hdW3ldICE9PSAwICYmIGJvYXJkc1tpXS5pc0VuZW15ID09PSBmYWxzZSlcbiAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgYm9hcmRzW2ldLmhpdHNCb2FyZFt4XVt5XSAhPT0gZmFsc2UgJiZcbiAgICAgICAgICBib2FyZHNbaV0uYm9hcmRbeF1beV0gIT09IDBcbiAgICAgICAgKSB7XG4gICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICBib2FyZHNbaV0uaGl0c0JvYXJkW3hdW3ldICE9PSBmYWxzZSAmJlxuICAgICAgICAgIGJvYXJkc1tpXS5ib2FyZFt4XVt5XSA9PT0gMFxuICAgICAgICApIHtcbiAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXhcIiwgeCk7XG4gICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKFwiZGF0YS15XCIsIHkpO1xuXG4gICAgICAgIGlmIChib2FyZHNbaV0uc2hpcHNMZW5ndGggIT09IDApIHtcbiAgICAgICAgICBpZiAod2ViQm9hcmRzW2ldLmNsYXNzTGlzdC5jb250YWlucyhcImxlZnQtYm9hcmRcIikpIHtcbiAgICAgICAgICAgIGF0dGFjaENlbGxzSGlnaGxpZ2h0KGJvYXJkcywgd2ViQm9hcmRzLCBjZWxsLCBpc1ZlcnRpY2FsKTtcblxuICAgICAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgY2xpY2tlZFggPSBwYXJzZUludChlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXhcIikpO1xuICAgICAgICAgICAgICBjb25zdCBjbGlja2VkWSA9IHBhcnNlSW50KGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEteVwiKSk7XG4gICAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IGlzVmVydGljYWwgPyBcInZlcnRpY2FsXCIgOiBcImhvcml6b250YWxcIjtcblxuICAgICAgICAgICAgICBpZiAoIWNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2hpcFwiKSkge1xuICAgICAgICAgICAgICAgIGJvYXJkc1tpXS5wbGFjZVNoaXAoXG4gICAgICAgICAgICAgICAgICBbY2xpY2tlZFgsIGNsaWNrZWRZXSxcbiAgICAgICAgICAgICAgICAgIGJvYXJkc1tpXS5zaGlwc0xlbmd0aCxcbiAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgcmVtb3ZlSGlnaGxpZ2h0KHdlYkJvYXJkc1tpXSk7XG4gICAgICAgICAgICAgICAgY2hlY2tGb3JTdGFydGluZ0dhbWUoYm9hcmRzLCB3ZWJCb2FyZHMsIHBsYXllcnMpO1xuICAgICAgICAgICAgICAgIHJlbmRlckJvYXJkcyhib2FyZHMsIHdlYkJvYXJkcywgcGxheWVycyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB3ZWJCb2FyZHNbaV0uYXBwZW5kQ2hpbGQoY2VsbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8vIEhpZ2hsaWdodGluZyBjZWxscyB3aGVuIHBsYXllciBpcyBwbGFjaW5nIHNoaXBzXG5mdW5jdGlvbiBoaWdobGlnaHRDZWxscyhib2FyZERPTSwgaG92ZXJYLCBob3ZlclksIGRpcmVjdGlvbiwgc2hpcExlbmd0aCkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHggPSBkaXJlY3Rpb24gPT09IFwidmVydGljYWxcIiA/IGhvdmVyWCArIGkgOiBob3Zlclg7XG4gICAgY29uc3QgeSA9IGRpcmVjdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiID8gaG92ZXJZIDogaG92ZXJZICsgaTtcbiAgICBjb25zdCBjZWxsID0gYm9hcmRET00ucXVlcnlTZWxlY3RvcihgLmNlbGxbZGF0YS14PVwiJHt4fVwiXVtkYXRhLXk9XCIke3l9XCJdYCk7XG4gICAgaWYgKGNlbGwgPT09IG51bGwpIHJldHVybjtcbiAgICBpZiAoIWNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2hpcFwiKSkge1xuICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiaGlnaGxpZ2h0XCIpO1xuICAgIH0gZWxzZSBpZiAoY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoXCJzaGlwXCIpID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59XG5cbi8vIFJlbW92ZSBoaWdobGlnaHRpbmcgY2VsbHNcbmZ1bmN0aW9uIHJlbW92ZUhpZ2hsaWdodChib2FyZERPTSkge1xuICBib2FyZERPTS5xdWVyeVNlbGVjdG9yQWxsKFwiLmhpZ2hsaWdodFwiKS5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlnaGxpZ2h0XCIpO1xuICB9KTtcbn1cblxuLy8gQXR0YWNoaW5nIHJvdGF0ZSBldmVudCB0byByb3RhdGUgYnRuIHRvIGFsbG93IHBsYXllciBjaGFuZ2UgZGlyZWN0aW9uIHdoZW4gcGxhY2luZyBzaGlwc1xuZnVuY3Rpb24gYXR0YWNoUm90YXRlRXZlbnQocm90YXRlQnRuLCBib2FyZHMsIHdlYkJvYXJkcywgcGxheWVycykge1xuICByb3RhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICByb3RhdGVCdG4udG9nZ2xlQXR0cmlidXRlKFwidmVydGljYWxcIik7XG4gICAgcmVuZGVyQm9hcmRzKGJvYXJkcywgW3dlYkJvYXJkc1swXSwgd2ViQm9hcmRzWzFdXSwgcGxheWVycyk7XG4gIH0pO1xufVxuXG4vLyBDYWxjdWxhdGluZyBjZWxscyB3aGljaCBhcmUgaGlnaGxpZ2h0ZWRcbmZ1bmN0aW9uIGF0dGFjaENlbGxzSGlnaGxpZ2h0KGJvYXJkcywgd2ViQm9hcmRzLCBjZWxsLCBpc1ZlcnRpY2FsKSB7XG4gIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgKGUpID0+IHtcbiAgICBjb25zdCBob3ZlclggPSBwYXJzZUludChlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXhcIikpO1xuICAgIGNvbnN0IGhvdmVyWSA9IHBhcnNlSW50KGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEteVwiKSk7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gaXNWZXJ0aWNhbCA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xuICAgIGhpZ2hsaWdodENlbGxzKFxuICAgICAgd2ViQm9hcmRzWzBdLFxuICAgICAgaG92ZXJYLFxuICAgICAgaG92ZXJZLFxuICAgICAgZGlyZWN0aW9uLFxuICAgICAgYm9hcmRzWzBdLnNoaXBzTGVuZ3RoLFxuICAgICk7XG4gIH0pO1xuXG4gIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKCkgPT4ge1xuICAgIHJlbW92ZUhpZ2hsaWdodCh3ZWJCb2FyZHNbMF0pO1xuICB9KTtcbn1cblxuLy8gQXR0YWNoaW5nIHJlc3RhcnQgZ2FtZSBldmVudCB0byByZXN0YXJ0IGJ0blxuZnVuY3Rpb24gYXR0YWNoUmVzdGFydEV2ZW50KHJlc3RhcnRCdG4pIHtcbiAgcmVzdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGdhbWVMb29wKCk7XG4gIH0pO1xufVxuXG4vLyBDaGFuZ2luZyByb3RhdGUgYnRuIHRvIGluZGljYXRlIHRvIHRoZSBwbGF5ZXIgdGhhdCBoZSBjYW4gc3RhcnQgc2hvb3RpbmdcbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VSb3RhdGVCdG4oKSB7XG4gIGNvbnN0IHJvdGF0ZURpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucm90YXRlLWRpdlwiKTtcbiAgY29uc3Qgcm90YXRlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yb3RhdGUtYnRuXCIpO1xuICByb3RhdGVEaXYucmVtb3ZlQ2hpbGQocm90YXRlQnRuKTtcbiAgY29uc3Qgc3RhcnRTaG9vdGluZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMVwiKTtcbiAgc3RhcnRTaG9vdGluZy50ZXh0Q29udGVudCA9IFwiU3RhcnQgU2hvb3RpbmdcIjtcbiAgc3RhcnRTaG9vdGluZy5jbGFzc0xpc3QuYWRkKFwic3RhcnQtc2hvb3RpbmdcIik7XG4gIHJvdGF0ZURpdi5hcHBlbmRDaGlsZChzdGFydFNob290aW5nKTtcbn1cblxuLy8gUmVuZGVyaW5nIHdpbm5lciBvbiBwYWdlXG5leHBvcnQgZnVuY3Rpb24gc2hvd1dpbm5lcih3aW5uZXIpIHtcbiAgY29uc3Qgc3RhcnRTaG9vdGluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3RhcnQtc2hvb3RpbmdcIik7XG4gIHN0YXJ0U2hvb3RpbmcudGV4dENvbnRlbnQgPSBgJHt3aW5uZXJ9IHdvbmA7XG59XG5cbi8vIERpc2FibGluZyBhbGwgZXZlbnRzIGFmdGVyIHNvbWVvbmUgd29uXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlQ29udGFpbmVyRXZlbnRzKCkge1xuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnRhaW5lclwiKTtcbiAgY29udGFpbmVyLnJlcGxhY2VXaXRoKGNvbnRhaW5lci5jbG9uZU5vZGUodHJ1ZSkpO1xuICBhdHRhY2hSZXN0YXJ0RXZlbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yZXN0YXJ0LWJ0blwiKSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTaGlwIHtcbiAgY29uc3RydWN0b3IobGVuZ3RoKSB7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgdGhpcy5oaXRzID0gMDtcbiAgICB0aGlzLnN1bmsgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIEFkZGluZyBoaXQgdG8gdGhlIHNoaXBcbiAgaGl0KCkge1xuICAgIHRoaXMuaGl0cysrO1xuICB9XG5cbiAgLy8gQ2hlY2tpbmcgaWYgc2hpcCBoYXMgc3Vua1xuICBpc1N1bmsoKSB7XG4gICAgaWYgKHRoaXMuaGl0cyA9PT0gdGhpcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc3VuayA9IHRydWU7XG4gICAgfVxuICB9XG59XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cblxuLyogRG9jdW1lbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXG4gKi9cblxuaHRtbCB7XG4gIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXG4gIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xufVxuXG4vKiBTZWN0aW9uc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuYm9keSB7XG4gIG1hcmdpbjogMDtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIFxcYG1haW5cXGAgZWxlbWVudCBjb25zaXN0ZW50bHkgaW4gSUUuXG4gKi9cblxubWFpbiB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGZvbnQgc2l6ZSBhbmQgbWFyZ2luIG9uIFxcYGgxXFxgIGVsZW1lbnRzIHdpdGhpbiBcXGBzZWN0aW9uXFxgIGFuZFxuICogXFxgYXJ0aWNsZVxcYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXG4gKi9cblxuaDEge1xuICBmb250LXNpemU6IDJlbTtcbiAgbWFyZ2luOiAwLjY3ZW0gMDtcbn1cblxuLyogR3JvdXBpbmcgY29udGVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBGaXJlZm94LlxuICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXG4gKi9cblxuaHIge1xuICBib3gtc2l6aW5nOiBjb250ZW50LWJveDsgLyogMSAqL1xuICBoZWlnaHQ6IDA7IC8qIDEgKi9cbiAgb3ZlcmZsb3c6IHZpc2libGU7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gQ29ycmVjdCB0aGUgb2RkIFxcYGVtXFxgIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5wcmUge1xuICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cbiAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cbn1cblxuLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxuICovXG5cbmEge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbn1cblxuLyoqXG4gKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxuICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cbiAqL1xuXG5hYmJyW3RpdGxlXSB7XG4gIGJvcmRlci1ib3R0b206IG5vbmU7IC8qIDEgKi9cbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkOyAvKiAyICovXG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cbiAqL1xuXG5iLFxuc3Ryb25nIHtcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gQ29ycmVjdCB0aGUgb2RkIFxcYGVtXFxgIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5jb2RlLFxua2JkLFxuc2FtcCB7XG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xuICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbnNtYWxsIHtcbiAgZm9udC1zaXplOiA4MCU7XG59XG5cbi8qKlxuICogUHJldmVudCBcXGBzdWJcXGAgYW5kIFxcYHN1cFxcYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cbiAqIGFsbCBicm93c2Vycy5cbiAqL1xuXG5zdWIsXG5zdXAge1xuICBmb250LXNpemU6IDc1JTtcbiAgbGluZS1oZWlnaHQ6IDA7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuXG5zdWIge1xuICBib3R0b206IC0wLjI1ZW07XG59XG5cbnN1cCB7XG4gIHRvcDogLTAuNWVtO1xufVxuXG4vKiBFbWJlZGRlZCBjb250ZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXG4gKi9cblxuaW1nIHtcbiAgYm9yZGVyLXN0eWxlOiBub25lO1xufVxuXG4vKiBGb3Jtc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cbiAqL1xuXG5idXR0b24sXG5pbnB1dCxcbm9wdGdyb3VwLFxuc2VsZWN0LFxudGV4dGFyZWEge1xuICBmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xuICBmb250LXNpemU6IDEwMCU7IC8qIDEgKi9cbiAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cbiAgbWFyZ2luOiAwOyAvKiAyICovXG59XG5cbi8qKlxuICogU2hvdyB0aGUgb3ZlcmZsb3cgaW4gSUUuXG4gKiAxLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlLlxuICovXG5cbmJ1dHRvbixcbmlucHV0IHsgLyogMSAqL1xuICBvdmVyZmxvdzogdmlzaWJsZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UsIEZpcmVmb3gsIGFuZCBJRS5cbiAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cbiAqL1xuXG5idXR0b24sXG5zZWxlY3QgeyAvKiAxICovXG4gIHRleHQtdHJhbnNmb3JtOiBub25lO1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4gKi9cblxuYnV0dG9uLFxuW3R5cGU9XCJidXR0b25cIl0sXG5bdHlwZT1cInJlc2V0XCJdLFxuW3R5cGU9XCJzdWJtaXRcIl0ge1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxuICovXG5cbmJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwiYnV0dG9uXCJdOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJyZXNldFwiXTo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwic3VibWl0XCJdOjotbW96LWZvY3VzLWlubmVyIHtcbiAgYm9yZGVyLXN0eWxlOiBub25lO1xuICBwYWRkaW5nOiAwO1xufVxuXG4vKipcbiAqIFJlc3RvcmUgdGhlIGZvY3VzIHN0eWxlcyB1bnNldCBieSB0aGUgcHJldmlvdXMgcnVsZS5cbiAqL1xuXG5idXR0b246LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cImJ1dHRvblwiXTotbW96LWZvY3VzcmluZyxcblt0eXBlPVwicmVzZXRcIl06LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cInN1Ym1pdFwiXTotbW96LWZvY3VzcmluZyB7XG4gIG91dGxpbmU6IDFweCBkb3R0ZWQgQnV0dG9uVGV4dDtcbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBwYWRkaW5nIGluIEZpcmVmb3guXG4gKi9cblxuZmllbGRzZXQge1xuICBwYWRkaW5nOiAwLjM1ZW0gMC43NWVtIDAuNjI1ZW07XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cbiAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gXFxgZmllbGRzZXRcXGAgZWxlbWVudHMgaW4gSUUuXG4gKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XG4gKiAgICBcXGBmaWVsZHNldFxcYCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxubGVnZW5kIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xuICBjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xuICBkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xuICBtYXgtd2lkdGg6IDEwMCU7IC8qIDEgKi9cbiAgcGFkZGluZzogMDsgLyogMyAqL1xuICB3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cbiAqL1xuXG5wcm9ncmVzcyB7XG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cbiAqL1xuXG50ZXh0YXJlYSB7XG4gIG92ZXJmbG93OiBhdXRvO1xufVxuXG4vKipcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxuICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxuICovXG5cblt0eXBlPVwiY2hlY2tib3hcIl0sXG5bdHlwZT1cInJhZGlvXCJdIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xuICBwYWRkaW5nOiAwOyAvKiAyICovXG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxuICovXG5cblt0eXBlPVwibnVtYmVyXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxuW3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xuICBoZWlnaHQ6IGF1dG87XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXG4gKiAyLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cbiAqL1xuXG5bdHlwZT1cInNlYXJjaFwiXSB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXG4gIG91dGxpbmUtb2Zmc2V0OiAtMnB4OyAvKiAyICovXG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxuICovXG5cblt0eXBlPVwic2VhcmNoXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4gKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIFxcYGluaGVyaXRcXGAgaW4gU2FmYXJpLlxuICovXG5cbjo6LXdlYmtpdC1maWxlLXVwbG9hZC1idXR0b24ge1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xuICBmb250OiBpbmhlcml0OyAvKiAyICovXG59XG5cbi8qIEludGVyYWN0aXZlXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gRWRnZSwgSUUgMTArLCBhbmQgRmlyZWZveC5cbiAqL1xuXG5kZXRhaWxzIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi8qXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuc3VtbWFyeSB7XG4gIGRpc3BsYXk6IGxpc3QtaXRlbTtcbn1cblxuLyogTWlzY1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMCsuXG4gKi9cblxudGVtcGxhdGUge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLlxuICovXG5cbltoaWRkZW5dIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vbm9kZV9tb2R1bGVzL25vcm1hbGl6ZS5jc3Mvbm9ybWFsaXplLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQSwyRUFBMkU7O0FBRTNFOytFQUMrRTs7QUFFL0U7OztFQUdFOztBQUVGO0VBQ0UsaUJBQWlCLEVBQUUsTUFBTTtFQUN6Qiw4QkFBOEIsRUFBRSxNQUFNO0FBQ3hDOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7RUFDRSxTQUFTO0FBQ1g7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSxjQUFjO0FBQ2hCOztBQUVBOzs7RUFHRTs7QUFFRjtFQUNFLGNBQWM7RUFDZCxnQkFBZ0I7QUFDbEI7O0FBRUE7K0VBQytFOztBQUUvRTs7O0VBR0U7O0FBRUY7RUFDRSx1QkFBdUIsRUFBRSxNQUFNO0VBQy9CLFNBQVMsRUFBRSxNQUFNO0VBQ2pCLGlCQUFpQixFQUFFLE1BQU07QUFDM0I7O0FBRUE7OztFQUdFOztBQUVGO0VBQ0UsaUNBQWlDLEVBQUUsTUFBTTtFQUN6QyxjQUFjLEVBQUUsTUFBTTtBQUN4Qjs7QUFFQTsrRUFDK0U7O0FBRS9FOztFQUVFOztBQUVGO0VBQ0UsNkJBQTZCO0FBQy9COztBQUVBOzs7RUFHRTs7QUFFRjtFQUNFLG1CQUFtQixFQUFFLE1BQU07RUFDM0IsMEJBQTBCLEVBQUUsTUFBTTtFQUNsQyxpQ0FBaUMsRUFBRSxNQUFNO0FBQzNDOztBQUVBOztFQUVFOztBQUVGOztFQUVFLG1CQUFtQjtBQUNyQjs7QUFFQTs7O0VBR0U7O0FBRUY7OztFQUdFLGlDQUFpQyxFQUFFLE1BQU07RUFDekMsY0FBYyxFQUFFLE1BQU07QUFDeEI7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSxjQUFjO0FBQ2hCOztBQUVBOzs7RUFHRTs7QUFFRjs7RUFFRSxjQUFjO0VBQ2QsY0FBYztFQUNkLGtCQUFrQjtFQUNsQix3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRSxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsV0FBVztBQUNiOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7RUFDRSxrQkFBa0I7QUFDcEI7O0FBRUE7K0VBQytFOztBQUUvRTs7O0VBR0U7O0FBRUY7Ozs7O0VBS0Usb0JBQW9CLEVBQUUsTUFBTTtFQUM1QixlQUFlLEVBQUUsTUFBTTtFQUN2QixpQkFBaUIsRUFBRSxNQUFNO0VBQ3pCLFNBQVMsRUFBRSxNQUFNO0FBQ25COztBQUVBOzs7RUFHRTs7QUFFRjtRQUNRLE1BQU07RUFDWixpQkFBaUI7QUFDbkI7O0FBRUE7OztFQUdFOztBQUVGO1NBQ1MsTUFBTTtFQUNiLG9CQUFvQjtBQUN0Qjs7QUFFQTs7RUFFRTs7QUFFRjs7OztFQUlFLDBCQUEwQjtBQUM1Qjs7QUFFQTs7RUFFRTs7QUFFRjs7OztFQUlFLGtCQUFrQjtFQUNsQixVQUFVO0FBQ1o7O0FBRUE7O0VBRUU7O0FBRUY7Ozs7RUFJRSw4QkFBOEI7QUFDaEM7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSw4QkFBOEI7QUFDaEM7O0FBRUE7Ozs7O0VBS0U7O0FBRUY7RUFDRSxzQkFBc0IsRUFBRSxNQUFNO0VBQzlCLGNBQWMsRUFBRSxNQUFNO0VBQ3RCLGNBQWMsRUFBRSxNQUFNO0VBQ3RCLGVBQWUsRUFBRSxNQUFNO0VBQ3ZCLFVBQVUsRUFBRSxNQUFNO0VBQ2xCLG1CQUFtQixFQUFFLE1BQU07QUFDN0I7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSx3QkFBd0I7QUFDMUI7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSxjQUFjO0FBQ2hCOztBQUVBOzs7RUFHRTs7QUFFRjs7RUFFRSxzQkFBc0IsRUFBRSxNQUFNO0VBQzlCLFVBQVUsRUFBRSxNQUFNO0FBQ3BCOztBQUVBOztFQUVFOztBQUVGOztFQUVFLFlBQVk7QUFDZDs7QUFFQTs7O0VBR0U7O0FBRUY7RUFDRSw2QkFBNkIsRUFBRSxNQUFNO0VBQ3JDLG9CQUFvQixFQUFFLE1BQU07QUFDOUI7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSx3QkFBd0I7QUFDMUI7O0FBRUE7OztFQUdFOztBQUVGO0VBQ0UsMEJBQTBCLEVBQUUsTUFBTTtFQUNsQyxhQUFhLEVBQUUsTUFBTTtBQUN2Qjs7QUFFQTsrRUFDK0U7O0FBRS9FOztFQUVFOztBQUVGO0VBQ0UsY0FBYztBQUNoQjs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLGtCQUFrQjtBQUNwQjs7QUFFQTsrRUFDK0U7O0FBRS9FOztFQUVFOztBQUVGO0VBQ0UsYUFBYTtBQUNmOztBQUVBOztFQUVFOztBQUVGO0VBQ0UsYUFBYTtBQUNmXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cXG5cXG4vKiBEb2N1bWVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW4gaU9TLlxcbiAqL1xcblxcbmh0bWwge1xcbiAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cXG4gIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xcbn1cXG5cXG4vKiBTZWN0aW9uc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbmJvZHkge1xcbiAgbWFyZ2luOiAwO1xcbn1cXG5cXG4vKipcXG4gKiBSZW5kZXIgdGhlIGBtYWluYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cXG4gKi9cXG5cXG5tYWluIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBmb250IHNpemUgYW5kIG1hcmdpbiBvbiBgaDFgIGVsZW1lbnRzIHdpdGhpbiBgc2VjdGlvbmAgYW5kXFxuICogYGFydGljbGVgIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5oMSB7XFxuICBmb250LXNpemU6IDJlbTtcXG4gIG1hcmdpbjogMC42N2VtIDA7XFxufVxcblxcbi8qIEdyb3VwaW5nIGNvbnRlbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXFxuICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXFxuICovXFxuXFxuaHIge1xcbiAgYm94LXNpemluZzogY29udGVudC1ib3g7IC8qIDEgKi9cXG4gIGhlaWdodDogMDsgLyogMSAqL1xcbiAgb3ZlcmZsb3c6IHZpc2libGU7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxucHJlIHtcXG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xcbiAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cXG59XFxuXFxuLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgZ3JheSBiYWNrZ3JvdW5kIG9uIGFjdGl2ZSBsaW5rcyBpbiBJRSAxMC5cXG4gKi9cXG5cXG5hIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbn1cXG5cXG4vKipcXG4gKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxcbiAqIDIuIEFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBJRSwgT3BlcmEsIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYWJiclt0aXRsZV0ge1xcbiAgYm9yZGVyLWJvdHRvbTogbm9uZTsgLyogMSAqL1xcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmIsXFxuc3Ryb25nIHtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkZXI7XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbmNvZGUsXFxua2JkLFxcbnNhbXAge1xcbiAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXFxuICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zbWFsbCB7XFxuICBmb250LXNpemU6IDgwJTtcXG59XFxuXFxuLyoqXFxuICogUHJldmVudCBgc3ViYCBhbmQgYHN1cGAgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluXFxuICogYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbnN1YixcXG5zdXAge1xcbiAgZm9udC1zaXplOiA3NSU7XFxuICBsaW5lLWhlaWdodDogMDtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuXFxuc3ViIHtcXG4gIGJvdHRvbTogLTAuMjVlbTtcXG59XFxuXFxuc3VwIHtcXG4gIHRvcDogLTAuNWVtO1xcbn1cXG5cXG4vKiBFbWJlZGRlZCBjb250ZW50XFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGJvcmRlciBvbiBpbWFnZXMgaW5zaWRlIGxpbmtzIGluIElFIDEwLlxcbiAqL1xcblxcbmltZyB7XFxuICBib3JkZXItc3R5bGU6IG5vbmU7XFxufVxcblxcbi8qIEZvcm1zXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBGaXJlZm94IGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYnV0dG9uLFxcbmlucHV0LFxcbm9wdGdyb3VwLFxcbnNlbGVjdCxcXG50ZXh0YXJlYSB7XFxuICBmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xcbiAgZm9udC1zaXplOiAxMDAlOyAvKiAxICovXFxuICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcbiAgbWFyZ2luOiAwOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxcbiAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXFxuICovXFxuXFxuYnV0dG9uLFxcbmlucHV0IHsgLyogMSAqL1xcbiAgb3ZlcmZsb3c6IHZpc2libGU7XFxufVxcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxcbiAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cXG4gKi9cXG5cXG5idXR0b24sXFxuc2VsZWN0IHsgLyogMSAqL1xcbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYnV0dG9uLFxcblt0eXBlPVxcXCJidXR0b25cXFwiXSxcXG5bdHlwZT1cXFwicmVzZXRcXFwiXSxcXG5bdHlwZT1cXFwic3VibWl0XFxcIl0ge1xcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247XFxufVxcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXFxuICovXFxuXFxuYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxcblt0eXBlPVxcXCJidXR0b25cXFwiXTo6LW1vei1mb2N1cy1pbm5lcixcXG5bdHlwZT1cXFwicmVzZXRcXFwiXTo6LW1vei1mb2N1cy1pbm5lcixcXG5bdHlwZT1cXFwic3VibWl0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIge1xcbiAgYm9yZGVyLXN0eWxlOiBub25lO1xcbiAgcGFkZGluZzogMDtcXG59XFxuXFxuLyoqXFxuICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxcbiAqL1xcblxcbmJ1dHRvbjotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl06LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcInJlc2V0XFxcIl06LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdOi1tb3otZm9jdXNyaW5nIHtcXG4gIG91dGxpbmU6IDFweCBkb3R0ZWQgQnV0dG9uVGV4dDtcXG59XFxuXFxuLyoqXFxuICogQ29ycmVjdCB0aGUgcGFkZGluZyBpbiBGaXJlZm94LlxcbiAqL1xcblxcbmZpZWxkc2V0IHtcXG4gIHBhZGRpbmc6IDAuMzVlbSAwLjc1ZW0gMC42MjVlbTtcXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cXG4gKiAyLiBDb3JyZWN0IHRoZSBjb2xvciBpbmhlcml0YW5jZSBmcm9tIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gSUUuXFxuICogMy4gUmVtb3ZlIHRoZSBwYWRkaW5nIHNvIGRldmVsb3BlcnMgYXJlIG5vdCBjYXVnaHQgb3V0IHdoZW4gdGhleSB6ZXJvIG91dFxcbiAqICAgIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbmxlZ2VuZCB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxuICBjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xcbiAgZGlzcGxheTogdGFibGU7IC8qIDEgKi9cXG4gIG1heC13aWR0aDogMTAwJTsgLyogMSAqL1xcbiAgcGFkZGluZzogMDsgLyogMyAqL1xcbiAgd2hpdGUtc3BhY2U6IG5vcm1hbDsgLyogMSAqL1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgdmVydGljYWwgYWxpZ25tZW50IGluIENocm9tZSwgRmlyZWZveCwgYW5kIE9wZXJhLlxcbiAqL1xcblxcbnByb2dyZXNzIHtcXG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXFxuICovXFxuXFxudGV4dGFyZWEge1xcbiAgb3ZlcmZsb3c6IGF1dG87XFxufVxcblxcbi8qKlxcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxcbiAqIDIuIFJlbW92ZSB0aGUgcGFkZGluZyBpbiBJRSAxMC5cXG4gKi9cXG5cXG5bdHlwZT1cXFwiY2hlY2tib3hcXFwiXSxcXG5bdHlwZT1cXFwicmFkaW9cXFwiXSB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxuICBwYWRkaW5nOiAwOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIENocm9tZS5cXG4gKi9cXG5cXG5bdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXFxuW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcXG4gIGhlaWdodDogYXV0bztcXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXFxuICogMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXFxuICovXFxuXFxuW3R5cGU9XFxcInNlYXJjaFxcXCJdIHtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXFxuICBvdXRsaW5lLW9mZnNldDogLTJweDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXFxuICovXFxuXFxuW3R5cGU9XFxcInNlYXJjaFxcXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4gKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIGBpbmhlcml0YCBpbiBTYWZhcmkuXFxuICovXFxuXFxuOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XFxuICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xcbiAgZm9udDogaW5oZXJpdDsgLyogMiAqL1xcbn1cXG5cXG4vKiBJbnRlcmFjdGl2ZVxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLypcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSAxMCssIGFuZCBGaXJlZm94LlxcbiAqL1xcblxcbmRldGFpbHMge1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcblxcbi8qXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbnN1bW1hcnkge1xcbiAgZGlzcGxheTogbGlzdC1pdGVtO1xcbn1cXG5cXG4vKiBNaXNjXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMCsuXFxuICovXFxuXFxudGVtcGxhdGUge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXFxuICovXFxuXFxuW2hpZGRlbl0ge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVRfUlVMRV9JTVBPUlRfMF9fXyBmcm9tIFwiLSEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi9ub2RlX21vZHVsZXMvbm9ybWFsaXplLmNzcy9ub3JtYWxpemUuY3NzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fID0gbmV3IFVSTChcImZvbnRzL1JvYm90by1Cb2xkLnR0ZlwiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8xX19fID0gbmV3IFVSTChcImZvbnRzL1JvYm90by1SZWd1bGFyLnR0ZlwiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18uaShfX19DU1NfTE9BREVSX0FUX1JVTEVfSU1QT1JUXzBfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8xX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMV9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYEBmb250LWZhY2Uge1xuICBmb250LWZhbWlseTogXCJSb2JvdG9cIjtcbiAgc3JjOiB1cmwoJHtfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19ffSk7XG4gIHNyYzogdXJsKCR7X19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMV9fX30pO1xufVxuXG46cm9vdCB7XG4gIC0tbWFpbi1ib3JkZXItY29sb3I6ICM0OTUwNTc7XG4gIC0tbWFpbi10ZXh0LWNvbG9yOiAjMzMzMzMzO1xufVxuXG5ib2R5IHtcbiAgbWluLWhlaWdodDogMTAwdmg7XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byBsZWZ0LCAjZjhmNmUzLCAjYWNlMmUxKTtcbiAgZm9udC1mYW1pbHk6IFwiUm9ib3RvXCI7XG4gIGNvbG9yOiB2YXIoLS1tYWluLXRleHQtY29sb3IpO1xufVxuXG4uY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgbWluLWhlaWdodDogMTAwdmg7XG59XG5cbi5oZWFkZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgcGFkZGluZy10b3A6IDVyZW07XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4uZ2FtZS1uYW1lIHtcbiAgZm9udC1zaXplOiA0cmVtO1xufVxuXG4ubmFtZSB7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLW1haW4tYm9yZGVyLWNvbG9yKTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2EyZDJmZjtcbiAgd2lkdGg6IDIwcmVtO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGJvcmRlci1yYWRpdXM6IDAuMnJlbTtcbn1cblxuLnN0YXJ0LWJ0biB7XG4gIHBhZGRpbmctdG9wOiAzcmVtO1xufVxuXG4uc3RhcnQge1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLW1haW4tYm9yZGVyLWNvbG9yKTtcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgZm9udC1zaXplOiAycmVtO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIG91dGxpbmU6IG5vbmU7XG59XG5cbi5zdGFydDpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNjMGZhZmY7XG4gIHBhZGRpbmctbGVmdDogM3JlbTtcbiAgcGFkZGluZy1yaWdodDogM3JlbTtcbiAgdHJhbnNpdGlvbjogMC42cztcbn1cblxuLm1haW4ge1xuICBtYXJnaW4tdG9wOiAzcmVtO1xuICBtaW4taGVpZ2h0OiA1MHZoO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuXG4ucm90YXRlLWJ0biB7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgZm9udC1zaXplOiAzLjVyZW07XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIG91dGxpbmU6IG5vbmU7XG4gIHdpZHRoOiAyNXJlbTtcbiAgaGVpZ2h0OiA1cmVtO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGJvcmRlci1yYWRpdXM6IDlweDtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xufVxuXG4ucm90YXRlLWJ0bjpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNlMGZjZmY7XG4gIHRyYW5zaXRpb246IDAuNnM7XG59XG5cbi5nYW1lYm9hcmRzIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICB3aWR0aDogNjUlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIG1hcmdpbi10b3A6IDJyZW07XG59XG5cbi5yaWdodC1ib2FyZCxcbi5sZWZ0LWJvYXJkIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIG91dGxpbmU6IG5vbmU7XG4gIHdpZHRoOiA5MCU7XG4gIGFzcGVjdC1yYXRpbzogMTtcbiAgbWF4LXdpZHRoOiA2MDBweDtcbiAgbWF4LWhlaWdodDogNjAwcHg7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAxZnIpO1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMCwgMWZyKTtcbiAgZ2FwOiAwO1xuICBtYXJnaW46IDFyZW07XG4gIG1hcmdpbi10b3A6IDJyZW07XG59XG5cbi5jZWxsIHtcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbWFpbi1ib3JkZXItY29sb3IpO1xuICBtYXgtaGVpZ2h0OiAxMDAlO1xuICBtYXgtd2lkdGg6IDEwMCU7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xufVxuXG4ucmlnaHQtYm9hcmQgLmNlbGwge1xuICBjdXJzb3I6IGNyb3NzaGFpcjtcbn1cblxuLnJpZ2h0LWJvYXJkIC5jZWxsOm5vdCgubWlzcyk6bm90KC5oaXQpOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2UwZmNmZjtcbn1cblxuLnNoaXAge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYTJkMmZmO1xufVxuXG4uaGl0IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmNGQ2ZDtcbn1cblxuLm1pc3Mge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZDViZGFmO1xufVxuXG4uaGlnaGxpZ2h0IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE0NCwgMjA3LCAyMzEpO1xuICBib3JkZXI6IG5vbmU7XG59XG5cbi5mb290ZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBtaW4taGVpZ2h0OiAxMDAlO1xuICBtYXJnaW4tdG9wOiBhdXRvO1xufVxuXG4ucmVzdGFydC1idG4ge1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGZvbnQtc2l6ZTogMnJlbTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBvdXRsaW5lOiBub25lO1xuICB3aWR0aDogMTVyZW07XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgYm9yZGVyLXJhZGl1czogOXB4O1xuICBib3JkZXItY29sb3I6IHZhcigtLW1haW4tYm9yZGVyLWNvbG9yKTtcbiAgbWFyZ2luLWJvdHRvbTogMnJlbTtcbn1cblxuLnJlc3RhcnQtYnRuOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2VkZWRlOTtcbiAgdHJhbnNpdGlvbjogMC42cztcbn1cblxuLnN0YXJ0LXNob290aW5nIHtcbiAgZm9udC1zaXplOiAzLjVyZW07XG4gIHdpZHRoOiAyNXJlbTtcbiAgaGVpZ2h0OiA1cmVtO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGxldHRlci1zcGFjaW5nOiAwLjFyZW07XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbn1cblxuLmNvcHlyaWdodC1kaXYge1xuICBtYXJnaW4tdG9wOiAzcmVtO1xuICBkaXNwbGF5OiBmbGV4O1xuICBoZWlnaHQ6IDVyZW07XG4gIHdpZHRoOiAxMDAlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWRlZGU5O1xuICBvcGFjaXR5OiAwLjg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuXG5hIHtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICBjb2xvcjogdmFyKC0tbWFpbi10ZXh0LWNvbG9yKTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiA1cHg7XG59XG5cbi5zdmctbG9nbyB7XG4gIHdpZHRoOiAycmVtO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUNBO0VBQ0UscUJBQXFCO0VBQ3JCLDRDQUErQjtFQUMvQiw0Q0FBa0M7QUFDcEM7O0FBRUE7RUFDRSw0QkFBNEI7RUFDNUIsMEJBQTBCO0FBQzVCOztBQUVBO0VBQ0UsaUJBQWlCO0VBQ2pCLHNEQUFzRDtFQUN0RCxxQkFBcUI7RUFDckIsNkJBQTZCO0FBQy9COztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0QixpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLHVCQUF1QjtFQUN2QixzQkFBc0I7RUFDdEIsaUJBQWlCO0VBQ2pCLFdBQVc7QUFDYjs7QUFFQTtFQUNFLGVBQWU7QUFDakI7O0FBRUE7RUFDRSwwQ0FBMEM7RUFDMUMseUJBQXlCO0VBQ3pCLFlBQVk7RUFDWixrQkFBa0I7RUFDbEIscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0UsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UscUJBQXFCO0VBQ3JCLDBDQUEwQztFQUMxQyxtQkFBbUI7RUFDbkIsZUFBZTtFQUNmLGVBQWU7RUFDZiw2QkFBNkI7RUFDN0IsNEJBQTRCO0VBQzVCLGVBQWU7RUFDZixnQkFBZ0I7RUFDaEIsYUFBYTtBQUNmOztBQUVBO0VBQ0UseUJBQXlCO0VBQ3pCLGtCQUFrQjtFQUNsQixtQkFBbUI7RUFDbkIsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsZ0JBQWdCO0VBQ2hCLGdCQUFnQjtFQUNoQixhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLHFCQUFxQjtFQUNyQixpQkFBaUI7RUFDakIsZUFBZTtFQUNmLDZCQUE2QjtFQUM3Qiw0QkFBNEI7RUFDNUIsZ0JBQWdCO0VBQ2hCLGFBQWE7RUFDYixZQUFZO0VBQ1osWUFBWTtFQUNaLGtCQUFrQjtFQUNsQixrQkFBa0I7RUFDbEIsU0FBUztFQUNULFVBQVU7QUFDWjs7QUFFQTtFQUNFLHlCQUF5QjtFQUN6QixnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsOEJBQThCO0VBQzlCLFVBQVU7RUFDVixZQUFZO0VBQ1osZ0JBQWdCO0FBQ2xCOztBQUVBOztFQUVFLDZCQUE2QjtFQUM3Qiw0QkFBNEI7RUFDNUIsZ0JBQWdCO0VBQ2hCLGFBQWE7RUFDYixVQUFVO0VBQ1YsZUFBZTtFQUNmLGdCQUFnQjtFQUNoQixpQkFBaUI7RUFDakIsYUFBYTtFQUNiLHNDQUFzQztFQUN0QyxtQ0FBbUM7RUFDbkMsTUFBTTtFQUNOLFlBQVk7RUFDWixnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSwwQ0FBMEM7RUFDMUMsZ0JBQWdCO0VBQ2hCLGVBQWU7RUFDZixlQUFlO0VBQ2YsU0FBUztFQUNULFVBQVU7QUFDWjs7QUFFQTtFQUNFLGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLG9DQUFvQztFQUNwQyxZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLG1CQUFtQjtFQUNuQixnQkFBZ0I7RUFDaEIsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UscUJBQXFCO0VBQ3JCLGVBQWU7RUFDZixlQUFlO0VBQ2YsNkJBQTZCO0VBQzdCLDRCQUE0QjtFQUM1QixlQUFlO0VBQ2YsZ0JBQWdCO0VBQ2hCLGFBQWE7RUFDYixZQUFZO0VBQ1osa0JBQWtCO0VBQ2xCLGtCQUFrQjtFQUNsQixzQ0FBc0M7RUFDdEMsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UseUJBQXlCO0VBQ3pCLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLGlCQUFpQjtFQUNqQixZQUFZO0VBQ1osWUFBWTtFQUNaLGtCQUFrQjtFQUNsQixzQkFBc0I7RUFDdEIsU0FBUztFQUNULFVBQVU7QUFDWjs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixhQUFhO0VBQ2IsWUFBWTtFQUNaLFdBQVc7RUFDWCx5QkFBeUI7RUFDekIsWUFBWTtFQUNaLHVCQUF1QjtFQUN2QixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxxQkFBcUI7RUFDckIsNkJBQTZCO0VBQzdCLGFBQWE7RUFDYixtQkFBbUI7RUFDbkIsUUFBUTtBQUNWOztBQUVBO0VBQ0UsV0FBVztFQUNYLGtCQUFrQjtBQUNwQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAaW1wb3J0IFxcXCJub3JtYWxpemUuY3NzXFxcIjtcXG5AZm9udC1mYWNlIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiUm9ib3RvXFxcIjtcXG4gIHNyYzogdXJsKGZvbnRzL1JvYm90by1Cb2xkLnR0Zik7XFxuICBzcmM6IHVybChmb250cy9Sb2JvdG8tUmVndWxhci50dGYpO1xcbn1cXG5cXG46cm9vdCB7XFxuICAtLW1haW4tYm9yZGVyLWNvbG9yOiAjNDk1MDU3O1xcbiAgLS1tYWluLXRleHQtY29sb3I6ICMzMzMzMzM7XFxufVxcblxcbmJvZHkge1xcbiAgbWluLWhlaWdodDogMTAwdmg7XFxuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gbGVmdCwgI2Y4ZjZlMywgI2FjZTJlMSk7XFxuICBmb250LWZhbWlseTogXFxcIlJvYm90b1xcXCI7XFxuICBjb2xvcjogdmFyKC0tbWFpbi10ZXh0LWNvbG9yKTtcXG59XFxuXFxuLmNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbn1cXG5cXG4uaGVhZGVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgcGFkZGluZy10b3A6IDVyZW07XFxuICB3aWR0aDogMTAwJTtcXG59XFxuXFxuLmdhbWUtbmFtZSB7XFxuICBmb250LXNpemU6IDRyZW07XFxufVxcblxcbi5uYW1lIHtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLW1haW4tYm9yZGVyLWNvbG9yKTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNhMmQyZmY7XFxuICB3aWR0aDogMjByZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBib3JkZXItcmFkaXVzOiAwLjJyZW07XFxufVxcblxcbi5zdGFydC1idG4ge1xcbiAgcGFkZGluZy10b3A6IDNyZW07XFxufVxcblxcbi5zdGFydCB7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1tYWluLWJvcmRlci1jb2xvcik7XFxuICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgZm9udC1zaXplOiAycmVtO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG4gIG91dGxpbmU6IG5vbmU7XFxufVxcblxcbi5zdGFydDpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYzBmYWZmO1xcbiAgcGFkZGluZy1sZWZ0OiAzcmVtO1xcbiAgcGFkZGluZy1yaWdodDogM3JlbTtcXG4gIHRyYW5zaXRpb246IDAuNnM7XFxufVxcblxcbi5tYWluIHtcXG4gIG1hcmdpbi10b3A6IDNyZW07XFxuICBtaW4taGVpZ2h0OiA1MHZoO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4ucm90YXRlLWJ0biB7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICBmb250LXNpemU6IDMuNXJlbTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuICBvdXRsaW5lOiBub25lO1xcbiAgd2lkdGg6IDI1cmVtO1xcbiAgaGVpZ2h0OiA1cmVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgYm9yZGVyLXJhZGl1czogOXB4O1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG59XFxuXFxuLnJvdGF0ZS1idG46aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2UwZmNmZjtcXG4gIHRyYW5zaXRpb246IDAuNnM7XFxufVxcblxcbi5nYW1lYm9hcmRzIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxuICB3aWR0aDogNjUlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgbWFyZ2luLXRvcDogMnJlbTtcXG59XFxuXFxuLnJpZ2h0LWJvYXJkLFxcbi5sZWZ0LWJvYXJkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuICBvdXRsaW5lOiBub25lO1xcbiAgd2lkdGg6IDkwJTtcXG4gIGFzcGVjdC1yYXRpbzogMTtcXG4gIG1heC13aWR0aDogNjAwcHg7XFxuICBtYXgtaGVpZ2h0OiA2MDBweDtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwgMWZyKTtcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDEwLCAxZnIpO1xcbiAgZ2FwOiAwO1xcbiAgbWFyZ2luOiAxcmVtO1xcbiAgbWFyZ2luLXRvcDogMnJlbTtcXG59XFxuXFxuLmNlbGwge1xcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbWFpbi1ib3JkZXItY29sb3IpO1xcbiAgbWF4LWhlaWdodDogMTAwJTtcXG4gIG1heC13aWR0aDogMTAwJTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxufVxcblxcbi5yaWdodC1ib2FyZCAuY2VsbCB7XFxuICBjdXJzb3I6IGNyb3NzaGFpcjtcXG59XFxuXFxuLnJpZ2h0LWJvYXJkIC5jZWxsOm5vdCgubWlzcyk6bm90KC5oaXQpOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNlMGZjZmY7XFxufVxcblxcbi5zaGlwIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNhMmQyZmY7XFxufVxcblxcbi5oaXQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmNGQ2ZDtcXG59XFxuXFxuLm1pc3Mge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Q1YmRhZjtcXG59XFxuXFxuLmhpZ2hsaWdodCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTQ0LCAyMDcsIDIzMSk7XFxuICBib3JkZXI6IG5vbmU7XFxufVxcblxcbi5mb290ZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgbWluLWhlaWdodDogMTAwJTtcXG4gIG1hcmdpbi10b3A6IGF1dG87XFxufVxcblxcbi5yZXN0YXJ0LWJ0biB7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICBmb250LXNpemU6IDJyZW07XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIHdpZHRoOiAxNXJlbTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGJvcmRlci1yYWRpdXM6IDlweDtcXG4gIGJvcmRlci1jb2xvcjogdmFyKC0tbWFpbi1ib3JkZXItY29sb3IpO1xcbiAgbWFyZ2luLWJvdHRvbTogMnJlbTtcXG59XFxuXFxuLnJlc3RhcnQtYnRuOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNlZGVkZTk7XFxuICB0cmFuc2l0aW9uOiAwLjZzO1xcbn1cXG5cXG4uc3RhcnQtc2hvb3Rpbmcge1xcbiAgZm9udC1zaXplOiAzLjVyZW07XFxuICB3aWR0aDogMjVyZW07XFxuICBoZWlnaHQ6IDVyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBsZXR0ZXItc3BhY2luZzogMC4xcmVtO1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG59XFxuXFxuLmNvcHlyaWdodC1kaXYge1xcbiAgbWFyZ2luLXRvcDogM3JlbTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBoZWlnaHQ6IDVyZW07XFxuICB3aWR0aDogMTAwJTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNlZGVkZTk7XFxuICBvcGFjaXR5OiAwLjg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbmEge1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgY29sb3I6IHZhcigtLW1haW4tdGV4dC1jb2xvcik7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGdhcDogNXB4O1xcbn1cXG5cXG4uc3ZnLWxvZ28ge1xcbiAgd2lkdGg6IDJyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIGlmICghdXJsKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICB1cmwgPSBTdHJpbmcodXJsLl9fZXNNb2R1bGUgPyB1cmwuZGVmYXVsdCA6IHVybCk7XG5cbiAgLy8gSWYgdXJsIGlzIGFscmVhZHkgd3JhcHBlZCBpbiBxdW90ZXMsIHJlbW92ZSB0aGVtXG4gIGlmICgvXlsnXCJdLipbJ1wiXSQvLnRlc3QodXJsKSkge1xuICAgIHVybCA9IHVybC5zbGljZSgxLCAtMSk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaGFzaCkge1xuICAgIHVybCArPSBvcHRpb25zLmhhc2g7XG4gIH1cblxuICAvLyBTaG91bGQgdXJsIGJlIHdyYXBwZWQ/XG4gIC8vIFNlZSBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3NzLXZhbHVlcy0zLyN1cmxzXG4gIGlmICgvW1wiJygpIFxcdFxcbl18KCUyMCkvLnRlc3QodXJsKSB8fCBvcHRpb25zLm5lZWRRdW90ZXMpIHtcbiAgICByZXR1cm4gXCJcXFwiXCIuY29uY2F0KHVybC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIiksIFwiXFxcIlwiKTtcbiAgfVxuICByZXR1cm4gdXJsO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZXMuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZXMuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHtcblx0XHRcdHZhciBpID0gc2NyaXB0cy5sZW5ndGggLSAxO1xuXHRcdFx0d2hpbGUgKGkgPiAtMSAmJiAhc2NyaXB0VXJsKSBzY3JpcHRVcmwgPSBzY3JpcHRzW2ktLV0uc3JjO1xuXHRcdH1cblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5iID0gZG9jdW1lbnQuYmFzZVVSSSB8fCBzZWxmLmxvY2F0aW9uLmhyZWY7XG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gbm8ganNvbnAgZnVuY3Rpb24iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCB7IGdhbWVMb29wIH0gZnJvbSBcIi4vZ2FtZVwiO1xuaW1wb3J0IFwiLi9zdHlsZXMuY3NzXCI7XG5pbXBvcnQgd2ViSWNvbiBmcm9tIFwiLi9hc3NldHMvaWNvbi5wbmdcIjtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG4gIGxpbmsucmVsID0gXCJpY29uXCI7XG4gIGxpbmsudHlwZSA9IFwiaW1hZ2UvcG5nXCI7XG4gIGxpbmsuaHJlZiA9IHdlYkljb247XG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobGluayk7XG59KTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJzdGFydFwiKSkge1xuICAgIGdhbWVMb29wKCk7XG4gIH1cbn0pO1xuIl0sIm5hbWVzIjpbIkdhbWVib2FyZCIsIlBsYXllciIsImNoYW5nZVJvdGF0ZUJ0biIsInJlbW92ZUNvbnRhaW5lckV2ZW50cyIsInJlbmRlckJvYXJkcyIsInJlbmRlclBhZ2UiLCJnYW1lTG9vcCIsInBsYXllck9uZSIsInBsYXllclR3byIsInBsYXllcnMiLCJib2FyZE9uZSIsImJvYXJkVHdvIiwiYm9hcmRzIiwiZ2VuZXJhdGVCb2FyZCIsInN0YXJ0R2FtZSIsIndlYkJvYXJkcyIsInN0YXJ0IiwiaSIsInNoaXBzTGVuZ3RoIiwieCIsIk1hdGgiLCJyb3VuZCIsInJhbmRvbSIsInkiLCJkaXJlY3Rpb24iLCJwbGFjZVNoaXAiLCJjb250YWluZXIiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsInRhcmdldCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiY2VsbCIsImdldEF0dHJpYnV0ZSIsImNsb3Nlc3QiLCJib2FyZCIsImF0dGFja1dvbiIsInJlY2VpdmVBdHRhY2siLCJzZXRUaW1lb3V0IiwiYWlUdXJuIiwiY2hlY2tGb3JTdGFydGluZ0dhbWUiLCJzaG93V2lubmVyIiwiU2hpcCIsImNvbnN0cnVjdG9yIiwiaXNFbmVteSIsImhpdHNCb2FyZCIsInIiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJjIiwiQXJyYXkiLCJmaWxsIiwibWFwIiwibmV3U2hpcCIsImNvb3JkaW5hdGVzIiwiY2VsbEhpdCIsImhpdCIsImlzU3VuayIsImNoZWNraW5nV2luIiwid2lubmVyIiwic2hpcHMiLCJkZXN0cm95ZWRTaGlwcyIsImZvckVhY2giLCJlbGVtZW10IiwiZWxlbSIsInB1c2giLCJzdW5rIiwibmFtZSIsImdlbmVyYXRlUmFuZG9tQ29yZHMiLCJlbmVteUJvYXJkIiwiY29yZHMiLCJ0dXJuIiwiZ2l0aHViTG9nbyIsImlubmVySFRNTCIsIm1haW4iLCJjcmVhdGVFbGVtZW50IiwiYWRkIiwicm90YXRlRGl2Iiwicm90YXRlQnRuIiwidGV4dENvbnRlbnQiLCJnYW1lYm9hcmRzIiwibGVmdEJvYXJkIiwicmlnaHRCb2FyZCIsImZvb3RlciIsInJlc3RhcnRCdG4iLCJjb3B5cmlnaHREaXYiLCJjb3B5cmlnaHRUZXh0IiwiYXBwZW5kQ2hpbGQiLCJhdHRhY2hSb3RhdGVFdmVudCIsImF0dGFjaFJlc3RhcnRFdmVudCIsImlzVmVydGljYWwiLCJoYXNBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJhdHRhY2hDZWxsc0hpZ2hsaWdodCIsImNsaWNrZWRYIiwicGFyc2VJbnQiLCJjbGlja2VkWSIsInJlbW92ZUhpZ2hsaWdodCIsImhpZ2hsaWdodENlbGxzIiwiYm9hcmRET00iLCJob3ZlclgiLCJob3ZlclkiLCJzaGlwTGVuZ3RoIiwicXVlcnlTZWxlY3RvckFsbCIsInJlbW92ZSIsInRvZ2dsZUF0dHJpYnV0ZSIsInJlbW92ZUNoaWxkIiwic3RhcnRTaG9vdGluZyIsInJlcGxhY2VXaXRoIiwiY2xvbmVOb2RlIiwiaGl0cyIsIndlYkljb24iLCJsaW5rIiwicmVsIiwidHlwZSIsImhyZWYiLCJoZWFkIl0sInNvdXJjZVJvb3QiOiIifQ==