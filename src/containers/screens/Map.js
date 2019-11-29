import React, {Component} from 'react';
import {View, Text, Platform, ActivityIndicator} from 'react-native';

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';

import MapView from 'react-native-maps';
import MapStyle from '../../config/MapStyle';

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
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
  }

  setLocation = position => {
    this.setState({
      latitude: position.latitude,
      longitude: position.longitude,
    });
  };

  getPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        this.currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.setLocation(this.currentLocation);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 1000},
    );
  };

  componentDidMount() {
    this.getPosition();
  }

  moveLocation = newLocation => {
    this.currentLocation = {
      latitude: newLocation.nativeEvent.coordinate.latitude,
      longitude: newLocation.nativeEvent.coordinate.longitude,
    };
    this.setLocation(this.currentLocation);
  };

  render() {
    if (this.state.latitude && this.state.latitude !== 0) {
      return (
        <MapView
          showsUserLocation
          followsUserLocation
          loadingEnabled
          showsMyLocationButton={true}
          style={this.styles.map}
          customMapStyle={MapStyle}
          provider="google"
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta,
          }}
          onUserLocationChange={this.moveLocation}
        />
      );
    } else {
      return (
        <View style={this.styles.loadScreen}>
          <ActivityIndicator size={'large'} color="#192BC2" />
          <Text>Turist is checking your location!</Text>
        </View>
      );
    }
  }
}

export default Map;
