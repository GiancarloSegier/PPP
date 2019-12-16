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
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
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
      userId: auth().currentUser.uid,
      loading: true,
      deleteLoading: false,
      refreshing: false,
    };
    console.log(this.state.userId);
  }

  async componentDidMount() {
    await this.props.tripStore.getUserSoloTrips(this.state.userId);
    await this.props.tripStore.getUserPartyTrips(this.state.userId);
    this.checkLoading();
  }

  checkLoading = () => {
    this.setState({loading: false});
  };

  onDeleteSoloTour = tour => {
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
          onPress: async () => {
            this.setState({deleteLoading: true});
            await this.props.tripStore.deleteSoloTour(tour);
            this.setState({deleteLoading: false});
          },
        },
      ],
      {cancelable: false},
    );
  };

  onDeletePartyTour = tour => {
    Alert.alert(
      'Remove trip',
      'Are you sure you want to delete this party?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete trip',
          onPress: async () => {
            this.setState({deleteLoading: true});
            await this.props.tripStore.deletePartyTour(tour);
            this.setState({deleteLoading: false});
          },
        },
      ],
      {cancelable: false},
    );
  };

  onRefreshHandler = () => {
    //reset pageNo to 1
    this.setState({
      refreshing: true,
      pageNo: 1,
      data: [],
      dataReceived: false,
    });
    //timeout to simulate loading
    setTimeout(async () => {
      await this.props.tripStore.getUserSoloTrips(this.state.userId);
      await this.props.tripStore.getUserPartyTrips(this.state.userId);
      this.setState({
        refreshing: false,
        pageNo: 1,
        data: [],
        dataReceived: false,
      });
    }, 1500);
  };
  renderCarouselSoloTrip = ({item}) => {
    return (
      <TripCard
        item={item}
        onDeleteTour={this.onDeleteSoloTour}
        navigation={this.props.navigation}
      />
    );
  };
  renderCarouselPartyTrip = ({item}) => {
    return (
      <TripCard
        item={item}
        onDeleteTour={this.onDeletePartyTour}
        navigation={this.props.navigation}
      />
    );
  };

  render() {
    if (this.state.loading || this.state.deleteLoading) {
      return (
        <View style={this.styles.loadScreen}>
          <ActivityIndicator size={'large'} color="#192BC2" />
          <Text>
            {this.state.loading
              ? 'Turist is loading your trips!'
              : 'Turist is deleting your trip'}{' '}
          </Text>
        </View>
      );
    } else {
      return (
        <>
          {this.props.tripStore.userSoloTrips.length > 0 ||
          this.props.tripStore.userPartyTrips.length > 0 ? (
            <ScrollView
              refreshControl={
                <RefreshControl
                  tintColor="#182ac1"
                  progressBackgroundColor={'rgba(255,255,255, 0.8)'}
                  size="large"
                  title="Turist is searching for more!"
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefreshHandler}
                />
              }>
              <>
                <View style={this.styles.container}>
                  <View style={this.styles.tripTypes}>
                    <Text style={this.styles.heading2}>My solo trips:</Text>
                    <Text style={this.styles.landmarksAmount}>
                      {this.props.tripStore.userSoloTrips.length}
                    </Text>
                  </View>
                </View>
                {this.props.tripStore.userSoloTrips.length > 0 ? (
                  <Carousel
                    containerCustomStyle={this.styles.carouselContainer}
                    ref={c => {
                      this._carousel = c;
                    }}
                    data={this.props.tripStore.userSoloTrips}
                    renderItem={this.renderCarouselSoloTrip}
                    sliderWidth={
                      Dimensions.get('screen').width +
                      Dimensions.get('screen').width * 0.02
                    }
                    slideStyle={Platform.OS === 'android' ? {padding: 4} : null}
                    itemWidth={Dimensions.get('window').width * 0.8}
                  />
                ) : (
                  <View style={this.styles.container}>
                    <Text>You haven't made any solo trips yet!</Text>
                  </View>
                )}
                <View style={this.styles.container}>
                  <View style={this.styles.tripTypes}>
                    <Text style={this.styles.heading2}>My parties:</Text>
                    <Text style={this.styles.landmarksAmount}>
                      {this.props.tripStore.userPartyTrips.length}
                    </Text>
                  </View>
                </View>
                {this.props.tripStore.userPartyTrips.length > 0 ? (
                  <Carousel
                    containerCustomStyle={this.styles.carouselContainer}
                    ref={c => {
                      this._carousel = c;
                    }}
                    data={this.props.tripStore.userPartyTrips}
                    renderItem={this.renderCarouselPartyTrip}
                    sliderWidth={
                      Dimensions.get('screen').width +
                      Dimensions.get('screen').width * 0.02
                    }
                    slideStyle={Platform.OS === 'android' ? {padding: 4} : null}
                    itemWidth={Dimensions.get('window').width * 0.8}
                  />
                ) : (
                  <View style={this.styles.container}>
                    <Text>You haven't made any party trips yet!</Text>
                  </View>
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
            buttonStyle={this.styles.bigButton}
            titleStyle={this.styles.primaryFormButtonTitle}
          />
        </>
      );
    }
  }
}

export default inject('tripStore')(observer(MyTrips));
