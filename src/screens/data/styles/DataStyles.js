import {StyleSheet, Dimensions} from 'react-native';

import {colors, utils} from '../../../constants';

const {width, height} = Dimensions.get('window');
const ratio = Math.min(width, height) / 375;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /******************** Alignment ************/
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10 * ratio,
  },
  modal_status: {
    marginBottom: 10 * ratio,
    marginTop: 20 * ratio,
  },
  /****************** dropdown************ */
  dropdown_container: {
    position: 'absolute',
    height: 50 * ratio,
    marginLeft: 70 * ratio,
    width: '90%',
    top: 12 * ratio,
    alignItems: 'center',
  },
  dropdown_text: {
    fontSize: 16 * ratio,
    fontWeight: 'bold',
    color: 'black',
  },
  textallign: {
    marginLeft: 15 * ratio,
  },
  /**************************** */
  titleText: {
    flex: 1,
    fontSize: 22 * ratio,
    fontWeight: 'bold',
  },
  header: {
    padding: 10 * ratio,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  headerText: {
    fontSize: 16 * ratio,
    fontWeight: '500',
    left: 5 * ratio,
  },
  separator: {
    height: 0.5 * ratio,
    backgroundColor: '#808080',
    width: '95%',
    alignSelf: 'center',
  },
  text: {
    fontSize: 16 * ratio,
    color: '#606070',
    padding: 13 * ratio,
  },
  Subtext: {
    fontSize: 16 * ratio,
    color: colors.white,
    padding: 14 * ratio,
    fontWeight: 'bold',
  },
  Subheader: {
    top: 20 * ratio,
    backgroundColor: '#35795B',
  },
  content: {
    paddingLeft: 10 * ratio,
    paddingRight: 10 * ratio,
    backgroundColor: '#fff',
  },
  deletebutton: {
    // marginLeft: 259 * ratio,
    right: 28 * ratio,
  },
  touchableopacity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  maincontainer: {
    height: utils.POPUP_HEIGHT,
    width: utils.SCR_WIDTH,
  },
  touchableopacity_text: {
    fontSize: 17 * ratio,
    paddingHorizontal: 8 * ratio,
    fontWeight: '400',
  },
  dropdownbutton: {
    marginLeft: 220 * ratio,
  },
  nodatashow: {
    flex: 1,
    fontSize: 20 * ratio,
    fontWeight: 'bold',
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
});

export default styles;
