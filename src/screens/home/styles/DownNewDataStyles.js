import {StyleSheet, Dimensions} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const {width, height} = Dimensions.get('window');
const ratio = Math.min(width, height) / 375;
const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: 'row',
    height: hp('6.8%'),
  },
  modal_status: {
    width: 100,
    justifyContent: 'center',
    marginRight: 23,
  },

  dropdown_container: {
    width: '100%',
    paddingRight: 123,
  },
  input: {
    borderColor: 'black',
    borderRadius: 10,
    width: '99%',
    height: 300,
    backgroundColor: 'white',
  },
  input_container: {
    top: -15,
  },

  dropdown: {
    height: hp('5%'),
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
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
    fontSize: 15.5 * ratio,
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 13.5 * ratio,
    color: 'black',
  },
  iconStyle: {
    width: 23 * ratio,
    height: 23 * ratio,
  },
  inputSearchStyle: {
    height: hp('5%'),
    borderColor: 'black',
    fontSize: 13.5 * ratio,
    backgroundColor: '#C0C0C0',
  },
  item: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.8,
    borderColor: 'black',
    height: hp('6.3%'),
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'white',
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'black',
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
    fontSize: 13.5 * ratio,
  },
  text: {
    fontSize: 14 * ratio,
    fontWeight: 'bold',
    color: 'black',
  },
  DownloadBtn: {
    width: '100%',
    paddingLeft: wp('3.7%'),
    paddingRight: wp('3.7%'),
    height: '100%',
    justifyContent: 'flex-end',
    alignSelf: 'center',
  },
  selectedStyle_1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#009D57',
    marginTop: 1,
    borderColor: '#009D57',
    marginRight: 2 * ratio,
    paddingHorizontal: 12 * ratio,
    paddingVertical: 7 * ratio,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 2,
    shadowRadius: 1.41,
  },
  textSelectedStyle_1: {
    marginRight: 5,
    fontSize: 13 * ratio,
    color: 'white',
  },
  itemContainerStyle: {
    borderWidth: 1,
    borderColor: 'gray',
    height: hp('6.3%'),
  },
  itemTextStyle: {
    fontSize: 12.5 * ratio,
    color: 'black',
  },
  date_dropdown: {
    marginBottom: '15%',
    marginTop: 40,
  },
  date_dropdown_bubble: {
    marginTop: 5,
  },
});

export default styles;
