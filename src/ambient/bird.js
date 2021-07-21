import distance from "../components/distance";
import stateMachine, { states } from "../components/stateMachine";
import viewDirection from "../components/viewDirection";
import k from "../kaboom";
import { getPlayer } from "../player";

const stateActions = {
  /**
   * IDLE
   */
  [states.IDLE]: {
    updateAction: (bird) => {
      const player = getPlayer();
      if (bird.shouldEscape(player)) {
        bird.escape(player);
      }
    },
    resolve: (bird) => {
      bird.changeState(states.MOVE, bird, Math.floor(Math.random() * 5));
      bird.play("idle");
    },
  },
  /**
   * MOVE
   */
  [states.MOVE]: {
    updateAction: (bird) => {
      const player = getPlayer();
      if (bird.shouldEscape(player)) {
        bird.escape(player);
      }
      bird.move(bird.getViewDirection() * 10, 0);
    },
    resolve: (bird) => {
      // Let the bird turn at random
      if (Math.random() > 0.5) {
        bird.setViewDirection(bird.getViewDirection() * -1);
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
      bird.escapingTimer += k.dt();

      bird.move(bird.getViewDirection() * 50, 0);
      bird.jump(20);
      // Change the view direction only if the player is near enough
      if (bird.playerIsNearby()) {
        if (bird.getViewDirection() === 1 && bird.pos.x < player.pos.x) {
          bird.setViewDirection(-1);
          bird.scale.x = 1;
        }
        if (bird.getViewDirection() === -1 && bird.pos.x > player.pos.x) {
          bird.setViewDirection(1);
          bird.scale.x = -1;
        }
      }

      if (bird.escapingTimer > 3 && bird.canStopEscaping()) {
        bird.escaping = false;
        bird.changeState(states.IDLE, bird);
      }
    },
    resolve: (bird) => {
      bird.escapingTimer = 0;
      bird.play("fly");
    },
  },
};

const onBirdAdded = () => {
  // If the goblin collides with the player
  k.collides("bird", "enemy", (bird, enemy) => {
    if (!bird.escaping) {
      if (bird.viewDirection === -1 && bird.pos.x < enemy.pos.x) {
        bird.viewDirection = 1;
        bird.scale.x = -1;
      }
      if (bird.viewDirection === 1 && bird.pos.x > enemy.pos.x) {
        bird.viewDirection = -1;
        bird.scale.x = 1;
      }
      bird.escape(enemy);
    }
  });
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
    viewDirection(),
    {
      escaping: false,
      escapingTimer: 0,
      add() {
        onBirdAdded();
      },
      /**
       * Checks if the bird should escape.
       * @returns True if it should escape
       */
      shouldEscape(gameobject) {
        return this.distanceToGameobject(gameobject) < 20;
      },
      /**
       * Checks if the player is nearby.
       * @returns true if the player is nearby
       */
      playerIsNearby() {
        const player = getPlayer();
        return this.distanceToGameobject(player) < 20;
      },
      /**
       * Let's the bird escape. Directly away from the player.
       */
      escape(from) {
        this.escaping = true;
        // Player is on the left, escape to the right
        if (this.gameobjectPos(from) === -1) {
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
        const player = getPlayer();
        return this.distanceToGameobject(player) > 100;
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
