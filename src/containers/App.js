import React, {Component} from 'react';
import {Provider} from 'mobx-react';

import store from '../store/index.js';

import MainNavigator from '../components/MainNavigator';
import TabNavigator from '../components/TabNavigator';
import AppContainer from './AppContainer';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider {...store}>
        <AppContainer />
      </Provider>
    );
  }
}
