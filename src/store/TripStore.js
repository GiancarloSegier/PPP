import {action, observable, decorate} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Geocoder from 'react-native-geocoding';
import config from '../../config.js';
class TripStore {
  landmarkSelection = [];
  userSoloTrips = [];
  citySoloTrips = [];
  userPartyTrips = [];
  cityPartyTrips = [];
  tourDistance;
  tourDuration;
  googleAPI = config.GOOGLEAPI;
  tourCity = '';
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.soloTripsDatabase = firestore().collection('soloTrips');
    this.partyTripsDatabase = firestore().collection('partyTrips');
  }

  getAllUserTrips = userId => {
    this.getUserSoloTrips(userId);
    this.getUserPartyTrips(userId);
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
    this.citySoloTrips = [];
    const fetchedCitySoloTrips = this.soloTripsDatabase.where(
      'tourCity',
      '==',
      city,
    );

    this.unsubscribeAllTrips = fetchedCitySoloTrips.onSnapshot(
      querySnapshots => {
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
      },
    );
  };
  getCityPartyTrips = async city => {
    this.day = new Date().getDate();
    this.month = new Date().getMonth() + 1;
    this.year = new Date().getFullYear();
    this.hours = new Date().getHours();
    this.minutes = new Date().getMinutes();
    const startTime = `${this.hours < 10 ? '0' + this.hours : this.hours}${
      this.minutes < 10 ? '0' + this.minutes : this.minutes
    }`;
    const time = parseInt(startTime, 0);

    const startDate = `${this.day}/${this.month}/${this.year}`;

    this.cityPartyTrips = [];
    const fetchedCityPartyTrips = this.partyTripsDatabase.where(
      'tourCity',
      '==',
      city,
    );
    const currentDateTrips = fetchedCityPartyTrips.where(
      'startDate',
      '==',
      `${this.day}/${this.month}/${this.year}`,
    );

    const timePartyTrips = currentDateTrips.where('startTime', '>', time);

    this.unsubscribeAllTrips = timePartyTrips.onSnapshot(querySnapshots => {
      querySnapshots.forEach(doc => {
        this.cityPartyTrips.push({
          tourId: doc.id,
          tripTitle: doc.data().tripTitle,
          dateAdded: doc.data().dateAdded,
          landmarks: doc.data().landmarks,
          distance: doc.data().distance,
          duration: doc.data().duration,
          tourCity: doc.data().tourCity,
          userId: doc.data().userId,
          startDate: doc.data().startDate,
          startTime: doc.data().startTime,
        });
      });
    });
    console.log(this.cityPartyTrips);
  };

  getUserSoloTrips = async userId => {
    this.userSoloTrips = [];
    const fetchedUserSoloTrips = this.soloTripsDatabase.where(
      'userId',
      '==',
      userId,
    );

    const orderedSoloTrips = fetchedUserSoloTrips.orderBy('dateAdded');

    this.unsubscribeAllTrips = orderedSoloTrips.onSnapshot(querySnapshots => {
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

    const fetchedUserPartyTrips = this.partyTripsDatabase.where(
      'userId',
      '==',
      userId,
    );

    const timePartyTrips = fetchedUserPartyTrips
      .orderBy('startDate')
      .orderBy('startTime');

    this.unsubscribeAllTrips = timePartyTrips.onSnapshot(querySnapshots => {
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
          startDate: doc.data().startDate,
          startTime: doc.data().startTime,
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
    this.getAllUserTrips(tour.userId);
  };
  addPartyTour = async tour => {
    await this.partyTripsDatabase.add(tour);
    await this.resetLandmarks();
    this.getAllUserTrips(tour.userId);
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
  getCityPartyTrips: action,
  cityPartyTrips: observable,
  getTourCity: action,
  tourCity: observable,
  deleteSoloTour: action,
  deletePartyTour: action,
  addSoloTour: action,
  addPartyTour: action,
});

export default TripStore;
