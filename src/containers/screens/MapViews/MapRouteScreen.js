import React, {Component} from 'react';
import {
  View,
  Text,
  Platform,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import {Button} from 'react-native-elements';

import androidUI from '../../../styles/ui.android.style.js';
import iosUI from '../../../styles/ui.ios.style.js';

import MapView, {Marker, Callout} from 'react-native-maps';
import MapStyle from '../../../config/MapStyle';

import {inject, observer} from 'mobx-react';

import MapViewDirections from 'react-native-maps-directions';
const origin = {latitude: 37.3318456, longitude: -122.0296002};
const destination = {latitude: 37.771707, longitude: -122.4053769};

export class MapRouteScreen extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }

    this.state = {
      googleAPI: props.mapStore.googleAPI,
      userLocation: {
        latitude: props.mapStore.userLocation.latitude,
        longitude: props.mapStore.userLocation.longitude,
        latitudeDelta: 0.045,
        longitudeDelta: 0.045,
      },
      coordinates: [
        // {
        //   latitude: props.mapStore.userLocation.latitude,
        //   longitude: props.mapStore.userLocation.longitude,
        // },
        // {
        //   latitude: 41.8958,
        //   longitude: 12.4826,
        // },
        // {
        //   latitude: 41.8902,
        //   longitude: 12.4922,
        // },
        {
          latitude: 37.3317876,
          longitude: -122.0054812,
        },
        {
          latitude: 37.771707,
          longitude: -122.4053769,
        },
      ],
    };
  }

  render() {
    const {userLocation, googleAPI} = this.state;
    return (
      <MapView
        ref={map => (this._map = map)}
        toolbarEnabled={false}
        showsUserLocation={true}
        followsUserLocation={true}
        loadingEnabled
        showsPointsOfInterest={false}
        showsMyLocationButton={true}
        customMapStyle={MapStyle}
        style={this.styles.map}
        provider={MapView.PROVIDER_GOOGLE}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: userLocation.latitudeDelta,
          longitudeDelta: userLocation.longitudeDelta,
        }}>
        <MapViewDirections
          origin={this.state.coordinates[0]}
          waypoints={
            this.state.coordinates.length > 2
              ? this.state.coordinates.slice(1, -1)
              : null
          }
          destination={
            this.state.coordinates[this.state.coordinates.length - 1]
          }
          apikey={googleAPI}
          strokeWidth={3}
          strokeColor="orange"
          optimizeWaypoints={true}
          onStart={params => {
            console.log(
              `Started routing between "${params.origin}" and "${
                params.destination
              }"`,
            );
          }}
          onReady={result => {
            console.log(`Distance: ${result.distance} km`);
            console.log(`Duration: ${result.duration} min.`);
          }}
        />
        {this.state.coordinates.map((place, index) => {
          console.log(place);
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}>
              <Image
                source={require('../../../assets/googlepin.png')}
                style={{height: 50, resizeMode: 'contain'}}
              />
            </Marker>
          );
        })}
      </MapView>
    );
  }
}

export default inject('mapStore')(observer(MapRouteScreen));
