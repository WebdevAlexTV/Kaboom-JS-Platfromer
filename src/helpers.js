import k from "./kaboom";

export const addEffectText = (origin, text, size = 4) => {
  k.add([
    k.text(text, size),
    k.pos(origin.pos),
    k.origin("center"),
    {
      add() {
        const boomText = this;
        k.wait(1, function () {
          k.destroy(boomText);
        });
      },
      update() {
        this.pos.y -= 0.3;
      },
    },
  ]);
};
