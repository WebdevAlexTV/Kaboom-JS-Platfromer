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
                from: 24,
                to: 27,
            },
            jump: {
                from: 56,
                to: 58,
            },
            shoot: {
                from: 24,
                to: 27,
            },
            die: {
                from: 0,
                to: 7,
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
};

export default loadSprites;
