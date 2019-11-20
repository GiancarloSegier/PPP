import React, {Component} from 'react';

import TabNavigator from './TabNavigator';
import Header from '../components/Header';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <Header />
        <TabNavigator />
      </>
    );
  }
}
