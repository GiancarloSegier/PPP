import React, {Component} from 'react';
import {View, Text} from 'react-native';

import androidUI from '../styles/ui.android.style.js';
import iosUI from '../styles/ui.ios.style.js';

export class MyTrips extends Component {
  constructor(props) {
    super(props);

    if (this.props.platform === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }
  }

  render() {
    return (
      <View>
        <Text style={this.styles.title}>My trips</Text>
      </View>
    );
  }
}

export default MyTrips;
