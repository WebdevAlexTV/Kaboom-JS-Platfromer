import k from "./kaboom";

const initCamera = (player) => {
    k.camIgnore(["bg", "ui"]);

    // Let the camera follow the player.
    player.action(() => {
        // Fix the camera on the bottom level line
        const position = { ...player.pos, y: 240 };
        const minX = Math.floor(k.width() / 2);
        if (position.x < minX) {
            position.x = minX;
        }
        k.camPos(position);
    });
};

export default initCamera;
