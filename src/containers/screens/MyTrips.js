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

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';
import firebase from 'react-native-firebase';

export class MyTrips extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }

    this.state = {
      trips: [],
      userId: firebase.auth().currentUser.uid,
    };
    this.ref = firebase.firestore().collection('trips');
  }

  componentDidMount() {
    this.collectTrips();
  }

  collectTrips() {
    const userTrips = this.ref.where('userId', '==', this.state.userId);
    console.log(this.ref);
    // console.log(userTrips);

    this.unsubscribe = userTrips.onSnapshot(querySnapshots => {
      const trips = [];
      querySnapshots.forEach(doc => {
        // console.log(doc);
        trips.push({
          tripTitle: doc.data().tripTitle,
        });
      });
      this.setState({
        trips: trips,
      });
    });
  }

  render() {
    return (
      <>
        <Button
          onPress={() => this.props.navigation.navigate('CreateRouteScreen')}
          title={'Create my trip'}
        />

        <View>
          <FlatList
            data={this.state.trips}
            renderItem={({item, index}) => {
              return <Text key={index}>{item.tripTitle}</Text>;
            }}
          />
        </View>
      </>
    );
  }
}

export default MyTrips;
