import {StyleSheet} from 'react-native';
import {colors} from './colors';
import {Dimensions} from 'react-native';
const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

export default StyleSheet.create({
  background: {
    backgroundColor: colors.darkWhite,
  },
  container: {
    padding: 24,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: colors.blue,
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
    borderColor: colors.white,
    borderWidth: 2,
  },

  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.navy,
  },
  heading2: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.navy,
  },
  subTitle: {
    fontSize: 20,
    color: colors.blue,
  },

  // LoginScreen

  loginScreen: {
    backgroundColor: colors.blue,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  form: {},
  formTitle: {
    fontSize: 24,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '300',
    marginBottom: 16,
    marginTop: 24,
  },
  formField: {
    borderColor: colors.navy,
    borderWidth: 2,
    width: deviceWidth - 48,
    height: 40,
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: colors.white,
    borderRadius: 8,
    color: colors.navy,
    marginBottom: 2,
    marginTop: 0,
  },
  formError: {
    color: colors.darkWhite,
    fontStyle: 'italic',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 16,
    marginBottom: 4,
  },

  primaryFormButton: {
    backgroundColor: colors.darkBlue,
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
    backgroundColor: colors.blue,
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

  socialLogin: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  socialFormButton: {
    backgroundColor: colors.white,
    marginVertical: 8,
    height: 40,
    borderRadius: 8,
    // opacity: 0.75,
  },
  buttonContainer: {
    flex: 1,
  },
  socialFormButtonTitle: {
    fontSize: 16,
    color: colors.darkBlue,
    fontWeight: 'bold',
  },

  logoLogin: {
    width: '50%',
    resizeMode: 'contain',
  },
  loginSubtitle: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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
    borderColor: colors.white,
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
    borderColor: colors.white,
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
