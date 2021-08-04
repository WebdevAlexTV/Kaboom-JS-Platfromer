import constants from "../constants";
import { spawnExplosion } from "../items/munition";
import k from "../kaboom";

const shoot = (max, current = null) => {
  let timeSinceLastShot = constants.SHOOT_DELAY;
  let maxMunition = max;
  let currentMunition = current === null ? max : current;

  // Runs every frame
  k.action(() => {
    timeSinceLastShot += k.dt();
  });

  /**
   * Check if the game object can shoot.
   *
   * @returns
   */
  function canShoot() {
    return timeSinceLastShot >= constants.SHOOT_DELAY && currentMunition > 0;
  }

  /**
   * Spawn an orb as projectile.
   *
   * @param {*} position
   * @param {*} direction
   */
  function spawnOrb(position, direction) {
    k.add([
      k.sprite("orb"),
      k.pos(position),
      k.origin("center"),
      "bullet",
      {
        direction,
        add() {
          this.play("fly");
        },
        explode() {
          spawnExplosion(this);
        },
      },
    ]);
  }

  /**
   * If the game object can shoot, it shoots.
   */
  function shoot() {
    if (this.canShoot()) {
      this.play("shoot", false);
      timeSinceLastShot = 0;
      currentMunition--;
      spawnOrb(this.pos, this.getViewDirection());
    }
  }

  return {
    shoot,
    canShoot,
    getCurrentMunition() {
      return currentMunition;
    },
    getMaxMunition() {
      return maxMunition;
    },
    addMunition(value) {
      if (currentMunition + value <= maxMunition) {
        currentMunition += value;
      } else {
        currentMunition = maxMunition;
      }
    },
    add() {
      // Handle the bullet movement
      k.action("bullet", (bullet) => {
        if (!bullet.collided) {
          bullet.move(bullet.direction * constants.BULLET_SPEED, 0);
        }

        // remove the bullet if it's out of the scene for performance
        if (bullet.pos.x > this.pos.x + k.width()) {
          k.destroy(bullet);
        }
      });

      // Bullet vs. block
      k.collides("bullet", "block", (bullet, block) => {
        bullet.explode();
      });

      // Bullet vs. enemy
      k.collides("bullet", "enemy", (bullet, enemy) => {
        bullet.explode();
        enemy.suffer(1);
        enemy.bounce(this.getViewDirection());
      });
    },
  };
};

export default shoot;
