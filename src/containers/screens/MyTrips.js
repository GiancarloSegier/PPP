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
  Dimensions,
} from 'react-native';
import {Button} from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';

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
      allTrips: [],
      userId: firebase.auth().currentUser.uid,
    };
    this.ref = firebase.firestore().collection('trips');
  }

  componentDidMount() {
    this.collectTrips();
  }

  collectTrips() {
    const userTrips = this.ref.where('userId', '==', this.state.userId);
    const userSoloTrips = userTrips.where('type', '==', 'solo');

    this.unsubscribeAllTrips = userTrips.onSnapshot(querySnapshots => {
      const allTrips = [];

      querySnapshots.forEach(doc => {
        let day = new Date(doc.data().dateAdded).getDay();
        let month = new Date(doc.data().dateAdded).getMonth() + 1;
        let year = new Date(doc.data().dateAdded).getFullYear();
        allTrips.push({
          tripTitle: doc.data().tripTitle,
          dateAdded: doc.data().dateAdded,
          dateAddedString: `${day}/${month}/${year}`,
          coords: doc.data().coords,
        });
      });
      this.setState({
        allTrips: allTrips,
      });
    });

    this.unsubscribeSoloTrips = userSoloTrips.onSnapshot(querySnapshots => {
      const soloTrips = [];
      querySnapshots.forEach(doc => {
        let day = new Date(doc.data().dateAdded).getDay();
        let month = new Date(doc.data().dateAdded).getMonth() + 1;
        let year = new Date(doc.data().dateAdded).getFullYear();

        soloTrips.push({
          tripTitle: doc.data().tripTitle,
          dateAdded: doc.data().dateAdded,
          dateAddedString: `${day}/${month}/${year}`,
          coords: doc.data().coords,
        });
      });
      this.setState({
        soloTrips: soloTrips,
      });
    });
  }

  renderItem = ({item, index}) => {
    console.log(item.dateAdded);
    return (
      <View style={this.styles.carouselCard}>
        <View>
          <Text style={this.styles.carouselTitle}>{item.tripTitle}</Text>
          {/* <Text>{item.dateAdded}</Text> */}
          <View>
            {item.coords.map((coord, index) => {
              return (
                <Text key={index} style={[this.styles.placeType]}>
                  {coord.latitude}
                </Text>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  render() {
    if (this.state.allTrips.length > 0) {
      return (
        <View style={[this.styles.background, {flex: 1}]}>
          <View style={this.styles.container}>
            <Text style={this.styles.heading2}>My trips</Text>
            <Carousel
              contentContainerCustomStyle={{
                alignItems: 'center',
              }}
              ref={c => {
                this._carousel = c;
              }}
              data={this.state.soloTrips}
              renderItem={this.renderItem}
              sliderWidth={Dimensions.get('screen').width}
              itemWidth={Dimensions.get('screen').width * 0.8}
              onSnapToItem={index => this.setState({activeSlide: index})}
            />
            <Text style={this.styles.heading2}>My Parties</Text>
            <Carousel
              contentContainerCustomStyle={{
                alignItems: 'center',
              }}
              ref={c => {
                this._carousel = c;
              }}
              data={this.state.soloTrips}
              renderItem={this.renderItem}
              sliderWidth={Dimensions.get('screen').width}
              itemWidth={Dimensions.get('screen').width * 0.8}
              onSnapToItem={index => this.setState({activeSlide: index})}
            />
          </View>
          <Button
            onPress={() => this.props.navigation.navigate('CreateRouteScreen')}
            title={'Create my trip'}
            buttonStyle={this.styles.mapButton}
            titleStyle={this.styles.primaryFormButtonTitle}
          />
        </View>
      );
    } else {
      return (
        <View style={this.styles.container}>
          <Text>Create a trip!</Text>
        </View>
      );
    }
  }
}

export default MyTrips;
