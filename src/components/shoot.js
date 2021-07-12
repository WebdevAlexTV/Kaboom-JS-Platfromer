import constants from "../constants";
import k from "../kaboom";

const shoot = () => {
    let timeSinceLastShot = 0;
    // Runs every frame
    k.action(() => {
        timeSinceLastShot += k.dt();
    });

    return {
        canShoot: () => timeSinceLastShot >= constants.SHOOT_DELAY,
        hasShot: () => {
            timeSinceLastShot = 0;
        },
    };
};

export default shoot;
