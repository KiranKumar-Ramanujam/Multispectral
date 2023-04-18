import {Platform, Dimensions} from 'react-native';

const SCR_WIDTH = Dimensions.get('window').width;
const SCR_HEIGHT = Dimensions.get('window').height;
const POPUP_HEIGHT = 300;
const TOGGLE_HEIGHT = 18;
const TOGGLE_WIDTH = 34;
const CIRCLE_HEIGHT = TOGGLE_HEIGHT - 4;
const CIRCLE_WIDTH = TOGGLE_HEIGHT - 4;
const TOGGLE_OFFSET = TOGGLE_WIDTH - CIRCLE_WIDTH - 4;

const elevation_1 = {
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
    },
    android: {
      elevation: 1,
    },
  }),
};

const elevation_2 = {
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    },
    android: {
      elevation: 2,
    },
  }),
};

const elevation_3 = {
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    android: {
      elevation: 3,
    },
  }),
};

const elevation_4 = {
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
    },
    android: {
      elevation: 4,
    },
  }),
};

const elevation_5 = {
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    android: {
      elevation: 5,
    },
  }),
};

const elevation_6 = {
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
    },
    android: {
      elevation: 6,
    },
  }),
};

const elevation_7 = {
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
    },
    android: {
      elevation: 7,
    },
  }),
};

const elevation_8 = {
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
    },
    android: {
      elevation: 8,
    },
  }),
};

export default {
  SCR_WIDTH,
  SCR_HEIGHT,
  POPUP_HEIGHT,
  TOGGLE_HEIGHT,
  TOGGLE_WIDTH,
  CIRCLE_HEIGHT,
  CIRCLE_WIDTH,
  TOGGLE_OFFSET,
  elevation_1,
  elevation_2,
  elevation_3,
  elevation_4,
  elevation_5,
  elevation_6,
  elevation_7,
  elevation_8,
};
