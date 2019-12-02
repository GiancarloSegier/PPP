import React from 'react';
import {RNCamera} from 'react-native-camera';
import {
  TouchableOpacity,
  Text,
  ScrollView,
  View,
  ActivityIndicator,
  Image,
} from 'react-native';
import ScanInfo from './ScanInfo';

const Scan = props => {
  const {
    camera,
    takePicture,
    activeCamera,
    googleVisionDetection,
    loading,
    image,
    styles,
  } = props;

  return (
    <>
      {/* Resultscreen */}

      {googleVisionDetection && (
        <ScanInfo
          activeCamera={activeCamera}
          googleVisionDetection={googleVisionDetection}
          styles={styles}
          image={image}
        />
      )}

      {/* Scanscreen */}

      {camera && (
        <View style={styles.cameraScreen}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.camera}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.off}
            captureAudio={false}
          />

          <TouchableOpacity
            onPress={() => takePicture(this.camera)}
            style={styles.capture}
          />
        </View>
      )}

      {/* Loadscreen */}

      {!googleVisionDetection && loading && (
        <View style={styles.loadScreen}>
          <ActivityIndicator size={'large'} color="#192BC2" />
          <Text style={styles.body}>Turist is checking your image!</Text>
        </View>
      )}
    </>
  );
};

export default Scan;
