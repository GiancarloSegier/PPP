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
  googleAPI = 'AIzaSyBKHOKyghn31QDS5h7Eomcuvc7H1PWhzbQ';
  tourCity = '';
  // userId = auth().currentUser.uid;
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.soloTripsDatabase = firestore().collection('soloTrips');
    this.partyTripsDatabase = firestore().collection('partyTrips');
  }

  componentDidMount() {
    // this.getAllUserTrips();
  }

  getAllUserTrips = () => {
    this.getUserSoloTrips(this.userId);
    this.getUserPartyTrips(this.userId);
  };

  async getTourCity(coords) {
    console.log(coords);
    await Geocoder.from(coords.latitude, coords.longitude)
      .then(json => {
        const city = json.results[0].address_components.filter(address =>
          address.types.includes('locality'),
        )[0].long_name;

        console.log('citystore: ' + city);

        if (city !== undefined) {
          this.tourCity = city;
        } else {
          this.tourCity = '';
        }
      })
      .catch(error => console.warn(error));
  }

  compare(a, b) {
    const bandA = a.dateAdded;
    const bandB = b.dateAdded;

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }

  getCitySoloTrips = async city => {
    console.log(city);
    this.citySoloTrips = [];
    const getCitySoloTrips = await this.soloTripsDatabase.where(
      'tourCity',
      '==',
      city,
    );

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
    const fetchedUserSoloTrips = await this.soloTripsDatabase.where(
      'userId',
      '==',
      userId,
    );

    this.unsubscribeAllTrips = fetchedUserSoloTrips.onSnapshot(
      querySnapshots => {
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
      },
    );
  };
  getUserPartyTrips = async userId => {
    this.userPartyTrips = [];
    const fetchedUserPartyTrips = await this.partyTripsDatabase.where(
      'userId',
      '==',
      userId,
    );

    this.unsubscribeAllTrips = fetchedUserPartyTrips.onSnapshot(
      querySnapshots => {
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
      },
    );
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
  deleteSoloTour = async tour => {
    console.log(tour);
    await this.soloTripsDatabase.doc(tour.tourId).delete();
    this.getAllUserTrips();
  };
  deletePartyTour = async tour => {
    console.log(tour);
    await this.partyTripsDatabase.doc(tour.tourId).delete();
    this.getAllUserTrips();
  };

  addSoloTour = async tour => {
    await this.soloTripsDatabase.add(tour);
    await this.resetLandmarks();
    this.getAllUserTrips();
  };
  addPartyTour = async tour => {
    await this.partyTripsDatabase.add(tour);
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
  deleteSoloTour: action,
  deletePartyTour: action,
  addSoloTour: action,
  addPartyTour: action,
});

export default TripStore;
