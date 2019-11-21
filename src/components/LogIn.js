import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, Alert} from 'react-native';
import {
  LoginButton,
  AccessToken,
  GraphRequestManager,
  GraphRequest,
} from 'react-native-fbsdk';
import AppContainer from '../containers/AppContainer';
import TabNavigator from '../containers/TabNavigator';
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pushData: [],
      user_name: '',
      user_img: '',
      user_mail: '',
      loggedIn: false,
    };
    console.log(props);

    // check if user is logged in or not - if logged in -> show info
    if (AccessToken.getCurrentAccessToken()) {
      this.getToken();
    }
  }

  _responseInfoCallback = (error, result) => {
    if (error) {
      Alert.alert('Error fetching data: ' + error.toString());
    } else {
      this.setState({
        user_name: result.name,
        user_img: result.picture.data.url,
        user_mail: result.email,
        loggedIn: true,
      });
    }
    console.log(this.state);
  };

  getToken() {
    AccessToken.getCurrentAccessToken().then(data => {
      const infoRequest = new GraphRequest(
        '/me',
        {
          parameters: {
            fields: {
              string:
                'email,name,first_name,middle_name,last_name, picture.type(large)', // what you want to get
            },
            access_token: {
              string: data.accessToken.toString(), // put your accessToken here
            },
          },
        },
        this._responseInfoCallback, // make sure you define _responseInfoCallback in same class
      );
      new GraphRequestManager().addRequest(infoRequest).start();
    });
  }

  render() {
    // this.getToken();
    return (
      <View style={styles.sectionContainer}>
        {this.state.user_img ? (
          <Image
            source={{uri: this.state.user_img}}
            style={{width: 100, height: 100}}
          />
        ) : null}

        <Text style={styles.text}> {this.state.user_name} </Text>

        <LoginButton
          onLoginFinished={(error, result) => {
            if (error) {
              console.log('login has error: ' + result.error);
            } else if (result.isCancelled) {
              console.log('login is cancelled.');
            } else {
              this.getToken();
            }
          }}
          onLogoutFinished={() =>
            this.setState({
              user_name: '',
              user_img: '',
              user_mail: '',
              loggedIn: false,
            })
          }
        />
        {this.state.loggedIn ? <Text>Ingelogd</Text> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
