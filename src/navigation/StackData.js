import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Dimensions} from 'react-native';

import {colors, route} from '../constants';

import DataScreen from '../screens/data/Data';

const Stack = createStackNavigator();

const {width, height} = Dimensions.get('window');
const ratio = Math.min(width, height) / 375;

export default () => (
  <Stack.Navigator>
    <Stack.Screen
      name={route.DATASRC}
      component={DataScreen}
      options={{
        headerTintColor: colors.white,
        headerStyle: {
          backgroundColor: '#009D57',
          height: 61 * ratio,
        },
        title: 'Manage Map Data',
        headerTitleStyle: {
          fontSize: 18 * ratio,
          fontWeight: '700',
        },
      }}
    />
  </Stack.Navigator>
);
