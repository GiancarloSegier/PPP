import React, {Component} from 'react';
import {
  View,
  Text,
  Platform,
  TextInput,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Button} from 'react-native-elements';

import androidUI from '../../../styles/ui.android.style.js';
import iosUI from '../../../styles/ui.ios.style.js';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {inject, observer} from 'mobx-react';
import MapRoute from '../../../components/map/MapRoute.js';
import SelectionOverlay from '../../../components/map/SelectionOverlay.js';

export class CreateSoloTour extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }

    let day = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();

    this.state = {
      trips: [],
      newTripTitle: '',
      currentDate: `${day}/${month}/${year}`,
      userId: auth().currentUser.uid,
      isDatePickerVisible: false,
      landmarkSelection: this.props.tripStore.landmarkSelection,
      tourDuration: this.props.tripStore.tourDuration,
      tourDistance: this.props.tripStore.tourDistance,
      originLocation: {},
      tourCity: null,
      selectionVisible: false,
      removeAllPressed: false,
    };

    this.firestoreCollection = firestore().collection('trips');
  }

  onPressAdd = async () => {
    const newLandmarks = [];
    if (
      this.state.newTripTitle.trim() === '' &&
      this.state.landmarkSelection.length < 2
    ) {
      Alert.alert(
        'You really have to fill in a tourname and select at least 2 landmarks',
      );
      return;
    } else if (this.state.newTripTitle.trim() === '') {
      Alert.alert('Enter a tourname please');
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
          latitude: landmark.coords.latitude,
          longitude: landmark.coords.longitude,
          placeName: landmark.placeName,
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
    };
    this.setState({landmarkSelection: [], loading: true});
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
      "You're trip has been created and saved!",
      [
        {
          text: 'Do it now',
          onPress: () => {
            console.log('Do it now');
            this.props.navigation.goBack();
          },
        },
        {
          text: 'Do it later',
          onPress: () => {
            console.log('Do it later');
            this.props.navigation.goBack();
          },
        },
      ],
      {cancelable: false},
    );
  };

  onPressShowSelection = () => {
    this.setState({selectionVisible: true});
  };
  onHideSelection = async (removeAll = false) => {
    this.setState({selectionVisible: false});
    if (removeAll) {
      this.setState({loading: true, removeAllPressed: removeAll});
      await this.props.tripStore.resetLandmarks();
      this.setState({
        landmarkSelection: this.props.tripStore.landmarkSelection,
        loading: false,
        removeAllPressed: false,
      });
    }
  };

  render() {
    if (!this.state.loading) {
      return (
        <>
          <ScrollView style={{flex: 1}}>
            <View>
              <View style={this.styles.container}>
                <Text style={this.styles.heading2}>Create your tour</Text>
                <View style={this.styles.marginTop}>
                  <TextInput
                    style={this.styles.formField}
                    keyboardType="default"
                    placeholder="Enter a tourtitle"
                    value={
                      this.state.newTripTitle === ''
                        ? ''
                        : this.state.newTripTitle
                    }
                    onChangeText={text => this.setState({newTripTitle: text})}
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
              title={'Create tour'}
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

export default inject('tripStore', 'mapStore')(observer(CreateSoloTour));
