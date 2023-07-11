import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Dimensions} from 'react-native';
import {colors, route} from '../constants';
import {NavigationBack} from '../components';
import Map from '../screens/map/Map';
import FilterMap from '../screens/map/section/FilterMap';
import ValidateGroundTruth from '../screens/map/section/ValidateGroundTruth';

const Stack = createStackNavigator();

const {width, height} = Dimensions.get('window');
const ratio = Math.min(width, height) / 375;

export default () => (
  <Stack.Navigator>
    <Stack.Screen
      name={route.FILTERMAP2}
      component={FilterMap}
      options={{
        headerLeft: () => <NavigationBack />,
        headerTintColor: 'white',
        headerStyle: {backgroundColor: '#009D57', height: 61 * ratio},
        tabBarVisible: false,
        title: 'Filter Map',
        headerTitleStyle: {
          fontSize: 18 * ratio,
          fontWeight: '700',
        },
      }}
    />

    <Stack.Screen
      name={route.MAP}
      component={Map}
      options={{
        headerShown: false,
        headerTintColor: colors.white,
        headerStyle: {backgroundColor: '#009D57', height: 61 * ratio},
        title: 'Map',
        headerTitleStyle: {
          fontSize: 18 * ratio,
          fontWeight: '700',
        },
      }}
    />
    <Stack.Screen
      name={route.FILTERMAP}
      component={FilterMap}
      options={{
        headerLeft: () => <NavigationBack />,
        headerTintColor: 'white',
        headerStyle: {backgroundColor: '#009D57', height: 61 * ratio},
        tabBarVisible: false,
        title: 'Filter Map',
        headerTitleStyle: {
          fontSize: 18 * ratio,
          fontWeight: '700',
        },
      }}
    />

    <Stack.Screen
      name={route.VALIDATEGROUNDTRUTH}
      component={ValidateGroundTruth}
      options={{
        headerLeft: () => <NavigationBack />,
        headerTintColor: 'white',
        headerStyle: {backgroundColor: '#009D57', height: 61 * ratio},
        title: 'Validate Ground Truth',
        headerTitleStyle: {
          fontSize: 18 * ratio,
          fontWeight: '700',
        },
      }}
    />
  </Stack.Navigator>
);
