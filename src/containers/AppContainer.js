import React, {Component} from 'react';

import {AccessToken} from 'react-native-fbsdk';
import {inject, observer} from 'mobx-react';
import Header from '../components/Header';
import Login from '../components/LogIn';
import MainNavigator from '../components/MainNavigator';
class AppContainer extends Component {
  constructor(props) {
    super(props);

    if (AccessToken.getCurrentAccessToken()) {
      props.userStore.getFBToken();
    }
  }

  render() {
    if (this.props.userStore.loggedIn) {
      return (
        <>
          <Header />
          <MainNavigator />
        </>
      );
    } else {
      return <Login />;
    }
  }
}

export default inject('userStore')(observer(AppContainer));
