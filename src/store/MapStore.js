import {action, observable, decorate, configure} from 'mobx';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {Linking} from 'react-native';

// configure({enforceActions: 'observed'});

class MapStore {
  latitude;
  longitude;
  userLocation = {};
  currentCity = null;
  googleAPI = 'AIzaSyBKHOKyghn31QDS5h7Eomcuvc7H1PWhzbQ';
  constructor(rootStore) {
    this.rootStore = rootStore;
    Geocoder.init(this.googleAPI), {language: 'en'};
    this.getCurrentLocation();
  }

  setCurrentCity(city) {
    this.currentCity = city;
  }

  getCurrentCity() {
    Geocoder.from(this.userLocation.latitude, this.userLocation.longitude)
      .then(json => {
        const city = json.results[0].address_components.filter(address =>
          address.types.includes('locality'),
        )[0].long_name;

        if (city !== undefined) {
          this.setCurrentCity(city);
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
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
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

  handleOpenMaps = landmarkSelection => {
    const origin = this.userLocation;
    const destination = landmarkSelection[0].coords;
    const waypoints = [];

    for (let i = 0; i < landmarkSelection.length; i++) {
      const landmark = landmarkSelection[i];
      console.log(landmark.coords.latitude);
      let landmarkString;
      if (i === 0) {
        landmarkString = `${landmark.coords.latitude},${
          landmark.coords.longitude
        }`;
      } else {
        landmarkString = `@${landmark.coords.latitude},${
          landmark.coords.longitude
        }`;
      }
      waypoints.push(landmarkString);
    }

    const waypointsQuerry = waypoints.toString().replace(/,@/g, '%7C');

    console.log(waypoints);
    const googleUrl = `https://www.google.com/maps/dir/?api=1&origin=${
      origin.latitude
    },${origin.longitude}&waypoints=${waypointsQuerry}&destination=${
      destination.latitude
    },${destination.longitude}&dir_action=navigate&travelmode=walking`;

    Linking.canOpenURL(googleUrl).then(supported => {
      if (supported) {
        Linking.openURL(googleUrl);
      } else {
        console.log("Don't know how to open URI: " + googleUrl);
      }
    });
  };
}

decorate(MapStore, {
  userLocation: observable,
  getCurrentLocation: action,
  testFunction: action,
  getCurrentCity: action,
  currentCity: observable,
  getUrlWithParameters: action,
  setCurrentCity: action,
  handleOpenMaps: action,
});

export default MapStore;
