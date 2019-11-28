import {action, observable, decorate, configure} from 'mobx';
import {
  AccessToken,
  GraphRequestManager,
  GraphRequest,
} from 'react-native-fbsdk';
import {Alert} from 'react-native';

configure({enforceActions: 'observed'});

class MapStore {
  loggedIn = false;
  region = {};

  constructor(rootStore) {
    this.rootStore = rootStore;
    console.log(this.user);
  }
  getCurrentLocation() {}
}

decorate(MapStore, {
  getCurrentLocation: action,
});

export default MapStore;
