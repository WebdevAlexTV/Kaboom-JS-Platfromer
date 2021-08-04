import bouncable from "../components/bounce";
import distance from "../components/distance";
import health from "../components/health";
import stateMachine, { states } from "../components/stateMachine";
import viewDirection from "../components/viewDirection";
import constants from "../constants";
import spawnMunition from "../items/munition";
import k from "../kaboom";
import { getPlayer } from "../player";

const stateActions = {
  [states.IDLE]: {
    updateAction: (worm) => {
      const player = getPlayer();
      if (
        worm.distanceToGameobject(player) < 150 &&
        worm.distanceToGameobject(player) > 10
      ) {
        worm.changeState(states.MOVE, worm);
      }
    },
    resolve: () => {},
    canResolve: () => {
      return true;
    },
  },
  [states.WAIT]: {
    updateAction: () => {},
    resolve: (worm) => {
      worm.changeState(states.IDLE, worm, 1);
    },
    canResolve: () => {
      return true;
    },
  },
  [states.MOVE]: {
    updateAction: (worm) => {
      const player = getPlayer();
      worm.move(constants.WORM_SPEED * worm.getViewDirection(), 0);
      worm.scale.x = worm.scale.x * worm.getViewDirection();

      if (worm.distanceToGameobject(player) > 10) {
        worm.setViewDirection(worm.gameobjectPos(player));
      } else {
        if (worm.distanceToGameobject(player, "y") > 20) {
          worm.changeState(states.WAIT, worm);
        }
      }
    },
    resolve: (worm) => {
      worm.play("run");
    },
    canResolve: () => {
      return true;
    },
  },
  [states.SUFFER]: {
    updateAction: () => {},
    resolve: (worm) => {
      worm.setSuffering(true);
      worm.play("suffer", false);
    },
    canResolve: () => {
      return true;
    },
  },
  [states.DIE]: {
    updateAction: () => {},
    resolve: (worm) => {
      worm.play("die");
      k.wait(0.5, () => {
        if (!worm.isOffspring) {
          spawnMunition(worm.pos);
          spawnOffsprings(worm);
        }
        k.destroy(worm);
      });
    },
    canResolve: () => {
      return true;
    },
  },
  /**
   * When the worm get's spawned by killing a big worm
   */
  OFFSPRING: {
    updateAction: (worm) => {
      worm.jump(30 + worm.spawnModifier);
      worm.move(worm.getViewDirection() * 20 + worm.spawnModifier);
    },
    resolve: (worm) => {
      worm.changeState(states.WAIT, worm, 0.3);
    },
  },
};

/**
 * Spawn some offsprings for the given worm.
 * @param {*} worm
 */
const spawnOffsprings = (worm) => {
  if (!worm.isOffspring) {
    for (let i = 0; i < constants.WORM_SPAWN_AMOUNT; i++) {
      k.wait(0.2 * (i + 1), () => {
        let spawnedWorm = spawnWorm(worm.pos, 0.5);
        spawnedWorm.setViewDirection(Math.random() < 0.5 ? 1 : -1);
        spawnedWorm.isOffspring = true;
        spawnedWorm.spawnModifier = Math.floor(Math.random() * 20);
        spawnedWorm.changeState("OFFSPRING", spawnedWorm);
      });
    }
  }
};

const onWormAdded = (worm) => {
  // If the goblin dies
  worm.on("death", () => {
    worm.changeState(states.DIE, worm);
  });

  // When the worm suffers damage
  worm.on("suffer", () => {
    worm.changeState(states.SUFFER, worm);
  });

  // If the worm collides with the player
  k.collides("player", "worm", (player, worm) => {
    if (!worm.isCurrentState(states.DIE)) {
      if (worm.distanceToGameobject(player, "y") < 5 / worm.scale.x) {
        player.suffer(1);
        k.camShake(6);
        player.bounce(worm.getViewDirection());
      } else {
        if (!worm.isCurrentState(states.SUFFER)) {
          worm.suffer(1);
          worm.changeState(states.SUFFER, worm);
        }
        player.doJump(true);
      }
    }
  });

  // When an animation of the worm ends
  worm.on("animEnd", (anim) => {
    if (anim === "suffer") {
      worm.setSuffering(false);
      worm.changeState(worm.getLastState(), worm);
    }
  });
};

const spawnWorm = (pos, scale = 1) => {
  return k.add([
    k.sprite("worm", {
      frame: 0,
    }),
    "worm",
    "enemy",
    "sufferable",
    k.scale(scale),
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
        onWormAdded(this);
      },
    },
  ]);
};

export const wormConfig = () => {
  return [
    {
      add() {
        spawnWorm(this.pos);
        k.destroy(this);
      },
    },
  ];
};

export default wormConfig;
