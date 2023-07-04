import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import * as Animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';

const {width, height} = Dimensions.get('window');
const ratio = Math.min(width, height) / 375;

const Toaster = props => {
  const {
    style,
    textcolor,
    res,
    toastSuccess,
    toastMessage1,
    toastMessage2,
    iconName,
    iconcolor,
  } = props;

  return (
    <Animatable.View
      duration={1000}
      animation="fadeIn"
      style={[
        styles.toasterContainer,
        {
          backgroundColor: res === true ? 'green' : '#FEF2F2',
        },
        style,
      ]}>
      <View style={{width: '15%'}}>
        {toastSuccess === true ? (
          <AntDesign
            style={{left: 5 * ratio}}
            raised
            name={iconName}
            size={25}
            color={iconcolor}
          />
        ) : (
          <AntDesign
            style={{left: 5 * ratio}}
            raised
            name={iconName}
            size={25}
            color={iconcolor}
          />
        )}
      </View>
      <View stvle={styles.toasterTextview}>
        {toastMessage1 != null && toastMessage1 != '' ? (
          <Text style={[styles.toasterText1, {color: textcolor}]}>
            {toastMessage1}
          </Text>
        ) : null}
        <Text style={[styles.toasterText2, {color: textcolor}]}>
          {toastMessage2}
        </Text>
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  toasterContainer: {
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
  toasterText1: {
    fontSize: 14 * ratio,
    fontWeight: 'bold',
  },
  toasterText2: {
    fontSize: 11.5 * ratio,
    top: 1 * ratio,
  },
});
export default Toaster;
