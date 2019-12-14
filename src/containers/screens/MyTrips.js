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

    this.state = {
      allTrips: [],
      userSoloTrips: props.tripStore.userSoloTrips,
      userPartyTrips: props.tripStore.userPartyTrips,
      userId: auth().currentUser.uid,
    };
  }

  componentDidMount() {
    this.collectTrips();
  }

  collectTrips() {
    this.props.tripStore.getUserSoloTrips(this.state.userId);
    this.props.tripStore.getUserPartyTrips(this.state.userId);
    this.setState({
      userSoloTrips: this.props.tripStore.userSoloTrips,
      userPartyTrips: this.props.tripStore.userPartyTrips,
    });
  }

  renderCarouselTrip = ({item}) => {
    return <TripCard item={item} />;
  };

  render() {
    return (
      <>
        {this.state.userSoloTrips.length > 0 ||
        this.state.userPartyTrips.length > 0 ? (
          <ScrollView>
            <>
              <View style={this.styles.container}>
                <Text style={this.styles.heading2}>My solo trips</Text>
              </View>
              {this.state.userSoloTrips.length > 0 ? (
                <Carousel
                  containerCustomStyle={this.styles.carouselContainer}
                  ref={c => {
                    this._carousel = c;
                  }}
                  data={this.state.userSoloTrips}
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
              {this.state.userPartyTrips.length > 0 ? (
                <View style={{height: 140}}>
                  <Carousel
                    containerCustomStyle={this.styles.carouselContainer}
                    ref={c => {
                      this._carousel = c;
                    }}
                    data={this.state.userPartyTrips}
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
