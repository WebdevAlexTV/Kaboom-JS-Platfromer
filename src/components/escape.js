const escape = () => {
  return {
    shouldEscape() {
      return this.distanceToPlayer() < 20;
    },
    escape() {
      // Player is on the left, escape to the right
      if (this.playerPos() === -1) {
        this.viewDirection = 1;
        this.scale.x = -1;
      } else {
        this.viewDirection = -1;
        this.scale.x = 1;
      }
      this.changeState(states.FLY, this);
    },
    canStopEscaping() {
      return this.distanceToPlayer() > 100;
    },
  };
};

export default escape;
