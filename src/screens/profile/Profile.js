import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import {useDispatch} from 'react-redux';
import {getLogoutData} from '../../redux/actions/logindetail.action';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import versionNumber from '../../../package.json';

import {Loader} from '../../components';

import styles from './styles/ProfileStyles';

const ProfileScreen = ({navigation}) => {
  const theme = 'light';

  const {width, height} = Dimensions.get('window');
  const ratio = Math.min(width, height) / 375;

  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    AsyncStorage.getItem('loginUserName').then(loginUser => {
      if (loginUser && loginUser !== null && loginUser !== undefined) {
        setUserName(loginUser);
      }
    });
    AsyncStorage.getItem('loginUserId').then(loginUserId => {
      if (loginUserId && loginUserId !== null && loginUserId !== undefined) {
        setUserId(loginUserId);
      }
    });
  }, []);

  const handleLogout = () => {
    AsyncStorage.removeItem('loginUserId');
    AsyncStorage.removeItem('loginUserName');
    AsyncStorage.removeItem('login');
    AsyncStorage.removeItem('wipedData');
    AsyncStorage.removeItem('userobject');
    dispatch(getLogoutData());

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
            <Text style={styles.userTag}>{`UserId : ${userId}`}</Text>
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
