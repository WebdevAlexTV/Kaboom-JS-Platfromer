import k from "./kaboom";
import shoot from "./components/shoot";
import health from "./components/health";
import control from "./components/control";
import stateMachine, { states } from "./components/stateMachine";
import constants from "./constants";
import bouncable from "./components/bounce";
import viewDirection from "./components/viewDirection";

const stateActions = {
  /**
   * Idle
   */
  [states.IDLE]: {
    updateAction: (player) => {},
    resolve: (player) => {
      player.play("idle");
    },
    canResolve: (player) => {
      return !player.isDead();
    },
  },
  /**
   * Move
   */
  [states.MOVE]: {
    updateAction: (player) => {},
    resolve: (player) => {
      player.play("run");
    },
    canResolve: (player) => {
      return player.grounded() && !player.isDead() && !player.isSuffering();
    },
  },
  /**
   * Shoot
   */
  [states.SHOOT]: {
    updateAction: (player) => {},
    resolve: (player) => {
      player.shoot();
      player.play("shoot", false);
    },
    canResolve: (player) => {
      return player.canShoot() && !player.isDead() && !player.isSuffering();
    },
  },
  /**
   * Jump
   */
  [states.JUMP]: {
    updateAction: (player) => {},
    resolve: (player) => {
      player.doJump();
    },
    canResolve: (player) => {
      return player.canJump() && !player.isDead() && !player.isSuffering();
    },
  },
  /**
   * Fall
   */
  [states.FALL]: {
    updateAction: (player) => {},
    resolve: (player) => {
      player.play("fall");
    },
    canResolve: (player) => {
      return !player.isDead() && !player.isSuffering();
    },
  },
  /**
   * Suffer
   */
  [states.SUFFER]: {
    updateAction: (player) => {},
    resolve: (player) => {
      player.setSuffering(true);
      player.play("suffer", false);
    },
    canResolve: (player) => {
      return !player.isDead();
    },
  },
  /**
   * Die
   */
  [states.DIE]: {
    updateAction: (player) => {},
    resolve: (player) => {
      player.play("die", false);
    },
  },
};

const addJumpEffect = (player) => {
  k.add([
    k.sprite("jump_effect"),
    k.pos(player.pos),
    k.origin("center"),
    "jump_effect",
    {
      add() {
        this.play(player.isDoubleJumpging ? "doubleJump" : "jump");
        k.wait(0.3, () => {
          k.destroy(this);
        });
      },
    },
  ]);
};

const initPlayer = () => {
  const player = k.add([
    k.sprite("player", {
      frame: 40,
      animSpeed: 0.15,
    }),
    k.origin("center"),
    k.pos(30, 200),
    k.scale(1),
    k.body(),
    shoot(),
    health(3),
    control(),
    bouncable(),
    viewDirection(),
    stateMachine(states.IDLE, stateActions),
    "player",
    {
      isDoubleJumpging: false,
      add() {
        this.on("animEnd", (anim) => {
          if (this.grounded()) {
            if (k.keyIsDown("left") || k.keyIsDown("right")) {
              player.play("run");
            } else {
              player.play("idle");
            }
          } else {
            if (anim === "jump" || anim === "jumpRoll" || anim === "shoot") {
              this.play("fall");
            }
          }
          if (anim === "suffer") {
            player.setSuffering(false);
            player.changeState(player.getLastState(), player);
          }
        });
      },
      /**
       * Check if the user can jump.
       * @returns
       */
      canJump() {
        return this.grounded() || this.isDoubleJumpging === false;
      },
      /**
       * Perform the jump if possible.
       */
      doJump(small = false) {
        if (this.canJump()) {
          if (!this.grounded()) {
            this.isDoubleJumpging = true;
            this.play("jumpRoll", false);
          } else {
            this.play("jump", false);
          }

          addJumpEffect(this);
          this.jump(small ? constants.JUMP_FORCE / 2 : constants.JUMP_FORCE);
        }
      },
      /**
       * Run in the given direction.
       * @param {*} direction
       */
      run(direction) {
        this.setViewDirection(direction);
        this.scale.x = direction;
        this.move(this.getViewDirection() * constants.MOVE_SPEED, 0);
      },
      /**
       * Checks if the player is dead.
       * @returns
       */
      isDead() {
        return this.getState() === states.DIE;
      },
      /**
       * Check if the player can interact (via keys).
       * @returns
       */
      canInteract() {
        return this.getState() !== states.SUFFER && !this.isDead();
      },
    },
  ]);

  // Player comes back to earth again
  player.on("grounded", () => {
    player.isDoubleJumpging = false;

    if (k.keyIsDown("left") || k.keyIsDown("right")) {
      player.changeState(states.MOVE, player);
    } else {
      player.changeState(states.IDLE, player);
    }
  });

  player.on("death", () => {
    player.changeState(states.DIE, player);
    k.wait(0.75, () => {
      k.destroy(player);
    });
    k.sceneData().lost = true;
  });

  player.action(() => {
    if (player.pos.y > k.height() * 3) {
      player.suffer(player.getMaxHealth());
      player.trigger("death");
    }
  });

  return player;
};

export const getPlayer = () => {
  return k.get("player")[0];
};

export default initPlayer;
