import React, {useState, useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {View, PanResponder} from 'react-native';

import TabNavigation from './TabNavigation';
import AuthScreen from '../screens/auth/AuthScreen';

import {Loader} from '../components';

import {getLoginData, getLogoutData} from '../redux/actions/logindetail.action';

const Stack = createStackNavigator();

const Navigation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const [Login, setLogin] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('userobject').then(res => {
      if (res != null) {
        setIsLoading(false);
        dispatch(getLoginData());
      } else {
        setIsLoading(false);
        dispatch(getLogoutData());
      }
    });
    resetInactivityTimeout();
  }, [Login]);

  const timerId = useRef(false);
  const [timeForInactivityInSecond, setTimeForInactivityInSecond] =
    useState(900);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        resetInactivityTimeout();
        return false;
      },
    }),
  ).current;
  const resetInactivityTimeout = () => {
    clearTimeout(timerId.current);
    timerId.current = setTimeout(async () => {
      AsyncStorage.removeItem('loginUserId');
      AsyncStorage.removeItem('loginUserName');
      AsyncStorage.removeItem('login');
      AsyncStorage.removeItem('wipedData');
      AsyncStorage.removeItem('userobject');
      dispatch(getLogoutData());
      setLogin(false);
    }, timeForInactivityInSecond * 1000);
  };
  return (
    <>
      <View style={{flex: 1}} {...panResponder.panHandlers}>
        <Loader loading={isLoading} />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="AuthScreen"
            screenOptions={{
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              presentation: 'modal',
            }}>
            {!state?.getLoginDataReducer?.login ? (
              <Stack.Screen
                name="AuthScreen"
                component={AuthScreen}
                options={{
                  headerShown: false,
                }}
              />
            ) : (
              <Stack.Screen
                name="TabNavigation"
                component={TabNavigation}
                options={{
                  headerShown: false,
                }}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </>
  );
};
export default Navigation;
