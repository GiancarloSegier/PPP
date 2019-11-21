import React, {Component} from 'react';
import {View, Text, Button} from 'react-native';

import LogIn from './LogIn.js';
export default class LogInScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <LogIn navigation={this.props.navigation} />
      </View>
    );
  }
}
