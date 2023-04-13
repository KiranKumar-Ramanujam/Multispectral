import * as React from 'react';
import {TouchableOpacity, Dimensions} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Svg, {Circle, Path, Rect} from 'react-native-svg';

import {colors} from '../constants';
import {gStyle} from '../constants';

const {width, height} = Dimensions.get('window');
const ratio = Math.min(width, height) / 375;

const MaterialCommunityIcons_all = ({active, name, style, size, color}) => {
  color = active ? colors.TabColor.active : colors.TabColor.inactive;

  return (
    <MaterialCommunityIcons
      name={name}
      style={style}
      size={size}
      color={color}
    />
  );
};

const MaterialIcon = ({style, onPress, name, size}) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <MaterialIcons
        name={name}
        size={size}
        color={gStyle.btn.backgroundColor}
      />
    </TouchableOpacity>
  );
};

const Circles = ({cx, cy, r, fill, stroke, strokeWidth}) => {
  return (
    <Svg height="50" width="70">
      <Circle
        cx={cx}
        cy={cy}
        r={r}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
};

const AntDesignIcon = ({style, onPress, name, size, color}) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <AntDesign name={name} size={size} color={color} />
    </TouchableOpacity>
  );
};

const Svg_Filter = ({viewBox, color}) => {
  return (
    <Svg
      width="35"
      height="35"
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect width="60" height="60" rx="60" fill={color} />
      <Path
        d="M24.9997 45V40H13.333L21.6663 31.6667H16.6663L24.9997 23.3333H19.9997L28.333 15L36.6663 23.3333H31.6663L35.8118 27.6746C31.6663 27.6746 28.3529 30.3247 28.3118 35.1746C28.2907 37.6746 29.9785 41.0079 30.6663 41.0079C30.6663 41.0079 30.6663 42.6746 30.6663 45H24.9997Z"
        fill="white"
      />
      <Path
        d="M35.8964 28.5078C37.6868 28.5078 39.404 29.2191 40.67 30.4851C41.936 31.7511 42.6473 33.4682 42.6473 35.2587C42.6473 36.9308 42.0345 38.468 41.0271 39.652L41.3075 39.9324H42.128L47.321 45.1254L45.7631 46.6833L40.5701 41.4903V40.6698L40.2897 40.3894C39.1057 41.3968 37.5685 42.0096 35.8964 42.0096C34.1059 42.0096 32.3888 41.2983 31.1228 40.0323C29.8568 38.7663 29.1455 37.0491 29.1455 35.2587C29.1455 33.4682 29.8568 31.7511 31.1228 30.4851C32.3888 29.2191 34.1059 28.5078 35.8964 28.5078ZM35.8964 30.585C33.2999 30.585 31.2227 32.6622 31.2227 35.2587C31.2227 37.8552 33.2999 39.9324 35.8964 39.9324C38.4929 39.9324 40.5701 37.8552 40.5701 35.2587C40.5701 32.6622 38.4929 30.585 35.8964 30.585Z"
        fill="white"
      />
    </Svg>
  );
};

const BackIcon = ({active, size}) => {
  const theme = 'dark';
  const fill = active
    ? colors.activeTintColor[theme]
    : colors.inactiveTintColor[theme];

  return <MaterialIcons name="arrow-back" color={'white'} size={30 * ratio} />;
};

export {
  MaterialCommunityIcons_all,
  MaterialIcon,
  Circles,
  AntDesignIcon,
  Svg_Filter,
  BackIcon,
};
