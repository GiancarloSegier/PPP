import {action, observable, decorate, configure} from 'mobx';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';

// configure({enforceActions: 'observed'});

class MapStore {
  latitude;
  longitude;
  userLocation = {};
  currentCity = '';
  googleAPI = 'AIzaSyBLSLqH_qXkSrU5qK1M71zmWU3gpjs8C4g';
  constructor(rootStore) {
    this.rootStore = rootStore;
    Geocoder.init(this.googleAPI), {language: 'en'};
    this.getCurrentLocation();
  }

  getCurrentCity() {
    Geocoder.from(this.userLocation.latitude, this.userLocation.longitude)
      .then(json => {
        const city = json.results[0].address_components.filter(address =>
          address.types.includes('locality'),
        )[0].long_name;

        if (city !== undefined) {
          this.currentCity = city;
        } else {
          this.currentCity = '';
        }
      })
      .catch(error => console.warn(error));
  }

  getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.045,
          longitudeDelta: 0.045,
        };
        this.userLocation = currentLocation;
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 1000},
    );
  };

  getUrlWithParameters = (lat, long, radius, type, API) => {
    if (type === 'all') {
      type = '';
    }
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
    const location = `location=${lat},${long}&radius=${radius}`;
    const typeData = `&types=${type}`;
    const key = `&key=${API}`;
    return `${url}${location}${typeData}${key}`;
  };
}

decorate(MapStore, {
  userLocation: observable,
  getCurrentLocation: action,
  testFunction: action,
  getCurrentCity: action,
  currentCity: observable,
  getUrlWithParameters: action,
});

export default MapStore;
