import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const ratio = Math.min(width, height) / 375;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
    height: '100%',
    justifyContent: 'flex-end',
    alignSelf: 'center',
  },
  item: {
    padding: 20,
    fontSize: 15,
    marginTop: 5,
  },
  popcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer2: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  alertBox: {
    backgroundColor: '#fff',
    width: 280 * ratio,
    padding: 13 * ratio,
    borderRadius: 10 * ratio,
    height: 180 * ratio,
  },
  title: {
    fontSize: 20 * ratio,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 15 * ratio,
  },
  popbuttonContainer: {
    bottom: 20 * ratio,
    alignItems: 'center',
  },
  popconfirmButton: {
    backgroundColor: '#009D57',
    width: 245 * ratio,
    padding: 12 * ratio,
    borderRadius: 5 * ratio,
    top: 20 * ratio,
  },
  popbuttonText: {
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 14 * ratio,
  },
});

export default styles;
