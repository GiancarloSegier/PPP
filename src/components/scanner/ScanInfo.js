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
import {inject, observer} from 'mobx-react';
const placeHolder = require('../../assets/placeholderImage.gif');

class ScanInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.googleVisionDetection.webDetection.webEntities[0]
        .description,
      loadingInfo: true,
      landmarks: this.props.googleVisionDetection.webDetection.webEntities,
    };
  }
  componentDidMount() {
    this.collectInfo(this.state.title);
  }

  collectInfo = async searchTerm => {
    this.setState({loadingInfo: true});
    await this.props.wikiStore.collectInfo(searchTerm);
    const searchInfo = await this.props.wikiStore.wikiInfo;

    this.setState({
      title: searchInfo.title,
      loadingInfo: false,
      wikiURL: searchInfo.wikiURL,
      placeInfo: searchInfo.placeInfo,
    });
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
          <Image
            source={image ? {uri: image} : placeholder}
            style={styles.resultImage}
          />
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
                  <View>
                    {this.state.placeInfo &&
                    this.state.placeInfo.text !== '' ? (
                      <Text style={styles.body}>
                        {this.state.placeInfo.text}
                      </Text>
                    ) : (
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
                      this.state.placeInfo.text !== ''
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

export default inject('wikiStore')(observer(ScanInfo));
