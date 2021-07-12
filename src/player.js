import k from "./kaboom";
import shoot from "./components/shoot";

const initPlayer = () => {
  const player = k.add([
    k.sprite("player", {
      frame: 40,
      animSpeed: 0.25,
    }),
    k.origin("center"),
    k.pos(80, 80),
    k.scale(1),
    k.body(),
    shoot(),
    "player",
    {
      viewDirection: 1,
      isDoubleJumpging: false,
    },
  ]);

  // Let the camera follow the player.
  player.action(() => {
    k.camPos(player.pos);
  });

  // Player comes back to earth again
  player.on("grounded", () => {
    player.isDoubleJumpging = false;
    player.play("idle");
  });

  // Player idle animation on default
  player.play("idle");

  return player;
};

export default initPlayer;
