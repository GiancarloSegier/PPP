import {action, observable, decorate} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Geocoder from 'react-native-geocoding';
class TripStore {
  landmarkSelection = [];
  userSoloTrips = [];
  citySoloTrips = [];
  userPartyTrips = [];
  tourDistance;
  tourDuration;
  googleAPI = 'AIzaSyBLSLqH_qXkSrU5qK1M71zmWU3gpjs8C4g';
  tourCity = '';
  userId = auth().currentUser.uid;
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.database = firestore().collection('trips');
  }

  componentDidMount() {
    this.getAllUserTrips();
  }

  getAllUserTrips = () => {
    this.getUserSoloTrips(this.userId);
    this.getUserPartyTrips(this.userId);
  };

  async getTourCity(coords) {
    await Geocoder.from(coords.latitude, coords.longitude)
      .then(json => {
        const city = json.results[0].address_components.filter(address =>
          address.types.includes('locality'),
        )[0].long_name;

        if (city !== undefined) {
          this.tourCity = city;
        } else {
          this.tourCity = '';
        }
      })
      .catch(error => console.warn(error));
  }

  getCitySoloTrips = async city => {
    this.citySoloTrips = [];
    const getCitySoloTrips = await this.database.where('tourCity', '==', city);

    this.unsubscribeAllTrips = getCitySoloTrips.onSnapshot(querySnapshots => {
      querySnapshots.forEach(doc => {
        this.citySoloTrips.push({
          tourId: doc.id,
          tripTitle: doc.data().tripTitle,
          dateAdded: doc.data().dateAdded,
          landmarks: doc.data().landmarks,
          distance: doc.data().distance,
          duration: doc.data().duration,
          tourCity: doc.data().tourCity,
          userId: doc.data().userId,
        });
      });
    });
  };
  getCityPartyTrips = () => {};
  getUserSoloTrips = async userId => {
    this.userSoloTrips = [];
    const allUserTrips = await this.database.where('userId', '==', userId);

    const getSoloTrips = await allUserTrips.where('type', '==', 'solo');

    this.unsubscribeAllTrips = getSoloTrips.onSnapshot(querySnapshots => {
      querySnapshots.forEach(doc => {
        this.userSoloTrips.push({
          tourId: doc.id,
          tripTitle: doc.data().tripTitle,
          dateAdded: doc.data().dateAdded,
          landmarks: doc.data().landmarks,
          distance: doc.data().distance,
          duration: doc.data().duration,
          tourCity: doc.data().tourCity,
          userId: doc.data().userId,
        });
      });
    });
  };
  getUserPartyTrips = async userId => {
    this.userPartyTrips = [];
    const allUserTrips = await this.database.where('userId', '==', userId);

    const getPartyTrips = await allUserTrips.where('type', '==', 'party');

    this.unsubscribeAllTrips = getPartyTrips.onSnapshot(querySnapshots => {
      querySnapshots.forEach(doc => {
        this.userPartyTrips.push({
          tourId: doc.id,
          tripTitle: doc.data().tripTitle,
          dateAdded: doc.data().dateAdded,
          landmarks: doc.data().landmarks,
          distance: doc.data().distance,
          duration: doc.data().duration,
          tourCity: doc.data().tourCity,
          userId: doc.data().userId,
        });
      });
    });
  };

  addToSelection = landmark => {
    const landmarkInSelection = this.checkLandmark(landmark);
    if (!landmarkInSelection) {
      this.landmarkSelection.push(landmark);
    }
  };

  removeFromSelection = async landmark => {
    for (let i = 0; i < this.landmarkSelection.length; i++) {
      const place = this.landmarkSelection[i];

      if (place.placeId === landmark.placeId) {
        this.landmarkSelection.splice(i, 1);
      }
    }
  };

  checkLandmark = landmark => {
    for (let i = 0; i < this.landmarkSelection.length; i++) {
      const checkLandmark = this.landmarkSelection[i];
      if (landmark.placeName === checkLandmark.placeName) {
        return true;
      }
    }
  };

  resetLandmarks = () => {
    this.landmarkSelection = [];
  };

  setTourDistance = distance => {
    this.tourDistance = distance;
  };
  setTourDuration = duration => {
    this.tourDuration = duration;
  };
  deleteTour = tour => {
    console.log(tour);
    this.database.doc(tour.tourId).delete();
    this.getAllUserTrips();
  };

  addSoloTour = async tour => {
    await this.database.add(tour);
    await this.resetLandmarks();
    this.getAllUserTrips();
  };
}

decorate(TripStore, {
  addToSelection: action,
  removeFromSelection: action,
  landmarkSelection: observable,
  checkLandmark: action,
  resetLandmarks: action,
  setTourDistance: action,
  setTourDuration: action,
  tourDuration: observable,
  tourDistance: observable,
  getUserSoloTrips: action,
  userSoloTrips: observable,
  getCitySoloTrips: action,
  citySoloTrips: observable,
  getUserPartyTrips: action,
  userPartyTrips: observable,
  getTourCity: action,
  tourCity: observable,
  deleteTour: action,
  addSoloTour: action,
});

export default TripStore;
