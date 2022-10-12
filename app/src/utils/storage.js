 
const TOKEN_KEY = "salud_vector_key";
const CURRENT_ROUTE = "currentRoute";

const parse = JSON.parse;
const stringify = JSON.stringify;

/**
 *! I will be using only local storage
 */
const sessionStorageUtil = {
  /**
   * CLEAR
   */
  clear(key) {
    if (sessionStorage && sessionStorage.getItem(key)) {
      return sessionStorage.removeItem(key);
    }
    return null;
  },

  // Clear all local storage
  clearAppStorage() {
    if (sessionStorage) {
      sessionStorage.clear();
    }
  },

  clearToken() {
    return sessionStorageUtil.clear(TOKEN_KEY);
  },

  /**
   * GETTERS
   */
  get(key) {
    if (sessionStorage && sessionStorage.getItem(key)) {
      return parse(sessionStorage.getItem(key)) || null;
    }
    return null;
  },

  getToken() {
    return sessionStorageUtil.get(TOKEN_KEY);
  },

  getCurrentRoute() {
    return sessionStorageUtil.get(CURRENT_ROUTE);
  },

  /**
   * SETTERS
   */
  set(value, key) {
    if (sessionStorage) {
      return sessionStorage.setItem(key, stringify(value));
    }

    return null;
  },
  setToken(value) {
    return sessionStorageUtil.set(value, TOKEN_KEY);
  },
  setCurrentRoute(value) {
    return sessionStorageUtil.set(value, CURRENT_ROUTE);
  }
};

const localStorageUtil = {
  /**
   * CLEAR
   */
  clear(key) {
    if (localStorage && localStorage.getItem(key)) {
      return localStorage.removeItem(key);
    }
    return null;
  },

  // Clear all local storage
  clearAppStorage() {
    if (localStorage) {
      localStorage.clear();
    }
  },

  clearToken() {
    return localStorageUtil.clear(TOKEN_KEY);
  },

  /**
   * GETTERS
   */
  get(key) {
    if (localStorage && localStorage.getItem(key)) {
      return parse(localStorage.getItem(key)) || null;
    }
    return null;
  },

  getToken() {
    return localStorageUtil.get(TOKEN_KEY);
  },

  getCurrentRoute() {
    return localStorageUtil.get(CURRENT_ROUTE);
  },

  /**
   * SETTERS
   */
  set(value, key) {
    if (localStorage) {
      return localStorage.setItem(key, stringify(value));
    }

    return null;
  },
  setToken(value) {
    return localStorageUtil.set(value, TOKEN_KEY);
  },
  setCurrentRoute(value) {
    return localStorageUtil.set(value, CURRENT_ROUTE);
  }
};

export default localStorageUtil;
