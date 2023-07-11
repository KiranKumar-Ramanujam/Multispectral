import EncryptedStorage from 'react-native-encrypted-storage';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getLogoutData} from '../../redux/actions/logindetail.action';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import versionNumber from '../../../package.json';
import {Loader} from '../../components';
import styles from './styles/ProfileStyles';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';
import RNFS from 'react-native-fs';
import SQLite from 'react-native-sqlcipher';

const ProfileScreen = ({navigation}) => {
  const {width, height} = Dimensions.get('window');
  const ratio = Math.min(width, height) / 375;
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [DeviceId, setDeviceId] = useState('');

  const dispatch = useDispatch();

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
    try {
      UserData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    DeviceInfo.getUniqueId().then(uniqueId => {
      setDeviceId(uniqueId);
    });
  }, [DeviceId]);

  async function UserData() {
    try {
      const session = await EncryptedStorage.getItem('user_session');
      if (session !== undefined && session != null && session != '') {
        const data = JSON.parse(session);
        setUserName(data.loginUserName);
        setUserId(data.loginUserId);
        setToken(data.token);
      }
    } catch (error) {
      console.log('Error :', error);
    }
  }

  const handleLogout = async () => {
    const session = await EncryptedStorage.getItem('user_session');
    if (session !== undefined && session != null && session != '') {
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
    await EncryptedStorage.removeItem('user_session');
    dispatch(getLogoutData());
    setIsLoading(false);
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
        <ScrollView style={{container: 1}}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 20,
              color: '#74777A',
            }}>{`Token : ${token} \n\n UserId : ${userId}`}</Text>
        </ScrollView>
      </View>
      <View style={styles.versionStyle}>
        <Text
          style={{
            color: '#74777A',
            textAlign: 'center',
            fontSize: 13 * ratio,
          }}>
          {`${versionNumber.version} - ${DeviceId}`}
        </Text>
      </View>
    </>
  );
};

export default ProfileScreen;
