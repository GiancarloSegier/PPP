import React, {Component} from 'react';
import {View, Text, ScrollView, Platform} from 'react-native';
import Header from '../../components/interface/Header';

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';
import firebase from 'react-native-firebase';
import {Button} from 'react-native-elements';

import {signout} from '../../api/RootApi';

class Profile extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }
  }

  onSignedOut = () => {
    console.log('signed out');
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
      <ScrollView style={this.styles.background}>
        <Header />
        <View style={this.styles.container}>
          <Text style={this.styles.title}>Welcome back</Text>
          <Text style={this.styles.subTitle}>
            {firebase.auth().currentUser.displayName}
          </Text>
          <Button
            onPress={() => {
              signout(this.onSignedOut);
            }}
            title={'Log out'}
          />
        </View>
      </ScrollView>
    );
  }
}

export default Profile;
