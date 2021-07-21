import constants from "../constants";
import k from "../kaboom";
import viewDirection from "../components/viewDirection";

const attack = () => {
  let timeSinceLastAttack = constants.ATTACK_DELAY;
  // Runs every frame
  k.action(() => {
    timeSinceLastAttack += k.dt();
  });

  /**
   * Check if the game object can attack.
   *
   * @returns
   */
  function canAttack() {
    return timeSinceLastAttack >= constants.ATTACK_DELAY;
  }

  const spawnAttack = (gameobject) => {
    const gameObjectViewDirection = gameobject.getViewDirection();
    k.add([
      k.sprite("sword_effect"),
      k.pos({
        y: gameobject.pos.y - 2,
        x: gameobject.pos.x + 16 * gameObjectViewDirection,
      }),
      k.origin("center"),
      k.scale(1),
      viewDirection(gameObjectViewDirection),
      "attack",
      {
        /**
         * Place hit effect at the sword attacks position.
         */
        hit() {
          const swordAttack = this;
          k.add([
            k.sprite("hit_sparkle"),
            k.pos(swordAttack.pos),
            k.origin("center"),
            {
              add() {
                this.play("effect", false);
                this.on("animEnd", (anim) => {
                  if (anim === "effect") {
                    k.destroy(this);
                  }
                });
              },
            },
          ]);
          k.wait(0.1, function () {
            k.destroy(swordAttack);
          });
        },
        add() {
          this.scale.x = gameObjectViewDirection;
          this.play("effect", false);
          this.on("animEnd", (anim) => {
            if (anim === "effect") {
              k.destroy(this);
            }
          });

          k.collides("attack", "enemy", (attack, enemy) => {
            attack.hit();
            enemy.suffer(1);
            enemy.bounce(this.getViewDirection());
          });

          k.collides("attack", "block", (attack, block) => {
            attack.hit();
          });

          k.collides("attack", "bird", (attack, block) => {
            attack.hit();
          });
        },
      },
    ]);
  };

  return {
    canAttack,
    attack() {
      timeSinceLastAttack = 0;
      spawnAttack(this);
    },
  };
};

export default attack;
