import React, {Component} from 'react';
import {View, Text} from 'react-native';
import Header from '../components/Header';

export class Home extends Component {
  render() {
    return (
      <>
        <Header />
        <View style={{justifyContent: 'center', flex: 1}}>
          <Text style={{textAlign: 'center'}}>This is the home screen</Text>
        </View>
      </>
    );
  }
}

export default Home;
