import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const ratio = Math.min(width, height) / 375;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileView: {
    width: '100%',
    height: 'auto',
    paddingTop: 10 * ratio,
    paddingBottom: 20 * ratio,
    alignSelf: 'center',
    flexDirection: 'row',
    borderBottomidth: 0.4 * ratio,
    borderBottomColor: '#75787C',
    justifyContent: 'space-between',
    backgroundColor: '#E5E6E6',
  },
  profileImage: {
    width: 100 * ratio,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileDetails: {
    width: 290 * ratio,
    alignItems: 'flex-start',
    top: 8 * ratio,
  },
  tagName: {
    fontSize: 18 * ratio,
    marginBottom: 3 * ratio,
    fontWeight: 'bold',
    color: 'black',
  },
  userTag: {
    fontSize: 16 * ratio,
  },
  logoutText: {
    fontSize: 20 * ratio,
    width: 75 * ratio,
    alignSelf: 'center',
    color: '#FF3A3A',
  },
  versionStyle: {
    bottom: 0,
    marginBottom: 20 * ratio,
    alignSelf: 'center',
    position: 'absolute',
  },
  hapusStyle: {
    height: 65 * ratio,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    justifyContent: 'center',
  },
  hapusCenterView: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    left: 30 * ratio,
  },
});

export default styles;
