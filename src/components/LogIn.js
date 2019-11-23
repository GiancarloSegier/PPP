import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, Alert} from 'react-native';
import {
  LoginButton,
  AccessToken,
  GraphRequestManager,
  GraphRequest,
} from 'react-native-fbsdk';
import {inject, observer} from 'mobx-react';

class LogIn extends Component {
  constructor(props) {
    super(props);

    // // check if user is logged in or not - if logged in -> show info
    if (AccessToken.getCurrentAccessToken()) {
      props.userStore.getFBToken();
    }
  }

  render() {
    // this.getToken();
    return (
      <View style={styles.sectionContainer}>
        {this.props.userStore.userImg ? (
          <Image
            source={{uri: this.props.userStore.userImg}}
            style={{width: 100, height: 100}}
          />
        ) : null}

        <Text style={styles.text}> {this.props.userStore.userName} </Text>

        <LoginButton
          onLoginFinished={(error, result) => {
            console.log(`error: ${error}`);
            if (error) {
              console.log('login has error: ' + result.error);
            } else if (result.isCancelled) {
              console.log('login is cancelled.');
            } else {
              console.log(`result: ${result}`);
              this.props.userStore.getFBToken();
              console.log(this.props.userStore.loggedIn);
            }
          }}
          onLogoutFinished={() => this.props.userStore.logOut()}
        />
      </View>
    );
  }
}
export default inject('userStore')(observer(LogIn));

const styles = StyleSheet.create({
  sectionContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
