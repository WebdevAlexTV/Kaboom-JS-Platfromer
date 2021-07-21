import constants from "../constants";
import k from "../kaboom";
import stateMachine, { states } from "../components/stateMachine";
import health from "../components/health";
import bouncable from "../components/bounce";
import distance from "../components/distance";
import { getPlayer } from "../player";
import viewDirection from "../components/viewDirection";

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
      return true;
    },
  },
  [states.ATTACK]: {
    updateAction: (goblin) => {},
    resolve: (goblin) => {
      goblin.play("attack", false);
      goblin.timeSinceLastAttack = 0;
    },
    canResolve: (goblin) => {
      return goblin.timeSinceLastAttack >= ATTACK_DELAY;
    },
  },
  [states.SUFFER]: {
    updateAction: (goblin) => {},
    resolve: (goblin) => {},
    canResolve: (goblin) => {
      return true;
    },
  },
  [states.DIE]: {
    updateAction: (goblin) => {},
    resolve: (goblin) => {},
    canResolve: (goblin) => {
      return true;
    },
  },
};

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
      add() {
        this.play("effect");
      },
      update() {
        this.lifeTime += k.dt();
        if (!this.grounded()) {
          this.move(this.getViewDirection() * 50, 0);
          if (this.lifeTime < 0.5) {
            this.jump(70);
          }
        }
        if (this.lifeTime > EXPLODING_TIME) {
          k.add([
            k.text("Booom!", 4),
            k.pos(this.pos),
            k.origin("center"),
            {
              add() {
                const boomText = this;
                k.wait(1, function () {
                  k.destroy(boomText);
                });
              },
              update() {
                this.pos.y -= 0.3;
              },
            },
          ]);
          k.camShake(4);
          k.destroy(this);
        }
      },
    },
  ]);
};

const onBomberGoblinAdded = (goblin) => {
  // If the goblin dies
  goblin.on("death", () => {
    goblin.changeState(states.DIE, goblin);
  });

  goblin.on("animEnd", (anim) => {
    if (anim === "attack") {
      spawnBomb(goblin);
      goblin.changeState(states.IDLE, goblin);
    }
  });
};

const spawnBomberGoblin = (pos) => {
  k.add([
    k.sprite("goblin_bomber", {
      frame: 0,
    }),
    k.solid(),
    "bomber_goblin",
    "enemy",
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
