import React, {Component} from 'react';
import {
  View,
  Text,
  Platform,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import {Button} from 'react-native-elements';

import androidUI from '../../../styles/ui.android.style.js';
import iosUI from '../../../styles/ui.ios.style.js';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {inject, observer} from 'mobx-react';
import MapRoute from '../../../components/map/MapRoute.js';
import SelectionOverlay from '../../../components/map/SelectionOverlay.js';

import DateTimePickerModal from 'react-native-modal-datetime-picker';

export class CreatePartyTour extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }

    this.day = new Date().getDate();
    this.month = new Date().getMonth() + 1;
    this.year = new Date().getFullYear();
    this.hours = new Date().getHours();
    this.minutes = new Date().getMinutes();
    const startDate = `${this.day}/${this.month}/${this.year}`;
    const startTime = `${this.hours < 10 ? '0' + this.hours : this.hours}:${
      this.minutes < 10 ? '0' + this.minutes : this.minutes
    }`;

    this.state = {
      trips: [],
      newTripTitle: '',
      currentDate: `${this.day}/${this.month}/${this.year}`,
      userId: auth().currentUser.uid,
      isDateTimePickerVisible: false,
      landmarkSelection: this.props.tripStore.landmarkSelection,
      tourDuration: this.props.tripStore.tourDuration,
      tourDistance: this.props.tripStore.tourDistance,
      originLocation: {},
      tourCity: null,
      startHour: null,
      // startDate: new Date(),
      startdateTime: new Date(),
      startDate: startDate,
      startTime: startTime,
      loading: false,
    };

    this.firestoreCollection = firestore().collection('trips');
  }

  showDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: true});
  };

  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false});
  };

  handleDatePicked = date => {
    console.log('A date has been picked: ', date);
    // new Date().getho
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    console.log(date);
    const startDate = `${day}/${month}/${year}`;
    const startTime = `${hours < 10 ? '0' + hours : hours}:${
      minutes < 10 ? '0' + minutes : minutes
    }`;

    this.setState({
      startdateTime: date,
      startDate: startDate,
      startTime: startTime,
    });
    this.hideDateTimePicker();
  };

  onPressAdd = async () => {
    const newLandmarks = [];
    if (
      this.state.newTripTitle.trim() === '' &&
      this.state.landmarkSelection.length < 2
    ) {
      Alert.alert(
        'You really have to fill in a partyname and select at least 2 landmarks',
      );
      return;
    } else if (this.state.newTripTitle.trim() === '') {
      Alert.alert('Enter a name for your party please');
      return;
    }
    if (
      this.state.landmarkSelection &&
      this.state.landmarkSelection.length < 2
    ) {
      Alert.alert('You have to select at least 2 landmarks');
      return;
    } else {
      this.state.landmarkSelection.map(landmark => {
        const newLandmark = {
          coords: {
            latitude: landmark.coords.latitude,
            longitude: landmark.coords.longitude,
          },
          placeName: landmark.placeName,
          placeId: landmark.placeId,
          photoReference: landmark.photoReference,
        };
        newLandmarks.push(newLandmark);
      });
    }

    const newTour = {
      userId: this.state.userId,
      tripTitle: this.state.newTripTitle,
      dateAdded: this.state.currentDate,
      tourCity: this.props.tripStore.tourCity,
      distance: this.props.tripStore.tourDistance,
      duration: this.props.tripStore.tourDuration,
      landmarks: newLandmarks,
      startDate: this.state.startDate,
      startTime: parseInt(this.state.startTime.replace(':', ''), 0),
    };
    this.setState({
      landmarkSelection: [],
      prevLandmarkSelection: this.state.landmarkSelection,
      thisTour: newTour,
      loading: true,
    });
    await this.props.tripStore.addPartyTour(newTour);

    this.setState({
      newTripTitle: '',
      loading: false,
    });
    this.showSucces();
  };

  showSucces = () => {
    Alert.alert(
      'Congratulations!',
      "You're party has been created and saved!",
      [
        {
          text: 'Okay!',
          onPress: () => {
            console.log('Do it later');
            this.props.navigation.navigate('TripInfoScreen', {
              trip: this.state.thisTour,
            });
          },
        },
      ],
      {cancelable: false},
    );
  };

  onHideSelection = (removeAll = false) => {
    this.setState({selectionVisible: false});
    if (removeAll) {
      this.props.tripStore.resetLandmarks();
    }
  };

  render() {
    if (!this.state.loading) {
      return (
        <>
          <ScrollView style={{flex: 1}}>
            <View>
              <View style={this.styles.container}>
                <Text style={this.styles.heading2}>Create a party</Text>
                <View style={this.styles.marginTop}>
                  <TextInput
                    style={this.styles.formField}
                    keyboardType="default"
                    placeholder="Enter a partytitle"
                    value={
                      this.state.newTripTitle === ''
                        ? ''
                        : this.state.newTripTitle
                    }
                    onChangeText={text => this.setState({newTripTitle: text})}
                  />
                </View>
                <View style={this.styles.marginTop}>
                  <Text style={[this.styles.body, {marginBottom: 0}]}>
                    Startdate
                  </Text>
                  <TouchableHighlight
                    style={{borderRadius: 8}}
                    onPress={this.showDateTimePicker}>
                    <Text style={this.styles.startDateTime}>
                      {this.state.startDate}, {this.state.startTime}
                    </Text>
                  </TouchableHighlight>

                  <DateTimePickerModal
                    mode="datetime"
                    locale="en_GB"
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                    minimumDate={new Date()}
                    isDarkModeEnabled={true}
                  />
                </View>
              </View>

              {this.state.landmarkSelection &&
              this.state.landmarkSelection.length > 1 ? (
                <>
                  <MapRoute
                    createTour={true}
                    waypoints={true}
                    mapSize={'small'}
                    origin={{
                      latitude: this.props.tripStore.landmarkSelection[0].coords
                        .latitude,
                      longitude: this.props.tripStore.landmarkSelection[0]
                        .coords.longitude,
                    }}
                    landmarkSelection={this.state.landmarkSelection}
                    destinationLocation={{
                      latitude: this.state.landmarkSelection[
                        this.state.landmarkSelection.length - 1
                      ].coords.latitude,
                      longitude: this.state.landmarkSelection[
                        this.state.landmarkSelection.length - 1
                      ].coords.longitude,
                    }}
                  />
                  <Button
                    buttonStyle={this.styles.secondaryFormButton}
                    titleStyle={this.styles.primaryFormButtonTitle}
                    title={'customize landmarks'}
                    onPress={() => this.setState({selectionVisible: true})}
                  />
                </>
              ) : (
                <View style={this.styles.container}>
                  <Text style={this.styles.body}>
                    Seems like you haven't selected at least 2 landmarks. Go
                    pick them right away!
                  </Text>
                  <Button
                    buttonStyle={this.styles.primaryFormButton}
                    titleStyle={this.styles.primaryFormButtonTitle}
                    title={'add landmarks'}
                    onPress={() => this.props.navigation.navigate('Map')}
                  />
                </View>
              )}
            </View>
          </ScrollView>
          <View style={{height: 60}}>
            <Button
              buttonStyle={[this.styles.bigButton]}
              titleStyle={this.styles.primaryFormButtonTitle}
              title={'Create party'}
              disabled={this.state.landmarkSelection.length < 2 ? true : false}
              onPress={this.onPressAdd}
            />
            {this.state.selectionVisible ? (
              <SelectionOverlay
                onHideSelection={this.onHideSelection}
                navigation={this.props.navigation}
                createTour={true}
              />
            ) : null}
          </View>
        </>
      );
    } else {
      return (
        <View style={this.styles.loadScreen}>
          <ActivityIndicator size={'large'} color="#192BC2" />
          <Text>
            {this.state.removeAllPressed !== true
              ? 'Turist is uploading your trip!'
              : 'Turist is clearing your selected landmarks!'}{' '}
          </Text>
        </View>
      );
    }
  }
}

export default inject('tripStore', 'mapStore')(observer(CreatePartyTour));
