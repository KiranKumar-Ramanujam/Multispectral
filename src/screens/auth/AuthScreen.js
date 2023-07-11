import EncryptedStorage from 'react-native-encrypted-storage';
import md5 from 'md5';
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import RNFS from 'react-native-fs';
import {getLoginData} from '../../redux/actions/logindetail.action';
import {CommonActions} from '@react-navigation/native';
import {NetworkUtils} from '../../utils';
import {API_URL} from '../../helper/helper';
import {Loader} from '../../components';
import Logo from '../../components/Logo';
import {gStyle} from '../../constants';
import moment from 'moment';
import styles from './styles/AuthScreenStyles';
import SQLite from 'react-native-sqlcipher';
import DeviceInfo from 'react-native-device-info';
import versionNumber from '../../../package.json';

const AuthScreen = ({navigation}) => {
  const theme = 'light';

  const {width, height} = Dimensions.get('window');
  const ratio = Math.min(width, height) / 375;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [netInfo, setNetInfo] = useState(false);

  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const focusPasswordInput = () => {
    passwordInputRef.current.focus();
  };

  const [DeviceId, setDeviceId] = useState('');

  const pass = useSelector(state => state.databaseReducer.pass);
  let dbName = 'multispectral.db';
  const db = SQLite.openDatabase(
    {name: RNFS.ExternalDirectoryPath + '/' + dbName, key: pass},
    () => {},
    error => {
      console.log(error);
    },
  );

  const dispatch = useDispatch();

  DeviceInfo.getUniqueId().then(uniqueId => {
    setDeviceId(uniqueId);
  });
  useEffect(() => {
    (async () => {
      registerUser();
      setInterval(async () => {
        let NetworkInfo = JSON.parse(await NetworkUtils.isNetworkAvailable());
        setNetInfo(NetworkInfo);
      }, 10);
    })();
  }, []);

  const registerUser = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' +
          'MDB_User ' +
          '(userId INTEGER, userName VARCHAR(128), password VARCHAR(128), passwordDate TIMESTAMP, createdAt TIMESTAMP, updatedAt TIMESTAMP);',
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' +
          'MDB_Audit ' +
          '(Id INTEGER PRIMARY KEY AUTOINCREMENT, EntryDate datetime, UserId INTEGER, Username TEXT, DeviceId TEXT, ApkVersion TEXT,Module TEXT, Actions TEXT, Remarks TEXT, createdAt TIMESTAMP, updatedAt TIMESTAMP);',
      );
    });
  };

  const clearState = () => {
    setUsername('');
    setPassword('');
  };

  const loginValidation = jsonRes => {
    let isValid = true;
    let resErrors = {};
    if (jsonRes.meta.message != null && jsonRes.meta.message != '') {
      resErrors.message = jsonRes.meta.message;
    } else {
      resErrors.message = 'Please try again later.';
    }
    setErrors(resErrors);
    return isValid;
  };

  const handleSubmitPress = async () => {
    try {
      setIsLoading(true);
      const payload = {
        username,
        password,
      };
      if (netInfo) {
        try {
          const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          const jsonRes = await res.json();
          if (res.status !== 200) {
            setIsLoading(false);
            loginValidation(jsonRes);
            clearState();
            await db.transaction(tx => {
              var date = moment().format('YYYY/MM/DD hh:mm:ss a');
              tx.executeSql(
                `INSERT INTO MDB_Audit (EntryDate, UserId, Username, DeviceId, ApkVersion, Module, Actions, Remarks, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)`,
                [
                  date,
                  '-',
                  username,
                  DeviceId,
                  versionNumber.version,
                  'Auth',
                  'Login',
                  'Login Failed (Username atau Password salah.)',
                  date,
                  date,
                ],
                () => {
                  console.log('User Audit inserted successfully');
                },
              );
            });
          } else {
            let errors = {};
            await EncryptedStorage.setItem(
              'user_session',
              JSON.stringify({
                loginUserId: jsonRes.data.id,
                loginUserName: username,
                deviceId: DeviceId,
                apkversion: versionNumber.version,
                login: true,
                token: jsonRes.data.token,
              }),
            );
            setErrors(errors);
            setIsLoading(false);
            setTimeout(() => {
              dispatch(getLoginData());
            }, 1000);
            await db.transaction(tx => {
              var date = moment().format('YYYY/MM/DD hh:mm:ss a');
              tx.executeSql(
                `INSERT INTO MDB_Audit (EntryDate, UserId, Username, DeviceId, ApkVersion, Module, Actions, Remarks, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)`,
                [
                  date,
                  jsonRes.data.id,
                  username,
                  DeviceId,
                  versionNumber.version,
                  'Auth',
                  'Login',
                  'Login Successfull',
                  date,
                  date,
                ],
                () => {
                  console.log('User Audit inserted successfully');
                },
              );
            });
            await fetch(`${API_URL}/api/access-management/get-download-users`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then(async result => {
                try {
                  const jsonRes = await result.json();
                  const users = jsonRes.data.rows;
                  if (users.length == 0) {
                    Alert.alert(
                      'Warning!',
                      ' USers Master Data is Empty. Please check the User Master Data First.',
                    );
                  } else {
                    await db.transaction(tx => {
                      var date = moment().format('YYYY/MM/DD hh:mm:ss a');
                      tx.executeSql(
                        'DELETE FROM MDB_User',
                        [],
                        () => {
                          for (let i = 0; i < users.length; i++) {
                            {
                              tx.executeSql(
                                `INSERT INTO MDB_User (userId, userName, password, passwordDate, createdAt, updatedAt) VALUES (?,?,?,?,?,?)`,
                                [
                                  users[i].id,
                                  users[i].username,
                                  users[i].password,
                                  users[i].passwordDate,
                                  date,
                                  date,
                                ],
                                () => {
                                  console.log(
                                    'User Data inserted successfully',
                                  );
                                },
                              );
                            }
                          }
                        },
                        (_, error) => {
                          console.log('Error deleting records:', error);
                        },
                      );
                    });
                  }
                } catch (err) {
                  console.log(err);
                }
                navigation.dispatch(CommonActions.replace('TabNavigation'));
              })
              .catch(err => {});
          }
        } catch (error) {
          await db.transaction(tx => {
            tx.executeSql(
              'SELECT DISTINCT(userName), userId FROM MDB_User WHERE userName = ? AND password = ? ',
              [username, md5(password)],
              async (context, results) => {
                let len = results.rows.length;
                let errors = {};
                if (len > 0) {
                  const userId = results.rows.item(0)['userId'];
                  await EncryptedStorage.setItem(
                    'user_session',
                    JSON.stringify({
                      loginUserId: userId,
                      loginUserName: username,
                      deviceId: DeviceId,
                      apkversion: versionNumber.version,
                      login: true,
                      token: 'Offline',
                    }),
                  );
                  setIsLoading(false);
                  setErrors(errors);
                  setTimeout(() => {
                    dispatch(getLoginData());
                  }, 1000);
                  await insertTransaction(userId);
                  navigation.dispatch(CommonActions.replace('TabNavigation'));
                } else {
                  errors = {
                    meta: {
                      success: false,
                      message: 'Username atau Password salah.',
                    },
                  };
                  setIsLoading(false);
                  loginValidation(errors);
                  clearState();
                  var date = moment().format('YYYY/MM/DD hh:mm:ss a');
                  await tx.executeSql(
                    `INSERT INTO MDB_Audit (EntryDate, UserId, Username, DeviceId, ApkVersion, Module, Actions, Remarks, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)`,
                    [
                      date,
                      '-',
                      username,
                      DeviceId,
                      versionNumber.version,
                      'Auth',
                      'Login',
                      'Login Failed - Offline (Username atau Password salah.)',
                      date,
                      date,
                    ],
                    () => {
                      console.log('User Audit inserted successfully');
                    },
                  );
                }
              },
            );
          });
        }
      } else {
        await db.transaction(tx => {
          tx.executeSql(
            'SELECT DISTINCT(userName), userId FROM MDB_User WHERE userName = ? AND password = ? ',
            [username, md5(password)],
            async (context, results) => {
              let len = results.rows.length;
              let errors = {};
              if (len > 0) {
                const userId = results.rows.item(0)['userId'];
                await EncryptedStorage.setItem(
                  'user_session',
                  JSON.stringify({
                    loginUserId: userId,
                    loginUserName: username,
                    deviceId: DeviceId,
                    apkversion: versionNumber.version,
                    login: true,
                    token: 'Offline',
                  }),
                );
                setIsLoading(false);
                setErrors(errors);
                setTimeout(() => {
                  dispatch(getLoginData());
                }, 1000);
                await insertTransaction(userId);
                navigation.dispatch(CommonActions.replace('TabNavigation'));
              } else {
                errors = {
                  meta: {
                    success: false,
                    message: 'Username atau Password salah.',
                  },
                };
                setIsLoading(false);
                loginValidation(errors);
                clearState();
                var date = moment().format('YYYY/MM/DD hh:mm:ss a');
                await tx.executeSql(
                  `INSERT INTO MDB_Audit (EntryDate, UserId, Username, DeviceId, ApkVersion, Module, Actions, Remarks, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)`,
                  [
                    date,
                    '-',
                    username,
                    DeviceId,
                    versionNumber.version,
                    'Auth',
                    'Login',
                    'Login Failed - Offline (Username atau Password salah.)',
                    date,
                    date,
                  ],
                  () => {
                    console.log('User Audit inserted successfully');
                  },
                );
              }
            },
          );
        });
      }
    } catch (error) {
      setIsLoading(false);
    }

    const insertTransaction = async userId => {
      var date = moment().format('YYYY/MM/DD hh:mm:ss a');
      db.transaction(async tx => {
        tx.executeSql(
          `INSERT INTO MDB_Audit (EntryDate, UserId, Username, DeviceId, ApkVersion, Module, Actions, Remarks, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)`,
          [
            date,
            userId,
            username,
            DeviceId,
            versionNumber.version,
            'Auth',
            'Login',
            'Login Successfull - Offline',
            date,
            date,
          ],
          () => {
            console.log('Offline - User Audit inserted successfully');
          },
        );
      });
    };
  };

  return (
    <>
      <Loader loading={isLoading} />
      <View style={[gStyle.logincontainer[theme]]}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <View style={{flex: 1, height: Dimensions.get('window').height}}>
            <View style={styles.logo}>
              <Logo />
            </View>
            <View style={styles.titleview}>
              <Text style={styles.titletext}>Validasi Kesehatan Pohon</Text>
            </View>
            <View style={styles.usernameview}>
              <TextInput
                ref={usernameInputRef}
                style={styles.usernameinput}
                value={username}
                onChangeText={resUsername => setUsername(resUsername)}
                placeholder={'Username'}
                placeholderTextColor="#C0C0C0"
                onSubmitEditing={focusPasswordInput}
              />
              <TextInput
                ref={passwordInputRef}
                style={styles.passwordinput}
                value={password}
                secureTextEntry={true}
                onChangeText={resPassword => setPassword(resPassword)}
                placeholder={'Password'}
                placeholderTextColor="#C0C0C0"
              />
              {errors.message !== undefined && (
                <Text style={styles.invalidmessage}>{errors.message}</Text>
              )}
            </View>
            <View style={styles.loginview}>
              <TouchableOpacity
                style={{
                  color: '#000000',
                  height: 61 * ratio,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  backgroundColor:
                    username != null &&
                    username != '' &&
                    password != null &&
                    password != ''
                      ? '#009D57'
                      : '#C0C0C0',
                }}
                disabled={
                  username != null &&
                  username != '' &&
                  password != null &&
                  password != ''
                    ? false
                    : true
                }
                onPress={handleSubmitPress}>
                <Text style={styles.logintext}>MASUK</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.endtext}>2023 Asian Agri</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </>
  );
};

export default AuthScreen;
