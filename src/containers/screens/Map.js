import React, {Component} from 'react';
import {View, Text, Platform, ActivityIndicator} from 'react-native';

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';

import MapView from 'react-native-maps';
import MapStyle from '../../config/MapStyle';

import {inject, observer} from 'mobx-react';

export class Map extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }

    this.state = {
      userLocation: {
        latitude: null,
        longitude: null,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
    };
  }

  setLocation = position => {
    this.setState({
      userLocation: {
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
    });
  };

  componentDidMount() {
    this.setLocation(this.props.mapStore.userLocation);
  }

  moveLocation = newLocation => {
    this.currentLocation = {
      latitude: newLocation.nativeEvent.coordinate.latitude,
      longitude: newLocation.nativeEvent.coordinate.longitude,
    };
    this.setLocation(this.currentLocation);
  };

  render() {
    const {userLocation} = this.state;
    console.log(userLocation.latitude);
    if (userLocation.latitude && userLocation.latitude !== 0) {
      return (
        <MapView
          showsUserLocation
          followsUserLocation
          // loadingEnabled
          showsMyLocationButton={true}
          style={this.styles.map}
          customMapStyle={MapStyle}
          provider="google"
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: userLocation.latitudeDelta,
            longitudeDelta: userLocation.longitudeDelta,
          }}
          // onUserLocationChange={this.moveLocation}
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

export default inject('mapStore')(observer(Map));
