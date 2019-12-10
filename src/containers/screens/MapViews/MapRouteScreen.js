import React, {Component} from 'react';
import {View, Text, Platform, Image} from 'react-native';

import androidUI from '../../../styles/ui.android.style.js';
import iosUI from '../../../styles/ui.ios.style.js';

import MapView, {Marker} from 'react-native-maps';
import MapStyle from '../../../config/MapStyle';

import {inject, observer} from 'mobx-react';

import MapViewDirections from 'react-native-maps-directions';

import haversine from 'haversine';

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
      distanceTravelled: 0,
      distanceLeft: null,
      time: {
        hours: '00',
        minutes: '00',
        sec: '00',
      },
      prevLoc: {},
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

    this.calcDistanceLeft(newLocation);

    this.setState({
      userLocation: this.currentLocation,
    });
  };

  calcDistanceLeft = newLocation => {
    this.prevLoc = {
      latitude: this.state.userLocation.latitude,
      longitude: this.state.userLocation.longitude,
    };
    this.currentLoc = {
      latitude: newLocation.nativeEvent.coordinate.latitude,
      longitude: newLocation.nativeEvent.coordinate.longitude,
    };

    this.currentTravelled = this.state.distanceTravelled;
    this.newDistanceTravelled =
      this.currentTravelled + haversine(this.prevLoc, this.currentLoc);

    this.totalDistance = this.state.distance;

    this.distanceLeft = parseFloat(
      this.totalDistance - this.newDistanceTravelled,
    ).toFixed(1);

    this.setState({
      distanceTravelled: this.newDistanceTravelled,
      distanceLeft: this.distanceLeft,
    });
  };

  timer = () => {
    setInterval(() => {
      seconds++;
      this.getElapsedTime(seconds);
    }, 1000);
  };

  getElapsedTime = timeInSeconds => {
    let time = parseFloat(timeInSeconds).toFixed(3);
    let hours = Math.floor(time / 60 / 60);
    let minutes = Math.floor(time / 60) % 60;
    let sec = Math.floor(time - minutes * 60);
    this.setState({
      time: {
        hours: this.calcTime(hours, 2),
        minutes: this.calcTime(minutes, 2),
        sec: this.calcTime(sec, 2),
      },
    });
  };

  calcTime(num, size) {
    return ('000' + num).slice(size * -1);
  }

  render() {
    const {
      userLocation,
      googleAPI,
      currentRegion,
      distance,
      distanceLeft,
      time,
    } = this.state;
    return (
      <>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            position: 'absolute',
            width: '100%',
            padding: 24,
            zIndex: 99,
          }}>
          <View
            style={{
              borderRadius: 24,
              width: '30%',
              backgroundColor: 'rgba(255,255,255,0.96)',
              alignItems: 'center',
              padding: 16,
            }}>
            <Text
              style={[
                this.styles.heading2,
                {textAlign: 'center', lineHeight: 28, fontSize: 24},
              ]}>
              {distance} {this.state.leftDistance < 1 ? 'meters' : 'km'}
            </Text>
            <Text>total</Text>
          </View>
          <View
            style={{
              borderRadius: 24,
              width: '30%',
              backgroundColor: 'rgba(255,255,255,0.96)',
              alignItems: 'center',
              padding: 16,
            }}>
            <Text
              style={[
                this.styles.heading2,
                {textAlign: 'center', lineHeight: 28, fontSize: 24},
              ]}>
              {distanceLeft} {this.state.leftDistance < 1 ? 'meters' : 'km'}
            </Text>
            <Text>left to go</Text>
          </View>
          <View
            style={{
              borderRadius: 24,
              width: '30%',
              backgroundColor: 'rgba(255,255,255,0.96)',
              alignItems: 'center',
              padding: 16,
            }}>
            <Text
              style={[
                this.styles.heading2,
                {textAlign: 'center', lineHeight: 28, fontSize: 24},
              ]}>
              {time.hours !== '00' || time.hours !== 0
                ? `${time.minutes}:${time.sec}`
                : `${time.hours}:${time.minutes}:${time.sec}`}
            </Text>
            <Text>elapsed</Text>
          </View>
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
            mode="WALKING"
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
                `Started routing between "${params.origin}" and "${params.destination}"`,
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
                distanceLeft: this.distance,
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
