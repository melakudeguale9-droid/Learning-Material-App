const StoreStorage = {
  KEYS: {
    MATERIALS: 'toby_store_materials_v4',
    CART: 'toby_store_cart_v4'
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

  resetMaterials() {
    localStorage.removeItem(this.KEYS.MATERIALS);
    return [...DEFAULT_MATERIALS];
  }
};
