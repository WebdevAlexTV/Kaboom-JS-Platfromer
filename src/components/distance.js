import { getPlayer } from "../player";

const distance = () => {
  /**
   * Calculate the distance to the given gameobject.
   *
   * @param {*} axis
   * @returns The distance from the current game object to the given gameobject (always positive)
   */
  function distanceToGameobject(gameobject, axis = "x") {
    const dist = this.pos[axis] - gameobject.pos[axis];

    return dist < 0 ? dist * -1 : dist;
  }

  /**
   * Determines where the gameobject is.
   *
   * x = -1: gameobject is on the left
   * x = 1: gameobject is on the right
   * y = -1: gameobject is above
   * y = 1: gameobject is beneath
   * @param gameobject
   * @param {*} axis
   * @returns The position of the given gameobject relative to the current game object.
   */
  function gameobjectPos(gameobject, axis = "x") {
    if (this.pos[axis] < gameobject.pos[axis]) {
      return 1;
    }

    return -1;
  }

  return {
    distanceToGameobject,
    gameobjectPos,
  };
};

export default distance;
