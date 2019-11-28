import MapStore from './MapStore.js';

class Store {
  constructor() {
    this.mapStore = new MapStore(this);
  }
}

export default new Store();
