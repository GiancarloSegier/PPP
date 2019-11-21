import React, {Component, Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
} from 'react-native';
import {
  LoginButton,
  AccessToken,
  GraphRequestManager,
  GraphRequest,
} from 'react-native-fbsdk';
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pushData: [],
      info: {},
      loggedIn: false,
    };
    console.log(props);
  }
  componentDidMount() {}

  testRequestGraphAPI = currentToken => {
    const infoRequest = new GraphRequest(
      '/me',
      {
        parameters: {
          fields: {
            string: 'email,name,first_name,middle_name,last_name, picture', // what you want to get
          },
          access_token: {
            string: currentToken.toString(), // put your accessToken here
          },
        },
      },
      this._responseInfoCallback, // make sure you define _responseInfoCallback in same class
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  };

  _responseInfoCallback = (error, result) => {
    if (error) {
      console.log(Object.keys(error)); // print all enumerable
      console.log(error.errorMessage); // print error message
      let json_result = JSON.stringify(error); // error object => json
    } else {
      this.setState({info: result});
      console.log(this.state);
    }
  };

  getToken() {
    AccessToken.getCurrentAccessToken().then(data => {
      this.setState({
        loggedIn: true,
        userID: data.userID,
      });
      this.testRequestGraphAPI(data.accessToken);
    });
  }

  render() {
    // this.getToken();
    return (
      <View style={styles.sectionContainer}>
        <LoginButton
          onLoginFinished={(error, result) => {
            if (error) {
              console.log('login has error: ' + result.error);
            } else if (result.isCancelled) {
              console.log('login is cancelled.');
            } else {
              console.log(result);
              this.getToken();
              this.props.navigation.navigate('EnterApp');
            }
          }}
          onLogoutFinished={() =>
            this.setState({
              loggedIn: false,
              userID: '',
            })
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
