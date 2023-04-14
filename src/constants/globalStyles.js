import colors from './colors';
import fonts from './fonts';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const ratio = Math.min(width, height) / 375;

export default {
  activeOpacity: 0.7,

  container: {
    dark: {
      backgroundColor: colors.darkHighlightColor,
      flex: 1,
    },
    light: {
      backgroundColor: colors.background,
      flex: 1,
    },
  },

  logincontainer: {
    dark: {
      backgroundColor: colors.darkHighlightColor,
      flex: 1,
    },
    light: {
      backgroundColor: '#f0f0f0',
      flex: 1,
    },
  },

  contentContainer: {
    alignItems: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  headerTitleStyle: {
    textAlign: 'center',
  },
  headerBaseEnds: {
    flex: 1,
    justifyContent: 'center',
  },

  btn: {
    alignItems: 'center',
    backgroundColor: colors.greenColor,
    borderColor: colors.greenColor,
    borderWidth: 1,
    borderRadius: 5,
    height: 48,
    justifyContent: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  btnText: {
    color: colors.white,
    textAlign: 'center',
  },

  circlebtn: {
    borderWidth: 1,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    width: 49 * ratio,
    position: 'absolute',
    right: 20 * ratio,
    height: 49 * ratio,
    backgroundColor: colors.white,
    borderRadius: (49 * ratio) / 2,
  },

  text: {
    dark: {
      color: colors.white,
    },
    light: {
      color: colors.darkColor,
    },
  },
  textPacifico: {
    fontFamily: fonts.pacifico,
    fontSize: 25,
  },

  spacer16: {
    height: 16,
    width: '100%',
  },
  spacer64: {
    height: 600,
    width: '100%',
  },
};
