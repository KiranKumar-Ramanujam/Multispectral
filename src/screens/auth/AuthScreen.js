import AsyncStorage from '@react-native-async-storage/async-storage';
import md5 from 'md5';
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  StyleSheet,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import {useDispatch} from 'react-redux';
import RNFS from 'react-native-fs';
import {getLoginData} from '../../redux/actions/logindetail.action';
import {CommonActions} from '@react-navigation/native';

// Network Check
import {NetworkUtils} from '../../utils';

// API URL
import {API_URL} from '../../helper/helper';

// Components
import {Loader} from '../../components';
import Logo from '../../components/Logo';

// constants
import {gStyle, colors} from '../../constants';

// Date
import moment from 'moment';

// styles
import styles from './styles/AuthScreenStyles';

// Database
import SQLite from 'react-native-sqlite-storage';

/*********************************************************/

const AuthScreen = ({navigation}) => {
  const theme = 'light';

  const {width, height} = Dimensions.get('window');
  const ratio = Math.min(width, height) / 375;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [netInfo, setNetInfo] = useState(false);

  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const focusPasswordInput = () => {
    passwordInputRef.current.focus();
  };

  let dbName = 'multispectral.db';
  let db = SQLite.openDatabase(
    RNFS.ExternalDirectoryPath + '/' + dbName,
    '1.0',
    '',
    200000,
    okCallback,
    errorCallback,
  );

  const okCallback = () => {};
  const errorCallback = () => {};

  const dispatch = useDispatch();

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
          '(userId INTEGER, userName VARCHAR(128), password VARCHAR(128), regionId INTEGER, estateGroupId INTEGER, estateId INTEGER, afdelingId INTEGER, blockId INTEGER, createdAt TIMESTAMP, updatedAt TIMESTAMP);',
      );
    });
  };

  const clearState = () => {
    setUsername('');
    setPassword('');
  };

  const loginValidation = () => {
    let isValid = true;
    let resErrors = {};

    resErrors.message = 'Username atau Password salah.';

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
        await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
          .then(async res => {
            const jsonRes = await res.json();
            if (res.status !== 200) {
              setIsLoading(false);
              loginValidation();
              setShow(true);
              setLoginSuccess(false);
              setTimeout(() => {
                setShow(false);
              }, 2000);
              clearState();
            } else {
              let errors = {};
              let userObjectTemp = [];
              const temp = jsonRes.data.userId;
              AsyncStorage.setItem(
                'loginUserId',
                JSON.stringify(jsonRes.data.id),
              );
              AsyncStorage.setItem('loginUserName', username);
              AsyncStorage.setItem('login', JSON.stringify(true));
              AsyncStorage.setItem('wipedData', JSON.stringify(false));
              userObjectTemp.push({username: username, login: true});
              AsyncStorage.setItem(
                'userobject',
                JSON.stringify(userObjectTemp),
              );
              setErrors(errors);
              setShow(true);
              setLoginSuccess(true);
              setIsLoading(false);
              setTimeout(() => {
                setShow(false);
                dispatch(getLoginData());
              }, 1000);

              await fetch(
                `${API_URL}/api/access-management/get-download-users`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                },
              )
                .then(async result => {
                  try {
                    const jsonRes = await result.json();
                    const users = jsonRes.data.rows;
                    // Alert.alert('Information 1 !', JSON.stringify(jsonRes));
                    // Alert.alert('Information 2 !', JSON.stringify(users));
                    // Alert.alert('Information 3 !', JSON.stringify(users.rows));
                    if (users.length == 0) {
                      Alert.alert(
                        'Warning!',
                        ' USers Master Data is Empty. Please check the User Master Data First.',
                      );
                    } else {
                      await db.transaction(tx => {
                        var date = moment().format('YYYY/MM/DD hh:mm:ss a');
                        tx.executeSql(
                          'SELECT * FROM MDB_User',
                          [],
                          (tx, results) => {
                            var len = results.rows.length;
                            if (len <= 0) {
                              for (let i = 0; i < users.length; i++) {
                                for (
                                  let j = 0;
                                  j < users[i].user_area.length;
                                  j++
                                ) {
                                  tx.executeSql(
                                    `INSERT INTO MDB_User (userId, userName, password, regionId, estateGroupId, estateId, afdelingId, blockId, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)`,
                                    [
                                      users[i].id,
                                      users[i].username,
                                      users[i].password,
                                      users[i].user_area[j].regionId,
                                      users[i].user_area[j].estateGroupId,
                                      users[i].user_area[j].estateId,
                                      users[i].user_area[j].afdelingId,
                                      users[i].user_area[j].blockId,
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
                            }
                          },
                        );
                      });
                    }
                  } catch (err) {
                    console.log(err);
                  }
                })
                .catch(err => {
                  console.log(err);
                });
              navigation.dispatch(CommonActions.replace('TabNavigation'));
            }
          })
          .catch(err => {});
      } else {
        await db.transaction(tx => {
          tx.executeSql(
            'SELECT DISTINCT(userName), userId FROM MDB_User WHERE userName = ? AND password = ? ',
            [username, md5(password)],
            (context, results) => {
              let len = results.rows.length;
              let userObjectTemp = [];
              if (len > 0) {
                let errors = {};
                const userId = results.rows.item(0)['userId'];
                AsyncStorage.setItem('loginUserId', userId.toString());
                AsyncStorage.setItem('loginUserName', username);
                AsyncStorage.setItem('login', JSON.stringify(true));
                AsyncStorage.setItem('wipedData', JSON.stringify(false));
                userObjectTemp.push({username: username, login: true});
                AsyncStorage.setItem(
                  'userobject',
                  JSON.stringify(userObjectTemp),
                );
                setShow(true);
                setLoginSuccess(true);
                setIsLoading(false);
                setErrors(errors);
                setTimeout(() => {
                  setShow(false);
                  dispatch(getLoginData());
                }, 1000);
                navigation.dispatch(CommonActions.replace('TabNavigation'));
              } else {
                setIsLoading(false);
                loginValidation();
                setShow(true);
                setLoginSuccess(false);
                setTimeout(() => {
                  setShow(false);
                }, 2000);
                clearState();
              }
            },
          );
        });
      }
    } catch (error) {
      setIsLoading(false);
    }
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
