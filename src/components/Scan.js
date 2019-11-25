import React, {Fragment} from 'react';
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
  // console.log(`imageresult: ${result}`);

  //   return (
  //     <View style={styles.scrollViewStyle}>
  //       <Fragment>
  //         {!googleVisionDetection && loading && (
  //           <View style={styles.SpinnerStyle}>
  //             <ActivityIndicator size={props.size || 'large'} color="#192BC2" />
  //             <Text>Turist is checking your image!</Text>
  //           </View>
  //         )}
  //         {/* When Google Vision returns response successfully */}
  //         {googleVisionDetection && (
  //           <Fragment>
  //             <Text style={styles.textTitle1}>Result !</Text>

  //             <View
  //               style={
  //                 googleVisionDetection ? styles.scanCardView : styles.cardView
  //               }>
  //               <ScrollView>
  //                 <Image
  //                   source={{uri: image}}
  //                   style={{width: '50%', height: '50%'}}
  //                 />
  //                 {googleVisionDetection.webDetection.webEntities.map(
  //                   (data, index) => {
  //                     return (
  //                       <View
  //                         key={index}
  //                         style={{
  //                           borderWidth: 2,
  //                           borderColor: 'black',
  //                           margin: 10,
  //                         }}>
  //                         <Text>entityId : {data.entityId}</Text>
  //                         <Text>score : {data.score}</Text>
  //                         <Text numberOfLines={1}>
  //                           description: {data.description}
  //                         </Text>
  //                       </View>
  //                     );
  //                   },
  //                 )}
  //               </ScrollView>
  //             </View>

  //             <TouchableOpacity
  //               onPress={activeCamera}
  //               style={styles.buttonTouchable}>
  //               <Text style={styles.buttonTextStyle}>Click to Scan again!</Text>
  //             </TouchableOpacity>
  //           </Fragment>
  //         )}

  //         {/* React Native camera View */}
  //         {camera && (
  //           <View style={styles.container}>
  //             <RNCamera
  //               ref={ref => {
  //                 this.camera = ref;
  //               }}
  //               style={styles.preview}
  //               type={RNCamera.Constants.Type.back}
  //               flashMode={RNCamera.Constants.FlashMode.off}
  //               androidCameraPermissionOptions={{
  //                 title: 'Permission to use camera',
  //                 message: 'We need your permission to use your camera',
  //                 buttonPositive: 'Ok',
  //                 buttonNegative: 'Cancel',
  //               }}
  //               captureAudio={false}
  //             />
  //             {/* Click here for taking picture  */}
  //             <View
  //               style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
  //               <TouchableOpacity
  //                 onPress={() => takePicture(this.camera)}
  //                 style={styles.capture}>
  //                 <Text style={{fontSize: 14}}> SNAP </Text>
  //               </TouchableOpacity>
  //             </View>
  //           </View>
  //         )}
  //       </Fragment>
  //     </View>
  //   );
  // };

  return (
    <View>
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

      {camera && (
        <>
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

          <View
            style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => takePicture(this.camera)}
              style={styles.capture}
            />
          </View>
        </>
      )}

      {!googleVisionDetection && loading && (
        <View style={styles.loadScreen}>
          <ActivityIndicator size={'large'} color="#192BC2" />
          <Text>Turist is checking your image!</Text>
        </View>
      )}

      {/* {googleVisionDetection && (
        <>
          <Image source={{uri: image}} style={styles.resultImage} />

          <ScrollView style={{paddingBottom: 200}}>
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
          </ScrollView>

          <TouchableOpacity
            onPress={activeCamera}
            style={styles.buttonTouchable}>
            <Text style={styles.buttonTextStyle}>Click to Scan again!</Text>
          </TouchableOpacity>
        </>
      )} */}
    </View>
  );
};

export default Scan;
