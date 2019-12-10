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

import Carousel from 'react-native-snap-carousel';

import {inject, observer} from 'mobx-react';
import Filter from '../../../components/map/Filter.js';
import Icon from 'react-native-vector-icons/FontAwesome';

import GOOGLEPIN from '../../../assets/googlepin.png';

export class MapScreen extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }
    console.log(this.props);

    this.state = {
      googleAPI: props.mapStore.googleAPI,
      userLocation: {
        latitude: props.mapStore.userLocation.latitude,
        longitude: props.mapStore.userLocation.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      },
      regionLocation: {
        latitude: props.mapStore.userLocation.latitude,
        longitude: props.mapStore.userLocation.longitude,
      },
      places: [],
      markers: [],
      placeType: 'tourist_attraction',
      radius: 1500,
      checkOpen: false,
      filterOpen: false,
    };
  }

  componentDidMount() {
    this.setLocation(this.props.mapStore.userLocation);
    this.getPlaces();
  }

  getPlaces = async () => {
    const {regionLocation, placeType, radius} = this.state;
    const url = this.props.mapStore.getUrlWithParameters(
      regionLocation.latitude,
      regionLocation.longitude,
      radius,
      placeType,
      this.state.googleAPI,
    );

    await fetch(url)
      .then(data => data.json())
      .then(respons => {
        const markers = [];

        respons.results.map(place => {
          if (this.state.checkOpen) {
            if (place.opening_hours && place.opening_hours.open_now === true) {
              markers.push(place);
            }
          } else {
            markers.push(place);
          }
        });

        this.setState({places: markers});
      });
  };

  setLocation = position => {
    this.setState({
      userLocation: {
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
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

  moveRegion = () => {
    const regionLocation = {
      latitude: this.state.regionLocation.latitude,
      longitude: this.state.regionLocation.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015,
    };
    this.setRegion(regionLocation);
    this.getPlaces();
  };

  onChangeRegion = region => {
    const newRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015,
    };
    this.setState({regionLocation: newRegion, markers: []});
  };

  renderCarouselItem = ({item}) => {
    if (item.photos[0].photo_reference) {
      this.placeImage = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=${item.photos[0].photo_reference}&key=${this.state.googleAPI}`;
    }
    return (
      <View
        style={[
          this.styles.carouselCard,
          {
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'space-between',
            padding: 0,
          },
        ]}>
        {this.placeImage ? (
          <Image
            source={{uri: this.placeImage}}
            style={{height: '100%', width: '48%'}}
          />
        ) : null}
        <View style={{width: '48%'}}>
          <Text style={this.styles.carouselTitle}>{item.name}</Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {item.types.map((type, index) => {
              const correctType = type.replace(/_/g, ' ');
              if (
                correctType !== 'point of interest' &&
                correctType !== 'establishment' &&
                index < 2
              ) {
                return (
                  <Text key={index} style={[this.styles.placeType]}>
                    {correctType}
                  </Text>
                );
              }
            })}
          </View>
          {item.opening_hours ? (
            <Text style={this.styles.placeAdress}>
              {item.opening_hours.open_now ? 'Opened now' : 'Closed'}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  onCarouselItemChange = index => {
    let place = this.state.places[index];
    this._map.animateToRegion({
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015,
    });

    this.state.markers[index].showCallout();
  };
  onMarkerPressed = (place, index) => {
    this._map.animateToRegion({
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015,
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

  onSetFilter = async (radius, type, checkOpen) => {
    await this.setState({
      radius: radius,
      placeType: type,
      filterOpen: false,
      checkOpen: checkOpen,
    });
    this.moveRegion();
  };

  onPressGo = () => {
    console.log('go');
  };

  render() {
    const {userLocation} = this.state;

    if (userLocation.latitude && userLocation.latitude !== 0) {
      return (
        <>
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
                  console.log(place);
                  return (
                    <Marker
                      key={index}
                      ref={ref => (this.state.markers[index] = ref)}
                      coordinate={{
                        latitude: place.geometry.location.lat,
                        longitude: place.geometry.location.lng,
                      }}
                      onPress={() => this.onMarkerPressed(place, index)}>
                      {/* <Image
                        source={require('../../../assets/googlepin.png')}
                        style={{height: 50, resizeMode: 'contain'}}
                      /> */}
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
            buttonStyle={this.styles.mapButton}
            titleStyle={this.styles.primaryFormButtonTitle}
          />
          <Carousel
            containerCustomStyle={this.styles.carouselContainer}
            contentContainerCustomStyle={{
              alignItems: 'flex-end',
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
          <View style={{position: 'absolute', zIndex: 99}}>
            <Button
              onPress={this.onPressFilter}
              buttonStyle={this.styles.filterButton}
              icon={
                this.state.filterOpen ? (
                  <Icon name="times" size={24} color="#110b84" />
                ) : (
                  <Icon name="filter" size={24} color="#110b84" />
                )
              }
            />
            {this.state.filterOpen ? (
              <Filter
                placeType={this.state.placeType}
                radius={this.state.radius}
                checkOpen={this.state.checkOpen}
                onSelectItem={this.onSelectItem}
                onSetFilter={this.onSetFilter}
              />
            ) : null}
          </View>
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

export default inject('mapStore')(observer(MapScreen));
