import MapStore from './MapStore.js';
import WikiStore from './WikiStore.js';

class Store {
  constructor() {
    this.mapStore = new MapStore(this);
    this.wikiStore = new WikiStore(this);
  }
}

export default new Store();
