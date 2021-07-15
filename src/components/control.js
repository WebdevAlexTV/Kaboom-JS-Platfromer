import constants from "../constants";
import k from "../kaboom";
import { states } from "./stateMachine";

const control = () => {
  return {
    add() {
      const player = this;
      // Jump
      k.keyPress("space", () => {
        if (player.isDead()) {
          return;
        }
        player.changeState(states.JUMP, player);
      });

      // Move left
      k.keyDown("left", () => {
        if (player.isDead()) {
          return;
        }
        player.run(-1);
      });

      k.keyPress("left", () => {
        player.changeState(states.MOVE, player);
      });

      k.keyRelease("left", () => {
        if (player.isDead()) {
          return;
        }
        if (player.grounded()) {
          player.changeState(states.IDLE, player);
        }
      });

      // Move right
      k.keyDown("right", () => {
        if (player.isDead()) {
          return;
        }
        player.run(1);
      });

      k.keyPress("right", () => {
        player.changeState(states.MOVE, player);
      });

      k.keyRelease("right", () => {
        if (player.isDead()) {
          return;
        }
        if (player.grounded()) {
          player.changeState(states.IDLE, player);
        }
      });

      // Attack
      k.keyPress("c", () => {
        if (player.isDead()) {
          return;
        }
        player.changeState(states.SHOOT, player);
      });
    },
  };
};

export default control;
