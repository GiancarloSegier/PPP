import React, {Component} from 'react';

import {TouchableOpacity, Text, ScrollView, View, Image} from 'react-native';

class ScanInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.googleVisionDetection.webDetection.webEntities[0]
        .description,
      // searchTerm: 'Eiffel Tower',
      searchContent: {},
    };
  }
  componentDidMount() {
    this.collectInfo();
  }
  collectInfo = async () => {
    const r = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts%7Cdescription%7Ccoordinates&titles=${
        this.state.title
      }&exchars=1200&explaintext=1`,
    );

    console.log(r);
    const text = await r.json();
    console.log(text.query.pages);
    const pageObject = text.query.pages;
    const pageInformation = pageObject[Object.keys(pageObject)[0]];
    this.setState({searchContent: pageInformation});
  };

  render() {
    const {activeCamera, googleVisionDetection, image, styles} = this.props;
    return (
      <>
        <ScrollView>
          <Image source={{uri: image}} style={styles.resultImage} />
          <View style={styles.container}>
            <Text style={styles.heading2}>{this.state.title}</Text>
            {/* {googleVisionDetection.webDetection.webEntities.map(
              (data, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      borderWidth: 2,
                      borderColor: 'black',
                      margin: 10,
                    }}>
                    <Text>entityId : {data.entityId}</Text>
                    <Text>score : {data.score}</Text>
                    <Text numberOfLines={1}>
                      description: {data.description}
                    </Text>
                  </View>
                );
              },
            )} */}

            <Text style={{fontSize: 24, color: '#110b84'}}>
              {this.state.searchContent.description}
            </Text>
            <Text>{this.state.searchContent.extract}</Text>
          </View>
        </ScrollView>
        <TouchableOpacity onPress={activeCamera} style={styles.scanAgain}>
          <Image
            source={require('../../assets/scan.png')}
            style={styles.scanAgain__Icon}
          />
        </TouchableOpacity>
      </>
    );
  }
}

export default ScanInfo;
