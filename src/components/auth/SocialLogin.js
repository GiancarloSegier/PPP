import React from 'react';

import {View, Platform} from 'react-native';
import {Button, Text, Divider} from 'react-native-elements';

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';

const SocialLogin = props => {
  if (Platform.OS === 'ios') {
    this.styles = iosUI;
  } else {
    this.styles = androidUI;
  }

  return (
    <View style={{marginTop: 16}}>
      <Divider style={{height: 1, backgroundColor: '#fff'}} />
      <Text style={this.styles.loginSubtitle}>Login with:</Text>
      <View style={this.styles.socialLogin}>
        <View style={this.styles.buttonContainer}>
          <Button
            buttonStyle={[this.styles.socialFormButton, {marginRight: 8}]}
            titleStyle={this.styles.socialFormButtonTitle}
            onPress={props.onLoginFacebook}
            title={'Facebook'}
          />
        </View>
        <View style={this.styles.buttonContainer}>
          <Button
            buttonStyle={[this.styles.socialFormButton, {marginLeft: 8}]}
            titleStyle={this.styles.socialFormButtonTitle}
            onPress={props.onLoginTwitter}
            title={'Twitter'}
          />
        </View>
      </View>
    </View>
  );
};
export default SocialLogin;
