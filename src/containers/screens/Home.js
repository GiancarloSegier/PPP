import React, {Component} from 'react';
import {View, Text, Platform} from 'react-native';

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';
import {ScrollView} from 'react-native-gesture-handler';

class Home extends Component {
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
          <Text style={this.styles.subTitle}>Welcome to</Text>
          <Text style={this.styles.title}>Brugges</Text>
        </View>
      </ScrollView>
    );
  }
}

export default Home;
