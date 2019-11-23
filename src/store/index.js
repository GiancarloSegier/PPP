import UserStore from './UserStore.js';

class Store {
  constructor() {
    this.userStore = new UserStore(this);
  }
}

export default new Store();
