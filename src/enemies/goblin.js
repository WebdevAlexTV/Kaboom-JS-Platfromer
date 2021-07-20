import constants from "../constants";
import k from "../kaboom";
import stateMachine, { states } from "../components/stateMachine";
import health from "../components/health";
import bouncable from "../components/bounce";
import distance from "../components/distance";

const stateActions = {
  /**
   * IDLE
   */
  [states.IDLE]: {
    updateAction: (goblin) => {
      if (goblin.distanceToPlayer() > 150) {
        goblin.changeState(states.MOVE, goblin);
      }
    },
    resolve: (goblin) => {
      goblin.changeSprite("goblin");
      goblin.play("idle", false);
    },
    canResolve: (goblin) => {
      return !goblin.isSuffering();
    },
  },
  /**
   * WAIT
   */
  [states.WAIT]: {
    updateAction: (goblin) => {},
    resolve: (goblin) => {
      goblin.changeState(states.IDLE, goblin, 1);
      goblin.changeSprite("goblin");
      goblin.play("idle");
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
      goblin.move(constants.ENEMY_SPEED * goblin.viewDirection, 0);
      goblin.scale.x = goblin.viewDirection;

      if (goblin.distanceToPlayer() > 10) {
        goblin.viewDirection = goblin.playerPos();
      }
    },
    resolve: (goblin) => {
      goblin.changeSprite("goblin");
      goblin.play("run");
    },
    canResolve: (goblin) => {
      return !goblin.isSuffering();
    },
  },
  /**
   * Attack
   */
  [states.ATTACK]: {
    updateAction: (goblin) => {},
    resolve: (goblin) => {
      goblin.changeSprite("goblin_attack");
      goblin.play("attack", false);
      goblin.changeState(states.MOVE, goblin, 1.2);
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
    player.bounce(goblin.viewDirection);
    player.suffer(1);
    k.camShake(6);
  });

  // If the goblin collides with each other
  k.collides("goblin", "goblin", (goblin, goblin2) => {
    if (!goblin.isCurrentState(states.ATTACKING)) {
      goblin.move(goblin.viewDirection * -1 * 10);
      goblin.changeState(states.WAIT, goblin);
    }
    if (!goblin2.isCurrentState(states.ATTACKING)) {
      goblin2.move(goblin2.viewDirection * -1 * 10);
      goblin2.changeState(states.WAIT, goblin2);
    }
  });

  // When an animation of the goblin ends
  goblin.on("animEnd", (anim) => {
    if (anim === "suffer") {
      goblin.setSuffering(false);
      goblin.changeState(goblin.getLastState(), goblin);
    }
  });
};

const spawnGoblin = (pos) => {
  k.add([
    k.sprite("goblin", {
      frame: 22,
    }),
    k.solid(),
    "goblin",
    "enemy",
    k.scale(1),
    k.origin("center"),
    k.pos(pos),
    k.body(),
    stateMachine(states.IDLE, stateActions),
    health(3),
    bouncable(),
    distance(),
    {
      viewDirection: -1,
      add() {
        onGoblinAdded(this);
      },
    },
  ]);
};

export const goblinConfig = () => {
  return [
    {
      add() {
        spawnGoblin(this.pos);
        k.destroy(this);
      },
    },
  ];
};

export default goblinConfig;
