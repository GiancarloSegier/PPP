import React, {Component} from 'react';

import {TouchableOpacity, Text, ScrollView, View, Image} from 'react-native';

class ScanInfo extends Component {
  paragraphs = [];
  constructor(props) {
    super(props);

    console.log(this.props.googleVisionDetection);

    this.state = {
      title: this.props.googleVisionDetection.webDetection.webEntities[0]
        .description,
      searchContent: {},
    };
  }
  componentDidMount() {
    this.collectInfo();
  }
  collectInfo = async searchTerm => {
    if (searchTerm) {
      this.setState({title: searchTerm, searchContent: {}});
    }
    const r = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts%7Cdescription%7Ccoordinates%7Ccategories&titles=${this.state.title}&explaintext=1&imdir=ascending&inprop=url`,
    );

    const text = await r.json();
    const pageObject = text.query.pages;
    const pageInformation = pageObject[Object.keys(pageObject)[0]];

    // // const imageUrl = `${pageInformation.fullurl}/${pageInformation.images[0].title}`;
    // const imageName = pageInformation.images[0].title;
    // const fullUrl = pageInformation.fullurl;
    // const correctImageUrl = imageName.replace(/\s+/g, '_');

    // NEEDS ANOTHER FETCH TO GET IMAGE!!!! OVERKILL!!

    // const imageUrl = `${fullUrl}#/media/${correctImageUrl}`;
    // console.log(imageUrl);

    const paragraph = {};
    this.paragraphs = [];
    if (pageInformation.extract) {
      const plainText = pageInformation.extract.split('==');
      const infoArray = plainText[0].split('\n');

      for (let i = 0; i < infoArray.length; i++) {
        paragraph[i] = {id: i, text: infoArray[i]};
        if (paragraph[i].text !== '') {
          this.paragraphs.push(paragraph[i]);
        }
      }
    }

    this.setState({
      searchContent: pageObject,
      // imageUrl: imageUrl,
    });
  };

  render() {
    const {activeCamera, googleVisionDetection, image, styles} = this.props;
    console.log(googleVisionDetection.landmarkAnnotations);
    return (
      <>
        <ScrollView>
          <Image source={{uri: image}} style={styles.resultImage} />
          <View style={styles.container}>
            <Text style={styles.heading2}>{this.state.title}</Text>
            <Text>Turist thinks it could be this too?</Text>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              {this.props.googleVisionDetection.webDetection.webEntities.map(
                (data, index) => {
                  return (
                    <>
                      {data.description !== undefined ? (
                        <TouchableOpacity
                          key={data.description}
                          style={{backgroundColor: 'red', height: 50}}
                          onPress={() => {
                            this.collectInfo(data.description);
                          }}>
                          <Text>{data.description}</Text>
                        </TouchableOpacity>
                      ) : null}
                    </>
                  );
                },
              )}
            </View>
            <Text style={{fontSize: 24, color: '#110b84'}}>
              {this.state.searchContent.description}
            </Text>
            {this.paragraphs.map(info => {
              return (
                <Text key={info.id} style={{marginBottom: 16}}>
                  {info.text}
                </Text>
              );
            })}
            <View>
              {!this.paragraphs[0] && (
                <Text>
                  No information was found. Turist is reading every book at the
                  moment...
                </Text>
              )}
            </View>
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
