import constants from "../constants";
import k from "../kaboom";
import stateMachine, { states } from "../components/stateMachine";
import health from "../components/health";
import bouncable from "../components/bounce";
import distance from "../components/distance";
import { getPlayer } from "../player";
import viewDirection from "../components/viewDirection";
import { addEffectText } from "../helpers";
import spawnMunition from "../items/munition";

const stateActions = {
  /**
   * IDLE
   */
  [states.IDLE]: {
    updateAction: (goblin) => {
      const player = getPlayer();
      if (
        goblin.distanceToGameobject(player) < 150 &&
        goblin.distanceToGameobject(player) > 10
      ) {
        goblin.changeState(states.MOVE, goblin);
      }
    },
    resolve: (goblin) => {
      goblin.changeSprite("goblin");
      goblin.play("idle");
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
      goblin.changeSprite("goblin");
      goblin.play("idle");
      goblin.changeState(states.IDLE, goblin, 1);
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
      goblin.move(constants.ENEMY_SPEED * goblin.getViewDirection(), 0);
      goblin.scale.x = goblin.getViewDirection();

      if (goblin.distanceToGameobject(player) > 10) {
        goblin.setViewDirection(goblin.gameobjectPos(player));
      } else {
        if (goblin.distanceToGameobject(player, "y") > 20) {
          goblin.changeState(states.WAIT, goblin);
        }
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
      addEffectText(goblin, "Stab!");
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
        spawnMunition(goblin.pos);
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
    if (!goblin.isCurrentState(states.DIE)) {
      if (goblin.distanceToGameobject(player, "y") < 5) {
        goblin.changeState(states.ATTACK, goblin);
        player.suffer(1);
        k.camShake(6);
        player.bounce(goblin.getViewDirection());
      } else {
        if (!goblin.isCurrentState(states.SUFFER)) {
          goblin.suffer(1);
          goblin.changeState(states.SUFFER, goblin);
        }
        player.doJump(true);
      }
    }
  });

  // If the goblin collides with each other
  k.collides("goblin", "goblin", (goblin, goblin2) => {
    const player = getPlayer();

    if (!goblin.isCurrentState(states.ATTACKING)) {
      if (
        goblin.distanceToGameobject(player) >
        goblin2.distanceToGameobject(player)
      ) {
        goblin.move(goblin.gameobjectPos(player) * -1 * 10);
        goblin.changeState(states.WAIT, goblin);
      }
    }
    if (!goblin2.isCurrentState(states.ATTACKING)) {
      if (
        goblin2.distanceToGameobject(player) >
        goblin.distanceToGameobject(player)
      ) {
        goblin2.move(goblin2.getViewDirection() * -1 * 10);
        goblin2.changeState(states.WAIT, goblin2);
      }
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
    "goblin",
    "enemy",
    "sufferable",
    k.scale(1),
    k.origin("center"),
    k.pos(pos),
    k.body(),
    stateMachine(states.IDLE, stateActions),
    health(3),
    bouncable(),
    distance(),
    viewDirection(),
    {
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
