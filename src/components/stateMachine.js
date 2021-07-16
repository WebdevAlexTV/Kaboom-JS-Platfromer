import k from "../kaboom";

export const states = {
  IDLE: "IDLE",
  MOVE: "MOVE",
  SHOOT: "SHOOT",
  ATTACK: "ATTACK",
  JUMP: "JUMP",
  FALL: "FALL",
  SUFFER: "SUFFER",
  DIE: "DIE",
};

const stateMachine = (initialState, stateActions) => {
  let currentState = initialState;
  let lastState = initialState;

  const changeState = (state, context) => {
    if (
      stateActions[state] &&
      stateActions[state].canResolve &&
      stateActions[state].canResolve(context)
    ) {
      stateActions[state].resolve(context);
      if (state !== states.SUFFER) {
        lastState = currentState;
      }
      currentState = state;

      return true;
    }

    return false;
  };

  return {
    state: currentState,
    getState: () => currentState,
    getLastState: () => lastState,
    changeState,
    add() {
      stateActions[currentState].resolve(this);
    },
    update() {
      if (k.sceneData().lost === false) {
        stateActions[currentState].updateAction(this);
      }
    },
  };
};

export default stateMachine;
