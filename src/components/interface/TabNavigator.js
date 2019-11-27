import React from 'react';

import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import Home from '../../containers/screens/Home';
import Scanner from '../../containers/screens/Scanner';
import Map from '../../containers/screens/Map';
import MyTrips from '../../containers/screens/MyTrips';
import Profile from '../../containers/screens/Profile';

import TabBarIcon from './TabBarIcon';

const TabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <TabBarIcon active={focused} screen={'home'} />
        ),
      },
    },
    Scan: {
      screen: Scanner,
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <TabBarIcon active={focused} screen={'scan'} />
        ),
      },
    },
    Map: {
      screen: Map,
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <TabBarIcon active={focused} screen={'map'} />
        ),
      },
    },
    MyTrips: {
      screen: MyTrips,
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <TabBarIcon active={focused} screen={'trips'} />
        ),
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <TabBarIcon active={focused} screen={'profile'} />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      activeBackgroundColor: '#F8F8F8',
      showLabel: false,
      style: {
        backgroundColor: '#fff',
        height: 60,
      },
      tabStyle: {
        borderRadius: 100,
        margin: 8,
      },
    },
  },
);

export default createAppContainer(TabNavigator);
