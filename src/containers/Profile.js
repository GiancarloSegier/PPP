import React, {Component} from 'react';
import {View, Text} from 'react-native';

export class Profile extends Component {
  render() {
    return (
      <View style={{justifyContent: 'center', flex: 1}}>
        <Text style={{textAlign: 'center'}}>This is the profile screen</Text>
      </View>
    );
  }
}

export default Profile;
