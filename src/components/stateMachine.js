export const states = {
  IDLE: "IDLE",
  MOVE: "MOVE",
  SHOOT: "SHOOT",
  ATTACK: "ATTACK",
};

const stateMachine = (initialState, stateActions) => {
  let currentState = initialState;

  const changeState = (state, context) => {
    if (
      stateActions[state] &&
      stateActions[state].canResolve &&
      stateActions[state].canResolve(context)
    ) {
      stateActions[state].resolve(context);
      currentState = state;

      return true;
    } else {
      return false;
    }
  };

  const updateAction = (context) => {
    stateActions[currentState].updateAction(context);
  };

  return {
    state: currentState,
    changeState,
    updateAction,
  };
};

export default stateMachine;
