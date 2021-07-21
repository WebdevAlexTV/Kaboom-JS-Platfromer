import constants from "../constants";
import k from "../kaboom";
import { states } from "./stateMachine";

const control = () => {
  return {
    add() {
      const player = this;
      // Jump
      k.keyPress("space", () => {
        if (!player.canInteract()) {
          return;
        }
        player.changeState(states.JUMP, player);
      });

      // Move left
      k.keyDown("left", () => {
        if (!player.canInteract()) {
          return;
        }
        player.run(-1);
      });

      k.keyPress("left", () => {
        player.changeState(states.MOVE, player);
      });

      k.keyRelease("left", () => {
        if (!player.canInteract()) {
          return;
        }
        if (player.grounded()) {
          player.changeState(states.IDLE, player);
        }
      });

      // Move right
      k.keyDown("right", () => {
        if (!player.canInteract()) {
          return;
        }
        player.run(1);
      });

      k.keyPress("right", () => {
        player.changeState(states.MOVE, player);
      });

      k.keyRelease("right", () => {
        if (!player.canInteract()) {
          return;
        }
        if (player.grounded()) {
          player.changeState(states.IDLE, player);
        }
      });

      // Shoot
      k.keyPress("f", () => {
        if (!player.canInteract()) {
          return;
        }
        player.changeState(states.SHOOT, player);
      });

      // Melee
      k.keyPress("d", () => {
        if (!player.canInteract()) {
          return;
        }
        player.changeState(states.ATTACK, player);
      });
    },
  };
};

export default control;
