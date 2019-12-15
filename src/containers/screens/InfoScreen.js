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
import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';
import {Button} from 'react-native-elements';
import {inject, observer} from 'mobx-react';
import MapRoute from '../../components/map/MapRoute.js';
import Icon from 'react-native-vector-icons/FontAwesome';

const placeHolder = require('../../assets/placeholderImage.gif');

export class InfoScreen extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }

    const data = props.navigation.state.params;

    this.state = {
      googleAPI: this.props.mapStore.googleAPI,
      place: data.place,
      placeName: data.placeName,
      location: {
        latitude: data.place.geometry.location.lat,
        longitude: data.place.geometry.location.lng,
      },
      landmarkSelection: this.props.tripStore.landmarkSelection,
      landmarkInCollection: null,
    };
  }
  componentDidMount = async () => {
    const landmark = {
      placeId: this.state.place.place_id,
      placeName: this.state.placeName,
      location: this.state.location,
    };
    this.checkLandmarkInCollection(landmark);
    await this.collectInfo(this.state.placeName);
  };

  checkLandmarkInCollection = landmark => {
    const landmarkInCollection = this.props.tripStore.checkLandmark(landmark);
    this.setState({landmarkInCollection: landmarkInCollection});
  };

  collectInfo = async searchTerm => {
    await this.props.wikiStore.collectInfo(searchTerm);
    const searchInfo = await this.props.wikiStore.wikiInfo;
    this.getImage(this.state.place);

    this.setState({
      placeName: searchInfo.title,
      wikiURL: searchInfo.wikiURL,
      placeInfo: searchInfo.placeInfo.text,
    });
  };

  getImage = item => {
    if (item.photos) {
      this.placeImage = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=${
        item.photos[0].photo_reference
      }&key=${this.state.googleAPI}`;
      this.setState({
        placeImage: this.placeImage,
      });
    }
  };

  handleClickWikiUrl = () => {
    Linking.canOpenURL(this.state.wikiURL).then(supported => {
      if (supported) {
        Linking.openURL(this.state.wikiURL);
      } else {
        console.log("Don't know how to open URI: " + this.state.wikiURL);
      }
    });
  };

  addToLandmarkSelection = async () => {
    const landmark = {
      placeId: this.state.place.place_id,
      placeName: this.state.placeName,
      coords: this.state.location,
    };
    await this.props.tripStore.addToSelection(landmark);
    this.checkLandmarkInCollection(landmark);
  };
  removeFromCollection = async () => {
    const landmark = {
      placeId: this.state.place.place_id,
      placeName: this.state.placeName,
      coords: this.state.location,
    };
    await this.props.tripStore.removeFromSelection(landmark);
    this.checkLandmarkInCollection(landmark);
  };

  render() {
    const {placeName, placeInfo, wikiURL, placeImage} = this.state;
    return (
      <>
        <View style={{MaxHeight: Dimensions.get('screen').height * 0.2}}>
          {placeImage ? (
            <Image
              source={placeImage ? {uri: placeImage} : placeHolder}
              style={this.styles.resultImage}
            />
          ) : null}
        </View>

        <Button
          buttonStyle={
            this.state.landmarkInCollection
              ? [this.styles.bigButton, this.styles.remove]
              : [this.styles.bigButton]
          }
          titleStyle={this.styles.primaryFormButtonTitle}
          title={
            this.state.landmarkInCollection
              ? ' remove from my tour'
              : ' add to my tour'
          }
          icon={
            this.state.landmarkInCollection ? (
              <Icon name="trash" size={24} color="white" />
            ) : (
              <Icon name="map-marker" size={24} color="white" />
            )
          }
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
                {placeName === '' ||
                placeName === undefined ||
                placeName === ' ' ||
                placeName === 'undefined'
                  ? 'Turist is not sure...'
                  : placeName}
              </Text>
            </View>

            {placeName === '' ||
            placeName === undefined ||
            placeName === ' ' ||
            placeName === 'undefined' ? null : (
              <>
                <View>
                  {placeInfo && placeInfo !== '' ? (
                    <Text style={this.styles.body}>{placeInfo}</Text>
                  ) : (
                    <Text style={this.styles.body}>
                      No information was found. Turist is reading every book at
                      the moment...
                    </Text>
                  )}
                </View>
                {placeInfo ? (
                  <Button
                    buttonStyle={this.styles.secondaryFormButton}
                    titleStyle={this.styles.secondaryFormButtonplaceName}
                    title={'Go to full information'}
                    onPress={this.handleClickWikiUrl}
                  />
                ) : null}
              </>
            )}
          </View>
          <View>
            <MapRoute
              waypoints={false}
              destinationLocation={this.state.location}
              placeName={placeName}
              mapSize={'big'}
            />
          </View>
        </ScrollView>
      </>
    );
  }
}

export default inject('wikiStore', 'mapStore', 'tripStore')(
  observer(InfoScreen),
);
