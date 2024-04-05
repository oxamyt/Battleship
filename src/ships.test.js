import Ship from "./ships";

const boat = new Ship(4);

test("adds hit to the ship", () => {
  boat.hit();
  boat.hit();
  boat.hit();
  boat.hit();
  expect(boat.hits).toBe(4);
});
