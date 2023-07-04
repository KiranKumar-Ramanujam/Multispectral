import {StyleSheet, Dimensions} from 'react-native';

import {utils} from '../../../constants';

const {width, height} = Dimensions.get('window');
const ratio = Math.min(width, height) / 375;

const styles = StyleSheet.create({
  MainContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // justifyContent: 'center',
  },
  mapStyle: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 20,
    backgroundColor: 'lightblue',
  },

  filter: {
    top: 70 * ratio,
  },

  container: {
    flex: 1,
  },
  pop_container: {
    position: 'absolute',
    bottom: 70 * ratio,
    height: 280 * ratio,
    width: utils.SCR_WIDTH,
    borderTopLeftRadius: 1 * ratio,
    borderTopRightRadius: 1 * ratio,
    paddingHorizontal: 24 * ratio,
    paddingTop: 19 * ratio,
  },
  popinnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9 * ratio,
  },
  poptitle: {
    fontSize: 19 * ratio,
    fontWeight: '700',
    color: 'black',
  },
  poplabel: {
    fontSize: 14 * ratio,
    marginTop: 9 * ratio,
    maxWidth: utils.SCR_WIDTH / 1.5,
    color: '#444',
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
  },
  popvalidatebutton: {
    borderRadius: 5 * ratio,
    padding: 15 * ratio,
    top: 21 * ratio,
    borderWidth: 1,
    borderColor: '#33a02c',
  },
  popvalidatebutton_background: {
    backgroundColor: 'white',
  },
  popvalidatebuttontext: {
    fontSize: 15.7 * ratio,
    color: '#33a02c',
    alignSelf: 'center',
  },
  poparrange_left: {
    left: 14 * ratio,
  },
  poppredicted_button: {
    borderRadius: 40 * ratio,
    padding: 5 * ratio,
    alignSelf: 'center',
    paddingHorizontal: 13 * ratio,
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
  popvalidated_button: {
    borderRadius: 40 * ratio,
    alignSelf: 'center',
    paddingHorizontal: 12 * ratio,
    padding: 4 * ratio,
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
  popRectangleShape: {
    borderRadius: 9 * ratio,
    backgroundColor: '#E6F5EE',
  },
  popclosebutton: {
    marginLeft: 130 * ratio,
  },
  validated_status_text: {
    alignSelf: 'center',
    color: '#2F80ED',
    fontSize: 19 * ratio,
    fontWeight: 'bold',
  },

  validated_popRectangleShape: {
    top: 19 * ratio,
    justifyContent: 'center',
    borderRadius: 5 * ratio,
    borderWidth: 1,
    backgroundColor: '#F4F9FF',
    height: 54 * ratio,
    width: 330 * ratio,
    alignSelf: 'center',
    borderColor: '#2F80ED',
  },
  pillcount: {
    borderRadius: 40 * ratio,
    alignSelf: 'center',
    paddingHorizontal: 12 * ratio,
  },
});

export default styles;
