import React, {Component} from 'react';
import {View, Image, StatusBar, Text} from 'react-native';
import {inject, observer} from 'mobx-react';

import androidUI from '../styles/ui.android.style.js';

import iosUI from '../styles/ui.ios.style.js';
import {TouchableHighlight} from 'react-native-gesture-handler';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  onPressAvatar() {
    // this.props.navigation.navigate('Profile');
    console.log('klik');
  }

  render() {
    return (
      <>
        <StatusBar
          backgroundColor="transparent"
          translucent
          barStyle="light-content"
        />
        <View
          style={
            this.props.platform === 'ios' ? iosUI.header : androidUI.header
          }>
          <View
            style={
              this.props.platform === 'ios'
                ? iosUI.headerContent
                : androidUI.headerContent
            }>
            <Image source={require('../assets/logo.png')} />

            <Image
              style={
                this.props.platform === 'ios' ? iosUI.avatar : androidUI.avatar
              }
              source={{uri: this.props.userStore.userImg}}
            />
          </View>
        </View>
      </>
    );
  }
}

export default inject('userStore')(observer(Header));
