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
} from 'react-native';
import {Button} from 'react-native-elements';

import androidUI from '../../../styles/ui.android.style.js';
import iosUI from '../../../styles/ui.ios.style.js';
import firebase from 'react-native-firebase';

import DatePicker from 'react-native-datepicker';
export class CreateTripScreen extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }

    this.state = {
      trips: [],
      newTripTitle: '',
      date: Date.now(),
      userId: firebase.auth().currentUser.uid,
    };

    this.ref = firebase.firestore().collection('trips');
  }
  onPressAdd = () => {
    if (this.state.newTripTitle.trim() === '') {
      Alert.alert('task name is blank');
      return;
    }
    this.ref
      .add({
        userId: this.state.userId,
        tripTitle: this.state.newTripTitle,
        dateAdded: Date.now(),
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

  render() {
    return (
      <View>
        <View style={{backgroundColor: 'grey', padding: 24}}>
          <TextInput
            style={{backgroundColor: 'white', padding: 24}}
            keyboardType="default"
            placeholder="enter triptitle"
            value={
              this.state.newTripTitle === '' ? '' : this.state.newTripTitle
            }
            onChangeText={text => this.setState({newTripTitle: text})}
          />

          <DatePicker
            style={{width: 200}}
            date={() => {
              const day = this.state.date.getDate();
              const month = this.state.date.getMonth();
              const year = this.state.date.getYear();
              console.log(this.state.date);

              return `${day}/${month}/${year}`;
            }} //initial date from state
            mode="date" //The enum of date, datetime and time
            placeholder="select date"
            format="DD-MM-YYYY"
            minDate="01-01-2016"
            maxDate="01-01-2019"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
              },
            }}
            onDateChange={date => {
              this.setState({date: date});
            }}
          />

          <TouchableHighlight
            onPress={this.onPressAdd}
            style={{backgroundColor: '#ddd', padding: 24}}>
            <Text>Add trip</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

export default CreateTripScreen;
