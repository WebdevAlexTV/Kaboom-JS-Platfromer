import k from "../kaboom";
import constants from "../constants";
import level from "../level";
import initKeyboardActions from "../keyboard";
import initPlayer from "../player";
import { goblinConfig, goblinUpdate } from "../enemies/goblin";

const main = () => {
  const player = initPlayer();

  // Let the user interact via keyboard.
  initKeyboardActions(player);

  k.action("bullet", (bullet) => {
    bullet.color = k.rand(k.rgb(0, 0, 0), k.rgb(1, 1, 1));
    bullet.move(bullet.direction * constants.BULLET_SPEED, 0);
    // remove the bullet if it's out of the scene for performance
    if (bullet.pos.x > player.pos.x + k.width() / 2) {
      k.destroy(bullet);
      console.log("bullet destroyed");
    }
  });

  k.collides("bullet", "block", (bullet, block) => {
    k.destroy(bullet);
  });

  k.collides("bullet", "enemy", (bullet, enemy) => {
    k.destroy(bullet);
    k.destroy(enemy);
  });

  goblinUpdate(player);

  k.addLevel(level, {
    width: 16,
    height: 16,
    pos: k.vec2(0, k.height() / 2),
    "=": [
      k.sprite("tileset", {
        frame: 1,
      }),
      k.solid(),
      "block",
    ],
    "#": [
      k.sprite("tileset", {
        frame: 13,
      }),
      k.solid(),
      "block",
    ],
    G: goblinConfig(),
  });
};

export default main;
