import constants from "../constants";
import k from "../kaboom";
import stateMachine, { states } from "../components/stateMachine";
import health from "../components/health";

const stateActions = {
    /**
     * IDLE
     */
    [states.IDLE]: {
        updateAction: ({ goblin, player }) => {
            if (
                goblin.pos.x - player.pos.x > -150 &&
                goblin.pos.x - player.pos.x < 150
            ) {
                goblin.changeState(states.MOVE, { goblin, player });
            }
            if (goblin.frame === 22) {
                goblin.play("idle");
            }
        },
        resolve: ({ goblin, player }) => {
            goblin.changeSprite("goblin");
            goblin.frame = 22;
        },
        canResolve: (context) => {
            return true;
        },
    },
    /**
     * MOVE
     */
    [states.MOVE]: {
        updateAction: ({ goblin, player }) => {
            goblin.move(constants.ENEMY_SPEED * goblin.moveDirection, 0);
            goblin.scale.x = 1 * goblin.moveDirection;

            if (goblin.pos.x - player.pos.x < -10) {
                goblin.moveDirection = 1;
            }
            if (goblin.pos.x - player.pos.x > 10) {
                goblin.moveDirection = -1;
            }

            if (goblin.frame === 5) {
                goblin.play("run");
            }
        },
        resolve: ({ goblin, player }) => {
            goblin.changeSprite("goblin");
            goblin.frame = 5;
        },
        canResolve: (context) => {
            return true;
        },
    },
    /**
     * Attack
     */
    [states.ATTACK]: {
        updateAction: ({ goblin, player }) => {
            if (goblin.frame === 11) {
                goblin.play("attack");
            }
        },
        resolve: ({ goblin, player }) => {
            goblin.changeSprite("goblin_attack");
            goblin.frame = 11;
            k.wait(1, () => {
                goblin.changeState(states.MOVE, { goblin, player });
            });
        },
        canResolve: (context) => {
            return true;
        },
    },
    /**
     * Die
     */
    [states.DIE]: {
        updateAction: ({ goblin }) => {},
        resolve: ({ goblin }) => {
            goblin.play("die");
            k.wait(0.5, () => {
                k.destroy(goblin);
            });
        },
        canResolve: (context) => {
            return true;
        },
    },
};

export const goblinConfig = () => {
    return [
        k.sprite("goblin", {
            frame: 22,
        }),
        k.solid(),
        "goblin",
        "enemy",
        k.scale(1),
        k.origin("center"),
        k.body(),
        stateMachine(states.IDLE, stateActions),
        health(3, 3),
        { moveDirection: -1 },
    ];
};

export const goblinUpdate = (player) => {
    k.action("goblin", (goblin) => {
        goblin.updateAction({ goblin, player });

        // If the goblin dies.
        goblin.on("death", () => {
            goblin.changeState(states.DIE, { goblin, player });
        });
    });

    k.collides("player", "goblin", (player, goblin) => {
        goblin.changeState(states.ATTACK, { goblin, player });
        player.suffer(1);
        k.camShake(6);
    });
};

export default goblinConfig;
