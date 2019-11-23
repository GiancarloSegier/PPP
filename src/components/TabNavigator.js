import React from 'react';

import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import Home from '../containers/Home';
import Scanner from '../containers/Scanner';
import Map from '../containers/Map';
import MyTrips from '../containers/MyTrips';
import Profile from '../containers/Profile';

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
      activeTintColor: 'red',
      inactiveTintColor: 'gray',
    },
  },
);

export default createAppContainer(TabNavigator);
