import React, {Component} from 'react';
import {
  View,
  Text,
  Platform,
  Dimensions,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableHighlight,
} from 'react-native';

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';
import {ScrollView} from 'react-native-gesture-handler';
import {inject, observer} from 'mobx-react';
import Geocoder from 'react-native-geocoding';

import {Button} from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome';

import MapView, {Marker} from 'react-native-maps';
import MapStyle from '../../config/MapStyle';
import TripCard from '../../components/trips/TripCard.js';
const googlepin = require('../../assets/googlepin.png');
const placeHolder = require('../../assets/placeholderImage.gif');

export class Home extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }

    this.state = {
      userLocation: props.mapStore.userLocation,
      currentCity: '',
      nearbyPlaces: [],
      cityImage: '',
      googleAPI: props.mapStore.googleAPI,
      activeDotIndex: 0,
      loading: true,
      citySoloTrips: props.tripStore.citySoloTrips,
    };

    Geocoder.init(props.mapStore.googleAPI), {language: 'en'};
  }

  async componentDidMount() {
    await this.fetchData();
    this.collectTrips(this.state.currentCity);
  }
  collectTrips = city => {
    this.props.tripStore.getCitySoloTrips(city);
    this.setState({citySoloTrips: this.props.tripStore.citySoloTrips});
  };

  fetchData = async () => {
    await this.props.mapStore.getCurrentLocation();
    this.setLocation(this.props.mapStore.userLocation);
    await this.getPlaces();
    await this.getCurrentCity();
    this.getPlaces();
    this.getCurrentCityImage();
    this.checkLoading();

    this.setState({
      refreshing: false,
      pageNo: 1,
      dataReceived: false,
    });
    this.props.mapStore.setCurrentCity(this.state.currentCity);
  };

  checkLoading = () => {
    setTimeout(() => {
      this.setState({loading: false});
    }, 1000);
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

  getPlaces = async () => {
    const url = await this.props.mapStore.getUrlWithParameters(
      this.props.mapStore.userLocation.latitude,
      this.props.mapStore.userLocation.longitude,
      1000,
      'tourist_attraction',
      this.state.googleAPI,
    );

    const places = [];

    await fetch(url)
      .then(data => data.json())
      .then(respons => {
        respons.results.map(place => {
          if (place.photos) {
            places.push(place);
          }
        });
      });

    if (places.length > 5) {
      this.setState({nearbyPlaces: places});
    } else {
      this.getAllPlaces();
    }
  };

  getAllPlaces = async () => {
    const url = await this.props.mapStore.getUrlWithParameters(
      this.props.mapStore.userLocation.latitude,
      this.props.mapStore.userLocation.longitude,
      3000,
      'tourist_attraction',
      this.state.googleAPI,
    );

    const places = [];

    await fetch(url)
      .then(data => data.json())
      .then(respons => {
        respons.results.map(place => {
          if (place.photos) {
            places.push(place);
          }
        });
      });
    this.setState({nearbyPlaces: places});
  };

  getCurrentCity = async () => {
    await Geocoder.from(
      this.props.mapStore.userLocation.latitude,
      this.props.mapStore.userLocation.longitude,
    )
      .then(json => {
        if (json.results[0].length !== 0) {
          const currentCity = json.results[0].address_components.filter(
            address =>
              address.types.includes('locality') ||
              address.types.includes('postal_town'),
          )[0].long_name;

          if (currentCity !== undefined) {
            this.setState({currentCity: currentCity});
          } else {
            this.setState({currentCity: ''});
          }
        } else {
          this.setState({currentCity: ''});
        }
      })
      .catch(error => console.warn(error));
  };

  getCurrentCityImage = async () => {
    const url = await this.props.mapStore.getUrlWithParameters(
      this.props.mapStore.userLocation.latitude,
      this.props.mapStore.userLocation.longitude,
      1000,
      '',
      this.state.googleAPI,
    );

    await fetch(url)
      .then(data => data.json())
      .then(respons => {
        const maxWidth = Dimensions.get('screen').width;

        if (
          this.state.currentCity !== '' &&
          respons.results[0].photos[0].photo_reference
        ) {
          const cityImageReference =
            respons.results[0].photos[0].photo_reference;
          const cityImageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${cityImageReference}&key=${
            this.state.googleAPI
          }`;

          this.setState({
            cityImage: cityImageUrl,
          });
        }
      });
  };

  onRefreshHandler = () => {
    //reset pageNo to 1
    this.setState({
      refreshing: true,
      pageNo: 1,
      data: [],
      dataReceived: false,
    });
    //timeout to simulate loading
    setTimeout(async () => {
      await this.fetchData();
      this.collectTrips(this.state.currentCity);
    }, 1500);
  };

  onPressPlace = place => {
    this.props.navigation.navigate('InfoScreen', {
      place: place,
      placeName: place.name,
    });
  };

  renderCarouselPlace = ({item}) => {
    if (item.photos[0].photo_reference) {
      const maxWidth = 500;
      this.placeImage = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${
        item.photos[0].photo_reference
      }&key=${this.state.googleAPI}`;
    }
    return (
      <TouchableHighlight
        style={this.styles.carouselCardTouchableHighlight}
        onPress={() => this.onPressPlace(item)}>
        <View style={this.styles.carouselPlaceCard}>
          {this.placeImage ? (
            <Image
              source={this.placeImage ? {uri: this.placeImage} : placeHolder}
              style={this.styles.placeImage}
            />
          ) : null}
          <View style={this.styles.carouselPlaceContainer}>
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
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  renderCarouselTrip = ({item}) => {
    return <TripCard item={item} />;
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={this.styles.loadScreen}>
          <ActivityIndicator size={'large'} color="#192BC2" />
          <Text>Turist is making everything ready for you!</Text>
        </View>
      );
    } else {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              tintColor="#182ac1"
              progressBackgroundColor={'rgba(255,255,255, 0.8)'}
              size="large"
              title="Turist is searching for more!"
              refreshing={this.state.refreshing}
              onRefresh={this.onRefreshHandler}
            />
          }>
          {this.state.currentCity ? (
            <View style={this.styles.homeHeader}>
              <Image
                source={
                  this.state.cityImage
                    ? {uri: this.state.cityImage}
                    : placeHolder
                }
                style={{
                  width: '100%',
                  height: 300,
                }}
              />
              <View style={this.styles.overlayCity}>
                <Text style={this.styles.cityName}>
                  <Icon name="map-marker" size={38} color="#ffffff" />{' '}
                  {this.state.currentCity}
                </Text>
              </View>
            </View>
          ) : (
            <View style={[this.styles.homeHeader, this.styles.noCity]}>
              <Text style={this.styles.cityName}>
                <Icon name="map-marker" size={38} color="#ffffff" /> Are you
                hiding?
              </Text>
            </View>
          )}
          <View style={this.styles.marginBottom}>
            {this.state.nearbyPlaces.length > 0 ? (
              <>
                <View style={this.styles.container}>
                  <Text style={this.styles.heading2}>Nearby places:</Text>
                </View>
                <Carousel
                  ref={c => {
                    this._carousel = c;
                  }}
                  containerCustomStyle={this.styles.carouselContainer}
                  data={this.state.nearbyPlaces}
                  renderItem={this.renderCarouselPlace}
                  sliderWidth={
                    Dimensions.get('screen').width +
                    Dimensions.get('screen').width * 0.02
                  }
                  itemWidth={Dimensions.get('screen').width * 0.8}
                  onSnapToItem={index => this.setState({activeSlide: index})}
                />
              </>
            ) : (
              <View style={this.styles.container}>
                <Text style={this.styles.heading2}>
                  Not so much to do here...
                </Text>
              </View>
            )}
            <View style={this.styles.container}>
              <Button
                buttonStyle={this.styles.primaryFormButton}
                titleStyle={this.styles.primaryFormButtonTitle}
                onPress={() => this.props.navigation.navigate('Map')}
                title={
                  this.state.nearbyPlaces > 0
                    ? 'See all nearby places'
                    : 'Look for nearby places'
                }
              />
            </View>
          </View>
          <View style={this.styles.marginBottom}>
            <View style={[this.styles.container, this.styles.blueBox]}>
              <Text
                style={[
                  this.styles.heading2,
                  this.styles.white,
                  this.styles.center,
                ]}>
                Plan your tour?
              </Text>
              <View style={this.styles.divider} />
              <Text style={[this.styles.body, this.styles.lightBlue]}>
                Use our tourgenerator to create your own tours. To use right
                away or to plan it for your next citytrip.{' '}
              </Text>
              <Button
                buttonStyle={this.styles.socialFormButton}
                titleStyle={this.styles.socialFormButtonTitle}
                onPress={() =>
                  this.props.navigation.navigate('CreateRouteScreen')
                }
                title={'go to generator'}
              />
            </View>
          </View>
          {this.state.citySoloTrips.length > 0 ? (
            <View style={this.styles.marginBottom}>
              <View style={this.styles.container}>
                <Text style={this.styles.heading2}>Featured trips:</Text>
              </View>
              <Carousel
                containerCustomStyle={this.styles.carouselContainer}
                ref={c => {
                  this._carousel = c;
                }}
                data={this.state.citySoloTrips}
                renderItem={this.renderCarouselTrip}
                sliderWidth={
                  Dimensions.get('screen').width +
                  Dimensions.get('screen').width * 0.02
                }
                itemWidth={Dimensions.get('window').width * 0.8}
              />
            </View>
          ) : null}
        </ScrollView>
      );
    }
  }
}

export default inject('mapStore', 'tripStore')(observer(Home));
