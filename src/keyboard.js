import constants from "./constants";
import k from "./kaboom";

let viewDirection = "right";

const spawnBullet = (player) => {
  k.add([
    k.rect(6, 2),
    k.pos(player.pos),
    k.origin("center"),
    k.color(0.5, 0.5, 1),
    // strings here means a tag
    "bullet",
    {
      direction: player.viewDirection,
    },
  ]);
};

const initKeyboardActions = (player) => {
  // Jump
  k.keyPress("space", () => {
    // these 2 functions are provided by body() component
    if (player.grounded() || player.isDoubleJumpging === false) {
      if (!player.grounded()) {
        player.isDoubleJumpging = true;
      }
      player.jump(constants.JUMP_FORCE);
      player.play("jump");
    }
  });

  // Move left
  k.keyDown("left", () => {
    viewDirection = "left";
    player.viewDirection = -1;
    player.scale.x = -1;
    player.move(-constants.MOVE_SPEED, 0);
  });

  k.keyPress("left", () => {
    player.play("run");
  });

  k.keyRelease("left", () => {
    if (player.grounded()) {
      player.play("idle");
    }
  });

  // Move right
  k.keyDown("right", () => {
    viewDirection = "right";
    player.viewDirection = 1;
    player.scale.x = 1;
    player.move(constants.MOVE_SPEED, 0);
  });

  k.keyPress("right", () => {
    player.play("run");
  });

  k.keyRelease("right", () => {
    if (player.grounded()) {
      player.play("idle");
    }
  });

  // Attack
  k.keyDown("c", () => {
    if (player.canShoot()) {
      player.hasShot();
      player.play("shoot");
      spawnBullet(player);
    }
  });

  k.keyRelease("c", () => {
    player.play("idle");
  });
};

export default initKeyboardActions;
