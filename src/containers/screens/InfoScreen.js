import React, {Component} from 'react';
import {Text, Image, Platform, View, ScrollView, Linking} from 'react-native';
import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';
import {Button} from 'react-native-elements';
import {inject, observer} from 'mobx-react';
import MapRoute from '../../components/map/MapRoute.js';

export class InfoScreen extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }
    console.log(props);
    const data = props.navigation.state.params;

    this.state = {
      googleAPI: this.props.mapStore.googleAPI,
      place: data.place,
      placeName: data.placeName,
      location: {
        latitude: data.place.geometry.location.lat,
        longitude: data.place.geometry.location.lng,
      },
    };
  }
  componentDidMount = async () => {
    await this.collectInfo(this.state.placeName);
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
    console.log(item.photos[0].photo_reference);
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

  render() {
    const {placeName, placeInfo, wikiURL, placeImage} = this.state;
    return (
      <>
        {placeImage ? (
          <Image source={{uri: placeImage}} style={this.styles.resultImage} />
        ) : null}
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
              destinationLocation={this.state.location}
              placeName={placeName}
            />
          </View>
        </ScrollView>
      </>
    );
  }
}

// export default InfoScreen;

export default inject('wikiStore', 'mapStore')(observer(InfoScreen));
