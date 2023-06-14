import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const ratio = Math.min(width, height) / 375;

const styles = StyleSheet.create({
  logo: {
    marginTop: 180 * ratio,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  titleview: {
    marginTop: 80 * ratio,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  titletext: {
    fontSize: 22 * ratio,
    textAlign: 'center',
    alignItems: 'center',
    color: '#1E345D',
    fontWeight: '700',
  },
  usernameview: {
    width: 350 * ratio,
    alignSelf: 'center',
    marginTop: 80 * ratio,
    flex: 1,
  },
  usernameinput: {
    color: 'black',
    alignItems: 'center',
    height: 64 * ratio,
    backgroundColor: 'white',
    borderRadius: 8 * ratio,
    borderColor: 'white',
    padding: 15 * ratio,
    fontSize: 14 * ratio,
  },
  usernameempty: {
    color: 'red',
    fontSize: 16 * ratio,
    marginLeft: 10 * ratio,
  },
  passwordinput: {
    color: 'black',
    alignItems: 'center',
    height: 64 * ratio,
    marginTop: 11 * ratio,
    backgroundColor: 'white',
    borderRadius: 8 * ratio,
    borderColor: 'white',
    padding: 15 * ratio,
    fontSize: 14 * ratio,
  },
  passwordempty: {
    color: 'red',
    fontSize: 16 * ratio,
    marginLeft: 10 * ratio,
  },
  invalidmessage: {
    color: 'red',
    fontSize: 16 * ratio,
    marginLeft: 10 * ratio,
    top: 8 * ratio,
  },
  loginview: {
    width: 350 * ratio,
    alignSelf: 'center',
    marginTop: 157 * ratio,
    flex: 1,
  },
  loginbtn: {
    color: '#000000',
    height: 61 * ratio,
    alignItems: 'center',
    backgroundColor: '#009D57',
    justifyContent: 'center',
    borderRadius: 8,
  },
  logintext: {
    fontSize: 21 * ratio,
    fontWeight: '500',
    color: '#FCFCFC',
  },
  endtext: {
    flex: 1,
    textAlign: 'center',
    marginTop: 39 * ratio,
    fontSize: 12 * ratio,
    color: '#74777A',
  },
});
export default styles;
