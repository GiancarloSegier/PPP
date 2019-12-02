import React, {Component} from 'react';
import {View, Text, Platform, ActivityIndicator, Image} from 'react-native';

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';

import MapView, {Marker, Callout} from 'react-native-maps';
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
        latitude: props.mapStore.userLocation.latitude,
        longitude: props.mapStore.userLocation.longitude,
        latitudeDelta: 0.025,
        longitudeDelta: 0.025,
      },
      regionLocation: {
        latitude: props.mapStore.userLocation.latitude,
        longitude: props.mapStore.userLocation.longitude,
      },
      places: null,
    };
  }

  componentDidMount() {
    this.setLocation(this.props.mapStore.userLocation);
    this.getPlaces();
  }

  getPlaces = async () => {
    const {regionLocation} = this.state;
    const url = this.getUrlWithParameters(
      regionLocation.latitude,
      regionLocation.longitude,
      2000,
      'landmark',
      'AIzaSyBLSLqH_qXkSrU5qK1M71zmWU3gpjs8C4g',
    );

    await fetch(url)
      .then(data => data.json())
      .then(respons => {
        const arrayMarkers = [];
        respons.results.map((element, index) => {
          arrayMarkers.push(
            <Marker
              key={index}
              coordinate={{
                latitude: element.geometry.location.lat,
                longitude: element.geometry.location.lng,
              }}>
              <Image
                source={require('../../assets/googlepin.png')}
                style={{height: 50, resizeMode: 'contain'}}
              />
              <Callout>
                <View>
                  <Text>{element.name}</Text>
                </View>
              </Callout>
            </Marker>,
          );
        });

        this.setState({places: arrayMarkers});
      });
  };

  getUrlWithParameters = (lat, long, radius, type, API) => {
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
    const location = `location=${lat},${long}&radius=${radius}`;
    const typeData = `&types=${type}`;
    const key = `&key=${API}`;
    return `${url}${location}${typeData}${key}`;
  };

  setLocation = position => {
    this.setState({
      userLocation: {
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: 0.025,
        longitudeDelta: 0.025,
      },
    });
  };

  setRegion = position => {
    this.setState({
      regionLocation: {
        latitude: position.latitude,
        longitude: position.longitude,
      },
    });
  };

  moveUserLocation = newLocation => {
    console.log(newLocation);
    this.currentLocation = {
      latitude: newLocation.nativeEvent.coordinate.latitude,
      longitude: newLocation.nativeEvent.coordinate.longitude,
    };
    this.setLocation(this.currentLocation);
  };

  moveRegion = newRegion => {
    this.currentRegion = {
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    };
    this.setRegion(this.currentRegion);
    this.getPlaces();
  };

  render() {
    const {userLocation} = this.state;

    if (userLocation.latitude && userLocation.latitude !== 0) {
      return (
        <>
          <MapView
            showsUserLocation={true}
            followsUserLocation={true}
            loadingEnabled
            showsPointsOfInterest={false}
            showsMyLocationButton={true}
            style={this.styles.map}
            customMapStyle={MapStyle}
            provider={MapView.PROVIDER_GOOGLE}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: userLocation.latitudeDelta,
              longitudeDelta: userLocation.longitudeDelta,
            }}
            onRegionChange={this.moveRegion}
            // onUserLocationChange={this.moveUserLocation}>
          >
            {this.state.places}
          </MapView>
        </>
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
