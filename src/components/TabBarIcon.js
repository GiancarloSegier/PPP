import React, {Component} from 'react';
import {Image, Text} from 'react-native';

class TabBarIcon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {screen, active} = this.props;
    let path;

    if (active) {
      switch (screen) {
        case 'home':
          path = require('../assets/home.png');
          break;
        case 'profile':
          path = require('../assets/profile.png');
          break;
      }
    } else {
      switch (screen) {
        case 'home':
          path = require('../assets/home-inactive.png');
          break;
        case 'profile':
          path = require('../assets/profile-inactive.png');
          break;
      }
    }

    return <Image source={path} />;
  }
}

export default TabBarIcon;
