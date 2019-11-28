import React, {Component} from 'react';
import {Provider} from 'mobx-react';

import store from '../store/index.js';

import LoginScreen from './auth/LogInScreen';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import TabNavigator from '../components/interface/TabNavigator';
import {createStackNavigator} from 'react-navigation-stack';
import Header from '../components/interface/Header.js';

import {Image, StatusBar} from 'react-native';

const AppStack = createStackNavigator(
  {
    StartScreen: TabNavigator,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#182ac1',
        elevation: 0,
        shadowOpacity: 0,
        height: 80,
        paddingTop: 30,
      },
      headerTitle: (
        <>
          <StatusBar
            backgroundColor="transparent"
            translucent
            barStyle="light-content"
          />
          <Image
            resizeMode="contain"
            style={{
              width: 140,
              height: 24,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            source={require('../assets/logo.png')}
          />
        </>
      ),
    },
  },
);

const AuthNavigator = createStackNavigator({
  LoginRoute: {
    screen: LoginScreen,
    navigationOptions: () => ({
      header: null,
    }),
  },
});

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      App: AppStack,
      Auth: AuthNavigator,
    },
    {
      initialRouteName: 'Auth',
    },
  ),
);

export default class App extends Component {
  render() {
    return (
      <Provider {...store}>
        <AppContainer />
      </Provider>
    );
  }
}
