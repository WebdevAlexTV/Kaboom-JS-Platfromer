import k from "./kaboom";

const initUi = (player) => {
    const healthText = k.add([
        // content, size
        k.text(`Health: ${player.getCurrentHealth()}`, 12),
        k.pos(10, 10),
        k.layer("ui"),
    ]);

    player.action(() => {
        healthText.text = `Health: ${player.getCurrentHealth()}`;
    });
};

export default initUi;
