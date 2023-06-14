import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';

import TabNavigation from './TabNavigation';
import AuthScreen from '../screens/auth/AuthScreen';

import {Loader} from '../components';

import {getLoginData, getLogoutData} from '../redux/actions/logindetail.action';

const Stack = createStackNavigator();

const Navigation = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const state = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    AsyncStorage.getItem('userobject').then(res => {
      if (res != null) {
        setIsLogin(true);
        setIsLoading(false);
        dispatch(getLoginData());
      } else {
        setIsLogin(false);
        setIsLoading(false);
        dispatch(getLogoutData());
      }
    });
  }, []);

  return (
    <>
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
    </>
  );
};
export default Navigation;
