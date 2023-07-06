import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import {useDispatch} from 'react-redux';
import {getLogoutData} from '../../redux/actions/logindetail.action';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import versionNumber from '../../../package.json';

import {Loader} from '../../components';

import styles from './styles/ProfileStyles';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';
import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';

const ProfileScreen = ({navigation}) => {
  const theme = 'light';

  const {width, height} = Dimensions.get('window');
  const ratio = Math.min(width, height) / 375;

  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [DeviceId, setDeviceId] = useState('');

  const dispatch = useDispatch();

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

  useEffect(() => {
    UserData();
  }, []);

  useEffect(() => {
    DeviceInfo.getUniqueId().then(uniqueId => {
      setDeviceId(uniqueId);
    });
  }, [DeviceId]);

  async function UserData() {
    try {
      const session = await AsyncStorage.getItem('user_session');
      if (session !== undefined && session != null && session != '') {
        const data = JSON.parse(session);
        setUserName(data.loginUserName);
        setUserId(data.loginUserId);
      }
    } catch (error) {
      console.log('Error :', error);
    }
  }

  const handleLogout = async () => {
    const session = await AsyncStorage.getItem('user_session');
    if (session !== undefined && session != null && session != '') {
      const data = JSON.parse(session);
      await db.transaction(tx => {
        var date = moment().format('YYYY/MM/DD hh:mm:ss a');
        tx.executeSql(
          `INSERT INTO MDB_Audit (EntryDate, UserId, Username, DeviceId, ApkVersion, Module, Actions, Remarks, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)`,
          [
            date,
            userId,
            userName,
            DeviceId,
            versionNumber.version,
            'Auth',
            'Logout',
            'Logout Successfull',
            date,
            date,
          ],
          () => {
            console.log('Auth  Audit - Logout inserted successfully');
          },
        );
      });
    }
    await AsyncStorage.removeItem('user_session');
    setShow(true);
    setLogoutSuccess(true);
    setIsLoading(false);
    dispatch(getLogoutData());
    navigation.navigate('Home');
  };

  return (
    <>
      <Loader loading={isLoading} />
      <View style={styles.container}>
        <View style={styles.profileView}>
          <View style={styles.profileImage}>
            <MaterialCommunityIcons
              raised
              size={85 * ratio}
              color="green"
              name="badge-account"
            />
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.tagName}>{`${userName
              .charAt(0)
              .toUpperCase()}${userName.slice(1)}`}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.hapusStyle} onPress={handleLogout}>
          <View style={styles.hapusCenterView}>
            <Text style={styles.logoutText}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.versionStyle}>
        <Text
          style={{
            color: '#74777A',
            textAlign: 'center',
            fontSize: 13 * ratio,
          }}>
          {versionNumber.version}
        </Text>
      </View>
    </>
  );
};

export default ProfileScreen;
