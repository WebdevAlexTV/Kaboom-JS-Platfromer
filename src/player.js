import k from "./kaboom";
import shoot from "./components/shoot";
import health from "./components/health";

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
        health(3, 3),
        "player",
        {
            viewDirection: 1,
            isDoubleJumpging: false,
        },
    ]);

    // Player comes back to earth again
    player.on("grounded", () => {
        player.isDoubleJumpging = false;
        player.play("idle");
    });

    player.on("death", () => {
        player.play("die");
        k.wait(0.75, () => {
            k.destroy(player);
        });
    });

    // Player idle animation on default
    player.play("idle");

    return player;
};

export default initPlayer;
