import React, {Component} from 'react';

import TabNavigator from './TabNavigator';

import {AccessToken} from 'react-native-fbsdk';
import LogInScreen from '../components/LogInScreen';

import {Text, View} from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props);
    console.log(AccessToken.getCurrentAccessToken());
  }

  render() {
    <TabNavigator />;
  }
}
