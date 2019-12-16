import React, {Component} from 'react';
import AuthForm from '../../components/auth/AuthForm';
import {login, signup, subscribeToAuthChanges} from '../../api/RootApi';
import {AccessToken, LoginManager} from 'react-native-fbsdk';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';

class LoginScreen extends Component {
  state = {
    authMode: 'login',
  };

  componentDidMount() {
    subscribeToAuthChanges(this.onAuthStateChanged);
  }

  onAuthStateChanged = user => {
    console.log(user);
    if (user !== null) {
      this.props.navigation.navigate('App');
    }
  };

  switchAuthMode = () => {
    this.setState(prevState => ({
      authMode: prevState.authMode === 'login' ? 'signup' : 'login',
    }));
  };

  onLoginFacebook = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then(result => {
        if (result.isCancelled) {
          return Promise.reject(new Error('THE USER CANCELLED THE REQUEST'));
        }
        console.log(
          `login succes with permissions: ${result.grantedPermissions.toString()}`,
        );
        return AccessToken.getCurrentAccessToken();
      })
      .then(data => {
        const credential = firebase.auth.FacebookAuthProvider.credential(
          data.accessToken,
        );
        return auth().signInWithCredential(credential);
      })
      .then(currentUser => {
        console.log(
          `Facebook login with user: ${JSON.stringify(currentUser.toJSON())}`,
        );
      })
      .catch(error => {
        console.log(`Facebook login fail with error: ${error}`);
      });
  };

  render() {
    return (
      <AuthForm
        login={login}
        signup={signup}
        authMode={this.state.authMode}
        switchAuthMode={this.switchAuthMode}
        onLoginFacebook={this.onLoginFacebook}
      />
    );
  }
}

export default LoginScreen;
