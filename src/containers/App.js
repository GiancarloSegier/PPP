import React, {Component} from 'react';
import {Provider} from 'mobx-react';

import store from '../store/index.js';

import LoginScreen from './auth/LogInScreen';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import TabNavigator from '../components/interface/TabNavigator';
import {createStackNavigator} from 'react-navigation-stack';

const AppStack = createStackNavigator(
  {
    StartScreen: TabNavigator,
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
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
