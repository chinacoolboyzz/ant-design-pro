import jwtDecode from 'jwt-decode';
import _ from 'lodash';

/**
 * JWT的方案
 */
export default {
  parse() {
    const token = this.get();
    if (token === null) return null;
    try {
      return jwtDecode(token);
    } catch (ex) {
      throw ex;
    }
  },
  check() {
    try {
      const payload = this.parse();

      return !_.isEmpty(payload);
    } catch (ex) {
      this.remove();
      return false;
    }
  },
  get() {
    try {
      return sessionStorage.getItem(STORAGE_TOKEN_NAME);
    } catch (ex) {
      throw ex;
    }
  },
  save(token: string) {
    sessionStorage.setItem(STORAGE_TOKEN_NAME, token);
  },
  remove() {
    sessionStorage.removeItem(STORAGE_TOKEN_NAME);
  },
};
