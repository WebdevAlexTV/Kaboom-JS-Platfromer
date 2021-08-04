import k from "../kaboom";

const spawnBlood = (position) => {
  k.add([
    k.pos(position),
    "blood",
    {
      add() {
        for (let i = 0; i < 5; i++) {
          addBloodParticle(position, i < 3 ? 1 : -1);
        }
        k.destroy(this);
      },
    },
  ]);
};

const addBloodParticle = (position, direction) => {
  const bloodParticle = k.add([
    k.rect(2, 2),
    k.pos(position),
    k.body(),
    {
      add() {
        this.on("grounded", () => {
          k.destroy(this);
        });
      },
      update() {
        if (!this.grounded()) {
          this.move(Math.floor(Math.random() * 300 * direction), 0);
        }
      },
    },
  ]);
  bloodParticle.color = k.rgb(255, 0, 0);
};

export default spawnBlood;
