import React, {Component} from 'react';
import {View, Platform, Alert, Dimensions} from 'react-native';
import {Button, Overlay, ButtonGroup} from 'react-native-elements';

import androidUI from '../../../styles/ui.android.style.js';
import iosUI from '../../../styles/ui.ios.style.js';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import CreateSoloTour from './CreateSoloTour.js';
import CreatePartyTour from './CreatePartyTour.js';

export class CreateTripScreen extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }

    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    this.state = {
      selectedIndex: 0,
      trips: [],
      newTripTitle: '',
      date: new Date(),
      currentDate: new Date(),
      currentDateString: `${day}/${month}/${year}`,
      pickedhour: null,
      pickedDateString: null,
      userId: auth().currentUser.uid,
      isDatePickerVisible: false,
    };

    this.ref = firestore().collection('trips');
  }

  updateIndex = selectedIndex => {
    this.setState({selectedIndex});
  };

  render() {
    const buttons = ['Solo', 'Party'];

    return (
      <View style={{flex: 1}}>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={this.state.selectedIndex}
          buttons={buttons}
          containerStyle={this.styles.buttonGroupContainer}
          buttonStyle={{borderWidth: 0}}
          textStyle={{
            textTransform: 'uppercase',
            letterSpacing: 2,
            fontSize: 14,
          }}
          selectedButtonStyle={{backgroundColor: '#110b84'}}
          innerBorderStyle={{color: 'transparent'}}
        />

        {this.state.selectedIndex === 0 ? (
          <CreateSoloTour navigation={this.props.navigation} />
        ) : (
          <CreatePartyTour navigation={this.props.navigation} />
        )}
      </View>
    );
  }
}
export default CreateTripScreen;
