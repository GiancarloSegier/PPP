import MapStore from './MapStore.js';
import WikiStore from './WikiStore.js';
import TripStore from './TripStore.js';

class Store {
  constructor() {
    this.mapStore = new MapStore(this);
    this.wikiStore = new WikiStore(this);
    this.tripStore = new TripStore(this);
  }
}

export default new Store();
