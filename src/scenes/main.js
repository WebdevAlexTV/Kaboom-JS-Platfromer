import k from "../kaboom";
import initPlayer from "../player";
import { goblinConfig } from "../enemies/goblin";
import initUi from "../ui";
import initCamera from "../camera";

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
  "H                      <---->                                                                ",
  "H           <---->                                                                           ",
  "H                                          <->                                               ",
  "H                  G                                                                         ",
  "L===================================]    [====================================================",
  "####################################)    (######################################################",
];

const main = () => {
  k.sceneData().lost = false;

  const player = initPlayer();

  k.layers(["bg", "obj", "ui"], "obj");

  // Handle the camera
  initCamera();

  // Initialize the ui
  initUi();

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
    G: goblinConfig(),
  });
};

export default main;
