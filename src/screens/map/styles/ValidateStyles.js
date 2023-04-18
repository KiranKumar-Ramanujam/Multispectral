import {StyleSheet, Dimensions} from 'react-native';

import {utils} from '../../../constants';

const {width, height} = Dimensions.get('window');
const ratio = Math.min(width, height) / 375;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pop_container: {
    width: utils.SCR_WIDTH,
    height: 1400,
    borderTopLeftRadius: 5 * ratio,
    borderTopRightRadius: 5 * ratio,
    paddingHorizontal: 17 * ratio,
    paddingTop: 5 * ratio,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20 * ratio,
  },
  button: {
    borderRadius: 5 * ratio,
    padding: 10 * ratio,
    top: 180 * ratio,
    width: '100%',
    height: 44 * ratio,
  },
  buttonClose: {
    backgroundColor: '#33a02c',
  },
  buttontext: {
    fontSize: 14 * ratio,
    color: 'white',
    alignSelf: 'center',
  },
  arrange_left: {
    left: 25,
  },
  arrange_right: {
    right: 130,
    paddingHorizontal: -60,
  },
  status_button: {
    borderRadius: 10,
    padding: 1.5,
    alignSelf: 'auto',
  },
  status_text: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 11 * ratio,
  },

  popinnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9 * ratio,
  },
  poptitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
  },
  poplabel: {
    fontSize: 14 * ratio,
    marginTop: 9 * ratio,
    maxWidth: utils.SCR_WIDTH / 1.5,
    color: '#444',
    alignSelf: 'center',
  },
  popid: {
    fontSize: 27 * ratio,
    fontWeight: '900',
    color: 'black',
  },
  popvalue: {
    fontSize: 18 * ratio,
    fontWeight: '600',
    color: 'black',
    alignSelf: 'center',
  },
  popvalidatebutton: {
    borderRadius: 5,
    padding: 15,
    top: 22,
    borderWidth: 1,
    borderColor: '#33a02c',
  },
  popvalidatebutton_background: {
    backgroundColor: 'white',
  },
  popvalidatebuttontext: {
    fontSize: 15,
    color: '#33a02c',
    alignSelf: 'center',
  },
  poparrange_left: {
    left: 10 * ratio,
  },
  poparrange_right: {
    right: 60 * ratio,
  },
  poppredicted_button: {
    borderRadius: 40 * ratio,
    padding: 6 * ratio,
    alignSelf: 'center',
    paddingHorizontal: 14 * ratio,
  },
  popstatus_text: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 11 * ratio,
  },
  popvalidate_status: {
    left: 100,
  },
  pop_attributecontainer: {
    flex: 1,
    alignItems: 'center',
  },
  pop_attributecontainer2: {
    right: 34 * ratio,
  },
  pop_attributecontainer3: {
    right: 10 * ratio,
  },
  pop_attributecontainer4: {
    left: 20 * ratio,
  },
  popvalidated_button: {
    borderRadius: 40 * ratio,
    padding: 6 * ratio,
    alignSelf: 'center',
    paddingHorizontal: 14 * ratio,
  },
  notvalidated_text: {
    alignSelf: 'center',
    color: 'blue',
    fontSize: 11 * ratio,
  },
  notvalidated_pill: {
    backgroundColor: 'white',
    borderWidth: 1 * ratio,
    borderColor: 'blue',
  },
  pop_container_topsection: {
    backgroundColor: 'lightgray',
    marginHorizontal: -20 * ratio,
    bottom: 12 * ratio,
  },

  modal_status: {
    marginBottom: 10 * ratio,
    marginTop: 20 * ratio,
  },
  switch_button: {
    position: 'absolute',
    width: 200 * ratio,
    left: 140 * ratio,
    height: 20 * ratio,
  },

  dropdown_container: {
    position: 'absolute',
    height: 50 * ratio,
    left: 140 * ratio,
    width: 270 * ratio,
    top: 13 * ratio,
  },
  input: {
    borderColor: 'grey',
    borderRadius: 10 * ratio,
    width: 340 * ratio,
    height: 89 * ratio,
    backgroundColor: 'white',
  },
  input_container: {
    top: -15 * ratio,
  },

  dropdown: {
    height: 39 * ratio,
    width: 200 * ratio,
    backgroundColor: 'white',
    borderRadius: 4 * ratio,
    padding: 11 * ratio,
    borderWidth: 1 * ratio,
    borderColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 1,
  },
  placeholderStyle: {
    fontSize: 13 * ratio,
  },
  selectedTextStyle: {
    fontSize: 12 * ratio,
  },
  iconStyle: {
    width: 20 * ratio,
    height: 20 * ratio,
  },
  inputSearchStyle: {
    height: 40 * ratio,
    fontSize: 15 * ratio,
  },
  item: {
    padding: 10 * ratio,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.8,
    borderColor: 'lightgray',
    height: 50 * ratio,
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'white',
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'lightgray',
    marginRight: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 2,
    shadowRadius: 1.41,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 13 * ratio,
  },

  toggle_button: {
    position: 'absolute',
    right: -2 * ratio,
    top: 19 * ratio,
    transform: [{scaleX: 1 * ratio}, {scaleY: 1 * ratio}],
  },

  scrollView: {
    marginHorizontal: 20 * ratio,
  },

  touchableopacity_buttonStyle: {
    backgroundColor: 'white',
    padding: 4 * ratio,
    width: 200 * ratio,
    borderWidth: 1 * ratio,
    borderRadius: 4 * ratio,
    borderColor: 'gray',
    height: 39 * ratio,
    paddingHorizontal: 14 * ratio,
  },

  touchableopacity_text: {
    fontSize: 14 * ratio,
    paddingHorizontal: 8 * ratio,
    fontWeight: '400',
  },

  textStyle: {
    fontSize: 12 * ratio,
    fontWeight: '400',
  },

  touchableopacity: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  imageStyle: {
    width: 50 * ratio,
    height: 50 * ratio,
    margin: 5 * ratio,
  },
  popclosebutton: {
    left: 69 * ratio,
  },
  uploadinnerContainer_1: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 88 * ratio,
    top: 70 * ratio,
  },
  uploadinnerContainer_2: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 88 * ratio,
    top: 100 * ratio,
  },
  uploadinnerContainer_3: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 150 * ratio,
    top: 125 * ratio,
    right: 58 * ratio,
  },
  innerContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    top: -30 * ratio,
  },
  innerContainer3: {
    flexDirection: 'row',
    alignItems: 'center',
    top: -60 * ratio,
  },
});

export default styles;
