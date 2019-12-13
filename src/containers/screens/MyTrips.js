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
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

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
      userId: auth().currentUser.uid,
    };
    this.ref = firestore().collection('trips');
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
        allTrips.push({
          tripTitle: doc.data().tripTitle,
          dateAdded: doc.data().dateAdded,
          landmarks: doc.data().landmarks,
        });
      });
      this.setState({
        allTrips: allTrips,
      });
    });

    this.unsubscribeSoloTrips = userSoloTrips.onSnapshot(querySnapshots => {
      const soloTrips = [];
      querySnapshots.forEach(doc => {
        soloTrips.push({
          tripTitle: doc.data().tripTitle,
          dateAdded: doc.data().dateAdded,
          landmarks: doc.data().landmarks,
        });
      });
      this.setState({
        soloTrips: soloTrips,
      });
    });
  }

  renderCarouselTrip = ({item}) => {
    return (
      <TouchableHighlight
        style={this.styles.carouselCardTouchableHighlight}
        onPress={() => this.onPressPlace(item)}>
        <View style={this.styles.carouselCard}>
          <View style={this.styles.mapPlaceInfo}>
            <Text style={this.styles.carouselTitle}>
              {item.tripTitle.split('').length > 20 ? (
                <Text>{item.tripTitle.slice(0, 20)}...</Text>
              ) : (
                <Text>{item.tripTitle}</Text>
              )}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    if (this.state.allTrips.length > 0) {
      return (
        <View style={[this.styles.background, {flex: 1}]}>
          <>
            <View style={this.styles.container}>
              <Text style={this.styles.heading2}>Trips</Text>
            </View>
            <View style={{height: 140}}>
              <Carousel
                containerCustomStyle={this.styles.carouselContainer}
                ref={c => {
                  this._carousel = c;
                }}
                data={this.state.allTrips}
                renderItem={this.renderCarouselTrip}
                sliderWidth={Dimensions.get('window').width + 32}
                itemWidth={Dimensions.get('window').width * 0.8}
              />
            </View>
          </>

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
          <Button
            onPress={() => this.props.navigation.navigate('CreateRouteScreen')}
            title={'Create my trip'}
            buttonStyle={this.styles.mapButton}
            titleStyle={this.styles.primaryFormButtonTitle}
          />
        </View>
      );
    }
  }
}

export default MyTrips;
