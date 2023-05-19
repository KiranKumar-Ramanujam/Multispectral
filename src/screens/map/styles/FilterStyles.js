import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const ratio = Math.min(width, height) / 375;

const styles = StyleSheet.create({
  title: {
    marginTop: 30 * ratio,
    fontSize: 16 * ratio,
    fontWeight: 'bold',
    paddingLeft: 14 * ratio,
    bottom: 20 * ratio,
  },
  text: {
    fontSize: 15 * ratio,
    fontWeight: 'bold',
    color: 'black',
    bottom: 10 * ratio,
  },
  switch_container: {
    padding: 5 * ratio,
    flexDirection: 'row',
    left: 9 * ratio,
    height: 40 * ratio,
    alignItems: 'center',
  },
  switch_text: {
    flex: 1,
    left: 5 * ratio,
    fontSize: 16 * ratio,
    color: '#74777A',
  },
  switch: {
    right: 16 * ratio,
    transform: [{scaleX: 0.8 * ratio}, {scaleY: 0.8 * ratio}],
  },
  container: {
    flex: 1,
  },
});

export default styles;
