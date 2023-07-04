import * as React from 'react';
import PropTypes from 'prop-types';
import {Text, TouchableOpacity} from 'react-native';

import {gStyle} from '../constants';

const Touch = ({accessible, onPress, style, text, textStyle, disabled}) => (
  <TouchableOpacity
    accessible={accessible}
    activeOpacity={gStyle.activeOpacity}
    onPress={onPress}
    disabled={disabled}
    style={style}>
    <Text style={textStyle}>{text}</Text>
  </TouchableOpacity>
);

Touch.defaultProps = {
  accessible: false,
  style: gStyle.btn,
  textStyle: gStyle.btnText,
};

Touch.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,

  accessible: PropTypes.bool,
  style: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.object,
  ]),
  textStyle: PropTypes.object,
};

export default Touch;
