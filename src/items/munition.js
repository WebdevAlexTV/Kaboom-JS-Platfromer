import k from "../kaboom";
import { getPlayer } from "../player";

const spawnMunition = (position) => {
  return k.add([
    k.sprite("orb"),
    k.pos(position),
    k.origin("center"),
    k.body(),
    "collectible",
    {
      add() {
        this.play("fly");

        const orb = this;

        this.collides("player", function () {
          const player = getPlayer();
          player.addMunition(1);
          spawnExplosion(orb);
        });
      },
    },
  ]);
};

/**
 * Spawn the explosion for the orb.
 * @param {*} orb
 */
export function spawnExplosion(orb) {
  k.add([
    k.sprite("orb_explosion"),
    k.pos(orb.pos),
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
  k.destroy(orb);
}

export default spawnMunition;
