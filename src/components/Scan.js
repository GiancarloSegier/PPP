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
        <>
          <ScrollView>
            <Image source={{uri: image}} style={styles.resultImage} />
            <View style={styles.container}>
              <Text style={styles.heading2}>
                {googleVisionDetection.webDetection.webEntities[0].description}
              </Text>
              {googleVisionDetection.webDetection.webEntities.map(
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
              )}
            </View>
          </ScrollView>
          <TouchableOpacity onPress={activeCamera} style={styles.scanAgain}>
            <Image
              source={require('../assets/scan.png')}
              style={styles.scanAgain__Icon}
            />
          </TouchableOpacity>
        </>
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
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
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
          <Text>Turist is checking your image!</Text>
        </View>
      )}
    </>
  );
};

export default Scan;
