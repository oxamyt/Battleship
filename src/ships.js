export default class Ship {
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
