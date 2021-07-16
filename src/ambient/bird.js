import stateMachine, { states } from "../components/stateMachine";
import k from "../kaboom";
import { getPlayer } from "../player";

const stateActions = {
  /**
   * IDLE
   */
  [states.IDLE]: {
    updateAction: (bird) => {
      const player = getPlayer();
      if (bird.pos.x - player.pos.x > -20 && bird.pos.x - player.pos.x < 20) {
        if (bird.pos.x > player.pos.x) {
          bird.viewDirection = 1;
          bird.scale.x = -1;
        } else {
          bird.viewDirection = -1;
          bird.scale.x = 1;
        }
        bird.changeState(states.MOVE, bird);
      }
    },
    resolve: (bird) => {
      bird.play("idle");
    },
    canResolve: (bird) => {
      return true;
    },
  },
  /**
   * MOVE
   */
  [states.MOVE]: {
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
      if (bird.pos.x - player.pos.x > 100 || bird.pos.x - player.pos.x < -100) {
        bird.changeState(states.IDLE, bird);
      }
    },
    resolve: (bird) => {
      bird.play("fly");
    },
    canResolve: (bird) => {
      return true;
    },
  },
};

export const birdConfig = () => {
  return [
    k.sprite("bird", {
      frame: 0,
    }),
    "bird",
    "ambient",
    k.scale(1),
    k.body(),
    k.origin("center"),
    stateMachine(states.IDLE, stateActions),
    {
      viewDirection: -1,
      add() {},
    },
  ];
};
