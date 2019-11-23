import React, {Component} from 'react';
import {View, Text} from 'react-native';

import {inject, observer} from 'mobx-react';

class Home extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{justifyContent: 'center', flex: 1}}>
        <Text style={{textAlign: 'center'}}>{this.props.userStore.user}</Text>
      </View>
    );
  }
}

export default inject('userStore')(observer(Home));
