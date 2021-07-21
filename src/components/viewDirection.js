const viewDirection = (initialViewDirection = 1) => {
  let viewDirection = initialViewDirection;

  return {
    setViewDirection(value) {
      viewDirection = value;
    },
    getViewDirection() {
      return viewDirection;
    },
    lookLeft() {
      viewDirection = -1;
    },
    lookRight() {
      viewDirection = 1;
    },
  };
};

export default viewDirection;
