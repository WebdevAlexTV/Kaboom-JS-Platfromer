import k from "../kaboom";

const bouncable = () => {
  let isBouncing = false;
  const bounceIntensity = 50;
  let bounceDirection = 1;

  /**
   * Bounce the gameobject into the given direction.
   *
   * @param {*} direction
   */
  function bounce(direction) {
    bounceDirection = direction;
    isBouncing = true;
    k.wait(0.5, () => {
      isBouncing = false;
    });
  }

  return {
    bounce,
    isBouncing: () => isBouncing,
    update() {
      if (isBouncing) {
        this.move(bounceDirection * bounceIntensity);
      }
    },
  };
};

export default bouncable;
