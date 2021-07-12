const health = (initMaxHealth, initCurrentHealth) => {
    let maxHealth = initMaxHealth;
    let currentHealth = initCurrentHealth;

    /**
     * Heal the given amount of health.
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
     * @param {*} value
     */
    function suffer(value) {
        if (currentHealth - value <= 0) {
            currentHealth = 0;
            this.trigger("death");
        } else {
            currentHealth -= value;
        }
    }

    return {
        getCurrentHealth: () => currentHealth,
        getMaxHealth: () => maxHealth,
        heal,
        suffer,
    };
};

export default health;
