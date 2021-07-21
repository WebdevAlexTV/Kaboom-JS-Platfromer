import k from "../kaboom";
import initPlayer from "../player";
import { goblinConfig } from "../enemies/goblin";
import initUi from "../ui";
import initCamera from "../camera";
import { birdConfig } from "../ambient/bird";

const level = [
  "                                                                                             ",
  "T                                                                                            ",
  "H                                                                                            ",
  "H                                                                                            ",
  "H                                                                                            ",
  "H                                                                                            ",
  "H                                                                                            ",
  "H                                                                                            ",
  "H                              <>                                                            ",
  "H                        <---->                                                              ",
  "H           <---->                                                                           ",
  "H                                          <->                                               ",
  "L===T    B          G               G                                                        ",
  "####L===============================]WWWW[===================================================",
  "####################################)WWWW(####################################################",
];

const main = () => {
  k.sceneData().lost = false;

  const player = initPlayer();

  k.layers(["bg", "ambient_bg", "obj", "ambient", "ui"], "obj");

  // Handle the camera
  initCamera();

  // Initialize the ui
  initUi();

  k.add([k.sprite("background"), k.layer("bg")]);
  k.add([k.sprite("background2"), k.layer("bg")]);

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
      {
        add() {
          const random = Math.random();
          if (random > 0.9 || random < 0.1) {
            const sprite = random > 0.9 ? "grass" : "drygrass";
            const position = { ...this.pos };
            position.x += 8;
            k.add([
              k.sprite(sprite),
              "ambient",
              k.origin("bot"),
              k.pos(position),
            ]);
          }
        },
      },
    ],
    T: [
      k.sprite("tileset", {
        frame: 2,
      }),
      k.solid(),
      "block",
    ],
    H: [
      k.sprite("tileset", {
        frame: 14,
      }),
      k.solid(),
      "block",
    ],
    L: [
      k.sprite("tileset", {
        frame: 27,
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
    "]": [
      k.sprite("tileset", {
        frame: 2,
      }),
      k.solid(),
      "block",
    ],
    "[": [
      k.sprite("tileset", {
        frame: 0,
      }),
      k.solid(),
      "block",
    ],
    ")": [
      k.sprite("tileset", {
        frame: 14,
      }),
      k.solid(),
      "block",
    ],
    "(": [
      k.sprite("tileset", {
        frame: 12,
      }),
      k.solid(),
      "block",
    ],
    "<": [
      k.sprite("tileset", {
        frame: 42,
      }),
      k.solid(),
      "block",
    ],
    "-": [
      k.sprite("tileset", {
        frame: 43,
      }),
      k.solid(),
      "block",
    ],
    ">": [
      k.sprite("tileset", {
        frame: 44,
      }),
      k.solid(),
      "block",
    ],
    W: [
      {
        add() {
          const waterfall = k.add([
            k.sprite("waterfall"),
            k.layer("ambient_bg"),
            "waterfall",
            k.pos({ ...this.pos, y: this.pos.y + 2 }),
          ]);
          waterfall.play("waterfall");
          //k.destroy(this);
        },
      },
    ],
    G: goblinConfig(),
    B: birdConfig(),
  });
};

export default main;
