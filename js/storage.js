const StoreStorage = {
  KEYS: {
    MATERIALS: 'toby_store_materials_v8',
    CART: 'toby_store_cart_v8',
    QUIZ_PROGRESS: 'toby_store_quiz_v8'
  },

  getMaterials() {
    try {
      const saved = localStorage.getItem(this.KEYS.MATERIALS);
      return saved ? JSON.parse(saved) : [...DEFAULT_MATERIALS];
    } catch {
      return [...DEFAULT_MATERIALS];
    }
  },

  saveMaterials(list) {
    localStorage.setItem(this.KEYS.MATERIALS, JSON.stringify(list));
  },

  getCart() {
    try {
      const saved = localStorage.getItem(this.KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  saveCart(cart) {
    localStorage.setItem(this.KEYS.CART, JSON.stringify(cart));
  },

  getQuizProgress() {
    try {
      const saved = localStorage.getItem(this.KEYS.QUIZ_PROGRESS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  },

  markLevelPassed(materialId, level, score) {
    const progress = this.getQuizProgress();
    if (!progress[materialId]) progress[materialId] = {};
    const prev = progress[materialId][level] || 0;
    progress[materialId][level] = Math.max(prev, score);
    localStorage.setItem(this.KEYS.QUIZ_PROGRESS, JSON.stringify(progress));
    return progress[materialId];
  },

  resetMaterials() {
    localStorage.removeItem(this.KEYS.MATERIALS);
    return [...DEFAULT_MATERIALS];
  }
};
