import React, {Component} from 'react';
import {
  View,
  Text,
  Platform,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import {Button} from 'react-native-elements';

import androidUI from '../../../styles/ui.android.style.js';
import iosUI from '../../../styles/ui.ios.style.js';

import MapStyle from '../../../config/MapStyle';

import Carousel from 'react-native-snap-carousel';

import {inject, observer} from 'mobx-react';
import Filter from '../../../components/map/Filter.js';
import Icon from 'react-native-vector-icons/FontAwesome';

import MapboxGL from '@react-native-mapbox-gl/maps';

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
      centerCoordinate: [
        props.mapStore.userLocation.longitude,
        props.mapStore.userLocation.latitude,
      ],
      places: [],
      markers: [],
      coordinates: [],
      placeType: 'tourist_attraction',
      selectedPlace: 'placeSelected0',
      radius: 1500,
      checkOpen: false,
      filterOpen: false,
    };
  }

  componentDidMount() {
    this.setLocation(this.props.mapStore.userLocation);
    this.getPlaces('tourist_attraction', 1500);
  }

  getPlaces = async (
    placeType,
    radius,
    regionLocation = this.state.regionLocation,
  ) => {
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

        this.setState({
          places: markers,
          coordinates: newCoordinates,
          placeType: placeType,
          radius: radius,
        });
      });
  };

  setLocation = position => {
    this.setState({
      userLocation: [position.longitude, position.latitude],
      regionLocation: [position.longitude, position.latitude],
      centerCoordinate: [position.longitude, position.latitude],
    });
  };

  moveRegion = async () => {
    this.setState({
      regionLocation: this.state.regionLocation,
      selectedPlace: 'placeSelected0',
    });
    await this.getPlaces(this.state.placeType, this.state.radius);
  };

  onChangeRegion = region => {
    const newRegion = region.geometry.coordinates;
    this.setState({
      regionLocation: newRegion,
      markers: [],
      selectedPlace: 'placeSelected0',
    });
  };

  renderCarouselItem = ({item}) => {
    if (item.photos) {
      this.placeImage = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=${item.photos[0].photo_reference}&key=${this.state.googleAPI}`;
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
    console.log(index);
    let place = this.state.places[index];
    let coordinates = [
      place.geometry.location.lng,
      place.geometry.location.lat,
    ];
    let selectedPlace = `placeSelected${index}`;

    this.setState({
      placeSelected: selectedPlace,
      centerCoordinate: coordinates,
    });
  };
  onMarkerPressed = (coordinates, index) => {
    this.carousel.snapToItem(index);
    let selectedPlace = `placeSelected${index}`;
    this.setState({
      placeSelected: selectedPlace,
      centerCoordinate: coordinates,
    });
  };

  onPressFilter = () => {
    this.setState(prevState => ({filterOpen: !prevState.filterOpen}));
  };

  onSetFilter = async (radius, type, checkOpen) => {
    this.setState({
      radius: radius,
      placeType: type,
      filterOpen: false,
      checkOpen: checkOpen,
      regionLocation: this.state.regionLocation,
      selectedPlace: 'placeSelected0',
    });
    console.log(type + ' : ' + this.state.placeType);
    await this.getPlaces(type, radius);

    // this.moveRegion();
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
    return items;
  }

  setUserLocation = location => {
    const newUserLocation = [
      location.coords.longitude,
      location.coords.latitude,
    ];

    this.setState({userLocation: newUserLocation});
  };

  onPressFollowUser = () => {
    this.setState({
      centerCoordinate: this.state.userLocation,
      regionLocation: this.state.userLocation,
    });

    console.log(this.state.regionLocation + ' : ' + this.state.userLocation);
    this.camera.setCamera({zoomLevel: 15});
    this.getPlaces(
      this.state.placeType,
      this.state.radius,
      this.state.userLocation,
    );
  };

  render() {
    const {userLocation, centerCoordinate} = this.state;

    if (userLocation.slice(0, 1) && userLocation.slice(1, 2) !== 0) {
      return (
        <>
          <View style={{flex: 1}}>
            <MapboxGL.MapView
              logoEnabled={false}
              ref={c => (this._map = c)}
              style={{flex: 1}}
              onRegionDidChange={this.onChangeRegion}
              onLongPress={this.MapPressed}
              styleURL={MapboxGL.StyleURL.Light}>
              {this.renderAnnotations()}
              <MapboxGL.UserLocation
                visible={true}
                renderMode="normal"
                animated
                onUpdate={this.setUserLocation}
              />
              <MapboxGL.Camera
                ref={c => (this.camera = c)}
                followUserMode="compass"
                zoomLevel={15}
                centerCoordinate={centerCoordinate}
              />
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
              this.carousel = c;
            }}
            data={this.state.places}
            renderItem={this.renderCarouselItem}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={300}
            activeItem
            onSnapToItem={index => this.onCarouselItemChange(index)}
          />
          <View style={{position: 'absolute', zIndex: 99}}>
            <View style={{flexDirection: 'row'}}>
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
              <Button
                onPress={this.onPressFollowUser}
                buttonStyle={this.styles.filterButton}
                icon={<Icon name="street-view" size={24} color="#110b84" />}
              />
            </View>
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
