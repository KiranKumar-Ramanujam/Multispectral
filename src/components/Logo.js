import React from 'react';
import {Image, StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const ratio = Math.min(width, height) / 375;

export default function Logo() {
  return (
    <Image
      source={require('../assets/images/asianagri_dpp-v_2_1.png')}
      style={styles.image}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 188 * ratio,
    height: 166 * ratio,
  },
});
