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
  blueBox: {
    backgroundColor: colors.blue,
    paddingVertical: 32,
  },
  white: {
    color: colors.white,
  },
  lightBlue: {
    color: colors.lightBlue,
  },
  center: {
    textAlign: 'center',
  },
  divider: {
    height: 3,
    width: 50,
    backgroundColor: colors.white,
    marginVertical: 24,
    alignSelf: 'center',
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
    lineHeight: 24,
  },

  // LoginScreen

  loginScreen: {
    backgroundColor: colors.blue,
    flex: 1,
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
    height: Dimensions.get('screen').height * 0.2,
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

  // Home

  carouselPlaceCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',

    borderRadius: 24,
  },
  carouselPlaceContainer: {
    padding: 24,
  },
  placeImage: {
    width: '100%',
    height: Dimensions.get('screen').height * 0.2,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
  },
  homeHeader: {
    position: 'relative',
    height: 130,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  noCity: {
    backgroundColor: colors.darkBlue,
  },
  overlayCity: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(2,0,41,0.4)',
  },
  cityName: {
    color: 'white',
    fontSize: 38,
    fontWeight: 'bold',
    bottom: 0,
    position: 'absolute',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  // Map

  map: {
    flex: 1,
  },
  placesBox: {
    height: 140,
    backgroundColor: colors.blue,
  },
  noPlacesBox: {
    backgroundColor: colors.blue,
    padding: 24,
  },
  emptyPlacesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  emptyPlacesTip: {
    color: colors.lightBlue,
    fontWeight: '600',
    textAlign: 'center',
  },
  carouselContainer: {
    paddingVertical: 24,
    shadowColor: colors.navy,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 2,
    marginLeft: -32,
  },
  carouselCardTouchableHighlight: {
    flex: 1,
    borderRadius: 16,
  },
  carouselCard: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    justifyContent: 'space-between',
  },
  carouselTitle: {
    color: colors.navy,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 6,
  },
  mapPlaceInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  mapPlaceImage: {
    height: '100%',
    width: '30%',
    borderRadius: 8,
    marginRight: 16,
  },
  placeType: {
    color: colors.blue,
    marginRight: 16,
    fontSize: 16,

    fontWeight: '600',
  },
  placeAdress: {
    fontSize: 16,
    color: colors.body,
    fontStyle: 'italic',
  },
  calloutContainer: {
    backgroundColor: 'rgba(255,255,255,.95)',
    width: 150,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderColor: colors.navy,
    borderWidth: 0.5,
  },
  calloutText: {
    color: colors.navy,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mapButton: {
    backgroundColor: colors.darkBlue,
    paddingVertical: 16,
    borderRadius: 0,
  },
  remove: {
    backgroundColor: '#ff0062',
  },
  filterButton: {
    marginLeft: 16,
    marginVertical: 8,
    backgroundColor: colors.white,
    borderRadius: 100,
    height: 48,
    width: 48,
    padding: 0,
    shadowColor: colors.navy,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.35,
    shadowRadius: 3,
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
    paddingTop: 40,
    zIndex: 99,
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
  //Trips

  overlayContainer: {
    padding: 0,
    width: Dimensions.get('screen').width * 0.85,
    height: Dimensions.get('screen').height * 0.8,
    paddingTop: 8,
    borderRadius: 24,
    overflow: 'hidden',
  },
  overlayButtonsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
    margin: 0,
  },
  selectionCounter: {
    backgroundColor: colors.blue,
    borderRadius: 100,
    padding: 2,
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 18,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
