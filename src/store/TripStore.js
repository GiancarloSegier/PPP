import {action, observable, decorate, configure} from 'mobx';
class TripStore {
  landmarkSelection = [];
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

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
}

decorate(TripStore, {
  addToSelection: action,
  removeFromSelection: action,
  landmarkSelection: observable,
  checkLandmark: action,
});

export default TripStore;
