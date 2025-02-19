import React, {Component} from 'react';
import {View, Text, Platform, TouchableHighlight} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';
import {Button} from 'react-native-elements';

const TripCard = ({item, onDeleteTour, type, navigation}) => {
  if (Platform.OS === 'ios') {
    this.styles = iosUI;
  } else {
    this.styles = androidUI;
  }

  this.hours = Math.floor(item.duration / 60);
  this.minutes = Math.floor(item.duration % 60);

  const onDelete = () => {
    onDeleteTour(item, type);
  };

  const onPressTrip = item => {
    navigation.navigate('TripInfoScreen', {
      trip: item,
    });
  };

  return (
    <TouchableHighlight
      style={this.styles.carouselCardTouchableHighlight}
      onPress={() => onPressTrip(item)}>
      <View style={this.styles.carouselTripCard}>
        <View style={this.styles.tripCardHeading}>
          <Text style={this.styles.tripCity}>
            <Icon name="map-marker" size={18} color="#fff" /> {item.tourCity}
          </Text>
          {item.startDate ? (
            <Text style={this.styles.tripDateAdded}>
              {item.startDate}, {String(item.startTime).slice(0, 2)}:
              {String(item.startTime).slice(2, 4)}
            </Text>
          ) : null}
          {onDeleteTour ? (
            <Button
              buttonStyle={{backgroundColor: 'transparent', padding: 0}}
              icon={<Icon name="trash" size={20} color="white" />}
              onPress={onDelete}
            />
          ) : null}
        </View>
        <View style={this.styles.tripCardContent}>
          <Text style={this.styles.tripCardTitle}>
            {item.tripTitle.split('').length > 30 ? (
              <Text>{item.tripTitle.slice(0, 30)}...</Text>
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
                {item.distance < 1 ? 'meters' : 'kilometers'}
              </Text>
            </View>
            <View style={this.styles.tripInfoBlock}>
              <Text style={this.styles.tripInfoTitle}>
                {this.hours > 0 && this.minutes < 10
                  ? this.hours + 'u' + '0' + this.minutes
                  : this.hours > 0 && this.minutes > 10
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
