import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import LogInScreen from './LogInScreen';
import AppContainer from '../containers/AppContainer';

import React from 'react';

import {Image, Platform} from 'react-native';
import androidUI from '../styles/ui.android.style.js';

import iosUI from '../styles/ui.ios.style.js';

const RootStack = createStackNavigator(
  {
    Login: LogInScreen,
    EnterApp: AppContainer,
  },
  {
    headerBackImage: 'none',
    headerBackTitleVisible: false,
    defaultNavigationOptions: {
      headerTitle: (
        <Image
          style={Platform.OS === 'ios' ? iosUI.logo : androidUI.logo}
          source={require('../assets/logo.png')}
        />
      ),

      headerStyle: {
        backgroundColor: '#192BC2',
      },
    },
  },
);

const MainNavigator = createAppContainer(RootStack);

export default MainNavigator;
