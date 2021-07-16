import constants from "../constants";
import k from "../kaboom";

const bouncable = () => {
  let isBouncing = false;
  let bounceDirection = 1;

  function bounce(direction) {
    bounceDirection = direction;
    isBouncing = true;
    k.wait(0.5, () => {
      isBouncing = false;
    });
  }

  return {
    bounce,
    update() {
      if (isBouncing) {
        this.move(bounceDirection * 50);
      }
    },
  };
};

export default bouncable;
