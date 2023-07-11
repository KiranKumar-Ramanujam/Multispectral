import React, {useState, useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {View, PanResponder} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useDispatch, useSelector} from 'react-redux';
import TabNavigation from './TabNavigation';
import AuthScreen from '../screens/auth/AuthScreen';
import {Loader} from '../components';
import moment from 'moment';
import {getLogoutData} from '../redux/actions/logindetail.action';
import SQLite from 'react-native-sqlcipher';
import RNFS from 'react-native-fs';

const Stack = createStackNavigator();

const RootStack = () => {
  const [isLoading, setIsLoading] = useState(false);
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const [Login, setLogin] = useState(true);

  const pass = useSelector(state => state.databaseReducer.pass);
  let dbName = 'multispectral.db';
  const db = SQLite.openDatabase(
    {name: RNFS.ExternalDirectoryPath + '/' + dbName, key: pass},
    () => {},
    error => {
      console.log(error);
    },
  );

  useEffect(() => {
    Auth();
    resetInactivityTimeout();
  }, [Login]);

  async function Auth() {
    try {
      const session = await EncryptedStorage.getItem('user_session');
      if (session !== undefined && session != null && session != '') {
        setIsLoading(false);
        dispatch(getLoginData());
      } else {
        setIsLoading(false);
        dispatch(getLogoutData());
      }
    } catch (error) {
      console.log('Error :', error);
    }
  }

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
  const resetInactivityTimeout = async () => {
    clearTimeout(timerId.current);
    timerId.current = setTimeout(async () => {
      const session = await EncryptedStorage.getItem('user_session');
      if (session !== undefined && session != null && session != '') {
        const data = JSON.parse(session);
        await db.transaction(tx => {
          var date = moment().format('YYYY/MM/DD hh:mm:ss a');
          tx.executeSql(
            `INSERT INTO MDB_Audit (EntryDate, UserId, Username, DeviceId, ApkVersion, Module, Actions, Remarks, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [
              date,
              data.loginUserId,
              data.loginUserName,
              data.deviceId,
              data.apkversion,
              'Auth',
              'Logout',
              'Logout Successful - Session Timeout',
              date,
              date,
            ],
            () => {
              console.log('User Audit - Session Logout inserted successfully');
            },
          );
        });
      }
      await EncryptedStorage.removeItem('user_session');
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
export default RootStack;
