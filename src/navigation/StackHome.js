import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Dimensions} from 'react-native';
import {colors, route} from '../constants';
import {NavigationBack} from '../components';
import HomeScreen from '../screens/home/Home';
import DownloadNewDataBlock from '../screens/home/section/DownloadNewDataBlock';

const Stack = createStackNavigator();

const {width, height} = Dimensions.get('window');
const ratio = Math.min(width, height) / 375;

export default () => (
  <Stack.Navigator>
    <Stack.Screen
      name={route.HOME}
      component={HomeScreen}
      options={{
        headerTintColor: colors.white,
        headerStyle: {
          backgroundColor: '#009D57',
          height: 61 * ratio,
        },
        title: 'Validasi Kesehatan Pohon',
        headerTitleStyle: {
          fontSize: 18 * ratio,
          fontWeight: '700',
        },
      }}
    />

    <Stack.Screen
      name={route.DOWNLOADNEWDATABLOCK}
      component={DownloadNewDataBlock}
      options={{
        headerLeft: () => <NavigationBack />,
        headerTintColor: 'white',
        headerStyle: {backgroundColor: '#009D57', height: 61 * ratio},
        title: 'Download Data Untuk Blok Baru',
        headerTitleStyle: {
          fontSize: 18 * ratio,
          fontWeight: '700',
        },
      }}
    />
  </Stack.Navigator>
);
