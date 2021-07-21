import k from "../kaboom";

export const states = {
  IDLE: "IDLE",
  MOVE: "MOVE",
  FLY: "FLY",
  WAIT: "WAIT",
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
  let delayedState = null;
  let delayedTimeout = 0;
  let delayedContext = null;

  /**
   * Change the game object to the given state.
   *
   * @param {*} state The state we want to set.
   * @param {*} context The context game object.
   * @param {*} timeout If set, change the state after the given amount of seconds is expired
   * @returns True if the state change is possible or was successfull.
   */
  const changeState = (state, context, timeout = null) => {
    // Change state after timeout
    if (timeout !== null) {
      delayedState = state;
      delayedContext = context;
      delayedTimeout = timeout;

      return true;
    }

    delayedState = null;
    delayedTimeout = 0;
    delayedContext = null;

    if (
      stateActions[state] &&
      ((stateActions[state].canResolve &&
        stateActions[state].canResolve(context)) ||
        stateActions[state].canResolve === undefined)
    ) {
      if (currentState !== states.SUFFER) {
        lastState = currentState;
      }
      currentState = state;
      stateActions[state].resolve(context);

      return true;
    }

    return false;
  };

  return {
    state: currentState,
    getState: () => currentState,
    getLastState: () => lastState,
    isCurrentState: (value) => value === currentState,
    changeState,
    add() {
      stateActions[currentState].resolve(this);
    },
    update() {
      if (delayedState !== null) {
        delayedTimeout -= k.dt();
        if (delayedTimeout <= 0) {
          changeState(delayedState, delayedContext);
        }
      }

      if (k.sceneData().lost === false) {
        stateActions[currentState].updateAction(this);
      }
    },
  };
};

export default stateMachine;
