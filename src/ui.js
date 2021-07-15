import k from "./kaboom";
import { getPlayer } from "./player";

const initUi = () => {
  const player = getPlayer();
  const hearts = [];

  const addHeart = () => {
    return k.add([
      k.sprite("heart"),
      k.pos((hearts.length + 1) * 20, 10),
      k.layer("ui"),
    ]);
  };

  k.add([k.sprite("background"), k.layer("bg")]);

  for (let i = 1; i <= player.getCurrentHealth(); i++) {
    hearts.push(addHeart());
  }

  player.action(() => {
    const currentHealth = player.getCurrentHealth();
    const numberOfHearts = hearts.length;

    if (currentHealth > numberOfHearts) {
      hearts.push(addHeart());
    } else if (currentHealth < numberOfHearts) {
      k.destroy(hearts.pop());
    }
  });
};

export default initUi;
