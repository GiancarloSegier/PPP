import React, {Component} from 'react';
import {View, Image, StatusBar} from 'react-native';
import androidUI from '../styles/ui.android.style.js';

import iosUI from '../styles/ui.ios.style.js';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <StatusBar backgroundColor="transparent" barStyle="light-content" />
        <View
          style={
            this.props.platform === 'ios' ? iosUI.header : androidUI.header
          }>
          <Image
            style={this.props.platform === 'ios' ? iosUI.logo : androidUI.logo}
            source={require('../assets/logo.png')}
          />
        </View>
      </>
    );
  }
}

export default Header;
