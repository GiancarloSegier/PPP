import React, {Component} from 'react';

import MainNavigator from '../components/MainNavigator';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <MainNavigator />
      </>
    );
  }
}