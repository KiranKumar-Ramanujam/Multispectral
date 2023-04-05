import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Toaster = props => {
  const {style, res, toastSuccess, toastMessage, iconName} = props;

  return (
    <Animatable.View
      duration={1000}
      animation="fadeIn"
      style={[
        styles.toasterContainer,
        {
          backgroundColor: res === true ? 'green' : 'red',
        },
        style,
      ]}>
      <View style={{width: '15%'}}>
        {toastSuccess === true ? (
          <AntDesign raised name={iconName} size={25} color="#FFFFFF" />
        ) : (
          <AntDesign raised name={iconName} size={25} color="#FFFFFF" />
        )}
      </View>
      <View stvle={styles.toasterTextview}>
        <Text style={styles.toasterText}>{toastMessage}</Text>
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  toasterContainer: {
    width: '100%',
    height: '100%',
    borderwidth: 0.5,
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifycontent: 'center',
    zIndex: 99,
  },
  toasterTextview: {
    width: '85%',
    justifycontent: 'center',
  },
  toasterText: {
    color: '#ffffff',
  },
});
export default Toaster;
