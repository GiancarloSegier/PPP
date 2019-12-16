import React, {Component} from 'react';
import {
  Text,
  Image,
  Platform,
  View,
  ScrollView,
  Linking,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import androidUI from '../../../styles/ui.android.style.js';
import iosUI from '../../../styles/ui.ios.style.js';
import {Button} from 'react-native-elements';
import {inject, observer} from 'mobx-react';
import MapRoute from '../../../components/map/MapRoute.js';
import Icon from 'react-native-vector-icons/FontAwesome';

const placeHolder = require('../../../assets/placeholderImage.gif');

export class TripInfoScreen extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }

    const data = props.navigation.state.params;

    console.log(data);
    this.state = {
      googleAPI: this.props.mapStore.googleAPI,
      tourCity: data.trip.tourCity,
      tripTitle: data.trip.tripTitle,
      landmarks: data.trip.landmarks,
      startTime: data.trip.startTime,
      startDate: data.trip.startDate,

      destinationLocation: {
        latitude:
          data.trip.landmarks[data.trip.landmarks.length - 1].coords.latitude,
        longitude:
          data.trip.landmarks[data.trip.landmarks.length - 1].coords.longitude,
      },
      cityImage: null,
    };
  }
  componentDidMount = async () => {
    await this.getCurrentCityImage();
  };

  getCurrentCityImage = async () => {
    const url = await this.props.mapStore.getUrlWithParameters(
      this.state.landmarks[0].coords.latitude,
      this.state.landmarks[0].coords.longitude,
      2000,
      '',
      this.state.googleAPI,
    );

    await fetch(url)
      .then(data => data.json())
      .then(respons => {
        if (
          this.state.currentCity !== '' &&
          respons.results[0].photos[0].photo_reference
        ) {
          const cityImageReference =
            respons.results[0].photos[0].photo_reference;
          const cityImageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=${cityImageReference}&key=${this.state.googleAPI}`;

          this.setState({
            cityImage: cityImageUrl,
          });
        }
      });
  };

  onPressPlace = landmark => {
    this.props.navigation.navigate('InfoScreen', {
      place: landmark,
      placeName: landmark.placeName,
      location: landmark.coords,
    });
  };

  onPressRoute = () => {
    this.props.mapStore.handleOpenMaps(this.state.landmarks);
  };

  render() {
    const {tourCity, placeInfo, wikiURL, cityImage} = this.state;
    return (
      <>
        <View style={this.styles.homeHeader}>
          <Image
            source={cityImage ? {uri: cityImage} : placeHolder}
            style={{
              width: '100%',
              height: 300,
            }}
          />
          <View style={this.styles.overlayCity}>
            <Text style={this.styles.cityName}>
              <Icon name="map-marker" size={38} color="#ffffff" /> {tourCity}
            </Text>
          </View>
        </View>

        <Button
          buttonStyle={this.styles.bigButton}
          titleStyle={this.styles.primaryFormButtonTitle}
          title={
            this.state.startDate ? 'Join this party' : ' follow this route'
          }
          icon={<Icon name="location-arrow" size={24} color="white" />}
          onPress={this.onPressRoute}
        />

        <ScrollView>
          <View style={this.styles.container}>
            <View
              style={[
                this.styles.scanUpperContainer,
                this.styles.marginBottom,
              ]}>
              <Text style={[this.styles.heading2]}>{this.state.tripTitle}</Text>
              {this.state.startDate ? (
                <Text style={this.styles.partyInfo}>
                  {this.state.startDate},{' '}
                  {String(this.state.startTime).slice(0, 2)}:
                  {String(this.state.startTime).slice(2, 4)}
                </Text>
              ) : null}
            </View>
            {this.state.landmarks.map((landmark, index) => {
              return (
                <View
                  key={index}
                  style={
                    index === this.state.landmarks.length - 1
                      ? [this.styles.landmarkListItemLast]
                      : [this.styles.landmarkListItem]
                  }>
                  <TouchableHighlight
                    onPress={() => this.onPressPlace(landmark)}>
                    <Text>{landmark.placeName}</Text>
                  </TouchableHighlight>
                </View>
              );
            })}
          </View>
          <View>
            <MapRoute
              waypoints={true}
              landmarkSelection={this.state.landmarks}
              origin={{
                latitude: this.state.landmarks[0].coords.latitude,
                longitude: this.state.landmarks[0].coords.longitude,
              }}
              destinationLocation={this.state.destinationLocation}
              placeName={this.state.tripTitle}
              mapSize={'big'}
            />
            {/* <MapRoute
              waypoints={false}
              destinationLocation={this.state.destinationLocation}
              placeName={this.state.tripTitle}
              mapSize={'big'}
            /> */}
          </View>
        </ScrollView>
      </>
    );
  }
}

export default inject(
  'wikiStore',
  'mapStore',
  'tripStore',
)(observer(TripInfoScreen));
