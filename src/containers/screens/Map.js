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

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';

import MapView, {Marker, Callout} from 'react-native-maps';
import MapStyle from '../../config/MapStyle';

import Carousel from 'react-native-snap-carousel';

import {inject, observer} from 'mobx-react';
import Filter from '../../components/map/Filter.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapScreen from './MapViews/MapScreen.js';
import MapRouteScreen from './MapViews/MapRouteScreen.js';

export class Map extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }

    this.state = {
      screen: '',
      googleAPI: props.mapStore.googleAPI,
    };
  }

  render() {
    if (this.state.screen === 'trip') {
      return <MapRouteScreen />;
    } else {
      return <MapScreen />;
    }
  }
}

export default inject('mapStore')(observer(Map));
