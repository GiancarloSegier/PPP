import React, {Component} from 'react';

import {Dimensions, Picker, View, Text} from 'react-native';
import {Button, Slider} from 'react-native-elements';

class Filter extends Component {
  constructor(props) {
    super(props);
    console.log(props);

    this.state = {
      selectedType: this.props.placeType,
      selectedRadius: this.props.radius,
    };
  }

  onSelectedItem = itemValue => {
    console.log(itemValue);
    this.props.onSelectItem(itemValue);
    console.log(this.props);
  };

  render() {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          height: Dimensions.get('screen').height,
          width: Dimensions.get('screen').width,
          backgroundColor: 'white',
        }}>
        <Picker
          selectedValue={this.state.selectedType}
          style={{
            backgroundColor: 'red',
          }}
          onValueChange={newSelectedType =>
            this.setState({selectedType: newSelectedType})
          }>
          <Picker.Item label="All" value="all" />
          <Picker.Item label="Park" value="park" />
        </Picker>
        <Slider
          value={this.state.selectedRadius}
          maximumValue={5000}
          minimumValue={500}
          step={500}
          onValueChange={newRadius => {
            const chosenRadius = Math.floor(newRadius);

            this.setState({selectedRadius: chosenRadius});
          }}
        />
        <Text>Value: {this.state.selectedRadius} meters</Text>
        <Button
          title="search this region"
          onPress={() =>
            this.props.onSetFilter(
              this.state.selectedRadius,
              this.state.selectedType,
            )
          }
          // buttonStyle={this.styles.mapSearchRegion}
          // titleStyle={this.styles.primaryFormButtonTitle}
        />
      </View>
    );
  }
}

export default Filter;
