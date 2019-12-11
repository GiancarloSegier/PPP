import React, {Component} from 'react';
import {
  View,
  Text,
  Platform,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableHighlight,
  Alert,
} from 'react-native';
import {Button} from 'react-native-elements';

import androidUI from '../../../styles/ui.android.style.js';
import iosUI from '../../../styles/ui.ios.style.js';

import MapView, {Marker, Callout} from 'react-native-maps';
import MapStyle from '../../../config/MapStyle';

import Carousel from 'react-native-snap-carousel';

import {inject, observer} from 'mobx-react';
import Filter from '../../../components/map/Filter.js';
import Icon from 'react-native-vector-icons/FontAwesome';

import MapboxGL from '@react-native-mapbox-gl/maps';

import GOOGLEPIN from '../../../assets/googlepin.png';

MapboxGL.setAccessToken(
  'pk.eyJ1Ijoic2VnaWVyZ2lhY2kiLCJhIjoiY2s0MHp2dGN3MDZydzNtcW5rZzl4MjByaCJ9.dWRZ7UQj1GX3_yUrcBzW8Q',
);

export class MapScreen extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }

    this.state = {
      googleAPI: props.mapStore.googleAPI,
      userLocation: [
        props.mapStore.userLocation.longitude,
        props.mapStore.userLocation.latitude,
      ],
      regionLocation: [
        props.mapStore.userLocation.longitude,
        props.mapStore.userLocation.latitude,
      ],
      places: [],
      markers: [],
      coordinates: [],
      placeType: 'tourist_attraction',
      radius: 1500,
      checkOpen: false,
      filterOpen: false,
    };
  }

  componentDidMount() {
    this.setLocation(this.props.mapStore.userLocation);
    this.getPlaces();
  }

  getPlaces = async () => {
    const {regionLocation, placeType, radius} = this.state;
    const url = this.props.mapStore.getUrlWithParameters(
      regionLocation.slice(1, 2),
      regionLocation.slice(0, 1),
      radius,
      placeType,
      this.state.googleAPI,
    );

    await fetch(url)
      .then(data => data.json())
      .then(respons => {
        const markers = [];
        const newCoordinates = [];

        respons.results.map(place => {
          let coordinate = [];
          if (this.state.checkOpen) {
            if (place.opening_hours && place.opening_hours.open_now === true) {
              markers.push(place);
              coordinate = [
                place.geometry.location.lng,
                place.geometry.location.lat,
              ];
              newCoordinates.push(coordinate);
            }
          } else {
            markers.push(place);
            coordinate = [
              place.geometry.location.lng,
              place.geometry.location.lat,
            ];

            newCoordinates.push(coordinate);
          }
        });

        this.setState({places: markers, coordinates: newCoordinates});
      });
  };

  setLocation = position => {
    this.setState({
      userLocation: [position.longitude, position.latitude],
    });
  };

  moveRegion = () => {
    this.setState({
      regionLocation: this.state.regionLocation,
    });
    console.log(this.state.regionLocation);
    this.getPlaces();
  };

  onChangeRegion = region => {
    const newRegion = region.geometry.coordinates;
    console.log(region.geometry.coordinates);
    this.setState({regionLocation: newRegion, markers: []});
  };

  renderCarouselItem = ({item}) => {
    if (item.photos) {
      this.placeImage = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=${
        item.photos[0].photo_reference
      }&key=${this.state.googleAPI}`;
    }
    return (
      <View
        style={[
          this.styles.carouselCard,
          {
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'space-between',
            padding: 0,
          },
        ]}>
        {this.placeImage ? (
          <Image
            source={{uri: this.placeImage}}
            style={{height: '100%', width: '48%'}}
          />
        ) : null}
        <View style={{width: '48%'}}>
          <Text style={this.styles.carouselTitle}>
            {item.name.split('').length > 20 ? (
              <Text>{item.name.slice(0, 20)}...</Text>
            ) : (
              <Text>{item.name}</Text>
            )}
          </Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {item.types.map((type, index) => {
              const correctType = type.replace(/_/g, ' ');
              if (
                correctType !== 'point of interest' &&
                correctType !== 'establishment' &&
                index < 2
              ) {
                return (
                  <Text key={index} style={[this.styles.placeType]}>
                    {correctType}
                  </Text>
                );
              }
            })}
          </View>
          {item.opening_hours ? (
            <Text style={this.styles.placeAdress}>
              {item.opening_hours.open_now ? 'Opened now' : 'Closed'}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  onCarouselItemChange = index => {
    let place = this.state.places[index];
    this._map.flyTo([place.geometry.location.lng, place.geometry.location.lat]);

    let selectedPlace = `placeSelected${index}`;

    this.setState({placeSelected: selectedPlace});
    // this.state.markers[index].showCallout();
  };
  onMarkerPressed = (coordinates, index) => {
    console.log(coordinates);
    this._map.flyTo(coordinates);
    this._carousel.snapToItem(index);
    let selectedPlace = `placeSelected${index}`;
    this.setState({placeSelected: selectedPlace});
  };

  onPressFilter = () => {
    this.setState(prevState => ({filterOpen: !prevState.filterOpen}));
  };

  onSelectItem = placeType => {
    this.setState({placeType: placeType, filterOpen: false});
  };

  onSetFilter = async (radius, type, checkOpen) => {
    await this.setState({
      radius: radius,
      placeType: type,
      filterOpen: false,
      checkOpen: checkOpen,
    });
    this.moveRegion();
  };

  onPressGo = () => {
    console.log('go');
  };

  renderAnnotation(counter) {
    const id = `pointAnnotation${counter}`;
    const coordinate = this.state.coordinates[counter];

    return (
      <MapboxGL.PointAnnotation
        onSelected={() => this.onMarkerPressed(coordinate, counter)}
        selected={this.state.placeSelected === `placeSelected${counter}`}
        ref={marker => (this._annotation = marker)}
        key={id}
        id={id}
        title="Test"
        coordinate={coordinate}>
        <Image
          source={require('../../../assets/googlepin.png')}
          style={{
            flex: 1,
            resizeMode: 'contain',
            width: 45,
            height: 45,
          }}
        />
        <MapboxGL.Callout
          title={this.state.places[counter].name}
          textStyle={this.styles.calloutText}
          contentStyle={this.styles.calloutContainer}
        />
      </MapboxGL.PointAnnotation>
    );
  }

  renderAnnotations() {
    const items = [];

    for (let i = 0; i < this.state.coordinates.length; i++) {
      items.push(this.renderAnnotation(i));
    }

    console.log(items);
    return items;
  }

  render() {
    const {userLocation} = this.state;

    if (userLocation.slice(0, 1) && userLocation.slice(1, 2) !== 0) {
      return (
        <>
          <View style={{flex: 1}}>
            <MapboxGL.MapView
              followUserMode={'compass'}
              logoEnabled={false}
              setMyLocationEnabled={true}
              ref={c => (this._map = c)}
              style={{flex: 1}}
              zoomLevel={14}
              onRegionDidChange={this.onChangeRegion}
              showUserLocation={true}
              styleURL={MapboxGL.StyleURL.Light}
              userTrackingMode={MapboxGL.UserTrackingModes.Follow}>
              {this.renderAnnotations()}
            </MapboxGL.MapView>
          </View>
          <Button
            title="search this region"
            onPress={this.moveRegion}
            buttonStyle={this.styles.mapButton}
            titleStyle={this.styles.primaryFormButtonTitle}
          />
          <Carousel
            containerCustomStyle={this.styles.carouselContainer}
            contentContainerCustomStyle={{
              alignItems: 'flex-end',
            }}
            ref={c => {
              this._carousel = c;
            }}
            data={this.state.places}
            renderItem={this.renderCarouselItem}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={300}
            onSnapToItem={index => this.onCarouselItemChange(index)}
          />
          <View style={{position: 'absolute', zIndex: 99}}>
            <Button
              onPress={this.onPressFilter}
              buttonStyle={this.styles.filterButton}
              icon={
                this.state.filterOpen ? (
                  <Icon name="times" size={24} color="#110b84" />
                ) : (
                  <Icon name="filter" size={24} color="#110b84" />
                )
              }
            />
            {this.state.filterOpen ? (
              <Filter
                placeType={this.state.placeType}
                radius={this.state.radius}
                checkOpen={this.state.checkOpen}
                onSelectItem={this.onSelectItem}
                onSetFilter={this.onSetFilter}
              />
            ) : null}
          </View>
        </>
      );
    } else {
      return (
        <View style={this.styles.loadScreen}>
          <ActivityIndicator size={'large'} color="#192BC2" />
          <Text>Turist is checking your location!</Text>
        </View>
      );
    }
  }
}

export default inject('mapStore')(observer(MapScreen));
