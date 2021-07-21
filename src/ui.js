import k from "./kaboom";
import { getPlayer } from "./player";

const initUi = () => {
  const player = getPlayer();
  const hearts = [];

  function addButton(buttonText, pos, callback) {
    const bg = k.add([
      k.pos(pos),
      k.rect(60, 30),
      k.origin("center"),
      k.color(1, 1, 1),
      k.layer("ui"),
    ]);

    k.add([
      k.text(buttonText),
      k.pos(pos),
      k.origin("center"),
      k.color(0, 0, 0),
      k.layer("ui"),
    ]);

    bg.action(() => {
      if (bg.isHovered()) {
        bg.color = k.rgb(0.8, 0.8, 0.8);
        if (k.mouseIsClicked()) {
          callback();
        }
      } else {
        bg.color = k.rgb(1, 1, 1);
      }
    });
  }

  const addHeart = () => {
    return k.add([
      k.sprite("heart"),
      k.pos((hearts.length + 1) * 20, 10),
      k.layer("ui"),
    ]);
  };

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

  player.on("death", () => {
    k.add([k.text("Ooops, you're dead!", 10), k.pos(20, 20), k.layer("ui")]);
    addButton("Retry", k.vec2(k.width() / 2, k.height() / 2), () => {
      k.go("main");
    });
  });
};

export default initUi;
