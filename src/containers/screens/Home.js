import React, {Component} from 'react';
import {View, Text, Platform, Dimensions} from 'react-native';

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';
import {ScrollView} from 'react-native-gesture-handler';
import {inject, observer, PropTypes} from 'mobx-react';
import Geocoder from 'react-native-geocoding';

import {Button} from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';

export class Home extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }

    console.log(props.mapStore);

    this.state = {
      userLocation: props.mapStore.userLocation,
      currentCity: '',
      nearbyPlaces: [],
    };
    Geocoder.init('AIzaSyBLSLqH_qXkSrU5qK1M71zmWU3gpjs8C4g'), {language: 'en'};
  }

  async componentDidMount() {
    this.setLocation(this.props.mapStore.userLocation);
    console.log('1: ' + this.state.userLocation.latitude);
    await this.getPlaces();
    console.log('2: ' + this.state.userLocation.latitude);
    await this.getCurrentCity();
    console.log('3: ' + this.state.userLocation.latitude);
    this.getPlaces();
  }

  setLocation = position => {
    this.setState({
      userLocation: {
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: 0.045,
        longitudeDelta: 0.045,
      },
    });
  };

  getPlaces = async () => {
    const url = await this.props.mapStore.getUrlWithParameters(
      this.props.mapStore.userLocation.latitude,
      this.props.mapStore.userLocation.longitude,
      1500,
      'tourist_attraction',
      'AIzaSyBLSLqH_qXkSrU5qK1M71zmWU3gpjs8C4g',
    );

    await fetch(url)
      .then(data => data.json())
      .then(respons => {
        const places = [];

        respons.results.map(place => {
          places.push(place);
        });

        this.setState({nearbyPlaces: places});
      });
  };

  getCurrentCity = async () => {
    console.log(this.props.mapStore.userLocation);
    await Geocoder.from(
      this.props.mapStore.userLocation.latitude,
      this.props.mapStore.userLocation.longitude,
    )
      .then(json => {
        console.log(json.results[0].address_components);
        const currentCity = json.results[0].address_components.filter(
          address =>
            address.types.includes('locality') ||
            address.types.includes('postal_town'),
        )[0].long_name;
        console.log(currentCity);

        if (currentCity !== undefined) {
          this.setState({currentCity: currentCity});
        } else {
          this.setState({currentCity: ''});
        }
      })
      .catch(error => console.warn(error));
  };

  renderCarouselPlace = ({item}) => {
    // console.log(item.name);
    return (
      <View style={this.styles.carouselCard}>
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
        <Text style={this.styles.placeAdress}>{item.vicinity}</Text>
        {item.opening_hours ? (
          <Text style={this.styles.placeAdress}>
            {item.opening_hours.open_now ? 'Opened now' : 'Closed'}
          </Text>
        ) : null}
      </View>
    );
  };

  render() {
    return (
      <ScrollView style={this.styles.background}>
        <View style={this.styles.container}>
          <Text style={this.styles.subTitle}>Welcome to</Text>
          <Text style={this.styles.title}>{this.state.currentCity}</Text>
        </View>
        <Text style={this.styles.heading2}>Nearby places</Text>

        <Carousel
          contentContainerCustomStyle={{
            alignItems: 'center',
            marginVertical: 24,
          }}
          ref={c => {
            this._carousel = c;
          }}
          data={this.state.nearbyPlaces}
          renderItem={this.renderCarouselPlace}
          sliderWidth={Dimensions.get('screen').width}
          itemWidth={300}
        />
        <Button
          title={'go to maps'}
          onPress={() => {
            this.props.navigation.navigate('Map');
          }}
        />
      </ScrollView>
    );
  }
}

Home.propTypes = {
  mapStore: PropTypes.observableObject.isRequired,
};

export default inject('mapStore')(observer(Home));
