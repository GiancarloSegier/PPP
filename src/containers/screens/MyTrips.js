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
  Image,
} from 'react-native';
import {Button} from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome';

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';
import auth from '@react-native-firebase/auth';
import {inject, observer} from 'mobx-react';
import TripCard from '../../components/trips/TripCard.js';

export class MyTrips extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }
  }

  onDeleteTour = tour => {
    Alert.alert(
      'Remove trip',
      'Are you sure you want to delete this trip?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete trip',
          onPress: () => {
            this.props.tripStore.deleteTour(tour);
          },
        },
      ],
      {cancelable: false},
    );
  };

  renderCarouselTrip = ({item}) => {
    return <TripCard item={item} onDeleteTour={this.onDeleteTour} />;
  };

  render() {
    return (
      <>
        {this.props.tripStore.userSoloTrips.length > 0 ||
        this.props.tripStore.userPartyTrips.length > 0 ? (
          <ScrollView>
            <>
              <View style={this.styles.container}>
                <Text style={this.styles.heading2}>My solo trips</Text>
              </View>
              {this.props.tripStore.userSoloTrips.length > 0 ? (
                <Carousel
                  containerCustomStyle={this.styles.carouselContainer}
                  ref={c => {
                    this._carousel = c;
                  }}
                  data={this.props.tripStore.userSoloTrips}
                  renderItem={this.renderCarouselTrip}
                  sliderWidth={
                    Dimensions.get('screen').width +
                    Dimensions.get('screen').width * 0.02
                  }
                  itemWidth={Dimensions.get('window').width * 0.8}
                />
              ) : (
                <Text>You haven't made any solo trips yet!</Text>
              )}
              <View style={this.styles.container}>
                <Text style={this.styles.heading2}>Parties</Text>
              </View>
              {this.props.tripStore.userPartyTrips.length > 0 ? (
                <View style={{height: 140}}>
                  <Carousel
                    containerCustomStyle={this.styles.carouselContainer}
                    ref={c => {
                      this._carousel = c;
                    }}
                    data={this.props.tripStore.userPartyTrips}
                    renderItem={this.renderCarouselTrip}
                    sliderWidth={
                      Dimensions.get('screen').width +
                      Dimensions.get('screen').width * 0.02
                    }
                    itemWidth={Dimensions.get('window').width * 0.8}
                    onSnapToItem={index => this.setState({activeSlide: index})}
                  />
                </View>
              ) : (
                <Text>You haven't made any party trips yet!</Text>
              )}
            </>
          </ScrollView>
        ) : (
          <View style={[this.styles.container, {flex: 1}]}>
            <Text style={[this.styles.title, this.styles.marginBottom]}>
              No trips?
            </Text>
            <Text style={this.styles.body}>
              Go to the map and add landmarks to your selection. Then you can
              make your own trip!
            </Text>
            <Text style={this.styles.body}>
              Or click the button below to go to the tour generator
            </Text>

            <Image
              source={require('../../assets/compass.png')}
              style={{
                height: '85%',
                width: '75%',
                resizeMode: 'contain',
                opacity: 0.25,
                alignSelf: 'center',
              }}
            />
          </View>
        )}
        <Button
          onPress={() => this.props.navigation.navigate('CreateRouteScreen')}
          title={'Create my trip'}
          buttonStyle={this.styles.mapButton}
          titleStyle={this.styles.primaryFormButtonTitle}
        />
      </>
    );
  }
}

export default inject('tripStore')(observer(MyTrips));
