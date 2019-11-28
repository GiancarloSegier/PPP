import React, {Component} from 'react';
import {View, Text, ScrollView, Platform} from 'react-native';

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';

import MapView from 'react-native-maps';

export class Map extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }
  }
  render() {
    return (
      <ScrollView style={this.styles.background}>
        <View style={this.styles.container}>
          <Text style={this.styles.title}>Mapscreen</Text>
          <MapView
            style={{height: 250, width: '100%'}}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </View>
      </ScrollView>
    );
  }
}

export default Map;
