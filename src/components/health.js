const health = (initMaxHealth, initCurrentHealth = null) => {
  let maxHealth = initMaxHealth;
  let currentHealth =
    initCurrentHealth === null ? initMaxHealth : initCurrentHealth;

  let suffering = false;

  /**
   * Heal the given amount of health.
   *
   * @param {*} value
   */
  function heal(value) {
    if (currentHealth + value > maxHealth) {
      currentHealth = maxHealth;
    } else {
      currentHealth += value;
    }
  }

  /**
   * Suffer the given amount of damage.
   *
   * @param {*} value
   */
  function suffer(value) {
    if (currentHealth - value <= 0) {
      currentHealth = 0;
      this.trigger("death");
    } else {
      currentHealth -= value;
      this.trigger("suffer");
    }
  }

  return {
    isSuffering: () => suffering,
    setSuffering(value) {
      suffering = value;
    },
    getCurrentHealth: () => currentHealth,
    getMaxHealth: () => maxHealth,
    isDead: () => currentHealth === 0,
    heal,
    suffer,
  };
};

export default health;
