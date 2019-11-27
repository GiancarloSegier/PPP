import {StyleSheet} from 'react-native';

import {Dimensions} from 'react-native';
const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

export default StyleSheet.create({
  background: {
    backgroundColor: '#f4f4f4',
  },
  container: {
    padding: 24,
  },

  header: {
    padding: 32,
    paddingBottom: 20,
    marginTop: -20,
    paddingTop: 60,
    backgroundColor: '#192BC2',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatar: {
    width: 35,
    height: 35,
    borderRadius: 100,
    borderColor: '#fff',
    borderWidth: 2,
    position: 'absolute',
    right: 0,
  },

  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#020029',
  },
  heading2: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#020029',
  },
  subTitle: {
    fontSize: 20,
    color: '#182AC1',
  },

  // Scanner

  resultImage: {
    width: deviceWidth,
    height: 200,
  },
  cameraScreen: {
    alignItems: 'center',
  },
  camera: {
    height: '100%',
    width: '100%',
  },
  capture: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 100,
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  loadScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  scanAgain: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    position: 'absolute',
    top: 24,
    left: 24,
  },
  scanAgain__Icon: {
    width: '100%',
    height: '100%',
    transform: [{scale: 0.5}],
  },
});
