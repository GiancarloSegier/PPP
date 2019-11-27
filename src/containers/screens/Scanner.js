import React, {Component} from 'react';
import {Platform} from 'react-native';
import Scan from '../../components/Scan';
import config from '../../../config.json';
import androidUI from '../../styles/ui.android.style.js';
import iosUI from '../../styles/ui.ios.style.js';
import Header from '../../components/interface/Header';
class CameraContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      camera: true,
      cameraResult: false,
      image: null,
      result: null,
      visionResponse: '',
      loading: false,
      googleVisionDetection: undefined,
    };

    if (Platform.OS === 'ios') {
      this.styles = iosUI;
    } else {
      this.styles = androidUI;
    }
  }

  takePicture = async value => {
    if (value) {
      const options = {quality: 0.5, base64: true};
      const data = await value.takePictureAsync(options);
      this.setState(
        {
          cameraResult: true,
          result: data.base64,
          image: data.uri,
          camera: false,
        },
        () => this.callGoogleVIsionApi(this.state.result),
      );
      this.setState({loading: true});
    }
  };
  callGoogleVIsionApi = async base64 => {
    let googleVisionRes = await fetch(
      config.googleCloud.api + config.googleCloud.apiKey,
      {
        method: 'POST',
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64,
              },
              features: [
                {type: 'LABEL_DETECTION', maxResults: 10},
                {type: 'LANDMARK_DETECTION', maxResults: 5},
                {type: 'FACE_DETECTION', maxResults: 5},
                {type: 'LOGO_DETECTION', maxResults: 5},
                {type: 'TEXT_DETECTION', maxResults: 5},
                {type: 'DOCUMENT_TEXT_DETECTION', maxResults: 5},
                {type: 'SAFE_SEARCH_DETECTION', maxResults: 5},
                {type: 'IMAGE_PROPERTIES', maxResults: 5},
                {type: 'CROP_HINTS', maxResults: 5},
                {type: 'WEB_DETECTION', maxResults: 5},
              ],
            },
          ],
        }),
      },
    );

    await googleVisionRes
      .json()
      .then(googleVisionRes => {
        if (googleVisionRes) {
          this.setState({
            loading: false,
            googleVisionDetection: googleVisionRes.responses[0],
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  activeCamera = () => {
    this.setState({
      camera: true,
      googleVisionDetection: false,
      loading: false,
    });
  };

  render() {
    const {
      camera,
      cameraResult,
      googleVisionDetection,
      loading,
      image,
    } = this.state;
    return (
      <>
        <Header />
        <Scan
          camera={camera}
          cameraResult={cameraResult}
          clickAgain={this.clickAgain}
          takePicture={value => this.takePicture(value)}
          activeCamera={this.activeCamera}
          googleVisionDetection={googleVisionDetection}
          loading={loading}
          image={image}
          styles={this.styles}
        />
      </>
    );
  }
}

export default CameraContainer;
