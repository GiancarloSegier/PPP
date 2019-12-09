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

let seconds = 0;

export class MapRouteScreen extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }

    this.state = {
      seconds: 0,
      followsUserLocation: true,
      googleAPI: props.mapStore.googleAPI,
      userLocation: {
        latitude: props.mapStore.userLocation.latitude,
        longitude: props.mapStore.userLocation.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      },
      currentRegion: {
        latitude: props.mapStore.userLocation.latitude,
        longitude: props.mapStore.userLocation.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      },
      duration: null,
      distance: null,
      coordinates: [
        {
          latitude: props.mapStore.userLocation.latitude,
          longitude: props.mapStore.userLocation.longitude,
        },
        {
          latitude: 41.8958,
          longitude: 12.4826,
        },
        {
          latitude: 41.8902,
          longitude: 12.4922,
        },
        // {
        //   latitude: 37.3317876,
        //   longitude: -122.0054812,
        // },
        // {
        //   latitude: 37.771707,
        //   longitude: -122.4053769,
        // },
      ],
    };
  }

  componentDidMount() {
    this.timer();
  }

  changeLocation = newLocation => {
    this.currentLocation = {
      latitude: newLocation.nativeEvent.coordinate.latitude,
      longitude: newLocation.nativeEvent.coordinate.longitude,
      latitudeDelta: 0.055,
      longitudeDelta: 0.055,
    };
    this.setState({userLocation: this.currentLocation});
    const haversine = require('haversine');

    const start = this.state.userLocation;
    const end = this.state.coordinates[this.state.coordinates.length - 1];
    const distanceLeft = haversine(start, end);
    let readableDistance;
    if (distanceLeft > 1) {
      readableDistance = parseFloat(distanceLeft).toFixed(1);
    } else {
      readableDistance = parseFloat(distanceLeft);
    }

    this.setState({leftDistance: readableDistance});
  };

  timer = () => {};

  render() {
    this.timer();
    const {userLocation, googleAPI, currentRegion} = this.state;
    console.log(currentRegion);
    return (
      <>
        <View
          style={{
            backgroundColor: 'white',
          }}>
          <Text>Total distance: {this.state.distance}km</Text>
          <Text>
            Time elapsed:{' '}
            {setInterval(() => {
              seconds++;
            }, 1000)}
          </Text>
          <Text>
            Distance left: {this.state.leftDistance}{' '}
            {this.state.leftDistance < 1 ? 'meters' : 'km'}
          </Text>
        </View>
        <MapView
          ref={map => (this._map = map)}
          toolbarEnabled={false}
          showsUserLocation={true}
          loadingEnabled
          showsPointsOfInterest={false}
          showsMyLocationButton={true}
          customMapStyle={MapStyle}
          style={this.styles.map}
          provider={MapView.PROVIDER_GOOGLE}
          onUserLocationChange={this.changeLocation}
          region={userLocation}>
          <MapViewDirections
            // mode="WALKING"
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
            strokeColor="red"
            optimizeWaypoints={true}
            onStart={params => {
              console.log(
                `Started routing between "${params.origin}" and "${
                  params.destination
                }"`,
              );
            }}
            onReady={result => {
              if (result.distance > 1) {
                this.distance = parseFloat(result.distance).toFixed(1);
              } else {
                this.distance = parseFloat(result.distance);
              }
              this.setState({
                distance: this.distance,
                duration: result.duration,
              });
            }}
          />
          {this.state.coordinates.map((place, index) => {
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
      </>
    );
  }
}

export default inject('mapStore')(observer(MapRouteScreen));
