import React, {Component} from 'react';
import {View, Text, Platform, TextInput, Alert} from 'react-native';
import {Button} from 'react-native-elements';

import androidUI from '../../../styles/ui.android.style.js';
import iosUI from '../../../styles/ui.ios.style.js';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {inject, observer} from 'mobx-react';
import MapRoute from '../../../components/map/MapRoute.js';

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
      originLocation: {
        latitude: this.props.tripStore.landmarkSelection[0].coords.latitude,
        longitude: this.props.tripStore.landmarkSelection[0].coords.longitude,
      },
      tourCity: null,
    };

    this.firestoreCollection = firestore().collection('trips');
  }

  componentDidMount() {
    this.getTourCity();
  }

  getTourCity = async () => {
    await this.props.tripStore.getTourCity(this.state.originLocation);
    this.setState({tourCity: this.props.tripStore.tourCity});
  };

  onPressAdd = async () => {
    const newLandmarks = [];
    if (
      this.state.newTripTitle.trim() === '' &&
      this.state.landmarkSelection.length < 1
    ) {
      Alert.alert(
        'You really have to fill in a tourname and select at least 1 landmark',
      );
      return;
    } else if (this.state.newTripTitle.trim() === '') {
      Alert.alert('Enter a tourname please');
      return;
    }
    if (
      this.state.landmarkSelection &&
      this.state.landmarkSelection.length < 1
    ) {
      Alert.alert('You have to select at least 1 landmark');
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
      type: 'solo',
      tripTitle: this.state.newTripTitle,
      dateAdded: this.state.currentDate,
      tourCity: this.props.tripStore.tourCity,
      distance: this.props.tripStore.tourDistance,
      duration: this.props.tripStore.tourDuration,
      landmarks: newLandmarks,
    };
    await this.props.tripStore.addSoloTour(newTour);
    await this.props.tripStore.resetLandmarks();
    this.setState({
      newTripTitle: '',
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
          onPress: () => console.log('Do it now'),
        },
        {
          text: 'Do it later',
          onPress: () => {
            console.log('Do it later');
          },
        },
      ],
      {cancelable: false},
    );
  };

  render() {
    return (
      <View style={this.styles.container}>
        <Text style={this.styles.heading2}>Create your tour</Text>
        <TextInput
          style={this.styles.formField}
          keyboardType="default"
          placeholder="Enter a tourname"
          value={this.state.newTripTitle === '' ? '' : this.state.newTripTitle}
          onChangeText={text => this.setState({newTripTitle: text})}
        />
        {this.state.landmarkSelection &&
        this.state.landmarkSelection.length > 0 ? (
          <Button
            buttonStyle={this.styles.primaryFormButton}
            titleStyle={this.styles.primaryFormButtonTitle}
            title={'add more landmarks'}
            onPress={() => this.props.navigation.navigate('Map')}
          />
        ) : null}
        {this.state.landmarkSelection &&
        this.state.landmarkSelection.length > 0 ? (
          <MapRoute
            createTour={true}
            waypoints={true}
            origin={this.state.originLocation}
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
        ) : (
          <Button
            buttonStyle={this.styles.primaryFormButton}
            titleStyle={this.styles.primaryFormButtonTitle}
            title={'add landmarks'}
            onPress={() => this.props.navigation.navigate('Map')}
          />
        )}
        <Button
          buttonStyle={this.styles.primaryFormButton}
          titleStyle={this.styles.primaryFormButtonTitle}
          title={'Create tour'}
          onPress={this.onPressAdd}
        />
      </View>
    );
  }
}

export default inject('tripStore', 'mapStore')(observer(CreateSoloTour));
