import React, {Component} from 'react';
import {View, Text, Platform, Image, ScrollView} from 'react-native';

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
    } else {
      await this.props.tripStore.removeFromSelection(removeLandmark);
    }
  };

  render() {
    return (
      <Overlay
        isVisible
        animated
        animationType="fade"
        overlayStyle={this.styles.overlayLandmarks}>
        <View style={this.styles.overlayButtonsTop}>
          <TouchableHighlight
            onPress={() =>
              this.props.onSetFilter(1500, 'tourist_attraction', false)
            }>
            <View style={{flexDirection: 'row', opacity: 0.4}}>
              <Icon name="times" size={16} color="#020029" />
              <Text style={{color: '#020029'}}> Clear all landmarks</Text>
            </View>
          </TouchableHighlight>
          <Button
            onPress={() => this.props.onHideSelection()}
            buttonStyle={this.styles.closeButton}
            icon={<Icon name="times" size={24} color="#110b84" />}
          />
        </View>

        <View style={[this.styles.container]}>
          <Text style={this.styles.heading2}>My landmarks</Text>
          <ScrollView>
            {this.state.landmarkSelection.map(landmark => {
              return (
                <View>
                  <Text>{landmark.placeName}</Text>
                  <Button
                    title="remove place"
                    onPress={() => this.removeFromCollection(landmark)}
                  />
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
          {this.state.loading ? null : (
            <MapRoute
              waypoints={true}
              landmarkSelection={this.state.landmarkSelection}
              destinationLocation={this.state.destinationLocation}
            />
          )}
          <Button
            title="Create my trip"
            onPress={this.moveRegion}
            buttonStyle={this.styles.mapButton}
            titleStyle={this.styles.primaryFormButtonTitle}
          />
        </View>
      </Overlay>
    );
  }
}

export default inject('tripStore')(observer(SelectionOverlay));
