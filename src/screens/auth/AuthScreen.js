import AsyncStorage from '@react-native-async-storage/async-storage';
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
import {useDispatch} from 'react-redux';
import {getLoginData} from '../../redux/actions/logindetail.action';
import {CommonActions} from '@react-navigation/native';

import {NetworkUtils} from '../../utils';

import {API_URL} from '../../helper/helper';

import moment from 'moment';

import SQLite from 'react-native-sqlite-storage';

import {Loader} from '../../components';
import Logo from '../../components/Logo';

import {gStyle} from '../../constants';

import styles from './styles/AuthScreenStyles';

const AuthScreen = ({navigation}) => {
  const theme = 'light';
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

  const dispatch = useDispatch();

  const db = SQLite.openDatabase(
    {
      name: 'MainDB',
      location: 'default',
    },
    () => {},
    error => {
      console.log(error);
    },
  );

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

    if (!username) {
      isValid = false;
      resErrors.username = 'Please enter a username';
    }

    if (!password) {
      isValid = false;
      resErrors.password = 'Please enter a password';
    }

    setErrors(resErrors);
    return isValid;
  };

  const handleSubmitPress = async () => {
    try {
      if (loginValidation()) {
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
              let resErrors = {};
              if (res.status !== 200) {
                setIsLoading(false);
                setShow(true);
                resErrors.message = jsonRes.message;
                setErrors(resErrors);
                setLoginSuccess(false);
                setTimeout(() => {
                  setShow(false);
                }, 2000);
                clearState();
              } else {
                let userObjectTemp = [];
                const temp = jsonRes.data.userId;
                AsyncStorage.setItem(
                  'loginUserId',
                  JSON.stringify(jsonRes.data.userId),
                );
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
                      const users = jsonRes.data;
                      if (result.status === 200) {
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
                                      j < users[i].user_areas.length;
                                      j++
                                    ) {
                                      tx.executeSql(
                                        `INSERT INTO MDB_User (userId, userName, password, regionId, estateGroupId, estateId, afdelingId, blockId, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)`,
                                        [
                                          users[i].id,
                                          users[i].username,
                                          users[i].password,
                                          users[i].user_areas[j].regionId,
                                          users[i].user_areas[j].estateGroupId,
                                          users[i].user_areas[j].estateId,
                                          users[i].user_areas[j].afdelingId,
                                          users[i].user_areas[j].blockId,
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
                  setTimeout(() => {
                    setShow(false);
                    dispatch(getLoginData());
                  }, 1000);
                  navigation.dispatch(CommonActions.replace('TabNavigation'));
                } else {
                  setIsLoading(false);
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
      } else {
        setIsLoading(false);
        setLoginSuccess(false);
        setTimeout(() => {
          setShow(false);
        }, 7000);
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
              {errors.username !== undefined && (
                <Text style={styles.usernameempty}>{errors.username}</Text>
              )}
              <TextInput
                ref={passwordInputRef}
                style={styles.passwordinput}
                value={password}
                secureTextEntry={true}
                onChangeText={resPassword => setPassword(resPassword)}
                placeholder={'Password'}
                placeholderTextColor="#C0C0C0"
              />
              {errors.password !== undefined && (
                <Text style={styles.passwordempty}>{errors.password}</Text>
              )}
            </View>
            <View style={styles.loginview}>
              <TouchableOpacity
                style={styles.loginbtn}
                onPress={handleSubmitPress}>
                <Text style={styles.logintext}>Login</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.endtext}>
              2023 Ace Resource Advisory Services Sdn. Bhd.
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </>
  );
};

export default AuthScreen;
