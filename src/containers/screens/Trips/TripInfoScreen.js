import React, {Component} from 'react';
import {
  Text,
  Image,
  Platform,
  View,
  ScrollView,
  Linking,
  Dimensions,
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
    console.log(data.trip.landmarks[0]);
    this.state = {
      googleAPI: this.props.mapStore.googleAPI,
      tourCity: data.trip.tourCity,
      tripTitle: data.trip.tripTitle,
      landmarks: data.trip.landmarks,
      cityImage: null,
    };
  }
  componentDidMount = async () => {
    await this.getCurrentCityImage();
  };

  getCurrentCityImage = async () => {
    const url = await this.props.mapStore.getUrlWithParameters(
      this.state.landmarks[0].latitude,
      this.state.landmarks[0].longitude,
      2000,
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
          title={' follow this route'}
          icon={<Icon name="location-arrow" size={24} color="white" />}
          onPress={
            this.state.landmarkInCollection
              ? this.removeFromCollection
              : this.addToLandmarkSelection
          }
        />
        <ScrollView>
          <View style={this.styles.container}>
            <View style={this.styles.scanUpperContainer}>
              <Text style={this.styles.heading2}>
                {tourCity === '' ||
                tourCity === undefined ||
                tourCity === ' ' ||
                tourCity === 'undefined'
                  ? 'Turist is not sure...'
                  : tourCity}
              </Text>
            </View>
          </View>
          {/* <View>
              <MapRoute
                waypoints={false}
                destinationLocation={this.state.location}
                placeName={tourCity}
                mapSize={'big'}
              />
            </View> */}
        </ScrollView>
      </>
    );
  }
}

export default inject('wikiStore', 'mapStore', 'tripStore')(
  observer(TripInfoScreen),
);
