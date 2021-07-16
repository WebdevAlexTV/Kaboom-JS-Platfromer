import constants from "../constants";
import k from "../kaboom";

const shoot = () => {
  let timeSinceLastShot = 0;
  // Runs every frame
  k.action(() => {
    timeSinceLastShot += k.dt();
  });

  function canShoot() {
    return timeSinceLastShot >= constants.SHOOT_DELAY;
  }

  function shoot() {
    if (this.canShoot()) {
      this.play("shoot", false);
      timeSinceLastShot = 0;
      k.add([
        k.sprite("orb"),
        k.pos(this.pos),
        k.origin("center"),
        "bullet",
        {
          direction: this.viewDirection,
          add() {
            this.play("fly");
          },
          explode() {
            const bullet = this;
            // Add the explosion effect.
            k.add([
              k.sprite("orb_explosion"),
              k.pos(bullet.pos),
              k.origin("center"),
              {
                add() {
                  this.play("explode");
                  k.wait(0.5, () => {
                    k.destroy(this);
                  });
                },
              },
            ]);
          },
        },
      ]);
    }
  }

  return {
    shoot,
    canShoot,
    add() {
      // Handle the bullet movement
      k.action("bullet", (bullet) => {
        if (!bullet.collided) {
          bullet.move(bullet.direction * constants.BULLET_SPEED, 0);
        }

        // remove the bullet if it's out of the scene for performance
        if (bullet.pos.x > this.pos.x + k.width()) {
          k.destroy(bullet);
          console.log("bullet destroyed");
        }
      });

      // Bullet vs. block
      k.collides("bullet", "block", (bullet, block) => {
        bullet.explode();
        k.destroy(bullet);
      });

      // Bullet vs. enemy
      k.collides("bullet", "enemy", (bullet, enemy) => {
        bullet.explode();
        k.destroy(bullet);
        enemy.suffer(1);
        enemy.bounce(this.viewDirection);
      });
    },
  };
};

export default shoot;
