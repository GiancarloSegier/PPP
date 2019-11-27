import React, {Component} from 'react';
import {View, Image, StatusBar, Platform} from 'react-native';
import {inject, observer} from 'mobx-react';

import androidUI from '../../styles/ui.android.style.js';

import iosUI from '../../styles/ui.ios.style.js';

class Header extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }
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
        <View style={this.styles.header}>
          <View style={this.styles.headerContent}>
            <Image source={require('../../assets/logo.png')} />

            {/* <Image
              style={this.styles.avatar}
              source={{uri: this.props.userStore.userImg}}
            /> */}
          </View>
        </View>
      </>
    );
  }
}

export default inject('userStore')(observer(Header));
