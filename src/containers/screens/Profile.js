import React, {Component} from 'react';
import {View, Text, ScrollView, Platform, Image, Alert} from 'react-native';

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';
import auth from '@react-native-firebase/auth';

import {Button} from 'react-native-elements';

import {signout} from '../../api/RootApi';
import Icon from 'react-native-vector-icons/FontAwesome';

class Profile extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }
    const creationTime = new Date(auth().currentUser.metadata.creationTime);
    const currentDate = new Date();

    this.state = {
      daysOnline: creationTime.getDate() - currentDate.getDate(),
    };
  }

  handleSignout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want Logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            signout(this.onSignedOut);
          },
        },
      ],
      {cancelable: false},
    );
  };
  onSignedOut = () => {
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
      <>
        <View style={[this.styles.container, {height: '100%'}]}>
          <View style={{flex: 1}}>
            <View style={this.styles.marginBottom}>
              <Text style={this.styles.title}>Goodday,</Text>
              <Text style={[this.styles.heading2, {color: '#182ac1'}]}>
                {auth().currentUser.displayName}
              </Text>
            </View>
            <View>
              <Text style={this.styles.body}>
                Go to the map and add landmarks to your selection. Then you can
                make your own trip!
              </Text>
              <Text style={this.styles.body}>
                Use the scanner to find out what those mysterious objects or
                monuments are
              </Text>
              <Text style={this.styles.body}>
                Please note that this app is still growing and working hard to
                furfill your wishes!
              </Text>
            </View>
          </View>
          <Image
            source={require('../../assets/compass.png')}
            style={{
              width: '75%',
              resizeMode: 'contain',
              opacity: 0.25,
              alignSelf: 'center',
              position: 'absolute',
              bottom: 0,
            }}
          />
          <Button
            icon={<Icon name="power-off" size={24} color="white" />}
            buttonStyle={[this.styles.resetFilter]}
            titleStyle={{fontSize: 16, fontWeight: 'bold'}}
            title=" log out"
            onPress={() => {
              this.handleSignout();
            }}
          />
        </View>
      </>
    );
  }
}

export default Profile;
