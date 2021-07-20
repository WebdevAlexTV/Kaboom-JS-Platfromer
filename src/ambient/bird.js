import distance from "../components/distance";
import stateMachine, { states } from "../components/stateMachine";
import k from "../kaboom";
import { getPlayer } from "../player";

const stateActions = {
  /**
   * IDLE
   */
  [states.IDLE]: {
    updateAction: (bird) => {
      if (bird.shouldEscape()) {
        bird.escape();
      }
    },
    resolve: (bird) => {
      bird.changeState(states.MOVE, bird, 5);
      bird.play("idle");
    },
  },
  /**
   * MOVE
   */
  [states.MOVE]: {
    updateAction: (bird) => {
      if (bird.shouldEscape()) {
        bird.escape();
      }
      bird.move(bird.viewDirection * 10, 0);
    },
    resolve: (bird) => {
      // Let the bird turn at random
      if (Math.random() > 0.5) {
        bird.viewDirection *= -1;
        bird.scale.x *= -1;
      }
      bird.changeState(states.IDLE, bird, 3);
      bird.play("walk");
    },
  },
  /**
   * FLY
   */
  [states.FLY]: {
    updateAction: (bird) => {
      const player = getPlayer();
      bird.move(bird.viewDirection * 50, 0);
      bird.jump(20);
      if (bird.viewDirection === 1 && bird.pos.x < player.pos.x) {
        bird.viewDirection = -1;
        bird.scale.x = 1;
      }
      if (bird.viewDirection === 1 && bird.pos.x > player.pos.x) {
        bird.viewDirection = 1;
        bird.scale.x = -1;
      }
      if (bird.canStopEscaping()) {
        bird.changeState(states.IDLE, bird);
      }
    },
    resolve: (bird) => {
      bird.play("fly");
    },
  },
};

const spawnBird = (pos) => {
  k.add([
    k.sprite("bird", {
      frame: 0,
    }),
    "bird",
    "ambient",
    k.scale(1),
    k.body(),
    k.origin("center"),
    k.pos(pos),
    stateMachine(states.IDLE, stateActions),
    distance(),
    {
      viewDirection: -1,
      /**
       * Checks if the bird should escape.
       * @returns True if it should escape
       */
      shouldEscape() {
        return this.distanceToPlayer() < 20;
      },
      /**
       * Let's the bird escape. Directly away from the player.
       */
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
      /**
       * Checks if the bird is far enough from the player.
       * @returns True if the player is far enough.
       */
      canStopEscaping() {
        return this.distanceToPlayer() > 100;
      },
    },
  ]);
};

export const birdConfig = () => {
  return [
    {
      add() {
        spawnBird(this.pos);
        k.destroy(this);
      },
    },
  ];
};
