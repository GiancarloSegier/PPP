import React, {Component} from 'react';
import {View, Text} from 'react-native';

import {inject, observer} from 'mobx-react';
import androidUI from '../styles/ui.android.style.js';
import iosUI from '../styles/ui.ios.style.js';

class Home extends Component {
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
      <View style={this.styles.container}>
        <Text style={this.styles.subTitle}>Welcome to</Text>
        <Text style={this.styles.title}>Brugges</Text>
      </View>
    );
  }
}

export default inject('userStore')(observer(Home));
