import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Dimensions} from 'react-native';

import {colors} from '../constants';

import StackHome from './StackHome';
import StackMap from './StackMap';
import StackProfile from './StackProfile';
import StackData from './StackData';

import {MaterialCommunityIcons_all} from '../icons/Icons';

const Tab = createBottomTabNavigator();

const {width, height} = Dimensions.get('window');
const ratio = Math.min(width, height) / 375;

export default () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: 'white',
        tabBarActiveTintColor: colors.TabColor.active,
        tabBarInactiveTintColor: colors.TabColor.inactive,
        tabBarAllowFontScaling: true,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: 'white',
          height: 70 * ratio,
        },
        tabBarItemStyle: {
          backgroundColor: 'white',
        },
        tabBarLabelStyle: {
          fontSize: 12 * ratio,
          top: -10 * ratio,
        },
      }}>
      <Tab.Screen
        name="home"
        component={StackHome}
        options={{
          tabBarIcon: ({focused}) => (
            <MaterialCommunityIcons_all
              active={focused}
              name={'home'}
              size={26 * ratio}
            />
          ),
          tabBarLabel: 'Home',
        }}
      />

      <Tab.Screen
        name="Map View"
        component={StackMap}
        options={{
          tabBarIcon: ({focused}) => (
            <MaterialCommunityIcons_all
              active={focused}
              name={'map'}
              size={26 * ratio}
            />
          ),
          tabBarLabel: 'Map',
        }}
      />

      <Tab.Screen
        name="Data"
        component={StackData}
        options={{
          tabBarIcon: ({focused}) => (
            <MaterialCommunityIcons_all
              active={focused}
              name={'database-marker'}
              size={26 * ratio}
            />
          ),
          tabBarLabel: 'Data',
        }}
      />

      <Tab.Screen
        name="Profile"
        component={StackProfile}
        options={{
          tabBarIcon: ({focused}) => (
            <MaterialCommunityIcons_all
              active={focused}
              name={'account-circle'}
              size={26 * ratio}
            />
          ),
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};
