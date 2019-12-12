import React, {Component} from 'react';
import {View, Text, Platform, Image} from 'react-native';

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';

import MapView, {Marker, Callout} from 'react-native-maps';
import MapStyle from '../../config/MapStyle';

import {inject, observer} from 'mobx-react';

import MapViewDirections from 'react-native-maps-directions';

import haversine from 'haversine';

import {Button} from 'react-native-elements';
import {Icon} from 'react-native-vector-icons/FontAwesome';

const googlepin = require('../../assets/googlepin.png');
const googlePinStart = require('../../assets/googlepinStart.png');
const googlePinFinish = require('../../assets/googlepinFinish.png');

class MapRoute extends Component {
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
      },
      placeName: props.placeName,
      destinationLocation: props.destinationLocation,
      distance: null,
    };
  }

  componentDidMount() {
    var hours = Math.floor(10.3833333333333 / 60);
    var minutes = Math.floor(10.3833333333333 % 60);
    console.log(hours + ':' + minutes);
  }

  fitMap = () => {
    this._map.fitToCoordinates(
      [this.state.userLocation, this.state.destinationLocation],
      {
        edgePadding: {top: 85, right: 85, bottom: 85, left: 85},
        animated: false,
      },
    );
  };

  render() {
    return (
      <>
        <Text>
          Distance:{' '}
          {this.state.distance < 1
            ? String(this.state.distance).replace('0.', '') + ' m'
            : this.state.distance + ' km'}
        </Text>
        <Text>
          Walkingtime:{' '}
          {this.state.hours > 0
            ? this.state.hours + 'u' + this.state.minutes
            : this.state.minutes + ' minutes'}
        </Text>
        <MapView
          ref={map => (this._map = map)}
          toolbarEnabled={false}
          loadingEnabled
          showsPointsOfInterest={false}
          showsMyLocationButton={false}
          customMapStyle={MapStyle}
          style={{height: 250, width: '100%'}}
          onLayout={this.fitMap}
          provider={MapView.PROVIDER_GOOGLE}>
          <MapViewDirections
            mode="WALKING"
            origin={this.state.userLocation}
            destination={this.state.destinationLocation}
            apikey={this.state.googleAPI}
            strokeWidth={5}
            strokeColor="#182ac1"
            optimizeWaypoints={true}
            onReady={result => {
              if (result.distance > 1) {
                this.distance = parseFloat(result.distance).toFixed(1);
              } else {
                this.distance = parseFloat(result.distance);
              }
              this.setState({
                distance: this.distance,
                hours: Math.floor(result.duration / 60),
                minutes: Math.floor(result.duration % 60),
              });
            }}
          />

          <Marker
            icon={googlepin}
            key={'start'}
            coordinate={{
              latitude: this.state.userLocation.latitude,
              longitude: this.state.userLocation.longitude,
            }}>
            <Callout tooltip style={this.styles.calloutContainer}>
              <View>
                <Text style={this.styles.calloutText}>Your location</Text>
              </View>
            </Callout>
          </Marker>
          <Marker
            icon={googlePinFinish}
            key={'finish'}
            coordinate={{
              latitude: this.state.destinationLocation.latitude,
              longitude: this.state.destinationLocation.longitude,
            }}>
            <Callout tooltip style={this.styles.calloutContainer}>
              <View>
                <Text style={this.styles.calloutText}>
                  {this.state.placeName}
                </Text>
              </View>
            </Callout>
          </Marker>
        </MapView>
      </>
    );
  }
}

export default inject('mapStore')(observer(MapRoute));
