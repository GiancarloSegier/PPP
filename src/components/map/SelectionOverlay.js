import React, {Component} from 'react';
import {View, Text, Platform, Image, ScrollView, Alert} from 'react-native';

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';
import {inject, observer} from 'mobx-react';
import {Button, Overlay} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapRoute from './MapRoute.js';
import {TouchableHighlight} from 'react-native-gesture-handler';

class SelectionOverlay extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }

    const landmarkSelection = this.props.tripStore.landmarkSelection;

    this.state = {
      landmarkSelection: landmarkSelection,
      originLocation: {
        latitude: landmarkSelection[0].coords.latitude,
        longitude: landmarkSelection[0].coords.longitude,
      },

      destinationLocation: {
        latitude:
          landmarkSelection[landmarkSelection.length - 1].coords.latitude,
        longitude:
          landmarkSelection[landmarkSelection.length - 1].coords.longitude,
      },
    };
  }
  removeFromCollection = async landmark => {
    this.setState({loading: true});
    const removeLandmark = {
      placeId: landmark.placeId,
      placeName: landmark.placeName,
      coords: landmark.coords,
    };

    if (
      this.state.landmarkSelection &&
      this.state.landmarkSelection.length === 1
    ) {
      await this.props.tripStore.removeFromSelection(removeLandmark);
      this.props.onHideSelection();
      this.setState({loading: false});
    } else {
      await this.props.tripStore.removeFromSelection(removeLandmark);
      this.setState({loading: false});
    }
  };

  onRemoveLandmark = landmark => {
    Alert.alert(
      'Remove landmark',
      `Are you sure you want to remove ${landmark.placeName} out of your selection?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Remove', onPress: () => this.removeFromCollection(landmark)},
      ],
      {cancelable: false},
    );
  };

  onPressRemoveAll() {
    Alert.alert(
      'Remove all landmarks',
      `Are you sure you want to remove ${this.state.landmarkSelection.length} landmarks out of your selection?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Remove all',
          onPress: () => {
            this.removeAll = true;
            this.props.onHideSelection(this.removeAll);
            this.setState({
              loading: false,
            });
          },
        },
      ],
      {cancelable: false},
    );
  }

  render() {
    return (
      <Overlay
        isVisible
        animated
        animationType="fade"
        overlayStyle={this.styles.overlayContainer}>
        <>
          <View style={{height: 140}}>
            <View style={[this.styles.container]}>
              <View style={this.styles.overlayButtonsTop}>
                <Button
                  onPress={() => this.onPressRemoveAll()}
                  buttonStyle={this.styles.resetFilter}
                  titleStyle={this.styles.resetTitle}
                  title=" Clear all landmarks"
                  icon={<Icon name="times" size={14} color="#fff" />}
                />
                <Button
                  onPress={() => this.props.onHideSelection()}
                  buttonStyle={this.styles.closeButton}
                  icon={<Icon name="times" size={24} color="#110b84" />}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                }}>
                <Text style={this.styles.heading2}>My landmarks:</Text>
                <Text style={this.styles.landmarksAmount}>
                  {this.state.landmarkSelection.length}
                </Text>
              </View>
            </View>
          </View>

          <ScrollView style={{flex: 1, marginHorizontal: 24}}>
            {this.state.landmarkSelection.map((landmark, index) => {
              return (
                <View key={index} style={this.styles.landmarkListItem}>
                  <Text style={{maxWidth: '85%'}}>{landmark.placeName}</Text>
                  <Button
                    buttonStyle={{
                      backgroundColor: 'transparent',
                      opacity: 0.5,
                    }}
                    onPress={() => this.onRemoveLandmark(landmark)}
                    icon={<Icon name="times" size={16} color="#020029" />}
                  />
                </View>
              );
            })}
            {this.state.landmarkSelection.length < 2 ? (
              <Text style={[this.styles.body, this.styles.marginTop]}>
                You have to select at least one more landmark
              </Text>
            ) : null}
          </ScrollView>
          <View style={{height: 290}}>
            <View
              style={{position: 'absolute', bottom: 0, width: '100%', flex: 1}}>
              {this.state.loading ||
              this.state.landmarkSelection.length < 2 ? null : (
                <MapRoute
                  waypoints={true}
                  landmarkSelection={this.state.landmarkSelection}
                  origin={this.state.originLocation}
                  destinationLocation={this.state.destinationLocation}
                />
              )}
              <Button
                title="Create my trip"
                onPress={() => {
                  this.props.onHideSelection(this.removeAll);
                  this.props.navigation.navigate('CreateRouteScreen');
                }}
                disabled={
                  this.state.landmarkSelection.length < 2 ? true : false
                }
                containerStyle={{flex: 1}}
                style={{flex: 1}}
                buttonStyle={this.styles.bigButton}
                titleStyle={this.styles.primaryFormButtonTitle}
              />
            </View>
          </View>
        </>
      </Overlay>
    );
  }
}

export default inject('tripStore')(observer(SelectionOverlay));
