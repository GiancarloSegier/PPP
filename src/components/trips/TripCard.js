import React, {Component} from 'react';
import {View, Text, Platform, TouchableHighlight} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';

const TripCard = ({item}) => {
  if (Platform.OS === 'ios') {
    this.styles = iosUI;
  } else {
    this.styles = androidUI;
  }

  this.hours = Math.floor(item.duration / 60);
  this.minutes = Math.floor(item.duration % 60);

  return (
    <TouchableHighlight
      style={this.styles.carouselCardTouchableHighlight}
      onPress={() => this.onPressPlace(item)}>
      <View style={this.styles.carouselTripCard}>
        <View style={this.styles.tripCardHeading}>
          <Text style={this.styles.tripCity}>
            <Icon name="map-marker" size={18} color="#fff" /> {item.tourCity}
          </Text>
          <Text style={this.styles.tripDateAdded}>{item.dateAdded}</Text>
        </View>
        <View style={this.styles.tripCardContent}>
          <Text style={this.styles.tripCardTitle}>
            {item.tripTitle.split('').length > 20 ? (
              <Text>{item.tripTitle.slice(0, 20)}...</Text>
            ) : (
              <Text>{item.tripTitle}</Text>
            )}
          </Text>
          <View style={this.styles.tripInfo}>
            <View style={this.styles.tripInfoBlock}>
              <Text style={this.styles.tripInfoTitle}>
                {item.distance < 1
                  ? String(item.distance).replace('0.', '')
                  : item.distance}
              </Text>
              <Text style={this.styles.infoParam}>
                {item.distance < 1 ? 'metres' : 'kilometres'}
              </Text>
            </View>
            <View style={this.styles.tripInfoBlock}>
              <Text style={this.styles.tripInfoTitle}>
                {this.hours > 0
                  ? this.hours + 'u' + this.minutes
                  : this.minutes}
              </Text>
              <Text style={this.styles.infoParam}>min walk</Text>
            </View>
            <View
              style={[this.styles.tripInfoBlock, this.styles.lastInfoBlock]}>
              <Text style={this.styles.tripInfoTitle}>
                {item.landmarks.length}
              </Text>
              <Text style={this.styles.infoParam}>landmarks</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default TripCard;
