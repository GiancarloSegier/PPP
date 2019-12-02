import {action, observable, decorate, configure} from 'mobx';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';

configure({enforceActions: 'observed'});

class MapStore {
  latitude;
  longitude;
  userLocation = {};
  currentCity = '';
  constructor(rootStore) {
    this.rootStore = rootStore;
    Geocoder.init('AIzaSyBLSLqH_qXkSrU5qK1M71zmWU3gpjs8C4g'), {language: 'en'};
    this.getCurrentLocation();
  }

  // getCurrentCity() {
  //   Geocoder.from(this.userLocation.latitude, this.userLocation.longitude)
  //     .then(json => {
  //       const city = json.results[0].address_components.filter(address =>
  //         address.types.includes('locality'),
  //       )[0].long_name;
  //       console.log(city);
  //       if (city !== undefined) {
  //         this.currentCity = city;
  //       } else {
  //         this.currentCity = '';
  //       }
  //     })
  //     .catch(error => console.warn(error));
  // }

  getCurrentLocation = async () => {
    await Geolocation.getCurrentPosition(
      position => {
        const currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        };
        this.userLocation = currentLocation;
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 1000},
    );
    // this.getCurrentCity();
  };
}

decorate(MapStore, {
  userLocation: observable,
  getCurrentLocation: action,
  testFunction: action,
  getCurrentCity: action,
  currentCity: observable,
});

export default MapStore;
