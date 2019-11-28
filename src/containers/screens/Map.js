import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform,
  Dimensions,
  PermissionsAndroid,
  Alert,
} from 'react-native';

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';

import MapView from 'react-native-maps';
import MapStyle from '../../config/MapStyle';
import {inject, observer} from 'mobx-react';
import {TouchableHighlight} from 'react-native-gesture-handler';

import Geolocation from 'react-native-geolocation-service';

export class Map extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }

    this.state = {
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    };
    this.getPosition();
  }

  setLocation = position => {
    this.setState({
      latitude: position.latitude,
      longitude: position.longitude,
    });
  };

  getPosition() {
    Geolocation.getCurrentPosition(
      position => {
        this.currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.setLocation(this.currentLocation);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 1500, maximumAge: 1000},
    );
  }

  render() {
    return (
      <MapView
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation
        style={this.styles.map}
        customMapStyle={MapStyle}
        provider="google"
        initialRegion={{
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          latitudeDelta: this.state.latitudeDelta,
          longitudeDelta: this.state.longitudeDelta,
        }}
      />
    );
  }
}

export default Map;
