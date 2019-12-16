import React, {Component} from 'react';
import {Provider} from 'mobx-react';

import store from '../store/index.js';

import LoginScreen from './auth/LogInScreen';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import TabNavigator from '../components/interface/TabNavigator';
import {createStackNavigator} from 'react-navigation-stack';

import {
  Image,
  StatusBar,
  PermissionsAndroid,
  View,
  Platform,
} from 'react-native';
import CreateTripScreen from './screens/Trips/CreateTripScreen.js';
import InfoScreen from './screens/InfoScreen.js';
import TripInfoScreen from './screens/Trips/TripInfoScreen.js';

const requestLocationPermission = async () => {
  try {
    const granted = PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the location');
    } else {
      console.log('location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};
const requestCameraPermission = async () => {
  try {
    const granted = PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

const AppStack = createStackNavigator(
  {
    StartScreen: TabNavigator,
    CreateRouteScreen: CreateTripScreen,
    InfoScreen: InfoScreen,
    TripInfoScreen: TripInfoScreen,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#182ac1',
        elevation: 0,
        shadowOpacity: 0,
        height: 60,
      },
      headerTitleContainerStyle: {
        left: 0, // THIS RIGHT HERE
      },

      headerTitle: (
        <View>
          <StatusBar
            backgroundColor="transparent"
            translucent
            barStyle="light-content"
          />
          <Image
            resizeMode="contain"
            style={{
              height: 24,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            source={require('../assets/logo.png')}
          />
        </View>
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
  async componentDidMount() {
    if (Platform.OS === 'android') {
      await requestLocationPermission();
      await requestCameraPermission();
    }
  }

  render() {
    return (
      <Provider {...store}>
        <AppContainer />
      </Provider>
    );
  }
}
