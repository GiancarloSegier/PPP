import React, {Component} from 'react';

import MainNavigator from '../components/MainNavigator';
import TabNavigator from './TabNavigator';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <MainNavigator />
        <TabNavigator />
      </>
    );
  }
}
