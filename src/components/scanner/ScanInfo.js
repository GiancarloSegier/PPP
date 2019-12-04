import React, {Component} from 'react';

import {
  TouchableOpacity,
  Text,
  ScrollView,
  View,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {Button} from 'react-native-elements';

class ScanInfo extends Component {
  paragraphs = [];
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.googleVisionDetection.webDetection.webEntities[0]
        .description,
      searchContent: {},
      loadingInfo: true,
      landmarks: this.props.googleVisionDetection.webDetection.webEntities,
    };
  }
  componentDidMount() {
    this.collectInfo(this.state.title);
  }
  collectInfo = async searchTerm => {
    this.setState({loadingInfo: true});
    const r = await fetch(
      `https://en.wikipedia.org//w/api.php?action=query&format=json&prop=extracts&description&titles=${searchTerm}&exchars=1200&explaintext=1`,
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
      title: searchTerm,
      loadingInfo: false,
      wikiURL: `https://en.wikipedia.org/wiki/${searchTerm}`,

      // imageUrl: imageUrl,
    });
    console.log(text.query);
  };

  handleClickUrl = () => {
    Linking.canOpenURL(this.state.wikiURL).then(supported => {
      if (supported) {
        Linking.openURL(this.state.wikiURL);
      } else {
        console.log("Don't know how to open URI: " + this.state.wikiURL);
      }
    });
  };

  render() {
    const {activeCamera, image, styles} = this.props;

    if (!this.state.loadingInfo) {
      return (
        <>
          <Image source={{uri: image}} style={styles.resultImage} />
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.scanUpperContainer}>
                <Text style={styles.heading2}>
                  {this.state.title === '' ||
                  this.state.title === undefined ||
                  this.state.title === ' ' ||
                  this.state.title === 'undefined'
                    ? 'Turist is not sure...'
                    : this.state.title}
                </Text>
                {this.state.landmarks.length > 1 ? (
                  <Text style={styles.heading4}>
                    Maybe you're looking for this?
                  </Text>
                ) : null}
                <View style={styles.landmarksContainer}>
                  {this.state.landmarks.map((data, index) => {
                    if (
                      data.description &&
                      data.description !== this.state.title
                    ) {
                      return (
                        <View key={data.description}>
                          <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                              this.collectInfo(data.description);
                            }}>
                            <Text style={styles.buttonText}>
                              {data.description}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }
                  })}
                </View>
              </View>

              {this.state.title === '' ||
              this.state.title === undefined ||
              this.state.title === ' ' ||
              this.state.title === 'undefined' ? null : (
                <>
                  {this.paragraphs.map(info => {
                    return (
                      <Text key={info.id} style={styles.body}>
                        {info.text}
                      </Text>
                    );
                  })}
                  <View>
                    {!this.paragraphs[0] && (
                      <Text style={styles.body}>
                        No information was found. Turist is reading every book
                        at the moment...
                      </Text>
                    )}
                  </View>
                  <Button
                    buttonStyle={styles.secondaryFormButton}
                    titleStyle={styles.secondaryFormButtonTitle}
                    title={
                      this.paragraphs.length > 0
                        ? 'Go to full information'
                        : 'Go to wikipediapage'
                    }
                    onPress={this.handleClickUrl}
                  />
                </>
              )}
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
    } else {
      return (
        <View style={styles.loadScreen}>
          <ActivityIndicator size={'large'} color="#192BC2" />
          <Text style={styles.body}>Turist is collecting info!</Text>
        </View>
      );
    }
  }
}

export default ScanInfo;
