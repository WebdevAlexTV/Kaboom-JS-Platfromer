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

const ATTACK_DELAY = 3;
const EXPLODING_TIME = 3;

const stateActions = {
  [states.IDLE]: {
    updateAction: (goblin) => {
      const player = getPlayer();
      if (goblin.distanceToGameobject(player) < 100) {
        const viewDirection = goblin.gameobjectPos(player);
        goblin.setViewDirection(viewDirection);
        goblin.scale.x = viewDirection;
        goblin.changeState(states.ATTACK, goblin);
      }
    },
    resolve: (goblin) => {
      goblin.play("idle");
    },
    canResolve: (goblin) => {
      return !goblin.isSuffering();
    },
  },
  [states.ATTACK]: {
    updateAction: (goblin) => {},
    resolve: (goblin) => {
      goblin.play("attack", false);
      goblin.timeSinceLastAttack = 0;
    },
    canResolve: (goblin) => {
      return (
        goblin.timeSinceLastAttack >= ATTACK_DELAY && !goblin.isSuffering()
      );
    },
  },
  [states.SUFFER]: {
    updateAction: (goblin) => {},
    resolve: (goblin) => {
      goblin.setSuffering(true);
      goblin.play("suffer", false);
    },
    canResolve: (goblin) => {
      return true;
    },
  },
  [states.DIE]: {
    updateAction: (goblin) => {},
    resolve: (goblin) => {
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

/**
 * Spawn the bomb.
 *
 * @param {*} goblin
 */
const spawnBomb = (goblin) => {
  const position = { ...goblin.pos };
  position.x = position.x - goblin.getViewDirection() * -10;
  position.y = position.y - 10;
  k.add([
    k.sprite("bomb_ticking"),
    k.pos(position),
    k.origin("center"),
    k.body(),
    "bomb",
    viewDirection(goblin.getViewDirection()),
    {
      lifeTime: 0,
      timesBounced: 0,
      add() {
        this.play("effect");
      },
      update() {
        this.lifeTime += k.dt();
        if (!this.grounded()) {
          this.move(this.getViewDirection() * 75, 0);
          if (this.lifeTime < 0.2) {
            this.jump(150 - this.lifeTime * 100);
          }
        } else {
          if (this.timesBounced < 3) {
            this.timesBounced += 1;
            this.jump(70 - this.timesBounced * 5);
          }
        }
        if (this.lifeTime > EXPLODING_TIME) {
          spawnExplosion(this.pos);
          addEffectText(this, "Booom!");
          k.destroy(this);
        }
      },
    },
  ]);
};

/**
 * Spawn a explosion on the given position.
 *
 * @param {*} position
 */
const spawnExplosion = (position) => {
  k.add([
    k.sprite("bomb_explosion"),
    k.scale(3),
    k.pos(position),
    k.origin("center"),
    "explosion",
    {
      alreadySuffered: [],
      add() {
        this.play("effect", false);
        k.collides("explosion", "sufferable", (explosion, sufferable) => {
          if (!explosion.alreadySuffered.includes(sufferable._id)) {
            explosion.alreadySuffered.push(sufferable._id);
            sufferable.suffer(2);
          }
        });
        this.on("animEnd", (anim) => {
          k.destroy(this);
        });
      },
    },
  ]);
  k.camShake(4);
};

const onBomberGoblinAdded = (goblin) => {
  // If the goblin dies
  goblin.on("death", () => {
    goblin.changeState(states.DIE, goblin);
  });

  // When the goblin suffers damage
  goblin.on("suffer", () => {
    goblin.changeState(states.SUFFER, goblin);
  });

  // If the goblin collides with the player
  k.collides("player", "bomber_goblin", (player, goblin) => {
    if (!goblin.isCurrentState(states.DIE)) {
      spawnExplosion(goblin.pos);
      goblin.suffer(goblin.getMaxHealth());
      player.bounce(goblin.getViewDirection());
    }
  });

  goblin.on("animEnd", (anim) => {
    if (anim === "attack") {
      spawnBomb(goblin);
      goblin.changeState(states.IDLE, goblin);
    } else if (anim === "suffer") {
      goblin.setSuffering(false);
      goblin.changeState(goblin.getLastState(), goblin);
    }
  });
};

const spawnBomberGoblin = (pos) => {
  k.add([
    k.sprite("goblin_bomber", {
      frame: 0,
    }),
    "bomber_goblin",
    "enemy",
    "sufferable",
    k.scale(1),
    k.origin("center"),
    k.pos(pos),
    k.body(),
    stateMachine(states.IDLE, stateActions),
    health(5),
    bouncable(),
    distance(),
    viewDirection(),
    {
      timeSinceLastAttack: ATTACK_DELAY,
      add() {
        onBomberGoblinAdded(this);
      },
      update() {
        this.timeSinceLastAttack += k.dt();
      },
    },
  ]);
};

export const bomberGoblinConfig = () => {
  return [
    {
      add() {
        spawnBomberGoblin(this.pos);
        k.destroy(this);
      },
    },
  ];
};

export default bomberGoblinConfig;
