import k from "./kaboom";
import { getPlayer } from "./player";

const initCamera = () => {
  const player = getPlayer();

  k.camIgnore(["bg", "ui"]);

  // Let the camera follow the player.
  player.action(() => {
    // Fix the camera on the bottom level line
    const position = { ...player.pos, y: 240 };

    const minX = Math.floor(k.width() / 2);
    if (position.x < minX) {
      position.x = minX;
    }

    if (160 - player.pos.y > -30) {
      position.y = 240 - (160 - player.pos.y) - 30;
    }
    k.camPos(position);
  });
};

export default initCamera;
