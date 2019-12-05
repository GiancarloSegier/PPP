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
