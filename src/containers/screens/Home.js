import React, {Component} from 'react';
import {View, Text, Platform} from 'react-native';

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';
import {ScrollView} from 'react-native-gesture-handler';
import {inject, observer} from 'mobx-react';
import Geocoder from 'react-native-geocoding';

export class Home extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }

    this.state = {
      currentCity: '',
    };
    Geocoder.init('AIzaSyBLSLqH_qXkSrU5qK1M71zmWU3gpjs8C4g'), {language: 'en'};
  }
  componentDidMount() {
    this.props.mapStore.getCurrentLocation();
    this.getCurrentCity();
    console.log(this.state);
  }

  getCurrentCity() {
    console.log(this.props.mapStore.userLocation.latitude);
    Geocoder.from(
      this.props.mapStore.userLocation.latitude,
      this.props.mapStore.userLocation.longitude,
    )
      .then(json => {
        const currentCity = json.results[0].address_components.filter(address =>
          address.types.includes('locality'),
        )[0].long_name;
        console.log(currentCity);

        if (currentCity !== undefined) {
          this.setState({currentCity: currentCity});
        } else {
          this.setState({currentCity: ''});
        }
      })

      .catch(error => console.warn(error));

    console.log(this.state.currentCity);
  }

  render() {
    return (
      <ScrollView style={this.styles.background}>
        <View style={this.styles.container}>
          <Text style={this.styles.subTitle}>Welcome to</Text>
          <Text style={this.styles.title}>{this.state.currentCity}</Text>
        </View>
      </ScrollView>
    );
  }
}

export default inject('mapStore')(observer(Home));
