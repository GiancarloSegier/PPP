import React, {Component} from 'react';

import TabNavigator from '../components/TabNavigator';

import {inject, observer} from 'mobx-react';
import Header from '../components/Header';
import Login from '../components/LogIn';
class AppContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.userStore.loggedIn) {
      return <Login />;
    } else {
      return (
        <>
          <Header />
          <TabNavigator />
        </>
      );
    }
  }
}

export default inject('userStore')(observer(AppContainer));
