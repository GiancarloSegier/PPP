import React, {Component} from 'react';
import {
  View,
  Text,
  Platform,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableHighlight,
  TouchableHighlightComponent,
} from 'react-native';
import {Button} from 'react-native-elements';
import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';
import MapStyle from '../../config/MapStyle';
import Carousel from 'react-native-snap-carousel';
import {inject, observer} from 'mobx-react';
import FilterOverlay from '../../components/map/FilterOverlay.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, {Marker, Callout} from 'react-native-maps';
import GOOGLEPIN from '../../assets/googlepin.png';
import SelectionOverlay from '../../components/map/SelectionOverlay.js';
const placeHolder = require('../../assets/placeholderImage.gif');

export class Map extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }
    const landmarkSelection = this.props.tripStore.landmarkSelection;

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
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      },
      places: [],
      markers: [],
      placeType: 'tourist_attraction',
      radius: 1500,
      checkOpen: false,
      filterOpen: false,
      landmarkSelection: landmarkSelection,
      selectionVisible: false,
    };
  }

  componentDidMount() {
    this.setLocation(this.props.mapStore.userLocation);
    this.getPlaces('tourist_attraction', 1500);
  }

  getPlaces = async (
    placeType,
    radius,
    regionLocation = this.state.regionLocation,
  ) => {
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
        latitudeDelta: position.latitudeDelta,
        longitudeDelta: position.longitudeDelta,
      },
    });
  };

  moveRegion = async () => {
    const regionLocation = {
      latitude: this.state.regionLocation.latitude,
      longitude: this.state.regionLocation.longitude,
      latitudeDelta: this.state.regionLocation.latitudeDelta,
      longitudeDelta: this.state.regionLocation.longitudeDelta,
    };
    this.setRegion(regionLocation);
    await this.getPlaces(this.state.placeType, this.state.radius);
    if (this.places) {
      await this.carousel.snapToItem(0);
    }
  };

  onChangeRegion = region => {
    const newRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    };
    this.setState({regionLocation: newRegion, markers: []});
  };

  onCarouselItemChange = index => {
    let place = this.state.places[index];
    this._map.animateToRegion(
      {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      },
      500,
    );
    this.state.markers[index].showCallout();
  };

  onMarkerPressed = (place, index) => {
    this._map.animateToRegion(
      {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      },
      500,
    );
    this.carousel.snapToItem(index);
  };

  onPressFilter = () => {
    this.setState(prevState => ({filterOpen: !prevState.filterOpen}));
  };

  onSelectItem = placeType => {
    this.setState({placeType: placeType, filterOpen: false});
  };

  onSetFilter = async (radius, type, checkOpen) => {
    this.setState({
      radius: radius,
      placeType: type,
      filterOpen: false,
      checkOpen: checkOpen,
      regionLocation: this.state.regionLocation,
      places: [],
    });
    await this.getPlaces(type, radius);
    if (this.places) {
      await this.carousel.snapToItem(0);
    }
  };

  onPressFollowUser = async () => {
    await this.props.mapStore.getCurrentLocation();
    this.currentLocation = await this.props.mapStore.userLocation;

    const newLocation = {
      latitude: this.currentLocation.latitude,
      longitude: this.currentLocation.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015,
    };
    this._map.animateToRegion(newLocation, 500);

    this.setState({regionLocation: newLocation, places: []});
    this.getPlaces(this.state.placeType, this.state.radius);
  };

  onPressPlace = place => {
    this.props.navigation.navigate('InfoScreen', {
      place: place,
      placeName: place.name,
    });
  };

  onPressShowSelection = () => {
    this.setState({selectionVisible: true});
  };
  onHideSelection = (removeAll = false) => {
    this.setState({selectionVisible: false});
    if (removeAll) {
      this.props.tripStore.resetLandmarks();
    }
  };

  renderCarouselItem = ({item}) => {
    let placeImage;
    if (item.photos) {
      placeImage = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=${
        item.photos[0].photo_reference
      }&key=${this.state.googleAPI}`;
    }

    return (
      <TouchableHighlight
        style={this.styles.carouselCardTouchableHighlight}
        onPress={() => this.onPressPlace(item)}>
        <View style={this.styles.carouselCard}>
          {placeImage ? (
            <Image
              source={placeImage ? {uri: placeImage} : placeHolder}
              style={this.styles.mapPlaceImage}
            />
          ) : null}
          <View style={this.styles.mapPlaceInfo}>
            <Text style={this.styles.carouselTitle}>
              {item.name.split('').length > 20 ? (
                <Text>{item.name.slice(0, 20)}...</Text>
              ) : (
                <Text>{item.name}</Text>
              )}
            </Text>
            <View>
              {item.types.map((type, index) => {
                const correctType = type.replace(/_/g, ' ');
                if (
                  correctType !== 'point of interest' &&
                  correctType !== 'establishment' &&
                  index < 1
                ) {
                  return (
                    <Text key={index} style={[this.styles.placeType]}>
                      {correctType}
                    </Text>
                  );
                }
              })}
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    const {userLocation, regionLocation} = this.state;
    if (userLocation.latitude && userLocation.latitude !== 0) {
      return (
        <>
          {this.state.filterOpen ? (
            <FilterOverlay
              placeType={this.state.placeType}
              radius={this.state.radius}
              checkOpen={this.state.checkOpen}
              onSelectItem={this.onSelectItem}
              onSetFilter={this.onSetFilter}
              onPressFilter={this.onPressFilter}
            />
          ) : null}
          <MapView
            ref={map => (this._map = map)}
            toolbarEnabled={false}
            showsUserLocation={true}
            showsBuildings
            loadingEnabled
            showsPointsOfInterest={false}
            showsMyLocationButton={false}
            customMapStyle={MapStyle}
            style={this.styles.map}
            provider={MapView.PROVIDER_GOOGLE}
            initialRegion={{
              latitude: regionLocation.latitude,
              longitude: regionLocation.longitude,
              latitudeDelta: regionLocation.latitudeDelta,
              longitudeDelta: regionLocation.longitudeDelta,
            }}
            onRegionChangeComplete={this.onChangeRegion}>
            {this.state.places ? (
              <>
                {this.state.places.map((place, index) => {
                  return (
                    <Marker
                      icon={Platform.OS !== 'ios' ? GOOGLEPIN : null}
                      key={index}
                      ref={ref => (this.state.markers[index] = ref)}
                      coordinate={{
                        latitude: place.geometry.location.lat,
                        longitude: place.geometry.location.lng,
                      }}
                      onPress={() => this.onMarkerPressed(place, index)}>
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

          <View style={{position: 'absolute', zIndex: 99}}>
            <View style={{flexDirection: 'row'}}>
              <Button
                onPress={this.onPressFilter}
                buttonStyle={this.styles.filterButton}
                icon={<Icon name="filter" size={24} color="#110b84" />}
              />

              <Button
                onPress={this.onPressFollowUser}
                buttonStyle={this.styles.filterButton}
                icon={<Icon name="street-view" size={24} color="#110b84" />}
              />

              {this.props.tripStore.landmarkSelection.length > 0 ? (
                <TouchableHighlight
                  onPress={this.onPressShowSelection}
                  style={this.styles.filterButton}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',

                      flex: 1,
                    }}>
                    <Icon name="map-marker" size={24} color="#110b84" />
                    <View style={this.styles.selectionCounter}>
                      <Text
                        style={{
                          color: 'white',

                          fontSize: 12,
                          fontWeight: 'bold',
                        }}>
                        {this.props.tripStore.landmarkSelection.length}
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>
              ) : null}
            </View>
          </View>
          <View
            style={
              this.state.places.length > 0
                ? this.styles.placesBox
                : this.styles.noPlacesBox
            }>
            {this.state.places.length > 0 ? (
              <Carousel
                containerCustomStyle={this.styles.carouselContainer}
                ref={c => {
                  this.carousel = c;
                }}
                data={this.state.places}
                renderItem={this.renderCarouselItem}
                sliderWidth={
                  Dimensions.get('screen').width +
                  Dimensions.get('screen').width * 0.02
                }
                slideStyle={Platform.OS === 'android' ? {padding: 4} : null}
                itemWidth={Dimensions.get('window').width * 0.8}
                onSnapToItem={index =>
                  this.state.places.length > 0
                    ? this.onCarouselItemChange(index)
                    : null
                }
              />
            ) : (
              <>
                <Text style={this.styles.emptyPlacesText}>
                  Well, you're looking in dark corners...
                </Text>
                <Text style={this.styles.emptyPlacesTip}>
                  Tip: use the filter
                </Text>
              </>
            )}
          </View>
          <Button
            title="search this region"
            onPress={this.moveRegion}
            buttonStyle={this.styles.bigButton}
            titleStyle={this.styles.primaryFormButtonTitle}
          />
          {this.state.selectionVisible ? (
            <SelectionOverlay
              onHideSelection={this.onHideSelection}
              navigation={this.props.navigation}
            />
          ) : null}
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

export default inject('mapStore', 'tripStore')(observer(Map));
