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
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#192BC2',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  logoHeader: {
    height: 24,
    resizeMode: 'contain',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 100,
    borderColor: '#fff',
    borderWidth: 2,
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

  // LoginScreen

  loginScreen: {
    backgroundColor: '#182AC1',
    height: '100%',
  },

  form: {
    justifyContent: 'space-around',
  },
  formTitle: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '300',
    marginBottom: 16,
    marginTop: 24,
  },
  formField: {
    borderColor: '#020029',
    borderWidth: 2,
    width: deviceWidth - 48,
    height: 40,
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    color: '#020029',
    marginBottom: 2,
    marginTop: 12,
  },
  formError: {
    color: '#f4f4f4',
    fontStyle: 'italic',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 16,
  },

  primaryFormButton: {
    backgroundColor: '#110b84',
    marginTop: 14,
    marginBottom: 2,
    height: 40,
    borderRadius: 8,
  },
  primaryFormButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryFormButton: {
    backgroundColor: '#182ac1',
    marginVertical: 8,
    height: 40,
    borderRadius: 8,
    width: '75%',
    alignSelf: 'center',
    // opacity: 0.75,
  },
  secondaryFormButtonTitle: {
    fontSize: 14,
  },
  logoLogin: {
    width: '50%',
    resizeMode: 'contain',
  },

  // Scanner

  resultImage: {
    width: deviceWidth,
    height: 200,
  },
  cameraScreen: {
    alignItems: 'center',
    height: deviceHeight - 160,
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
