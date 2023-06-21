import * as React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {gStyle} from '../constants';

import {BackIcon} from '../icons/Icons';

const NavigationBack = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={gStyle.activeOpacity}
      onPress={() => navigation.goBack(null)}
      style={styles.container}>
      <BackIcon active />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 16,
  },
});

export default NavigationBack;
