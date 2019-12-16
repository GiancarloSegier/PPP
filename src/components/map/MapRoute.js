import React, {Component} from 'react';
import {View, Text, Platform, Dimensions} from 'react-native';

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';

import MapView, {Marker, Callout} from 'react-native-maps';
import MapStyle from '../../config/MapStyle';

import {inject, observer} from 'mobx-react';

import MapViewDirections from 'react-native-maps-directions';

const googlepin = require('../../assets/googlepin.png');
const googlepinStart = require('../../assets/googlepinStart.png');
const googlePinFinish = require('../../assets/googlepinFinish.png');

class MapRoute extends Component {
  distance = 'calc...';
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }

    console.log(props.destinationLocation);

    this.state = {
      googleAPI: props.mapStore.googleAPI,
      userLocation: {
        latitude: props.mapStore.userLocation.latitude,
        longitude: props.mapStore.userLocation.longitude,
      },
      placeName: props.placeName,
      destinationLocation: props.destinationLocation,
      landmarkSelection: props.landmarkSelection,
      origin: props.origin,
    };
  }

  componentDidMount = async () => {
    this.checkOrigin();
    if (this.props.waypoints) {
      this.getWayPoints(this.props.landmarkSelection);
      await this.getTourCity();
    }
  };
  getTourCity = async () => {
    await this.props.tripStore.getTourCity(this.state.origin);
    this.setState({tourCity: this.props.tripStore.tourCity});
  };

  checkOrigin = () => {
    if (this.props.origin) {
      this.setState({origin: this.props.origin});
    } else {
      this.setState({origin: this.state.userLocation});
    }
  };

  getWayPoints = landmarkSelection => {
    const newWaypoints = [];
    for (let i = 0; i < landmarkSelection.length; i++) {
      const landmark = landmarkSelection[i];
      console.log(landmark.coords);

      const newWaypoint = {
        latitude: landmark.coords.latitude,
        longitude: landmark.coords.longitude,
      };
      newWaypoints.push(newWaypoint);
      this.setState({waypoints: newWaypoints});
    }
  };

  fitMap = async () => {
    if (this.props.waypoints === true) {
      const coordinates = [];

      coordinates.push(this.state.origin, this.state.destinationLocation);
      for (let i = 0; i < this.state.waypoints.length; i++) {
        const waypoint = this.state.waypoints[i];
        coordinates.push({
          latitude: waypoint.latitude,
          longitude: waypoint.longitude,
        });
      }

      await this._map.fitToCoordinates(coordinates, {
        edgePadding: {
          top: Dimensions.get('screen').height / 15,
          right: Dimensions.get('screen').width / 15,
          bottom: Dimensions.get('screen').height / 15,
          left: Dimensions.get('screen').width / 15,
        },
        animated: false,
      });
    } else {
      await this._map.fitToCoordinates(
        [this.state.origin, this.state.destinationLocation],
        {
          edgePadding: {
            top: Dimensions.get('screen').height / 15,
            right: Dimensions.get('screen').width / 15,
            bottom: Dimensions.get('screen').height / 15,
            left: Dimensions.get('screen').width / 15,
          },
          animated: false,
        },
      );
    }
  };

  render() {
    return (
      <>
        {this.state.landmarkSelection ? (
          <View>
            <View style={this.styles.tripCardContent}>
              <View style={this.styles.tripInfo}>
                <View style={this.styles.tripInfoBlock}>
                  <Text style={this.styles.tripInfoTitle}>
                    {this.distance < 1
                      ? String(this.distance).replace('0.', '')
                      : this.distance}
                  </Text>
                  <Text style={this.styles.infoParam}>
                    {this.distance < 1 ? 'meters' : 'kilometers'}
                  </Text>
                </View>
                <View style={this.styles.tripInfoBlock}>
                  <Text style={this.styles.tripInfoTitle}>
                    {this.state.hours > 0 && this.state.minutes < 10
                      ? this.state.hours + 'u' + '0' + this.state.minutes
                      : this.state.hours > 0 && this.state.minutes > 10
                      ? this.state.hours + 'u' + this.state.minutes
                      : this.state.minutes}
                  </Text>
                  <Text style={this.styles.infoParam}>
                    {this.state.hours > 0 ? 'walk' : 'min walk'}
                  </Text>
                </View>

                <View
                  style={[
                    this.styles.tripInfoBlock,
                    this.styles.lastInfoBlock,
                  ]}>
                  <Text style={this.styles.tripInfoTitle}>
                    {this.state.landmarkSelection.length}
                  </Text>
                  <Text style={this.styles.infoParam}>landmarks</Text>
                </View>
              </View>
            </View>
          </View>
        ) : null}

        <MapView
          ref={map => (this._map = map)}
          toolbarEnabled={false}
          loadingEnabled
          showsPointsOfInterest={false}
          showsMyLocationButton={false}
          customMapStyle={MapStyle}
          style={
            this.props.mapSize === 'big'
              ? {
                  height: Dimensions.get('screen').height * 0.3,
                  width: '100%',
                }
              : {
                  height: Dimensions.get('screen').height * 0.2,
                  width: '100%',
                }
          }
          onLayout={this.fitMap}
          provider={MapView.PROVIDER_GOOGLE}>
          <MapViewDirections
            mode="WALKING"
            origin={this.state.origin}
            waypoints={this.state.waypoints ? this.state.waypoints : null}
            destination={this.state.destinationLocation}
            apikey={this.state.googleAPI}
            strokeWidth={4}
            strokeColor="#182ac1"
            precision={'high'}
            optimizeWaypoints={true}
            onReady={result => {
              if (result.distance > 1) {
                this.distance = parseFloat(result.distance).toFixed(1);
              } else {
                this.distance = parseFloat(result.distance);
              }
              this.props.tripStore.setTourDistance(this.distance);
              this.props.tripStore.setTourDuration(result.duration);

              this.setState({
                hours: Math.floor(result.duration / 60),
                minutes: Math.floor(result.duration % 60),
              });
            }}
          />

          {this.state.waypoints ? (
            <>
              {this.state.waypoints.map((landmark, index) => {
                return (
                  <Marker
                    icon={
                      Platform.OS !== 'ios'
                        ? index === 0
                          ? googlepinStart
                          : index === this.state.waypoints.length - 1
                          ? googlePinFinish
                          : googlepin
                        : null
                    }
                    pinColor={'red'}
                    key={index}
                    coordinate={
                      landmark.latitude
                        ? {
                            latitude: landmark.latitude,
                            longitude: landmark.longitude,
                          }
                        : this.state.userLocation
                    }>
                    <Callout tooltip style={this.styles.calloutContainer}>
                      <View>
                        {index === this.state.waypoints.length - 1 ? (
                          <Text style={this.styles.calloutText}>
                            arrival /{' '}
                            {this.state.landmarkSelection[index].placeName}
                          </Text>
                        ) : (
                          <Text style={this.styles.calloutText}>
                            {this.state.landmarkSelection[index].placeName}
                          </Text>
                        )}
                      </View>
                    </Callout>
                  </Marker>
                );
              })}
            </>
          ) : null}
          {!this.props.waypoints ? (
            <>
              <Marker
                icon={Platform.OS !== 'ios' ? googlepin : null}
                pinColor={'red'}
                key={'start'}
                coordinate={
                  this.state.origin
                    ? this.state.origin
                    : this.state.userLocation
                }>
                <Callout tooltip style={this.styles.calloutContainer}>
                  <View>
                    <Text style={this.styles.calloutText}>Your location</Text>
                  </View>
                </Callout>
              </Marker>
              <Marker
                icon={Platform.OS !== 'ios' ? googlePinFinish : null}
                pinColor={'red'}
                key={'finish'}
                coordinate={
                  this.state.destinationLocation.latitude
                    ? {
                        latitude: this.state.destinationLocation.latitude,
                        longitude: this.state.destinationLocation.longitude,
                      }
                    : null
                }>
                <Callout tooltip style={this.styles.calloutContainer}>
                  <View>
                    <Text style={this.styles.calloutText}>
                      {this.state.placeName}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            </>
          ) : null}
        </MapView>
      </>
    );
  }
}

export default inject('mapStore', 'tripStore')(observer(MapRoute));
