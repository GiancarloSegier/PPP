import React, {Component} from 'react';
import {View, Text} from 'react-native';
import LogIn from '../components/LogIn';

export class Profile extends Component {
  render() {
    return (
      <View style={{height: '100%'}}>
        <LogIn />
      </View>
    );
  }
}

export default Profile;
