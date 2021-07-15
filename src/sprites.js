import k from "./kaboom";

const loadSprites = () => {
  k.loadRoot("./resources/sprites/");
  k.loadSprite("tileset", "tileset.png", {
    sliceX: 12,
    sliceY: 6,
  });
  k.loadSprite("player", "hero.png", {
    sliceX: 8,
    sliceY: 15,
    anims: {
      idle: {
        from: 40,
        to: 43,
      },
      run: {
        from: 8,
        to: 13,
      },
      fall: {
        from: 48,
        to: 50,
      },
      jump: {
        from: 56,
        to: 58,
      },
      jumpRoll: {
        from: 72,
        to: 74,
      },
      shoot: {
        from: 24,
        to: 24,
      },
      die: {
        from: 0,
        to: 7,
      },
      suffer: {
        from: 64,
        to: 66,
      },
    },
  });

  k.loadSprite("jump_effect", "hero.png", {
    sliceX: 8,
    sliceY: 15,
    anims: {
      jump: {
        from: 96,
        to: 99,
      },
      doubleJump: {
        from: 97,
        to: 99,
      },
    },
  });

  k.loadSprite("goblin", "goblin.png", {
    sliceX: 6,
    sliceY: 5,
    anims: {
      run: {
        from: 0,
        to: 5,
      },
      idle: {
        from: 19,
        to: 22,
      },
      die: {
        from: 6,
        to: 11,
      },
      suffer: {
        from: 24,
        to: 26,
      },
    },
  });

  k.loadSprite("goblin_attack", "goblin.png", {
    sliceX: 4,
    sliceY: 5,
    anims: {
      attack: {
        from: 8,
        to: 11,
      },
    },
  });

  k.loadSprite("orb", "orb_flying.png", {
    sliceX: 6,
    sliceY: 1,
    anims: {
      fly: {
        from: 0,
        to: 5,
      },
    },
  });

  k.loadSprite("orb_explosion", "orb_exploding.png", {
    sliceX: 6,
    sliceY: 1,
    anims: {
      explode: {
        from: 0,
        to: 5,
      },
    },
  });

  k.loadSprite("heart", "hearts_hud.png");

  k.loadSprite("background", "background.png");
};

export default loadSprites;
