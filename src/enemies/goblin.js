import constants from "../constants";
import k from "../kaboom";
import stateMachine, { states } from "../components/stateMachine";
import health from "../components/health";
import { getPlayer } from "../player";

const stateActions = {
  /**
   * IDLE
   */
  [states.IDLE]: {
    updateAction: (goblin) => {
      const player = getPlayer();
      if (
        goblin.pos.x - player.pos.x > -150 &&
        goblin.pos.x - player.pos.x < 150
      ) {
        goblin.changeState(states.MOVE, goblin);
      }
      if (goblin.frame === 22) {
        goblin.play("idle");
      }
    },
    resolve: (goblin) => {
      goblin.changeSprite("goblin");
      goblin.frame = 22;
    },
    canResolve: (goblin) => {
      return !goblin.isSuffering();
    },
  },
  /**
   * MOVE
   */
  [states.MOVE]: {
    updateAction: (goblin) => {
      const player = getPlayer();
      goblin.move(constants.ENEMY_SPEED * goblin.moveDirection, 0);
      goblin.scale.x = goblin.moveDirection;

      if (goblin.pos.x - player.pos.x < -10) {
        goblin.moveDirection = 1;
      }
      if (goblin.pos.x - player.pos.x > 10) {
        goblin.moveDirection = -1;
      }

      if (goblin.frame === 5) {
        goblin.play("run");
      }
    },
    resolve: (goblin) => {
      goblin.changeSprite("goblin");
      goblin.frame = 5;
    },
    canResolve: (goblin) => {
      return !goblin.isSuffering();
    },
  },
  /**
   * Attack
   */
  [states.ATTACK]: {
    updateAction: (goblin) => {
      if (goblin.frame === 11) {
        goblin.play("attack");
      }
    },
    resolve: (goblin) => {
      goblin.changeSprite("goblin_attack");
      goblin.frame = 11;
      k.wait(1, () => {
        goblin.changeState(states.MOVE, goblin);
      });
    },
    canResolve: (goblin) => {
      return !goblin.isSuffering();
    },
  },
  /**
   * Suffer
   */
  [states.SUFFER]: {
    updateAction: (goblin) => {},
    resolve: (goblin) => {
      goblin.changeSprite("goblin");
      goblin.setSuffering(true);
      goblin.play("suffer", false);
    },
    canResolve: (goblin) => {
      return true;
    },
  },
  /**
   * Die
   */
  [states.DIE]: {
    updateAction: (goblin) => {},
    resolve: (goblin) => {
      goblin.changeSprite("goblin");
      goblin.play("die");
      k.wait(0.5, () => {
        k.destroy(goblin);
      });
    },
    canResolve: (goblin) => {
      return true;
    },
  },
};

const onGoblinAdded = (goblin) => {
  // If the goblin dies
  goblin.on("death", () => {
    goblin.changeState(states.DIE, goblin);
  });

  // When the goblin suffers damage
  goblin.on("suffer", () => {
    goblin.changeState(states.SUFFER, goblin);
  });

  // If the goblin collides with the player
  k.collides("player", "goblin", (player, goblin) => {
    goblin.changeState(states.ATTACK, goblin);
    player.changeState(states.SUFFER, player);
    player.suffer(1);
    k.camShake(6);
  });

  // When an animation of the goblin ends
  goblin.on("animEnd", (anim) => {
    if (anim === "suffer") {
      goblin.setSuffering(false);
      goblin.changeState(goblin.getLastState(), goblin);
    }
  });
};

export const goblinConfig = () => {
  return [
    k.sprite("goblin", {
      frame: 22,
    }),
    k.solid(),
    "goblin",
    "enemy",
    k.scale(1),
    k.origin("center"),
    k.body(),
    stateMachine(states.IDLE, stateActions),
    health(3),
    {
      moveDirection: -1,
      add() {
        onGoblinAdded(this);
      },
    },
  ];
};

export default goblinConfig;
