import React from 'react';
import {View} from 'react-native';
import {Svg, Circle, Text as SVGText} from 'react-native-svg';

const CircularProgress = props => {
  const {size, strokeWidth, textInprogress, textCompletion} = props;
  const radius = (size - strokeWidth) / 2;
  const circum = radius * 2 * Math.PI;
  const svgProgress = 100 - props.progressPercent;
  const svgProgress2 = 100 - props.progressPercent2 / 1.4;

  return (
    <View style={{margin: 10}}>
      <Svg width={size} height={size}>
        <Circle
          stroke={props.bgColor ? props.bgColor : 'lightgrey'}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          {...{strokeWidth}}
        />

        <Circle
          stroke={props.pgColor ? props.pgColor : '#3b5998'}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={`${circum} ${circum}`}
          strokeDashoffset={radius * Math.PI * 2 * (svgProgress / 100)}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          {...{strokeWidth}}
        />
        <Circle
          stroke={props.bgColor ? props.bgColor : 'lightgrey'}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius / 1.4}
          {...{strokeWidth}}
        />

        <Circle
          stroke={props.pgColor2 ? props.pgColor2 : '#3b5998'}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius / 1.4}
          strokeDasharray={`${circum} ${circum}`}
          strokeDashoffset={radius * Math.PI * 2 * (svgProgress2 / 100)}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          {...{strokeWidth}}
        />
        <SVGText
          fontSize={props.textSize ? props.textSize : '10'}
          x={size / 2}
          y={size / 2 + (props.textSize ? props.textSize / 2 - 1 : 5)}
          textAnchor="middle"
          fill={
            props.progressPercent == 100 && props.progressPercent2 == 100
              ? 'red'
              : props.progressPercent < 100 && props.progressPercent2 <= 0
              ? 'green'
              : props.progressPercent < 100
              ? 'green'
              : 'orange'
          }>
          {props.progressPercent2 == 100 && props.progressPercent == 100
            ? textCompletion
            : textInprogress}
        </SVGText>
      </Svg>
    </View>
  );
};

export default CircularProgress;
