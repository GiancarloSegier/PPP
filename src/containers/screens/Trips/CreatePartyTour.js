import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform,
  FlatList,
  TextInput,
  TouchableHighlight,
  Alert,
  Modal,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Button, Overlay, ButtonGroup} from 'react-native-elements';

import androidUI from '../../../styles/ui.android.style.js';
import iosUI from '../../../styles/ui.ios.style.js';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import DatePicker from 'react-native-date-picker';

export class CreatePartyTour extends Component {
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
      trips: [],
      newTripTitle: '',
      currentDate: new Date(),
      currentDateString: `${day}/${month}/${year}`,
      pickedhour: null,
      pickedDateString: null,
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
    this.ref
      .add({
        userId: this.state.userId,
        type: 'party',
        tripTitle: this.state.newTripTitle,
        dateAdded: this.state.currentDate,
      })
      .then(data => {
        this.setState({newTripTitle: ''});
      })
      .catch(error => {
        console.log(`error loading: ${error}`);
        this.setState({newTripTitle: ''});
      })
      .then(() => {
        this.props.navigation.goBack(null);
      });
  };

  handleDatePicked = date => {
    const day = new Date(date).getDate();
    const month = new Date(date).getMonth() + 1;
    const year = new Date(date).getFullYear();

    this.setState({
      pickedDate: date,
      pickedDateString: `${day}/${month < 10 ? month : `0${month}`}/${year}`,
    });
    this.hidePicker();
  };

  handleTimePicked = date => {
    this.setState({
      pickedhour: date,
    });
  };

  render() {
    return (
      <View style={this.styles.container}>
        <Text style={this.styles.heading2}>Create your party tour</Text>
        <TextInput
          style={{backgroundColor: 'white', padding: 24}}
          keyboardType="default"
          placeholder="Enter name for your party"
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

export default CreatePartyTour;
