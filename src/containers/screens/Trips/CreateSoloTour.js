import React, {Component} from 'react';
import {View, Text, Platform, TextInput, Alert} from 'react-native';
import {Button} from 'react-native-elements';

import androidUI from '../../../styles/ui.android.style.js';
import iosUI from '../../../styles/ui.ios.style.js';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export class CreateSoloTour extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }
    console.log(props);

    let day = new Date().getDay();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();

    this.state = {
      trips: [],
      newTripTitle: '',
      currentDate: `${day}/${month}/${year}`,
      userId: auth().currentUser.uid,
      isDatePickerVisible: false,
    };

    this.ref = firestore().collection('trips');
  }
  onPressAdd = () => {
    if (this.state.newTripTitle.trim() === '') {
      Alert.alert('task name is blank');
      return;
    }
    console.log(this.state.currentDate);
    this.ref
      .add({
        userId: this.state.userId,
        type: 'solo',
        tripTitle: this.state.newTripTitle,
        dateAdded: new Date(this.state.currentDate),
        coords: [
          {latitude: 42.5, longitude: 2.0},
          {latitude: 42.54, longitude: 2.1},
        ],
      })
      .then(data => {
        this.setState({newTripTitle: ''});
        this.props.navigation.goBack(null);
      })
      .catch(error => {
        console.log(`error loading: ${error}`);
        this.setState({newTripTitle: ''});
      });
  };

  render() {
    console.log(this.props);
    return (
      <View style={this.styles.container}>
        <Text style={this.styles.heading2}>Create your tour</Text>
        <TextInput
          style={this.styles.formField}
          keyboardType="default"
          placeholder="Enter a tourname"
          value={this.state.newTripTitle === '' ? '' : this.state.newTripTitle}
          onChangeText={text => this.setState({newTripTitle: text})}
        />
        <Button
          buttonStyle={this.styles.primaryFormButton}
          titleStyle={this.styles.primaryFormButtonTitle}
          title={'add more landmarks'}
          onPress={() => this.props.navigation.navigate('Map')}
        />
        <Button
          buttonStyle={this.styles.primaryFormButton}
          titleStyle={this.styles.primaryFormButtonTitle}
          title={'Create tour'}
          onPress={this.onPressAdd}
        />
      </View>
    );
  }
}

export default CreateSoloTour;
