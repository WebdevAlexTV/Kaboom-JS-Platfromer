import { getPlayer } from "../player";

const distance = () => {
  /**
   * Calculate the distance to the player.
   * @param {*} axis
   * @returns The distance from the game object to the player (always positive)
   */
  function distanceToPlayer(axis = "x") {
    const player = getPlayer();

    const dist = this.pos[axis] - player.pos[axis];

    return dist < 0 ? dist * -1 : dist;
  }

  /**
   * Determines where the player is.
   * x = -1: player is on the left
   * x = 1: player is on the right
   * y = -1: player is above
   * y = 1: player is beneath
   * @param {*} axis
   * @returns The position of the player relative to the game object.
   */
  function playerPos(axis = "x") {
    const player = getPlayer();
    if (this.pos[axis] < player.pos[axis]) {
      return 1;
    }

    return -1;
  }

  return {
    distanceToPlayer,
    playerPos,
  };
};

export default distance;
