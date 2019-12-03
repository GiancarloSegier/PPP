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
  heading3: {},
  heading4: {
    fontSize: 18,
    opacity: 0.5,
    color: colors.navy,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 24,
    color: colors.blue,
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    color: colors.grey,
    marginBottom: 16,
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
    flex: 1,
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
  landmarksContainer: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },

  button: {
    backgroundColor: colors.lightBlue,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 100,
  },
  buttonText: {
    color: colors.navy,
    fontSize: 16,
  },
  // Map

  map: {
    flex: 1,

    marginBottom: -30,
  },
  carouselContainer: {
    position: 'absolute',
    bottom: 80,
  },
  carouselCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 300,
    padding: 24,
    borderRadius: 24,
  },
  carouselTitle: {
    color: colors.navy,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },
  placeType: {
    color: colors.blue,
    marginRight: 16,
    fontSize: 16,
    marginBottom: 16,
    fontWeight: '600',
  },
  placeAdress: {
    fontSize: 16,
    color: colors.body,
    fontStyle: 'italic',
  },
  calloutContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    minWidth: 100,
    maxWidth: 300,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  calloutText: {
    color: colors.navy,
    fontWeight: 'bold',
  },
  mapButton: {
    backgroundColor: colors.darkBlue,
    paddingVertical: 16,
    borderRadius: 0,
  },
  filterButton: {
    margin: 16,
    backgroundColor: colors.white,
    borderRadius: 100,
    height: 48,
    width: 48,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.35,
    shadowRadius: 2,
    // elevation: 1,
  },
  filterContainer: {
    position: 'relative',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    backgroundColor: 'rgba(255,255,255,0.98)',
    padding: 24,
  },
  filterTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.navy,
  },
  pickerItem: {
    color: colors.darkBlue,
  },
  radiusValue: {
    marginLeft: 'auto',
    fontSize: 18,
    color: colors.blue,
  },
  checkBoxFilter: {
    backgroundColor: 'white',
    borderWidth: 0,
    marginBottom: 24,
    padding: 0,
  },
  resetFilter: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    padding: 0,
    marginBottom: 16,
  },
});
