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
            const aiAttackWon = players[1].aiTurn(boards[0]);
            (0,_render__WEBPACK_IMPORTED_MODULE_2__.renderBoards)(boards, webBoards, players);
            if (aiAttackWon === true) {
              (0,_render__WEBPACK_IMPORTED_MODULE_2__.removeContainerEvents)();
            }
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
          const ship = boards[i].board[x][y];
          if (ship.sunk === true) {
            cell.classList.add("destroyed");
          } else {
            cell.classList.add("hit");
          }
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

.right-board .cell:not(.miss):not(.hit):not(.destroyed):hover {
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

.destroyed {
  background-color: #343a40;
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
`, "",{"version":3,"sources":["webpack://./src/styles.css"],"names":[],"mappings":"AACA;EACE,qBAAqB;EACrB,4CAA+B;EAC/B,4CAAkC;AACpC;;AAEA;EACE,4BAA4B;EAC5B,0BAA0B;AAC5B;;AAEA;EACE,iBAAiB;EACjB,sDAAsD;EACtD,qBAAqB;EACrB,6BAA6B;AAC/B;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,iBAAiB;AACnB;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,uBAAuB;EACvB,sBAAsB;EACtB,iBAAiB;EACjB,WAAW;AACb;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,0CAA0C;EAC1C,yBAAyB;EACzB,YAAY;EACZ,kBAAkB;EAClB,qBAAqB;AACvB;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,qBAAqB;EACrB,0CAA0C;EAC1C,mBAAmB;EACnB,eAAe;EACf,eAAe;EACf,6BAA6B;EAC7B,4BAA4B;EAC5B,eAAe;EACf,gBAAgB;EAChB,aAAa;AACf;;AAEA;EACE,yBAAyB;EACzB,kBAAkB;EAClB,mBAAmB;EACnB,gBAAgB;AAClB;;AAEA;EACE,gBAAgB;EAChB,gBAAgB;EAChB,aAAa;EACb,sBAAsB;EACtB,mBAAmB;AACrB;;AAEA;EACE,qBAAqB;EACrB,iBAAiB;EACjB,eAAe;EACf,6BAA6B;EAC7B,4BAA4B;EAC5B,gBAAgB;EAChB,aAAa;EACb,YAAY;EACZ,YAAY;EACZ,kBAAkB;EAClB,kBAAkB;EAClB,SAAS;EACT,UAAU;AACZ;;AAEA;EACE,yBAAyB;EACzB,gBAAgB;AAClB;;AAEA;EACE,aAAa;EACb,8BAA8B;EAC9B,UAAU;EACV,YAAY;EACZ,gBAAgB;AAClB;;AAEA;;EAEE,6BAA6B;EAC7B,4BAA4B;EAC5B,gBAAgB;EAChB,aAAa;EACb,UAAU;EACV,eAAe;EACf,gBAAgB;EAChB,iBAAiB;EACjB,aAAa;EACb,sCAAsC;EACtC,mCAAmC;EACnC,MAAM;EACN,YAAY;EACZ,gBAAgB;AAClB;;AAEA;EACE,0CAA0C;EAC1C,gBAAgB;EAChB,eAAe;EACf,eAAe;EACf,SAAS;EACT,UAAU;AACZ;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,oCAAoC;EACpC,YAAY;AACd;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,gBAAgB;EAChB,gBAAgB;AAClB;;AAEA;EACE,qBAAqB;EACrB,eAAe;EACf,eAAe;EACf,6BAA6B;EAC7B,4BAA4B;EAC5B,eAAe;EACf,gBAAgB;EAChB,aAAa;EACb,YAAY;EACZ,kBAAkB;EAClB,kBAAkB;EAClB,sCAAsC;EACtC,mBAAmB;AACrB;;AAEA;EACE,yBAAyB;EACzB,gBAAgB;AAClB;;AAEA;EACE,iBAAiB;EACjB,YAAY;EACZ,YAAY;EACZ,kBAAkB;EAClB,sBAAsB;EACtB,SAAS;EACT,UAAU;AACZ;;AAEA;EACE,gBAAgB;EAChB,aAAa;EACb,YAAY;EACZ,WAAW;EACX,yBAAyB;EACzB,YAAY;EACZ,uBAAuB;EACvB,mBAAmB;AACrB;;AAEA;EACE,qBAAqB;EACrB,6BAA6B;EAC7B,aAAa;EACb,mBAAmB;EACnB,QAAQ;AACV;;AAEA;EACE,WAAW;EACX,kBAAkB;AACpB","sourcesContent":["@import \"normalize.css\";\n@font-face {\n  font-family: \"Roboto\";\n  src: url(fonts/Roboto-Bold.ttf);\n  src: url(fonts/Roboto-Regular.ttf);\n}\n\n:root {\n  --main-border-color: #495057;\n  --main-text-color: #333333;\n}\n\nbody {\n  min-height: 100vh;\n  background: linear-gradient(to left, #f8f6e3, #ace2e1);\n  font-family: \"Roboto\";\n  color: var(--main-text-color);\n}\n\n.container {\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n}\n\n.header {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  padding-top: 5rem;\n  width: 100%;\n}\n\n.game-name {\n  font-size: 4rem;\n}\n\n.name {\n  border: 1px solid var(--main-border-color);\n  background-color: #a2d2ff;\n  width: 20rem;\n  text-align: center;\n  border-radius: 0.2rem;\n}\n\n.start-btn {\n  padding-top: 3rem;\n}\n\n.start {\n  text-decoration: none;\n  border: 1px solid var(--main-border-color);\n  border-radius: 10px;\n  font-size: 2rem;\n  cursor: pointer;\n  background-color: transparent;\n  background-repeat: no-repeat;\n  cursor: pointer;\n  overflow: hidden;\n  outline: none;\n}\n\n.start:hover {\n  background-color: #c0faff;\n  padding-left: 3rem;\n  padding-right: 3rem;\n  transition: 0.6s;\n}\n\n.main {\n  margin-top: 3rem;\n  min-height: 50vh;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.rotate-btn {\n  text-decoration: none;\n  font-size: 3.5rem;\n  cursor: pointer;\n  background-color: transparent;\n  background-repeat: no-repeat;\n  overflow: hidden;\n  outline: none;\n  width: 25rem;\n  height: 5rem;\n  text-align: center;\n  border-radius: 9px;\n  margin: 0;\n  padding: 0;\n}\n\n.rotate-btn:hover {\n  background-color: #e0fcff;\n  transition: 0.6s;\n}\n\n.gameboards {\n  display: flex;\n  justify-content: space-between;\n  width: 65%;\n  height: 100%;\n  margin-top: 2rem;\n}\n\n.right-board,\n.left-board {\n  background-color: transparent;\n  background-repeat: no-repeat;\n  overflow: hidden;\n  outline: none;\n  width: 90%;\n  aspect-ratio: 1;\n  max-width: 600px;\n  max-height: 600px;\n  display: grid;\n  grid-template-columns: repeat(10, 1fr);\n  grid-template-rows: repeat(10, 1fr);\n  gap: 0;\n  margin: 1rem;\n  margin-top: 2rem;\n}\n\n.cell {\n  border: 1px solid var(--main-border-color);\n  max-height: 100%;\n  max-width: 100%;\n  cursor: pointer;\n  margin: 0;\n  padding: 0;\n}\n\n.right-board .cell {\n  cursor: crosshair;\n}\n\n.right-board .cell:not(.miss):not(.hit):not(.destroyed):hover {\n  background-color: #e0fcff;\n}\n\n.ship {\n  background-color: #a2d2ff;\n}\n\n.hit {\n  background-color: #ff4d6d;\n}\n\n.miss {\n  background-color: #d5bdaf;\n}\n\n.destroyed {\n  background-color: #343a40;\n}\n\n.highlight {\n  background-color: rgb(144, 207, 231);\n  border: none;\n}\n\n.footer {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  min-height: 100%;\n  margin-top: auto;\n}\n\n.restart-btn {\n  text-decoration: none;\n  font-size: 2rem;\n  cursor: pointer;\n  background-color: transparent;\n  background-repeat: no-repeat;\n  cursor: pointer;\n  overflow: hidden;\n  outline: none;\n  width: 15rem;\n  text-align: center;\n  border-radius: 9px;\n  border-color: var(--main-border-color);\n  margin-bottom: 2rem;\n}\n\n.restart-btn:hover {\n  background-color: #edede9;\n  transition: 0.6s;\n}\n\n.start-shooting {\n  font-size: 3.5rem;\n  width: 25rem;\n  height: 5rem;\n  text-align: center;\n  letter-spacing: 0.1rem;\n  margin: 0;\n  padding: 0;\n}\n\n.copyright-div {\n  margin-top: 3rem;\n  display: flex;\n  height: 5rem;\n  width: 100%;\n  background-color: #edede9;\n  opacity: 0.8;\n  justify-content: center;\n  align-items: center;\n}\n\na {\n  text-decoration: none;\n  color: var(--main-text-color);\n  display: flex;\n  align-items: center;\n  gap: 5px;\n}\n\n.svg-logo {\n  width: 2rem;\n  text-align: center;\n}\n"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLGlGQUFpRixZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLFdBQVcsTUFBTSxLQUFLLFVBQVUsT0FBTyxLQUFLLFlBQVksYUFBYSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxXQUFXLFlBQVksV0FBVyxNQUFNLEtBQUssWUFBWSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsV0FBVyxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsVUFBVSxZQUFZLGFBQWEsV0FBVyxVQUFVLE1BQU0sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFVBQVUsWUFBWSxPQUFPLE1BQU0sWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFVBQVUsWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsV0FBVyxVQUFVLFVBQVUsVUFBVSxNQUFNLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLE1BQU0sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksV0FBVyxVQUFVLFlBQVksYUFBYSxXQUFXLFlBQVksV0FBVyxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxXQUFXLFVBQVUsWUFBWSxhQUFhLFdBQVcsVUFBVSxNQUFNLEtBQUssWUFBWSxXQUFXLFVBQVUsVUFB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Q0MsR0FBRyxHQUFHLE1BQU07RUFDakJELElBQUksQ0FBQ0UsSUFBSSxHQUFHLFdBQVc7RUFDdkJGLElBQUksQ0FBQ0csSUFBSSxHQUFHSiw2Q0FBTztFQUNuQnpGLFFBQVEsQ0FBQzhGLElBQUksQ0FBQzlCLFdBQVcsQ0FBQzBCLElBQUksQ0FBQztBQUNqQyxDQUFDLENBQUM7QUFFRjFGLFFBQVEsQ0FBQ0UsZ0JBQWdCLENBQUMsT0FBTyxFQUFHQyxDQUFDLElBQUs7RUFDeEMsSUFBSUEsQ0FBQyxDQUFDQyxNQUFNLENBQUNDLFNBQVMsQ0FBQ0MsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQ3hDM0IsK0NBQVEsQ0FBQyxDQUFDO0VBQ1o7QUFDRixDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3Byb2plY3RzdGFydGVydGVtcGxhdGUvLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0c3RhcnRlcnRlbXBsYXRlLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0c3RhcnRlcnRlbXBsYXRlLy4vc3JjL3BsYXllcnMuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdHN0YXJ0ZXJ0ZW1wbGF0ZS8uL3NyYy9yZW5kZXIuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdHN0YXJ0ZXJ0ZW1wbGF0ZS8uL3NyYy9zaGlwcy5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0c3RhcnRlcnRlbXBsYXRlLy4vbm9kZV9tb2R1bGVzL25vcm1hbGl6ZS5jc3Mvbm9ybWFsaXplLmNzcyIsIndlYnBhY2s6Ly9wcm9qZWN0c3RhcnRlcnRlbXBsYXRlLy4vc3JjL3N0eWxlcy5jc3MiLCJ3ZWJwYWNrOi8vcHJvamVjdHN0YXJ0ZXJ0ZW1wbGF0ZS8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdHN0YXJ0ZXJ0ZW1wbGF0ZS8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdHN0YXJ0ZXJ0ZW1wbGF0ZS8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3Byb2plY3RzdGFydGVydGVtcGxhdGUvLi9zcmMvc3R5bGVzLmNzcz80NGIyIiwid2VicGFjazovL3Byb2plY3RzdGFydGVydGVtcGxhdGUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdHN0YXJ0ZXJ0ZW1wbGF0ZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdHN0YXJ0ZXJ0ZW1wbGF0ZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0c3RhcnRlcnRlbXBsYXRlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL3Byb2plY3RzdGFydGVydGVtcGxhdGUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0c3RhcnRlcnRlbXBsYXRlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vcHJvamVjdHN0YXJ0ZXJ0ZW1wbGF0ZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wcm9qZWN0c3RhcnRlcnRlbXBsYXRlL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3Byb2plY3RzdGFydGVydGVtcGxhdGUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3Byb2plY3RzdGFydGVydGVtcGxhdGUvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9wcm9qZWN0c3RhcnRlcnRlbXBsYXRlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcHJvamVjdHN0YXJ0ZXJ0ZW1wbGF0ZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3Byb2plY3RzdGFydGVydGVtcGxhdGUvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vcHJvamVjdHN0YXJ0ZXJ0ZW1wbGF0ZS93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9wcm9qZWN0c3RhcnRlcnRlbXBsYXRlL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9wcm9qZWN0c3RhcnRlcnRlbXBsYXRlLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBHYW1lYm9hcmQgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL3BsYXllcnNcIjtcbmltcG9ydCB7XG4gIGNoYW5nZVJvdGF0ZUJ0bixcbiAgcmVtb3ZlQ29udGFpbmVyRXZlbnRzLFxuICByZW5kZXJCb2FyZHMsXG4gIHJlbmRlclBhZ2UsXG59IGZyb20gXCIuL3JlbmRlclwiO1xuXG4vLyBNYWluIGdhbWUgbG9vcCBmdW5jXG5leHBvcnQgZnVuY3Rpb24gZ2FtZUxvb3AoKSB7XG4gIGNvbnN0IHBsYXllck9uZSA9IG5ldyBQbGF5ZXIoXCJEYW5pZWxcIik7XG4gIGNvbnN0IHBsYXllclR3byA9IG5ldyBQbGF5ZXIoXCJBSVwiKTtcbiAgY29uc3QgcGxheWVycyA9IFtwbGF5ZXJPbmUsIHBsYXllclR3b107XG4gIGNvbnN0IGJvYXJkT25lID0gbmV3IEdhbWVib2FyZChmYWxzZSk7XG4gIGNvbnN0IGJvYXJkVHdvID0gbmV3IEdhbWVib2FyZCh0cnVlKTtcbiAgY29uc3QgYm9hcmRzID0gW2JvYXJkT25lLCBib2FyZFR3b107XG4gIGJvYXJkT25lLmdlbmVyYXRlQm9hcmQoKTtcbiAgYm9hcmRUd28uZ2VuZXJhdGVCb2FyZCgpO1xuICByZW5kZXJQYWdlKGJvYXJkcywgcGxheWVycyk7XG59XG5cbi8vIFBsYWNlIGNvbXB1dGVyIHNoaXBzIGFuZCBhbGxvdyBwbGF5ZXIgdG8gc2hvb3RcbmZ1bmN0aW9uIHN0YXJ0R2FtZShib2FyZHMsIHdlYkJvYXJkcywgcGxheWVycykge1xuICBpZiAoYm9hcmRzWzFdLnN0YXJ0ID09PSBmYWxzZSkge1xuICAgIGxldCBpID0gNTtcbiAgICB3aGlsZSAoYm9hcmRzWzFdLnNoaXBzTGVuZ3RoICE9PSAwKSB7XG4gICAgICBjb25zdCB4ID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogOSk7XG4gICAgICBjb25zdCB5ID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogOSk7XG4gICAgICBjb25zdCBkaXJlY3Rpb24gPVxuICAgICAgICBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpID09PSAxID8gXCJob3Jpem9udGFsXCIgOiBcInZlcnRpY2FsXCI7XG4gICAgICBpZiAoYm9hcmRzWzFdLnBsYWNlU2hpcChbeCwgeV0sIGksIGRpcmVjdGlvbikgPT09IHRydWUpIHtcbiAgICAgICAgaS0tO1xuICAgICAgfVxuICAgIH1cbiAgICBib2FyZHNbMV0uc3RhcnQgPSB0cnVlO1xuICB9XG4gIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udGFpbmVyXCIpO1xuICBjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgaWYgKFxuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY2VsbFwiKSAmJlxuICAgICAgIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcIm1pc3NcIikgJiZcbiAgICAgICFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIilcbiAgICApIHtcbiAgICAgIGNvbnN0IGNlbGwgPSBlLnRhcmdldDtcbiAgICAgIGNvbnN0IHggPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXhcIik7XG4gICAgICBjb25zdCB5ID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS15XCIpO1xuICAgICAgaWYgKGNlbGwuY2xvc2VzdChcIi5yaWdodC1ib2FyZFwiKSkge1xuICAgICAgICBjb25zdCBib2FyZCA9IGJvYXJkc1sxXTtcbiAgICAgICAgY29uc3QgYXR0YWNrV29uID0gYm9hcmQucmVjZWl2ZUF0dGFjayhbeCwgeV0sIHBsYXllcnMpO1xuICAgICAgICByZW5kZXJCb2FyZHMoYm9hcmRzLCB3ZWJCb2FyZHMsIHBsYXllcnMpO1xuICAgICAgICBpZiAoYXR0YWNrV29uID09PSB0cnVlKSB7XG4gICAgICAgICAgcmVtb3ZlQ29udGFpbmVyRXZlbnRzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhaUF0dGFja1dvbiA9IHBsYXllcnNbMV0uYWlUdXJuKGJvYXJkc1swXSk7XG4gICAgICAgICAgICByZW5kZXJCb2FyZHMoYm9hcmRzLCB3ZWJCb2FyZHMsIHBsYXllcnMpO1xuICAgICAgICAgICAgaWYgKGFpQXR0YWNrV29uID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgIHJlbW92ZUNvbnRhaW5lckV2ZW50cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG4vLyBDaGVja2luZyBpZiBwbGF5ZXIgcGxhY2VkIGFsbCBzaGlwcyBiZWZvcmUgc3RhcnRpbmcgZ2FtZVxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrRm9yU3RhcnRpbmdHYW1lKGJvYXJkcywgd2ViQm9hcmRzLCBwbGF5ZXJzKSB7XG4gIGlmIChib2FyZHNbMF0uc2hpcHNMZW5ndGggPT09IDApIHtcbiAgICBjaGFuZ2VSb3RhdGVCdG4oKTtcbiAgICBzdGFydEdhbWUoYm9hcmRzLCB3ZWJCb2FyZHMsIHBsYXllcnMpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBzaG93V2lubmVyIH0gZnJvbSBcIi4vcmVuZGVyXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lYm9hcmQge1xuICBjb25zdHJ1Y3Rvcihpc0VuZW15KSB7XG4gICAgdGhpcy5ib2FyZCA9IFtdO1xuICAgIHRoaXMuaGl0c0JvYXJkID0gW107XG4gICAgdGhpcy5pc0VuZW15ID0gaXNFbmVteTtcbiAgICB0aGlzLnNoaXBzTGVuZ3RoID0gNTtcbiAgICB0aGlzLnN0YXJ0ID0gZmFsc2U7XG4gIH1cblxuICAvLyBHZW5lcmF0aW5nIDEweDEwIGdhbWVib2FyZFxuICBnZW5lcmF0ZUJvYXJkKHIgPSAxMCwgYyA9IDEwKSB7XG4gICAgdGhpcy5ib2FyZCA9IEFycmF5KHIpXG4gICAgICAuZmlsbCgwKVxuICAgICAgLm1hcCgoKSA9PiBBcnJheShjKS5maWxsKDApKTtcbiAgICB0aGlzLmhpdHNCb2FyZCA9IEFycmF5KHIpXG4gICAgICAuZmlsbChmYWxzZSlcbiAgICAgIC5tYXAoKCkgPT4gQXJyYXkoYykuZmlsbChmYWxzZSkpO1xuICB9XG5cbiAgLy8gUGxhY2luZyBzaGlwIGluIGdhbWVib2FyZFxuICBwbGFjZVNoaXAoc3RhcnQsIGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gICAgY29uc3QgbmV3U2hpcCA9IG5ldyBTaGlwKGxlbmd0aCk7XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgaWYgKHN0YXJ0WzBdICsgbGVuZ3RoID4gdGhpcy5ib2FyZC5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtzdGFydFswXSArIGldW3N0YXJ0WzFdXSAhPT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmJvYXJkW3N0YXJ0WzBdICsgaV1bc3RhcnRbMV1dID0gbmV3U2hpcDtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2hpcHNMZW5ndGgtLTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChkaXJlY3Rpb24gPT09IFwidmVydGljYWxcIikge1xuICAgICAgaWYgKHN0YXJ0WzFdICsgbGVuZ3RoID4gdGhpcy5ib2FyZC5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtzdGFydFswXV1bc3RhcnRbMV0gKyBpXSAhPT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmJvYXJkW3N0YXJ0WzBdXVtzdGFydFsxXSArIGldID0gbmV3U2hpcDtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2hpcHNMZW5ndGgtLTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBDaGVja2luZyBpZiByZWNlaXZlZCBhdHRhY2sgaGl0IHNoaXBcbiAgcmVjZWl2ZUF0dGFjayhjb29yZGluYXRlcykge1xuICAgIGNvbnN0IGNlbGwgPSB0aGlzLmJvYXJkW2Nvb3JkaW5hdGVzWzBdXVtjb29yZGluYXRlc1sxXV07XG4gICAgY29uc3QgY2VsbEhpdCA9IHRoaXMuaGl0c0JvYXJkW2Nvb3JkaW5hdGVzWzBdXVtjb29yZGluYXRlc1sxXV07XG4gICAgaWYgKGNlbGxIaXQgPT09IGZhbHNlKSB7XG4gICAgICBpZiAoY2VsbCAhPT0gMCkge1xuICAgICAgICBjZWxsLmhpdCgpO1xuICAgICAgICB0aGlzLmhpdHNCb2FyZFtjb29yZGluYXRlc1swXV1bY29vcmRpbmF0ZXNbMV1dID0gdHJ1ZTtcbiAgICAgICAgY2VsbC5pc1N1bmsoKTtcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tpbmdXaW4oKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGNvbnN0IHdpbm5lciA9IHRoaXMuaXNFbmVteSA9PT0gdHJ1ZSA/IFwiUGxheWVyXCIgOiBcIkNvbXB1dGVyXCI7XG4gICAgICAgICAgc2hvd1dpbm5lcih3aW5uZXIpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmhpdHNCb2FyZFtjb29yZGluYXRlc1swXV1bY29vcmRpbmF0ZXNbMV1dID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gQ2hlY2tpbmcgY29uZGl0aW9ucyBmb3Igd2luXG4gIGNoZWNraW5nV2luKCkge1xuICAgIGNvbnN0IHNoaXBzID0gW107XG4gICAgY29uc3QgZGVzdHJveWVkU2hpcHMgPSBbXTtcbiAgICB0aGlzLmJvYXJkLmZvckVhY2goKGVsZW1lbXQpID0+XG4gICAgICBlbGVtZW10LmZvckVhY2goKGVsZW0pID0+IHtcbiAgICAgICAgaWYgKGVsZW0gIT09IDApIHtcbiAgICAgICAgICBzaGlwcy5wdXNoKGVsZW0pO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzaGlwc1tpXS5zdW5rID09PSB0cnVlKSB7XG4gICAgICAgIGRlc3Ryb3llZFNoaXBzLnB1c2goc2hpcHNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2hpcHMubGVuZ3RoID09PSBkZXN0cm95ZWRTaGlwcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gIH1cblxuICAvLyBHZW5lcmF0aW5nIHJhbmRvbSBjb3JkcyBmb3IgY29tcHV0ZXIgc2hpcHNcbiAgZ2VuZXJhdGVSYW5kb21Db3JkcygpIHtcbiAgICBjb25zdCB4ID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogOSk7XG4gICAgY29uc3QgeSA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDkpO1xuICAgIHJldHVybiBbeCwgeV07XG4gIH1cblxuICAvLyBDb21wdXRlciBtYWtlcyBhdHRhY2sgYXQgcmFuZG9tIGNvb3JkaW5hdGVzXG4gIGFpVHVybihlbmVteUJvYXJkKSB7XG4gICAgbGV0IGNvcmRzO1xuICAgIGRvIHtcbiAgICAgIGNvcmRzID0gdGhpcy5nZW5lcmF0ZVJhbmRvbUNvcmRzKCk7XG4gICAgfSB3aGlsZSAoZW5lbXlCb2FyZC5oaXRzQm9hcmRbY29yZHNbMF1dW2NvcmRzWzFdXSA9PT0gdHJ1ZSk7XG4gICAgY29uc3QgdHVybiA9IGVuZW15Qm9hcmQucmVjZWl2ZUF0dGFjayhbY29yZHNbMF0sIGNvcmRzWzFdXSk7XG4gICAgcmV0dXJuIHR1cm47XG4gIH1cbn1cbiIsImltcG9ydCB7IGNoZWNrRm9yU3RhcnRpbmdHYW1lLCBnYW1lTG9vcCB9IGZyb20gXCIuL2dhbWVcIjtcbmltcG9ydCBnaXRodWJMb2dvIGZyb20gXCIuL2Fzc2V0cy9naXRodWItbG9nby5zdmdcIjtcblxuLy8gUmVuZGVyaW5nIHBhZ2Ugd2l0aCBib2FyZHNcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJQYWdlKGJvYXJkcywgcGxheWVycykge1xuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnRhaW5lclwiKTtcbiAgY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgY29uc3QgbWFpbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIG1haW4uY2xhc3NMaXN0LmFkZChcIm1haW5cIik7XG5cbiAgY29uc3Qgcm90YXRlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgcm90YXRlRGl2LmNsYXNzTGlzdC5hZGQoXCJyb3RhdGUtZGl2XCIpO1xuXG4gIGNvbnN0IHJvdGF0ZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gIHJvdGF0ZUJ0bi5jbGFzc0xpc3QuYWRkKFwicm90YXRlLWJ0blwiKTtcbiAgcm90YXRlQnRuLnRleHRDb250ZW50ID0gXCJSb3RhdGUgU2hpcFwiO1xuXG4gIGNvbnN0IGdhbWVib2FyZHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBnYW1lYm9hcmRzLmNsYXNzTGlzdC5hZGQoXCJnYW1lYm9hcmRzXCIpO1xuXG4gIGNvbnN0IGxlZnRCb2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGxlZnRCb2FyZC5jbGFzc0xpc3QuYWRkKFwibGVmdC1ib2FyZFwiKTtcblxuICBjb25zdCByaWdodEJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgcmlnaHRCb2FyZC5jbGFzc0xpc3QuYWRkKFwicmlnaHQtYm9hcmRcIik7XG5cbiAgY29uc3QgZm9vdGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgZm9vdGVyLmNsYXNzTGlzdC5hZGQoXCJmb290ZXJcIik7XG5cbiAgY29uc3QgcmVzdGFydEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gIHJlc3RhcnRCdG4uY2xhc3NMaXN0LmFkZChcInJlc3RhcnQtYnRuXCIpO1xuICByZXN0YXJ0QnRuLnRleHRDb250ZW50ID0gXCJSZXN0YXJ0IGdhbWVcIjtcblxuICBjb25zdCBjb3B5cmlnaHREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBjb3B5cmlnaHREaXYuY2xhc3NMaXN0LmFkZChcImNvcHlyaWdodC1kaXZcIik7XG5cbiAgY29uc3QgY29weXJpZ2h0VGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMlwiKTtcblxuICBjb3B5cmlnaHRUZXh0LmlubmVySFRNTCA9IGA8YSBocmVmID1cImh0dHBzOi8vZ2l0aHViLmNvbS9veGFteXRcIj4yMDI0IE94YW15dCAgPGltZyBjbGFzcz1cInN2Zy1sb2dvXCIgc3JjPVwiJHtnaXRodWJMb2dvfVwiIGFsdD1cImdpdGh1Yi1sb2dvXCI+IDwvYT5gO1xuXG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChtYWluKTtcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGZvb3Rlcik7XG4gIGZvb3Rlci5hcHBlbmRDaGlsZChyZXN0YXJ0QnRuKTtcbiAgZm9vdGVyLmFwcGVuZENoaWxkKGNvcHlyaWdodERpdik7XG4gIGNvcHlyaWdodERpdi5hcHBlbmRDaGlsZChjb3B5cmlnaHRUZXh0KTtcbiAgbWFpbi5hcHBlbmRDaGlsZChyb3RhdGVEaXYpO1xuICByb3RhdGVEaXYuYXBwZW5kQ2hpbGQocm90YXRlQnRuKTtcbiAgbWFpbi5hcHBlbmRDaGlsZChnYW1lYm9hcmRzKTtcbiAgZ2FtZWJvYXJkcy5hcHBlbmRDaGlsZChsZWZ0Qm9hcmQpO1xuICBnYW1lYm9hcmRzLmFwcGVuZENoaWxkKHJpZ2h0Qm9hcmQpO1xuXG4gIGF0dGFjaFJvdGF0ZUV2ZW50KHJvdGF0ZUJ0biwgYm9hcmRzLCBbbGVmdEJvYXJkLCByaWdodEJvYXJkXSwgcGxheWVycyk7XG4gIGF0dGFjaFJlc3RhcnRFdmVudChyZXN0YXJ0QnRuKTtcblxuICByZW5kZXJCb2FyZHMoYm9hcmRzLCBbbGVmdEJvYXJkLCByaWdodEJvYXJkXSwgcGxheWVycyk7XG59XG5cbi8vIFJlbmRlcmluZyBib2FyZHMgYmFzZWQgb24gZ2FtZWJvYXJkc1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckJvYXJkcyhib2FyZHMsIHdlYkJvYXJkcywgcGxheWVycykge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBpc1ZlcnRpY2FsID0gd2ViQm9hcmRzW2ldLmNsb3Nlc3QoXCIubWFpblwiKS5xdWVyeVNlbGVjdG9yKFwiLnJvdGF0ZS1idG5cIik7XG4gICAgaWYgKGlzVmVydGljYWwgIT09IG51bGwpIHtcbiAgICAgIGlzVmVydGljYWwgPSBpc1ZlcnRpY2FsLmhhc0F0dHJpYnV0ZShcInZlcnRpY2FsXCIpO1xuICAgIH1cblxuICAgIHdlYkJvYXJkc1tpXS5pbm5lckhUTUwgPSBcIlwiO1xuICAgIGZvciAobGV0IHggPSAwOyB4IDwgYm9hcmRzW2ldLmJvYXJkLmxlbmd0aDsgeCsrKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGJvYXJkc1tpXS5ib2FyZC5sZW5ndGg7IHkrKykge1xuICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKTtcblxuICAgICAgICBpZiAoYm9hcmRzW2ldLmJvYXJkW3hdW3ldICE9PSAwICYmIGJvYXJkc1tpXS5pc0VuZW15ID09PSBmYWxzZSlcbiAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgYm9hcmRzW2ldLmhpdHNCb2FyZFt4XVt5XSAhPT0gZmFsc2UgJiZcbiAgICAgICAgICBib2FyZHNbaV0uYm9hcmRbeF1beV0gIT09IDBcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29uc3Qgc2hpcCA9IGJvYXJkc1tpXS5ib2FyZFt4XVt5XTtcbiAgICAgICAgICBpZiAoc2hpcC5zdW5rID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJkZXN0cm95ZWRcIik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGJvYXJkc1tpXS5oaXRzQm9hcmRbeF1beV0gIT09IGZhbHNlICYmXG4gICAgICAgICAgYm9hcmRzW2ldLmJvYXJkW3hdW3ldID09PSAwXG4gICAgICAgICkge1xuICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcIm1pc3NcIik7XG4gICAgICAgIH1cblxuICAgICAgICBjZWxsLnNldEF0dHJpYnV0ZShcImRhdGEteFwiLCB4KTtcbiAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXlcIiwgeSk7XG5cbiAgICAgICAgaWYgKGJvYXJkc1tpXS5zaGlwc0xlbmd0aCAhPT0gMCkge1xuICAgICAgICAgIGlmICh3ZWJCb2FyZHNbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKFwibGVmdC1ib2FyZFwiKSkge1xuICAgICAgICAgICAgYXR0YWNoQ2VsbHNIaWdobGlnaHQoYm9hcmRzLCB3ZWJCb2FyZHMsIGNlbGwsIGlzVmVydGljYWwpO1xuXG4gICAgICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBjbGlja2VkWCA9IHBhcnNlSW50KGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEteFwiKSk7XG4gICAgICAgICAgICAgIGNvbnN0IGNsaWNrZWRZID0gcGFyc2VJbnQoZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS15XCIpKTtcbiAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gaXNWZXJ0aWNhbCA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiO1xuXG4gICAgICAgICAgICAgIGlmICghY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoXCJzaGlwXCIpKSB7XG4gICAgICAgICAgICAgICAgYm9hcmRzW2ldLnBsYWNlU2hpcChcbiAgICAgICAgICAgICAgICAgIFtjbGlja2VkWCwgY2xpY2tlZFldLFxuICAgICAgICAgICAgICAgICAgYm9hcmRzW2ldLnNoaXBzTGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICByZW1vdmVIaWdobGlnaHQod2ViQm9hcmRzW2ldKTtcbiAgICAgICAgICAgICAgICBjaGVja0ZvclN0YXJ0aW5nR2FtZShib2FyZHMsIHdlYkJvYXJkcywgcGxheWVycyk7XG4gICAgICAgICAgICAgICAgcmVuZGVyQm9hcmRzKGJvYXJkcywgd2ViQm9hcmRzLCBwbGF5ZXJzKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHdlYkJvYXJkc1tpXS5hcHBlbmRDaGlsZChjZWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLy8gSGlnaGxpZ2h0aW5nIGNlbGxzIHdoZW4gcGxheWVyIGlzIHBsYWNpbmcgc2hpcHNcbmZ1bmN0aW9uIGhpZ2hsaWdodENlbGxzKGJvYXJkRE9NLCBob3ZlclgsIGhvdmVyWSwgZGlyZWN0aW9uLCBzaGlwTGVuZ3RoKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgeCA9IGRpcmVjdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiID8gaG92ZXJYICsgaSA6IGhvdmVyWDtcbiAgICBjb25zdCB5ID0gZGlyZWN0aW9uID09PSBcInZlcnRpY2FsXCIgPyBob3ZlclkgOiBob3ZlclkgKyBpO1xuICAgIGNvbnN0IGNlbGwgPSBib2FyZERPTS5xdWVyeVNlbGVjdG9yKGAuY2VsbFtkYXRhLXg9XCIke3h9XCJdW2RhdGEteT1cIiR7eX1cIl1gKTtcbiAgICBpZiAoY2VsbCA9PT0gbnVsbCkgcmV0dXJuO1xuICAgIGlmICghY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoXCJzaGlwXCIpKSB7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJoaWdobGlnaHRcIik7XG4gICAgfSBlbHNlIGlmIChjZWxsLmNsYXNzTGlzdC5jb250YWlucyhcInNoaXBcIikgPT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbn1cblxuLy8gUmVtb3ZlIGhpZ2hsaWdodGluZyBjZWxsc1xuZnVuY3Rpb24gcmVtb3ZlSGlnaGxpZ2h0KGJvYXJkRE9NKSB7XG4gIGJvYXJkRE9NLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaGlnaGxpZ2h0XCIpLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWdobGlnaHRcIik7XG4gIH0pO1xufVxuXG4vLyBBdHRhY2hpbmcgcm90YXRlIGV2ZW50IHRvIHJvdGF0ZSBidG4gdG8gYWxsb3cgcGxheWVyIGNoYW5nZSBkaXJlY3Rpb24gd2hlbiBwbGFjaW5nIHNoaXBzXG5mdW5jdGlvbiBhdHRhY2hSb3RhdGVFdmVudChyb3RhdGVCdG4sIGJvYXJkcywgd2ViQm9hcmRzLCBwbGF5ZXJzKSB7XG4gIHJvdGF0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIHJvdGF0ZUJ0bi50b2dnbGVBdHRyaWJ1dGUoXCJ2ZXJ0aWNhbFwiKTtcbiAgICByZW5kZXJCb2FyZHMoYm9hcmRzLCBbd2ViQm9hcmRzWzBdLCB3ZWJCb2FyZHNbMV1dLCBwbGF5ZXJzKTtcbiAgfSk7XG59XG5cbi8vIENhbGN1bGF0aW5nIGNlbGxzIHdoaWNoIGFyZSBoaWdobGlnaHRlZFxuZnVuY3Rpb24gYXR0YWNoQ2VsbHNIaWdobGlnaHQoYm9hcmRzLCB3ZWJCb2FyZHMsIGNlbGwsIGlzVmVydGljYWwpIHtcbiAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCAoZSkgPT4ge1xuICAgIGNvbnN0IGhvdmVyWCA9IHBhcnNlSW50KGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEteFwiKSk7XG4gICAgY29uc3QgaG92ZXJZID0gcGFyc2VJbnQoZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS15XCIpKTtcbiAgICBjb25zdCBkaXJlY3Rpb24gPSBpc1ZlcnRpY2FsID8gXCJob3Jpem9udGFsXCIgOiBcInZlcnRpY2FsXCI7XG4gICAgaGlnaGxpZ2h0Q2VsbHMoXG4gICAgICB3ZWJCb2FyZHNbMF0sXG4gICAgICBob3ZlclgsXG4gICAgICBob3ZlclksXG4gICAgICBkaXJlY3Rpb24sXG4gICAgICBib2FyZHNbMF0uc2hpcHNMZW5ndGgsXG4gICAgKTtcbiAgfSk7XG5cbiAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PiB7XG4gICAgcmVtb3ZlSGlnaGxpZ2h0KHdlYkJvYXJkc1swXSk7XG4gIH0pO1xufVxuXG4vLyBBdHRhY2hpbmcgcmVzdGFydCBnYW1lIGV2ZW50IHRvIHJlc3RhcnQgYnRuXG5mdW5jdGlvbiBhdHRhY2hSZXN0YXJ0RXZlbnQocmVzdGFydEJ0bikge1xuICByZXN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgZ2FtZUxvb3AoKTtcbiAgfSk7XG59XG5cbi8vIENoYW5naW5nIHJvdGF0ZSBidG4gdG8gaW5kaWNhdGUgdG8gdGhlIHBsYXllciB0aGF0IGhlIGNhbiBzdGFydCBzaG9vdGluZ1xuZXhwb3J0IGZ1bmN0aW9uIGNoYW5nZVJvdGF0ZUJ0bigpIHtcbiAgY29uc3Qgcm90YXRlRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yb3RhdGUtZGl2XCIpO1xuICBjb25zdCByb3RhdGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJvdGF0ZS1idG5cIik7XG4gIHJvdGF0ZURpdi5yZW1vdmVDaGlsZChyb3RhdGVCdG4pO1xuICBjb25zdCBzdGFydFNob290aW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuICBzdGFydFNob290aW5nLnRleHRDb250ZW50ID0gXCJTdGFydCBTaG9vdGluZ1wiO1xuICBzdGFydFNob290aW5nLmNsYXNzTGlzdC5hZGQoXCJzdGFydC1zaG9vdGluZ1wiKTtcbiAgcm90YXRlRGl2LmFwcGVuZENoaWxkKHN0YXJ0U2hvb3RpbmcpO1xufVxuXG4vLyBSZW5kZXJpbmcgd2lubmVyIG9uIHBhZ2VcbmV4cG9ydCBmdW5jdGlvbiBzaG93V2lubmVyKHdpbm5lcikge1xuICBjb25zdCBzdGFydFNob290aW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdGFydC1zaG9vdGluZ1wiKTtcbiAgc3RhcnRTaG9vdGluZy50ZXh0Q29udGVudCA9IGAke3dpbm5lcn0gd29uYDtcbn1cblxuLy8gRGlzYWJsaW5nIGFsbCBldmVudHMgYWZ0ZXIgc29tZW9uZSB3b25cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVDb250YWluZXJFdmVudHMoKSB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udGFpbmVyXCIpO1xuICBjb250YWluZXIucmVwbGFjZVdpdGgoY29udGFpbmVyLmNsb25lTm9kZSh0cnVlKSk7XG4gIGF0dGFjaFJlc3RhcnRFdmVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJlc3RhcnQtYnRuXCIpKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXAge1xuICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB0aGlzLmhpdHMgPSAwO1xuICAgIHRoaXMuc3VuayA9IGZhbHNlO1xuICB9XG5cbiAgLy8gQWRkaW5nIGhpdCB0byB0aGUgc2hpcFxuICBoaXQoKSB7XG4gICAgdGhpcy5oaXRzKys7XG4gIH1cblxuICAvLyBDaGVja2luZyBpZiBzaGlwIGhhcyBzdW5rXG4gIGlzU3VuaygpIHtcbiAgICBpZiAodGhpcy5oaXRzID09PSB0aGlzLmxlbmd0aCkge1xuICAgICAgdGhpcy5zdW5rID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgLyohIG5vcm1hbGl6ZS5jc3MgdjguMC4xIHwgTUlUIExpY2Vuc2UgfCBnaXRodWIuY29tL25lY29sYXMvbm9ybWFsaXplLmNzcyAqL1xuXG4vKiBEb2N1bWVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBQcmV2ZW50IGFkanVzdG1lbnRzIG9mIGZvbnQgc2l6ZSBhZnRlciBvcmllbnRhdGlvbiBjaGFuZ2VzIGluIGlPUy5cbiAqL1xuXG5odG1sIHtcbiAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cbiAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXG59XG5cbi8qIFNlY3Rpb25zXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgbWFyZ2luIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5ib2R5IHtcbiAgbWFyZ2luOiAwO1xufVxuXG4vKipcbiAqIFJlbmRlciB0aGUgXFxgbWFpblxcYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cbiAqL1xuXG5tYWluIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gXFxgaDFcXGAgZWxlbWVudHMgd2l0aGluIFxcYHNlY3Rpb25cXGAgYW5kXG4gKiBcXGBhcnRpY2xlXFxgIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cbiAqL1xuXG5oMSB7XG4gIGZvbnQtc2l6ZTogMmVtO1xuICBtYXJnaW46IDAuNjdlbSAwO1xufVxuXG4vKiBHcm91cGluZyBjb250ZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXG4gKiAyLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlIGFuZCBJRS5cbiAqL1xuXG5ociB7XG4gIGJveC1zaXppbmc6IGNvbnRlbnQtYm94OyAvKiAxICovXG4gIGhlaWdodDogMDsgLyogMSAqL1xuICBvdmVyZmxvdzogdmlzaWJsZTsgLyogMiAqL1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgXFxgZW1cXGAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbnByZSB7XG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xuICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xufVxuXG4vKiBUZXh0LWxldmVsIHNlbWFudGljc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdyYXkgYmFja2dyb3VuZCBvbiBhY3RpdmUgbGlua3MgaW4gSUUgMTAuXG4gKi9cblxuYSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xufVxuXG4vKipcbiAqIDEuIFJlbW92ZSB0aGUgYm90dG9tIGJvcmRlciBpbiBDaHJvbWUgNTctXG4gKiAyLiBBZGQgdGhlIGNvcnJlY3QgdGV4dCBkZWNvcmF0aW9uIGluIENocm9tZSwgRWRnZSwgSUUsIE9wZXJhLCBhbmQgU2FmYXJpLlxuICovXG5cbmFiYnJbdGl0bGVdIHtcbiAgYm9yZGVyLWJvdHRvbTogbm9uZTsgLyogMSAqL1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsgLyogMiAqL1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSBkb3R0ZWQ7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxuICovXG5cbmIsXG5zdHJvbmcge1xuICBmb250LXdlaWdodDogYm9sZGVyO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgXFxgZW1cXGAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbmNvZGUsXG5rYmQsXG5zYW1wIHtcbiAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXG4gIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuc21hbGwge1xuICBmb250LXNpemU6IDgwJTtcbn1cblxuLyoqXG4gKiBQcmV2ZW50IFxcYHN1YlxcYCBhbmQgXFxgc3VwXFxgIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpblxuICogYWxsIGJyb3dzZXJzLlxuICovXG5cbnN1YixcbnN1cCB7XG4gIGZvbnQtc2l6ZTogNzUlO1xuICBsaW5lLWhlaWdodDogMDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG59XG5cbnN1YiB7XG4gIGJvdHRvbTogLTAuMjVlbTtcbn1cblxuc3VwIHtcbiAgdG9wOiAtMC41ZW07XG59XG5cbi8qIEVtYmVkZGVkIGNvbnRlbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC5cbiAqL1xuXG5pbWcge1xuICBib3JkZXItc3R5bGU6IG5vbmU7XG59XG5cbi8qIEZvcm1zXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIDEuIENoYW5nZSB0aGUgZm9udCBzdHlsZXMgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gRmlyZWZveCBhbmQgU2FmYXJpLlxuICovXG5cbmJ1dHRvbixcbmlucHV0LFxub3B0Z3JvdXAsXG5zZWxlY3QsXG50ZXh0YXJlYSB7XG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0OyAvKiAxICovXG4gIGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xuICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xuICBtYXJnaW46IDA7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cbiAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXG4gKi9cblxuYnV0dG9uLFxuaW5wdXQgeyAvKiAxICovXG4gIG92ZXJmbG93OiB2aXNpYmxlO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxuICogMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxuICovXG5cbmJ1dHRvbixcbnNlbGVjdCB7IC8qIDEgKi9cbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbiAqL1xuXG5idXR0b24sXG5bdHlwZT1cImJ1dHRvblwiXSxcblt0eXBlPVwicmVzZXRcIl0sXG5bdHlwZT1cInN1Ym1pdFwiXSB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXG4gKi9cblxuYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJidXR0b25cIl06Oi1tb3otZm9jdXMtaW5uZXIsXG5bdHlwZT1cInJlc2V0XCJdOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJzdWJtaXRcIl06Oi1tb3otZm9jdXMtaW5uZXIge1xuICBib3JkZXItc3R5bGU6IG5vbmU7XG4gIHBhZGRpbmc6IDA7XG59XG5cbi8qKlxuICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxuICovXG5cbmJ1dHRvbjotbW96LWZvY3VzcmluZyxcblt0eXBlPVwiYnV0dG9uXCJdOi1tb3otZm9jdXNyaW5nLFxuW3R5cGU9XCJyZXNldFwiXTotbW96LWZvY3VzcmluZyxcblt0eXBlPVwic3VibWl0XCJdOi1tb3otZm9jdXNyaW5nIHtcbiAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cbiAqL1xuXG5maWVsZHNldCB7XG4gIHBhZGRpbmc6IDAuMzVlbSAwLjc1ZW0gMC42MjVlbTtcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxuICogMi4gQ29ycmVjdCB0aGUgY29sb3IgaW5oZXJpdGFuY2UgZnJvbSBcXGBmaWVsZHNldFxcYCBlbGVtZW50cyBpbiBJRS5cbiAqIDMuIFJlbW92ZSB0aGUgcGFkZGluZyBzbyBkZXZlbG9wZXJzIGFyZSBub3QgY2F1Z2h0IG91dCB3aGVuIHRoZXkgemVybyBvdXRcbiAqICAgIFxcYGZpZWxkc2V0XFxgIGVsZW1lbnRzIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5sZWdlbmQge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXG4gIGNvbG9yOiBpbmhlcml0OyAvKiAyICovXG4gIGRpc3BsYXk6IHRhYmxlOyAvKiAxICovXG4gIG1heC13aWR0aDogMTAwJTsgLyogMSAqL1xuICBwYWRkaW5nOiAwOyAvKiAzICovXG4gIHdoaXRlLXNwYWNlOiBub3JtYWw7IC8qIDEgKi9cbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgdmVydGljYWwgYWxpZ25tZW50IGluIENocm9tZSwgRmlyZWZveCwgYW5kIE9wZXJhLlxuICovXG5cbnByb2dyZXNzIHtcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgZGVmYXVsdCB2ZXJ0aWNhbCBzY3JvbGxiYXIgaW4gSUUgMTArLlxuICovXG5cbnRleHRhcmVhIHtcbiAgb3ZlcmZsb3c6IGF1dG87XG59XG5cbi8qKlxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gSUUgMTAuXG4gKiAyLiBSZW1vdmUgdGhlIHBhZGRpbmcgaW4gSUUgMTAuXG4gKi9cblxuW3R5cGU9XCJjaGVja2JveFwiXSxcblt0eXBlPVwicmFkaW9cIl0ge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXG4gIHBhZGRpbmc6IDA7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBDaHJvbWUuXG4gKi9cblxuW3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXG5bdHlwZT1cIm51bWJlclwiXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XG4gIGhlaWdodDogYXV0bztcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cbiAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxuICovXG5cblt0eXBlPVwic2VhcmNoXCJdIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7IC8qIDEgKi9cbiAgb3V0bGluZS1vZmZzZXQ6IC0ycHg7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXG4gKi9cblxuW3R5cGU9XCJzZWFyY2hcIl06Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb24ge1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbiAqIDIuIENoYW5nZSBmb250IHByb3BlcnRpZXMgdG8gXFxgaW5oZXJpdFxcYCBpbiBTYWZhcmkuXG4gKi9cblxuOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uOyAvKiAxICovXG4gIGZvbnQ6IGluaGVyaXQ7IC8qIDIgKi9cbn1cblxuLyogSW50ZXJhY3RpdmVcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSAxMCssIGFuZCBGaXJlZm94LlxuICovXG5cbmRldGFpbHMge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuLypcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5zdW1tYXJ5IHtcbiAgZGlzcGxheTogbGlzdC1pdGVtO1xufVxuXG4vKiBNaXNjXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cbiAqL1xuXG50ZW1wbGF0ZSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXG4gKi9cblxuW2hpZGRlbl0ge1xuICBkaXNwbGF5OiBub25lO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9ub2RlX21vZHVsZXMvbm9ybWFsaXplLmNzcy9ub3JtYWxpemUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBLDJFQUEyRTs7QUFFM0U7K0VBQytFOztBQUUvRTs7O0VBR0U7O0FBRUY7RUFDRSxpQkFBaUIsRUFBRSxNQUFNO0VBQ3pCLDhCQUE4QixFQUFFLE1BQU07QUFDeEM7O0FBRUE7K0VBQytFOztBQUUvRTs7RUFFRTs7QUFFRjtFQUNFLFNBQVM7QUFDWDs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLGNBQWM7QUFDaEI7O0FBRUE7OztFQUdFOztBQUVGO0VBQ0UsY0FBYztFQUNkLGdCQUFnQjtBQUNsQjs7QUFFQTsrRUFDK0U7O0FBRS9FOzs7RUFHRTs7QUFFRjtFQUNFLHVCQUF1QixFQUFFLE1BQU07RUFDL0IsU0FBUyxFQUFFLE1BQU07RUFDakIsaUJBQWlCLEVBQUUsTUFBTTtBQUMzQjs7QUFFQTs7O0VBR0U7O0FBRUY7RUFDRSxpQ0FBaUMsRUFBRSxNQUFNO0VBQ3pDLGNBQWMsRUFBRSxNQUFNO0FBQ3hCOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7RUFDRSw2QkFBNkI7QUFDL0I7O0FBRUE7OztFQUdFOztBQUVGO0VBQ0UsbUJBQW1CLEVBQUUsTUFBTTtFQUMzQiwwQkFBMEIsRUFBRSxNQUFNO0VBQ2xDLGlDQUFpQyxFQUFFLE1BQU07QUFDM0M7O0FBRUE7O0VBRUU7O0FBRUY7O0VBRUUsbUJBQW1CO0FBQ3JCOztBQUVBOzs7RUFHRTs7QUFFRjs7O0VBR0UsaUNBQWlDLEVBQUUsTUFBTTtFQUN6QyxjQUFjLEVBQUUsTUFBTTtBQUN4Qjs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLGNBQWM7QUFDaEI7O0FBRUE7OztFQUdFOztBQUVGOztFQUVFLGNBQWM7RUFDZCxjQUFjO0VBQ2Qsa0JBQWtCO0VBQ2xCLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxXQUFXO0FBQ2I7O0FBRUE7K0VBQytFOztBQUUvRTs7RUFFRTs7QUFFRjtFQUNFLGtCQUFrQjtBQUNwQjs7QUFFQTsrRUFDK0U7O0FBRS9FOzs7RUFHRTs7QUFFRjs7Ozs7RUFLRSxvQkFBb0IsRUFBRSxNQUFNO0VBQzVCLGVBQWUsRUFBRSxNQUFNO0VBQ3ZCLGlCQUFpQixFQUFFLE1BQU07RUFDekIsU0FBUyxFQUFFLE1BQU07QUFDbkI7O0FBRUE7OztFQUdFOztBQUVGO1FBQ1EsTUFBTTtFQUNaLGlCQUFpQjtBQUNuQjs7QUFFQTs7O0VBR0U7O0FBRUY7U0FDUyxNQUFNO0VBQ2Isb0JBQW9CO0FBQ3RCOztBQUVBOztFQUVFOztBQUVGOzs7O0VBSUUsMEJBQTBCO0FBQzVCOztBQUVBOztFQUVFOztBQUVGOzs7O0VBSUUsa0JBQWtCO0VBQ2xCLFVBQVU7QUFDWjs7QUFFQTs7RUFFRTs7QUFFRjs7OztFQUlFLDhCQUE4QjtBQUNoQzs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLDhCQUE4QjtBQUNoQzs7QUFFQTs7Ozs7RUFLRTs7QUFFRjtFQUNFLHNCQUFzQixFQUFFLE1BQU07RUFDOUIsY0FBYyxFQUFFLE1BQU07RUFDdEIsY0FBYyxFQUFFLE1BQU07RUFDdEIsZUFBZSxFQUFFLE1BQU07RUFDdkIsVUFBVSxFQUFFLE1BQU07RUFDbEIsbUJBQW1CLEVBQUUsTUFBTTtBQUM3Qjs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLHdCQUF3QjtBQUMxQjs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLGNBQWM7QUFDaEI7O0FBRUE7OztFQUdFOztBQUVGOztFQUVFLHNCQUFzQixFQUFFLE1BQU07RUFDOUIsVUFBVSxFQUFFLE1BQU07QUFDcEI7O0FBRUE7O0VBRUU7O0FBRUY7O0VBRUUsWUFBWTtBQUNkOztBQUVBOzs7RUFHRTs7QUFFRjtFQUNFLDZCQUE2QixFQUFFLE1BQU07RUFDckMsb0JBQW9CLEVBQUUsTUFBTTtBQUM5Qjs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLHdCQUF3QjtBQUMxQjs7QUFFQTs7O0VBR0U7O0FBRUY7RUFDRSwwQkFBMEIsRUFBRSxNQUFNO0VBQ2xDLGFBQWEsRUFBRSxNQUFNO0FBQ3ZCOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7RUFDRSxjQUFjO0FBQ2hCOztBQUVBOztFQUVFOztBQUVGO0VBQ0Usa0JBQWtCO0FBQ3BCOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7RUFDRSxhQUFhO0FBQ2Y7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSxhQUFhO0FBQ2ZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLyohIG5vcm1hbGl6ZS5jc3MgdjguMC4xIHwgTUlUIExpY2Vuc2UgfCBnaXRodWIuY29tL25lY29sYXMvbm9ybWFsaXplLmNzcyAqL1xcblxcbi8qIERvY3VtZW50XFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXFxuICovXFxuXFxuaHRtbCB7XFxuICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcbiAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXFxufVxcblxcbi8qIFNlY3Rpb25zXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuYm9keSB7XFxuICBtYXJnaW46IDA7XFxufVxcblxcbi8qKlxcbiAqIFJlbmRlciB0aGUgYG1haW5gIGVsZW1lbnQgY29uc2lzdGVudGx5IGluIElFLlxcbiAqL1xcblxcbm1haW4ge1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIGZvbnQgc2l6ZSBhbmQgbWFyZ2luIG9uIGBoMWAgZWxlbWVudHMgd2l0aGluIGBzZWN0aW9uYCBhbmRcXG4gKiBgYXJ0aWNsZWAgY29udGV4dHMgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmgxIHtcXG4gIGZvbnQtc2l6ZTogMmVtO1xcbiAgbWFyZ2luOiAwLjY3ZW0gMDtcXG59XFxuXFxuLyogR3JvdXBpbmcgY29udGVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gRmlyZWZveC5cXG4gKiAyLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlIGFuZCBJRS5cXG4gKi9cXG5cXG5ociB7XFxuICBib3gtc2l6aW5nOiBjb250ZW50LWJveDsgLyogMSAqL1xcbiAgaGVpZ2h0OiAwOyAvKiAxICovXFxuICBvdmVyZmxvdzogdmlzaWJsZTsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5wcmUge1xcbiAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXFxuICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbn1cXG5cXG4vKiBUZXh0LWxldmVsIHNlbWFudGljc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxcbiAqL1xcblxcbmEge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxufVxcblxcbi8qKlxcbiAqIDEuIFJlbW92ZSB0aGUgYm90dG9tIGJvcmRlciBpbiBDaHJvbWUgNTctXFxuICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5hYmJyW3RpdGxlXSB7XFxuICBib3JkZXItYm90dG9tOiBub25lOyAvKiAxICovXFxuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsgLyogMiAqL1xcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHdlaWdodCBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYixcXG5zdHJvbmcge1xcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuY29kZSxcXG5rYmQsXFxuc2FtcCB7XFxuICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG4gIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbnNtYWxsIHtcXG4gIGZvbnQtc2l6ZTogODAlO1xcbn1cXG5cXG4vKipcXG4gKiBQcmV2ZW50IGBzdWJgIGFuZCBgc3VwYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cXG4gKiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuc3ViLFxcbnN1cCB7XFxuICBmb250LXNpemU6IDc1JTtcXG4gIGxpbmUtaGVpZ2h0OiAwO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG5cXG5zdWIge1xcbiAgYm90dG9tOiAtMC4yNWVtO1xcbn1cXG5cXG5zdXAge1xcbiAgdG9wOiAtMC41ZW07XFxufVxcblxcbi8qIEVtYmVkZGVkIGNvbnRlbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXFxuICovXFxuXFxuaW1nIHtcXG4gIGJvcmRlci1zdHlsZTogbm9uZTtcXG59XFxuXFxuLyogRm9ybXNcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIENoYW5nZSB0aGUgZm9udCBzdHlsZXMgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5idXR0b24sXFxuaW5wdXQsXFxub3B0Z3JvdXAsXFxuc2VsZWN0LFxcbnRleHRhcmVhIHtcXG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0OyAvKiAxICovXFxuICBmb250LXNpemU6IDEwMCU7IC8qIDEgKi9cXG4gIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuICBtYXJnaW46IDA7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogU2hvdyB0aGUgb3ZlcmZsb3cgaW4gSUUuXFxuICogMS4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZS5cXG4gKi9cXG5cXG5idXR0b24sXFxuaW5wdXQgeyAvKiAxICovXFxuICBvdmVyZmxvdzogdmlzaWJsZTtcXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBFZGdlLCBGaXJlZm94LCBhbmQgSUUuXFxuICogMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxcbiAqL1xcblxcbmJ1dHRvbixcXG5zZWxlY3QgeyAvKiAxICovXFxuICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcXG59XFxuXFxuLyoqXFxuICogQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5idXR0b24sXFxuW3R5cGU9XFxcImJ1dHRvblxcXCJdLFxcblt0eXBlPVxcXCJyZXNldFxcXCJdLFxcblt0eXBlPVxcXCJzdWJtaXRcXFwiXSB7XFxuICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBpbm5lciBib3JkZXIgYW5kIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gKi9cXG5cXG5idXR0b246Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcImJ1dHRvblxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcblt0eXBlPVxcXCJyZXNldFxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcblt0eXBlPVxcXCJzdWJtaXRcXFwiXTo6LW1vei1mb2N1cy1pbm5lciB7XFxuICBib3JkZXItc3R5bGU6IG5vbmU7XFxuICBwYWRkaW5nOiAwO1xcbn1cXG5cXG4vKipcXG4gKiBSZXN0b3JlIHRoZSBmb2N1cyBzdHlsZXMgdW5zZXQgYnkgdGhlIHByZXZpb3VzIHJ1bGUuXFxuICovXFxuXFxuYnV0dG9uOi1tb3otZm9jdXNyaW5nLFxcblt0eXBlPVxcXCJidXR0b25cXFwiXTotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwicmVzZXRcXFwiXTotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwic3VibWl0XFxcIl06LW1vei1mb2N1c3Jpbmcge1xcbiAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xcbn1cXG5cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBwYWRkaW5nIGluIEZpcmVmb3guXFxuICovXFxuXFxuZmllbGRzZXQge1xcbiAgcGFkZGluZzogMC4zNWVtIDAuNzVlbSAwLjYyNWVtO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxcbiAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBJRS5cXG4gKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XFxuICogICAgYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxubGVnZW5kIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cXG4gIGNvbG9yOiBpbmhlcml0OyAvKiAyICovXFxuICBkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xcbiAgbWF4LXdpZHRoOiAxMDAlOyAvKiAxICovXFxuICBwYWRkaW5nOiAwOyAvKiAzICovXFxuICB3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXFxuICovXFxuXFxucHJvZ3Jlc3Mge1xcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cXG4gKi9cXG5cXG50ZXh0YXJlYSB7XFxuICBvdmVyZmxvdzogYXV0bztcXG59XFxuXFxuLyoqXFxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gSUUgMTAuXFxuICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxcbiAqL1xcblxcblt0eXBlPVxcXCJjaGVja2JveFxcXCJdLFxcblt0eXBlPVxcXCJyYWRpb1xcXCJdIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cXG4gIHBhZGRpbmc6IDA7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxcbiAqL1xcblxcblt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcXG5bdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xcbiAgaGVpZ2h0OiBhdXRvO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cXG4gKiAyLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cXG4gKi9cXG5cXG5bdHlwZT1cXFwic2VhcmNoXFxcIl0ge1xcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7IC8qIDEgKi9cXG4gIG91dGxpbmUtb2Zmc2V0OiAtMnB4OyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgaW5uZXIgcGFkZGluZyBpbiBDaHJvbWUgYW5kIFNhZmFyaSBvbiBtYWNPUy5cXG4gKi9cXG5cXG5bdHlwZT1cXFwic2VhcmNoXFxcIl06Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb24ge1xcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxcbiAqIDIuIENoYW5nZSBmb250IHByb3BlcnRpZXMgdG8gYGluaGVyaXRgIGluIFNhZmFyaS5cXG4gKi9cXG5cXG46Oi13ZWJraXQtZmlsZS11cGxvYWQtYnV0dG9uIHtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uOyAvKiAxICovXFxuICBmb250OiBpbmhlcml0OyAvKiAyICovXFxufVxcblxcbi8qIEludGVyYWN0aXZlXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIEVkZ2UsIElFIDEwKywgYW5kIEZpcmVmb3guXFxuICovXFxuXFxuZGV0YWlscyB7XFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuLypcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuc3VtbWFyeSB7XFxuICBkaXNwbGF5OiBsaXN0LWl0ZW07XFxufVxcblxcbi8qIE1pc2NcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cXG4gKi9cXG5cXG50ZW1wbGF0ZSB7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMC5cXG4gKi9cXG5cXG5baGlkZGVuXSB7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BVF9SVUxFX0lNUE9SVF8wX19fIGZyb20gXCItIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uL25vZGVfbW9kdWxlcy9ub3JtYWxpemUuY3NzL25vcm1hbGl6ZS5jc3NcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18gPSBuZXcgVVJMKFwiZm9udHMvUm9ib3RvLUJvbGQudHRmXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzFfX18gPSBuZXcgVVJMKFwiZm9udHMvUm9ib3RvLVJlZ3VsYXIudHRmXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5pKF9fX0NTU19MT0FERVJfQVRfUlVMRV9JTVBPUlRfMF9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzFfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8xX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgQGZvbnQtZmFjZSB7XG4gIGZvbnQtZmFtaWx5OiBcIlJvYm90b1wiO1xuICBzcmM6IHVybCgke19fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX199KTtcbiAgc3JjOiB1cmwoJHtfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8xX19ffSk7XG59XG5cbjpyb290IHtcbiAgLS1tYWluLWJvcmRlci1jb2xvcjogIzQ5NTA1NztcbiAgLS1tYWluLXRleHQtY29sb3I6ICMzMzMzMzM7XG59XG5cbmJvZHkge1xuICBtaW4taGVpZ2h0OiAxMDB2aDtcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIGxlZnQsICNmOGY2ZTMsICNhY2UyZTEpO1xuICBmb250LWZhbWlseTogXCJSb2JvdG9cIjtcbiAgY29sb3I6IHZhcigtLW1haW4tdGV4dC1jb2xvcik7XG59XG5cbi5jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBtaW4taGVpZ2h0OiAxMDB2aDtcbn1cblxuLmhlYWRlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBwYWRkaW5nLXRvcDogNXJlbTtcbiAgd2lkdGg6IDEwMCU7XG59XG5cbi5nYW1lLW5hbWUge1xuICBmb250LXNpemU6IDRyZW07XG59XG5cbi5uYW1lIHtcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbWFpbi1ib3JkZXItY29sb3IpO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYTJkMmZmO1xuICB3aWR0aDogMjByZW07XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgYm9yZGVyLXJhZGl1czogMC4ycmVtO1xufVxuXG4uc3RhcnQtYnRuIHtcbiAgcGFkZGluZy10b3A6IDNyZW07XG59XG5cbi5zdGFydCB7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbWFpbi1ib3JkZXItY29sb3IpO1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICBmb250LXNpemU6IDJyZW07XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgb3V0bGluZTogbm9uZTtcbn1cblxuLnN0YXJ0OmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2MwZmFmZjtcbiAgcGFkZGluZy1sZWZ0OiAzcmVtO1xuICBwYWRkaW5nLXJpZ2h0OiAzcmVtO1xuICB0cmFuc2l0aW9uOiAwLjZzO1xufVxuXG4ubWFpbiB7XG4gIG1hcmdpbi10b3A6IDNyZW07XG4gIG1pbi1oZWlnaHQ6IDUwdmg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5yb3RhdGUtYnRuIHtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICBmb250LXNpemU6IDMuNXJlbTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgb3V0bGluZTogbm9uZTtcbiAgd2lkdGg6IDI1cmVtO1xuICBoZWlnaHQ6IDVyZW07XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgYm9yZGVyLXJhZGl1czogOXB4O1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG59XG5cbi5yb3RhdGUtYnRuOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2UwZmNmZjtcbiAgdHJhbnNpdGlvbjogMC42cztcbn1cblxuLmdhbWVib2FyZHMge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIHdpZHRoOiA2NSU7XG4gIGhlaWdodDogMTAwJTtcbiAgbWFyZ2luLXRvcDogMnJlbTtcbn1cblxuLnJpZ2h0LWJvYXJkLFxuLmxlZnQtYm9hcmQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgb3V0bGluZTogbm9uZTtcbiAgd2lkdGg6IDkwJTtcbiAgYXNwZWN0LXJhdGlvOiAxO1xuICBtYXgtd2lkdGg6IDYwMHB4O1xuICBtYXgtaGVpZ2h0OiA2MDBweDtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTAsIDFmcik7XG4gIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDEwLCAxZnIpO1xuICBnYXA6IDA7XG4gIG1hcmdpbjogMXJlbTtcbiAgbWFyZ2luLXRvcDogMnJlbTtcbn1cblxuLmNlbGwge1xuICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1tYWluLWJvcmRlci1jb2xvcik7XG4gIG1heC1oZWlnaHQ6IDEwMCU7XG4gIG1heC13aWR0aDogMTAwJTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG59XG5cbi5yaWdodC1ib2FyZCAuY2VsbCB7XG4gIGN1cnNvcjogY3Jvc3NoYWlyO1xufVxuXG4ucmlnaHQtYm9hcmQgLmNlbGw6bm90KC5taXNzKTpub3QoLmhpdCk6bm90KC5kZXN0cm95ZWQpOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2UwZmNmZjtcbn1cblxuLnNoaXAge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYTJkMmZmO1xufVxuXG4uaGl0IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmNGQ2ZDtcbn1cblxuLm1pc3Mge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZDViZGFmO1xufVxuXG4uZGVzdHJveWVkIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzM0M2E0MDtcbn1cblxuLmhpZ2hsaWdodCB7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigxNDQsIDIwNywgMjMxKTtcbiAgYm9yZGVyOiBub25lO1xufVxuXG4uZm9vdGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgbWluLWhlaWdodDogMTAwJTtcbiAgbWFyZ2luLXRvcDogYXV0bztcbn1cblxuLnJlc3RhcnQtYnRuIHtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICBmb250LXNpemU6IDJyZW07XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgb3V0bGluZTogbm9uZTtcbiAgd2lkdGg6IDE1cmVtO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGJvcmRlci1yYWRpdXM6IDlweDtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1tYWluLWJvcmRlci1jb2xvcik7XG4gIG1hcmdpbi1ib3R0b206IDJyZW07XG59XG5cbi5yZXN0YXJ0LWJ0bjpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNlZGVkZTk7XG4gIHRyYW5zaXRpb246IDAuNnM7XG59XG5cbi5zdGFydC1zaG9vdGluZyB7XG4gIGZvbnQtc2l6ZTogMy41cmVtO1xuICB3aWR0aDogMjVyZW07XG4gIGhlaWdodDogNXJlbTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBsZXR0ZXItc3BhY2luZzogMC4xcmVtO1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG59XG5cbi5jb3B5cmlnaHQtZGl2IHtcbiAgbWFyZ2luLXRvcDogM3JlbTtcbiAgZGlzcGxheTogZmxleDtcbiAgaGVpZ2h0OiA1cmVtO1xuICB3aWR0aDogMTAwJTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2VkZWRlOTtcbiAgb3BhY2l0eTogMC44O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuYSB7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgY29sb3I6IHZhcigtLW1haW4tdGV4dC1jb2xvcik7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogNXB4O1xufVxuXG4uc3ZnLWxvZ28ge1xuICB3aWR0aDogMnJlbTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFDQTtFQUNFLHFCQUFxQjtFQUNyQiw0Q0FBK0I7RUFDL0IsNENBQWtDO0FBQ3BDOztBQUVBO0VBQ0UsNEJBQTRCO0VBQzVCLDBCQUEwQjtBQUM1Qjs7QUFFQTtFQUNFLGlCQUFpQjtFQUNqQixzREFBc0Q7RUFDdEQscUJBQXFCO0VBQ3JCLDZCQUE2QjtBQUMvQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQix1QkFBdUI7RUFDdkIsc0JBQXNCO0VBQ3RCLGlCQUFpQjtFQUNqQixXQUFXO0FBQ2I7O0FBRUE7RUFDRSxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsMENBQTBDO0VBQzFDLHlCQUF5QjtFQUN6QixZQUFZO0VBQ1osa0JBQWtCO0VBQ2xCLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLHFCQUFxQjtFQUNyQiwwQ0FBMEM7RUFDMUMsbUJBQW1CO0VBQ25CLGVBQWU7RUFDZixlQUFlO0VBQ2YsNkJBQTZCO0VBQzdCLDRCQUE0QjtFQUM1QixlQUFlO0VBQ2YsZ0JBQWdCO0VBQ2hCLGFBQWE7QUFDZjs7QUFFQTtFQUNFLHlCQUF5QjtFQUN6QixrQkFBa0I7RUFDbEIsbUJBQW1CO0VBQ25CLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixnQkFBZ0I7RUFDaEIsYUFBYTtFQUNiLHNCQUFzQjtFQUN0QixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxxQkFBcUI7RUFDckIsaUJBQWlCO0VBQ2pCLGVBQWU7RUFDZiw2QkFBNkI7RUFDN0IsNEJBQTRCO0VBQzVCLGdCQUFnQjtFQUNoQixhQUFhO0VBQ2IsWUFBWTtFQUNaLFlBQVk7RUFDWixrQkFBa0I7RUFDbEIsa0JBQWtCO0VBQ2xCLFNBQVM7RUFDVCxVQUFVO0FBQ1o7O0FBRUE7RUFDRSx5QkFBeUI7RUFDekIsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLDhCQUE4QjtFQUM5QixVQUFVO0VBQ1YsWUFBWTtFQUNaLGdCQUFnQjtBQUNsQjs7QUFFQTs7RUFFRSw2QkFBNkI7RUFDN0IsNEJBQTRCO0VBQzVCLGdCQUFnQjtFQUNoQixhQUFhO0VBQ2IsVUFBVTtFQUNWLGVBQWU7RUFDZixnQkFBZ0I7RUFDaEIsaUJBQWlCO0VBQ2pCLGFBQWE7RUFDYixzQ0FBc0M7RUFDdEMsbUNBQW1DO0VBQ25DLE1BQU07RUFDTixZQUFZO0VBQ1osZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsMENBQTBDO0VBQzFDLGdCQUFnQjtFQUNoQixlQUFlO0VBQ2YsZUFBZTtFQUNmLFNBQVM7RUFDVCxVQUFVO0FBQ1o7O0FBRUE7RUFDRSxpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSx5QkFBeUI7QUFDM0I7O0FBRUE7RUFDRSx5QkFBeUI7QUFDM0I7O0FBRUE7RUFDRSx5QkFBeUI7QUFDM0I7O0FBRUE7RUFDRSx5QkFBeUI7QUFDM0I7O0FBRUE7RUFDRSx5QkFBeUI7QUFDM0I7O0FBRUE7RUFDRSxvQ0FBb0M7RUFDcEMsWUFBWTtBQUNkOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0QixtQkFBbUI7RUFDbkIsZ0JBQWdCO0VBQ2hCLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLHFCQUFxQjtFQUNyQixlQUFlO0VBQ2YsZUFBZTtFQUNmLDZCQUE2QjtFQUM3Qiw0QkFBNEI7RUFDNUIsZUFBZTtFQUNmLGdCQUFnQjtFQUNoQixhQUFhO0VBQ2IsWUFBWTtFQUNaLGtCQUFrQjtFQUNsQixrQkFBa0I7RUFDbEIsc0NBQXNDO0VBQ3RDLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLHlCQUF5QjtFQUN6QixnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSxpQkFBaUI7RUFDakIsWUFBWTtFQUNaLFlBQVk7RUFDWixrQkFBa0I7RUFDbEIsc0JBQXNCO0VBQ3RCLFNBQVM7RUFDVCxVQUFVO0FBQ1o7O0FBRUE7RUFDRSxnQkFBZ0I7RUFDaEIsYUFBYTtFQUNiLFlBQVk7RUFDWixXQUFXO0VBQ1gseUJBQXlCO0VBQ3pCLFlBQVk7RUFDWix1QkFBdUI7RUFDdkIsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UscUJBQXFCO0VBQ3JCLDZCQUE2QjtFQUM3QixhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLFFBQVE7QUFDVjs7QUFFQTtFQUNFLFdBQVc7RUFDWCxrQkFBa0I7QUFDcEJcIixcInNvdXJjZXNDb250ZW50XCI6W1wiQGltcG9ydCBcXFwibm9ybWFsaXplLmNzc1xcXCI7XFxuQGZvbnQtZmFjZSB7XFxuICBmb250LWZhbWlseTogXFxcIlJvYm90b1xcXCI7XFxuICBzcmM6IHVybChmb250cy9Sb2JvdG8tQm9sZC50dGYpO1xcbiAgc3JjOiB1cmwoZm9udHMvUm9ib3RvLVJlZ3VsYXIudHRmKTtcXG59XFxuXFxuOnJvb3Qge1xcbiAgLS1tYWluLWJvcmRlci1jb2xvcjogIzQ5NTA1NztcXG4gIC0tbWFpbi10ZXh0LWNvbG9yOiAjMzMzMzMzO1xcbn1cXG5cXG5ib2R5IHtcXG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIGxlZnQsICNmOGY2ZTMsICNhY2UyZTEpO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJSb2JvdG9cXFwiO1xcbiAgY29sb3I6IHZhcigtLW1haW4tdGV4dC1jb2xvcik7XFxufVxcblxcbi5jb250YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBtaW4taGVpZ2h0OiAxMDB2aDtcXG59XFxuXFxuLmhlYWRlciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIHBhZGRpbmctdG9wOiA1cmVtO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbi5nYW1lLW5hbWUge1xcbiAgZm9udC1zaXplOiA0cmVtO1xcbn1cXG5cXG4ubmFtZSB7XFxuICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1tYWluLWJvcmRlci1jb2xvcik7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYTJkMmZmO1xcbiAgd2lkdGg6IDIwcmVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgYm9yZGVyLXJhZGl1czogMC4ycmVtO1xcbn1cXG5cXG4uc3RhcnQtYnRuIHtcXG4gIHBhZGRpbmctdG9wOiAzcmVtO1xcbn1cXG5cXG4uc3RhcnQge1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbWFpbi1ib3JkZXItY29sb3IpO1xcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcXG4gIGZvbnQtc2l6ZTogMnJlbTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuICBvdXRsaW5lOiBub25lO1xcbn1cXG5cXG4uc3RhcnQ6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2MwZmFmZjtcXG4gIHBhZGRpbmctbGVmdDogM3JlbTtcXG4gIHBhZGRpbmctcmlnaHQ6IDNyZW07XFxuICB0cmFuc2l0aW9uOiAwLjZzO1xcbn1cXG5cXG4ubWFpbiB7XFxuICBtYXJnaW4tdG9wOiAzcmVtO1xcbiAgbWluLWhlaWdodDogNTB2aDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLnJvdGF0ZS1idG4ge1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgZm9udC1zaXplOiAzLjVyZW07XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIHdpZHRoOiAyNXJlbTtcXG4gIGhlaWdodDogNXJlbTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGJvcmRlci1yYWRpdXM6IDlweDtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxufVxcblxcbi5yb3RhdGUtYnRuOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNlMGZjZmY7XFxuICB0cmFuc2l0aW9uOiAwLjZzO1xcbn1cXG5cXG4uZ2FtZWJvYXJkcyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbiAgd2lkdGg6IDY1JTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIG1hcmdpbi10b3A6IDJyZW07XFxufVxcblxcbi5yaWdodC1ib2FyZCxcXG4ubGVmdC1ib2FyZCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIHdpZHRoOiA5MCU7XFxuICBhc3BlY3QtcmF0aW86IDE7XFxuICBtYXgtd2lkdGg6IDYwMHB4O1xcbiAgbWF4LWhlaWdodDogNjAwcHg7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTAsIDFmcik7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMCwgMWZyKTtcXG4gIGdhcDogMDtcXG4gIG1hcmdpbjogMXJlbTtcXG4gIG1hcmdpbi10b3A6IDJyZW07XFxufVxcblxcbi5jZWxsIHtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLW1haW4tYm9yZGVyLWNvbG9yKTtcXG4gIG1heC1oZWlnaHQ6IDEwMCU7XFxuICBtYXgtd2lkdGg6IDEwMCU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbn1cXG5cXG4ucmlnaHQtYm9hcmQgLmNlbGwge1xcbiAgY3Vyc29yOiBjcm9zc2hhaXI7XFxufVxcblxcbi5yaWdodC1ib2FyZCAuY2VsbDpub3QoLm1pc3MpOm5vdCguaGl0KTpub3QoLmRlc3Ryb3llZCk6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2UwZmNmZjtcXG59XFxuXFxuLnNoaXAge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2EyZDJmZjtcXG59XFxuXFxuLmhpdCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmY0ZDZkO1xcbn1cXG5cXG4ubWlzcyB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZDViZGFmO1xcbn1cXG5cXG4uZGVzdHJveWVkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzNDNhNDA7XFxufVxcblxcbi5oaWdobGlnaHQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE0NCwgMjA3LCAyMzEpO1xcbiAgYm9yZGVyOiBub25lO1xcbn1cXG5cXG4uZm9vdGVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIG1pbi1oZWlnaHQ6IDEwMCU7XFxuICBtYXJnaW4tdG9wOiBhdXRvO1xcbn1cXG5cXG4ucmVzdGFydC1idG4ge1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgZm9udC1zaXplOiAycmVtO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG4gIG91dGxpbmU6IG5vbmU7XFxuICB3aWR0aDogMTVyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBib3JkZXItcmFkaXVzOiA5cHg7XFxuICBib3JkZXItY29sb3I6IHZhcigtLW1haW4tYm9yZGVyLWNvbG9yKTtcXG4gIG1hcmdpbi1ib3R0b206IDJyZW07XFxufVxcblxcbi5yZXN0YXJ0LWJ0bjpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWRlZGU5O1xcbiAgdHJhbnNpdGlvbjogMC42cztcXG59XFxuXFxuLnN0YXJ0LXNob290aW5nIHtcXG4gIGZvbnQtc2l6ZTogMy41cmVtO1xcbiAgd2lkdGg6IDI1cmVtO1xcbiAgaGVpZ2h0OiA1cmVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMXJlbTtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxufVxcblxcbi5jb3B5cmlnaHQtZGl2IHtcXG4gIG1hcmdpbi10b3A6IDNyZW07XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgaGVpZ2h0OiA1cmVtO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWRlZGU5O1xcbiAgb3BhY2l0eTogMC44O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG5hIHtcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gIGNvbG9yOiB2YXIoLS1tYWluLXRleHQtY29sb3IpO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBnYXA6IDVweDtcXG59XFxuXFxuLnN2Zy1sb2dvIHtcXG4gIHdpZHRoOiAycmVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuICBpZiAoIXVybCkge1xuICAgIHJldHVybiB1cmw7XG4gIH1cbiAgdXJsID0gU3RyaW5nKHVybC5fX2VzTW9kdWxlID8gdXJsLmRlZmF1bHQgOiB1cmwpO1xuXG4gIC8vIElmIHVybCBpcyBhbHJlYWR5IHdyYXBwZWQgaW4gcXVvdGVzLCByZW1vdmUgdGhlbVxuICBpZiAoL15bJ1wiXS4qWydcIl0kLy50ZXN0KHVybCkpIHtcbiAgICB1cmwgPSB1cmwuc2xpY2UoMSwgLTEpO1xuICB9XG4gIGlmIChvcHRpb25zLmhhc2gpIHtcbiAgICB1cmwgKz0gb3B0aW9ucy5oYXNoO1xuICB9XG5cbiAgLy8gU2hvdWxkIHVybCBiZSB3cmFwcGVkP1xuICAvLyBTZWUgaHR0cHM6Ly9kcmFmdHMuY3Nzd2cub3JnL2Nzcy12YWx1ZXMtMy8jdXJsc1xuICBpZiAoL1tcIicoKSBcXHRcXG5dfCglMjApLy50ZXN0KHVybCkgfHwgb3B0aW9ucy5uZWVkUXVvdGVzKSB7XG4gICAgcmV0dXJuIFwiXFxcIlwiLmNvbmNhdCh1cmwucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpLnJlcGxhY2UoL1xcbi9nLCBcIlxcXFxuXCIpLCBcIlxcXCJcIik7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGVzLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGVzLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyYztcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSB7XG5cdFx0XHR2YXIgaSA9IHNjcmlwdHMubGVuZ3RoIC0gMTtcblx0XHRcdHdoaWxlIChpID4gLTEgJiYgIXNjcmlwdFVybCkgc2NyaXB0VXJsID0gc2NyaXB0c1tpLS1dLnNyYztcblx0XHR9XG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsIl9fd2VicGFja19yZXF1aXJlX18uYiA9IGRvY3VtZW50LmJhc2VVUkkgfHwgc2VsZi5sb2NhdGlvbi5ocmVmO1xuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG4vLyBubyBvbiBjaHVua3MgbG9hZGVkXG5cbi8vIG5vIGpzb25wIGZ1bmN0aW9uIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgeyBnYW1lTG9vcCB9IGZyb20gXCIuL2dhbWVcIjtcbmltcG9ydCBcIi4vc3R5bGVzLmNzc1wiO1xuaW1wb3J0IHdlYkljb24gZnJvbSBcIi4vYXNzZXRzL2ljb24ucG5nXCI7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcbiAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuICBsaW5rLnJlbCA9IFwiaWNvblwiO1xuICBsaW5rLnR5cGUgPSBcImltYWdlL3BuZ1wiO1xuICBsaW5rLmhyZWYgPSB3ZWJJY29uO1xuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGxpbmspO1xufSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwic3RhcnRcIikpIHtcbiAgICBnYW1lTG9vcCgpO1xuICB9XG59KTtcbiJdLCJuYW1lcyI6WyJHYW1lYm9hcmQiLCJQbGF5ZXIiLCJjaGFuZ2VSb3RhdGVCdG4iLCJyZW1vdmVDb250YWluZXJFdmVudHMiLCJyZW5kZXJCb2FyZHMiLCJyZW5kZXJQYWdlIiwiZ2FtZUxvb3AiLCJwbGF5ZXJPbmUiLCJwbGF5ZXJUd28iLCJwbGF5ZXJzIiwiYm9hcmRPbmUiLCJib2FyZFR3byIsImJvYXJkcyIsImdlbmVyYXRlQm9hcmQiLCJzdGFydEdhbWUiLCJ3ZWJCb2FyZHMiLCJzdGFydCIsImkiLCJzaGlwc0xlbmd0aCIsIngiLCJNYXRoIiwicm91bmQiLCJyYW5kb20iLCJ5IiwiZGlyZWN0aW9uIiwicGxhY2VTaGlwIiwiY29udGFpbmVyIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJ0YXJnZXQiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImNlbGwiLCJnZXRBdHRyaWJ1dGUiLCJjbG9zZXN0IiwiYm9hcmQiLCJhdHRhY2tXb24iLCJyZWNlaXZlQXR0YWNrIiwic2V0VGltZW91dCIsImFpQXR0YWNrV29uIiwiYWlUdXJuIiwiY2hlY2tGb3JTdGFydGluZ0dhbWUiLCJzaG93V2lubmVyIiwiU2hpcCIsImNvbnN0cnVjdG9yIiwiaXNFbmVteSIsImhpdHNCb2FyZCIsInIiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJjIiwiQXJyYXkiLCJmaWxsIiwibWFwIiwibmV3U2hpcCIsImNvb3JkaW5hdGVzIiwiY2VsbEhpdCIsImhpdCIsImlzU3VuayIsImNoZWNraW5nV2luIiwid2lubmVyIiwic2hpcHMiLCJkZXN0cm95ZWRTaGlwcyIsImZvckVhY2giLCJlbGVtZW10IiwiZWxlbSIsInB1c2giLCJzdW5rIiwibmFtZSIsImdlbmVyYXRlUmFuZG9tQ29yZHMiLCJlbmVteUJvYXJkIiwiY29yZHMiLCJ0dXJuIiwiZ2l0aHViTG9nbyIsImlubmVySFRNTCIsIm1haW4iLCJjcmVhdGVFbGVtZW50IiwiYWRkIiwicm90YXRlRGl2Iiwicm90YXRlQnRuIiwidGV4dENvbnRlbnQiLCJnYW1lYm9hcmRzIiwibGVmdEJvYXJkIiwicmlnaHRCb2FyZCIsImZvb3RlciIsInJlc3RhcnRCdG4iLCJjb3B5cmlnaHREaXYiLCJjb3B5cmlnaHRUZXh0IiwiYXBwZW5kQ2hpbGQiLCJhdHRhY2hSb3RhdGVFdmVudCIsImF0dGFjaFJlc3RhcnRFdmVudCIsImlzVmVydGljYWwiLCJoYXNBdHRyaWJ1dGUiLCJzaGlwIiwic2V0QXR0cmlidXRlIiwiYXR0YWNoQ2VsbHNIaWdobGlnaHQiLCJjbGlja2VkWCIsInBhcnNlSW50IiwiY2xpY2tlZFkiLCJyZW1vdmVIaWdobGlnaHQiLCJoaWdobGlnaHRDZWxscyIsImJvYXJkRE9NIiwiaG92ZXJYIiwiaG92ZXJZIiwic2hpcExlbmd0aCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJyZW1vdmUiLCJ0b2dnbGVBdHRyaWJ1dGUiLCJyZW1vdmVDaGlsZCIsInN0YXJ0U2hvb3RpbmciLCJyZXBsYWNlV2l0aCIsImNsb25lTm9kZSIsImhpdHMiLCJ3ZWJJY29uIiwibGluayIsInJlbCIsInR5cGUiLCJocmVmIiwiaGVhZCJdLCJzb3VyY2VSb290IjoiIn0=