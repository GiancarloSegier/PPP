import React, {Component} from 'react';
import {
  View,
  Text,
  Platform,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert,
  Picker,
} from 'react-native';
import {Button} from 'react-native-elements';

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';

import MapView, {Marker, Callout} from 'react-native-maps';
import MapStyle from '../../config/MapStyle';

import Carousel from 'react-native-snap-carousel';

import {inject, observer} from 'mobx-react';
import Filter from '../../components/map/Filter.js';

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
      places: [],
      markers: [],
      placeType: 'all',
      radius: 1500,
      filterOpen: false,
    };
  }

  componentDidMount() {
    this.setLocation(this.props.mapStore.userLocation);
    this.getPlaces();
  }

  getPlaces = async () => {
    const {regionLocation, placeType, radius} = this.state;
    const url = this.getUrlWithParameters(
      regionLocation.latitude,
      regionLocation.longitude,
      radius,
      placeType,
      'AIzaSyBLSLqH_qXkSrU5qK1M71zmWU3gpjs8C4g',
    );

    await fetch(url)
      .then(data => data.json())
      .then(respons => {
        const markers = [];

        respons.results.map(place => {
          // console.log(`place: ${place}`);
          markers.push(place);
        });

        this.setState({places: markers});
      });
  };

  getUrlWithParameters = (lat, long, radius, type, API) => {
    if (type === 'all') {
      type = '';
    }
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
    const location = `location=${lat},${long}&radius=${radius}`;
    const typeData = `&types=${type}`;
    const key = `&key=${API}`;
    console.log(`${url}${location}${typeData}${key}`);
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
    this.currentLocation = {
      latitude: newLocation.nativeEvent.coordinate.latitude,
      longitude: newLocation.nativeEvent.coordinate.longitude,
    };
    this.setLocation(this.currentLocation);
  };

  moveRegion = () => {
    const regionLocation = {
      latitude: this.state.regionLocation.latitude,
      longitude: this.state.regionLocation.longitude,
      latitudeDelta: 0.025,
      longitudeDelta: 0.025,
    };
    this.setRegion(regionLocation);
    this.getPlaces();
  };

  onChangeRegion = region => {
    const newRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: 0.025,
      longitudeDelta: 0.025,
    };
    this.setState({regionLocation: newRegion, markers: []});
  };

  renderCarouselItem = ({item}) => {
    return (
      <View style={this.styles.carouselCard}>
        <Text style={this.styles.carouselTitle}>{item.name}</Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8}}>
          {item.types.map((type, index) => {
            const correctType = type.replace(/_/g, ' ');
            if (
              correctType !== 'point of interest' &&
              correctType !== 'establishment'
            ) {
              return (
                <Text key={index} style={[this.styles.placeType]}>
                  {correctType}
                </Text>
              );
            }
          })}
        </View>
        <Text style={this.styles.placeAdress}>{item.vicinity}</Text>
      </View>
    );
  };

  onCarouselItemChange = index => {
    let place = this.state.places[index];
    this._map.animateToRegion({
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      latitudeDelta: 0.025,
      longitudeDelta: 0.025,
    });

    this.state.markers[index].showCallout();
  };
  onMarkerPressed = (place, index) => {
    this._map.animateToRegion({
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      latitudeDelta: 0.025,
      longitudeDelta: 0.025,
    });
    this._carousel.snapToItem(index);
  };

  onPressFilter = () => {
    console.log('press filter');
    this.setState(prevState => ({filterOpen: !prevState.filterOpen}));
    console.log(this.state.filterOpen);
  };

  onSelectItem = placeType => {
    console.log(placeType);
    this.setState({placeType: placeType, filterOpen: false});
  };

  onSetFilter = async (radius, type) => {
    await this.setState({radius: radius, placeType: type, filterOpen: false});
    this.moveRegion();
  };

  render() {
    const {userLocation} = this.state;

    if (userLocation.latitude && userLocation.latitude !== 0) {
      return (
        <>
          <View style={{position: 'absolute', zIndex: 99, width: 50}}>
            <Button title="filter" onPress={this.onPressFilter} />
            {this.state.filterOpen ? (
              <Filter
                placeType={this.state.placeType}
                radius={this.state.radius}
                onSelectItem={this.onSelectItem}
                onSetFilter={this.onSetFilter}
              />
            ) : null}
          </View>
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
            }}
            onRegionChangeComplete={this.onChangeRegion}>
            {this.state.places ? (
              <>
                {this.state.places.map((place, index) => {
                  return (
                    <Marker
                      key={index}
                      ref={ref => (this.state.markers[index] = ref)}
                      coordinate={{
                        latitude: place.geometry.location.lat,
                        longitude: place.geometry.location.lng,
                      }}
                      onPress={() => this.onMarkerPressed(place, index)}>
                      <Image
                        source={require('../../assets/googlepin.png')}
                        style={{height: 50, resizeMode: 'contain'}}
                      />
                      <Callout tooltip style={this.styles.calloutContainer}>
                        <View>
                          <Text style={this.styles.calloutText}>
                            {place.name}
                          </Text>
                        </View>
                      </Callout>
                    </Marker>
                  );
                })}
              </>
            ) : null}
          </MapView>
          <Button
            title="search this region"
            onPress={this.moveRegion}
            buttonStyle={this.styles.mapSearchRegion}
            titleStyle={this.styles.primaryFormButtonTitle}
          />
          <Carousel
            containerCustomStyle={this.styles.carouselContainer}
            contentContainerCustomStyle={{
              alignItems: 'center',
            }}
            ref={c => {
              this._carousel = c;
            }}
            data={this.state.places}
            renderItem={this.renderCarouselItem}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={300}
            onSnapToItem={index => this.onCarouselItemChange(index)}
          />
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
