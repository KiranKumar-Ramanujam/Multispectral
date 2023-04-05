import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {View, Alert, TouchableOpacity, Text, Dimensions} from 'react-native';
import RNFS from 'react-native-fs';
import {useFocusEffect} from '@react-navigation/native';

import {NetworkUtils} from '../../utils';

import {gStyle, route, colors} from '../../constants';

import styles from './styles/HomeStyles';

import {API_URL} from '../../helper/helper';

import SQLite from 'react-native-sqlite-storage';

const Home = ({navigation}) => {
  const theme = 'light';
  const {width, height} = Dimensions.get('window');
  const ratio = Math.min(width, height) / 375;

  const [PostData, setPostData] = useState([]);
  const [VerificationImage, setVerificationImage] = useState();
  const [TreeData, setTreeData] = useState(false);
  const [netInfo, setNetInfo] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM MDB_manual_verification',
          [],
          (tx, results) => {
            var temp = [];
            var len = results.rows.length;
            if (len > 0) {
              for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
              setTreeData(true);
            }
          },
        );
      });
      getuploadData();
      getuploadImage();
      setInterval(async () => {
        let NetworkInfo = JSON.parse(await NetworkUtils.isNetworkAvailable());
        setNetInfo(NetworkInfo);
      }, 10);
    }, []),
  );

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

  const getuploadData = () => {
    try {
      let jsonArray = [];
      db.transaction(tx => {
        tx.executeSql(
          'SELECT verificationId, predictionId, userId, datetime, status, remarks, user_latitude, user_longitude,accuracy FROM MDB_manual_verification',
          [],
          (tx, results) => {
            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i);
              const jsonObject = {
                predictionId: row.predictionId,
                // userId: row.userId,
                userId: 1,
                datetime: row.datetime,
                status: row.status,
                remarks: row.remarks,
                user_latitude: row.user_latitude,
                user_longitude: row.user_longitude,
                accuracy: row.accuracy,
              };

              tx.executeSql(
                'SELECT verificationId, pestDiseaseId FROM MDB_manualverification_pest_disease  where verificationId =?',
                [row.verificationId],
                (tx, results) => {
                  let tempArray2 = [];
                  for (let j = 0; j < results.rows.length; j++) {
                    const childRow = results.rows.item(j);
                    const jsonObject2 = {
                      pestDiseaseId: childRow.pestDiseaseId,
                    };
                    tempArray2.push(jsonObject2);
                  }
                  jsonObject.manualverification_pd = tempArray2;
                },
              );

              tx.executeSql(
                'SELECT DISTINCT v.verificationImageId, l.treeId, l.blockId AS blockId, l.predictionId, r.verificationId, v.uploadPath AS uploadPath, v.filename AS filename, v.uploadDate AS uploadDate FROM MDB_trees l LEFT JOIN MDB_manual_verification r ON l.predictionId = r.predictionId LEFT JOIN MDB_verification_image v ON v.verificationId = r.verificationId where v.verificationId = ?',

                [row.verificationId],
                (tx, results) => {
                  let tempArray3 = [];
                  for (let j = 0; j < results.rows.length; j++) {
                    const childRow = results.rows.item(j);
                    const jsonObject3 = {
                      userId: childRow.userId,
                      filename: childRow.filename,
                      uploadPath: `D:/multispectral-file/verification_image/${childRow.blockId}/${childRow.filename}`,
                      uploadDate: childRow.uploadDate,
                    };
                    tempArray3.push(jsonObject3);
                  }
                  jsonObject.verification_image = tempArray3;
                  jsonArray.push(jsonObject);
                },
              );
            }
            setPostData(jsonArray);
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getuploadImage = () => {
    try {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT DISTINCT filename, uploadPath  FROM MDB_verification_image',
          [],
          (tx, results) => {
            var temp = [];
            var len = results.rows.length;
            if (len > 0) {
              for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
              setVerificationImage(temp);
            }
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  const synchronize = async () => {
    Alert.alert('Warning! 1', JSON.stringify(PostData));
    if (PostData != null && PostData != '') {
      Alert.alert('Warning! 2', JSON.stringify(PostData));
      await SendData(PostData);

      db.transaction(tx => {
        tx.executeSql(
          'SELECT DISTINCT(compressedImagePath) FROM MDB_trees',
          [],

          (tx, results) => {
            var temp = [];
            var len = results.rows.length;
            if (len > 0) {
              for (let i = 0; i < results.rows.length; ++i) {
                const temp = results.rows.item(i)['compressedImagePath'];
                RNFS.unlink(`file://${temp}`);
              }
            }
          },
        );

        tx.executeSql('DROP TABLE MDB_trees', [], (tx, results) => {
          console.log('Table MDB_trees Deleted successfully');
        });
        tx.executeSql(
          'DROP TABLE MDB_manual_verification',
          [],
          (tx, results) => {
            console.log('Table MDB_manual_verification Deleted successfully');
          },
        );
        tx.executeSql(
          'DROP TABLE MDB_manualverification_pest_disease',
          [],
          (tx, results) => {
            console.log(
              'Table MDB_manualverification_pest_disease Deleted successfully',
            );
          },
        );
        tx.executeSql('DROP TABLE MDB_pest_disease', [], (tx, results) => {
          console.log('Table MDB_pest_disease Deleted successfully');
        });
      });
      setTreeData(false);
    }
    if (VerificationImage != null && VerificationImage != '') {
      for (let i = 0; i < VerificationImage.length; i++) {
        await uploadImage(VerificationImage[i]);
      }
      db.transaction(tx => {
        tx.executeSql(
          'DROP TABLE MDB_verification_image',
          [],
          (tx, results) => {
            console.log('Table MDB_verification_image Deleted Successfully');
          },
        );
      });
    }
  };

  const SendData = async PostData => {
    try {
      Alert.alert('Warning 3!', JSON.stringify(PostData));
      await fetch(`${API_URL}/mobile/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(PostData),
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
    } catch (error) {
      console.log('Error in sending data :', error);
    }
  };

  const uploadImage = async imagePath => {
    const formData = new FormData();
    formData.append('uploadPath', {
      uri: `file://${imagePath.uploadPath}`,
      type: 'image/jpeg',
      name: imagePath.filename,
    });
    try {
      await fetch(`${API_URL}/api/image/upload_treeimage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.message);
          RNFS.unlink(`file://${imagePath.uploadPath}`);
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log('Error uploading image:', error);
    }
  };

  return (
    <View style={gStyle.container[theme]}>
      <View style={[styles.container]}>
        <TouchableOpacity
          style={{
            color: '#000000',
            height: 44 * ratio,
            alignItems: 'center',
            backgroundColor: '#009D57',
            justifyContent: 'center',
            borderRadius: 8,
            marginBottom: 14 * ratio,
            backgroundColor: TreeData && netInfo ? '#009D57' : 'gray',
            borderColor: TreeData && netInfo ? '#009D57' : 'gray',
          }}
          disabled={TreeData && netInfo ? false : true}
          onPress={() => synchronize()}>
          <Text
            style={{
              fontSize: 16.7 * ratio,
              fontWeight: '500',
              color: '#FCFCFC',
            }}>
            Sinkronisasi Data
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            color: '#000000',
            height: 44 * ratio,
            alignItems: 'center',
            backgroundColor: '#009D57',
            justifyContent: 'center',
            borderRadius: 8,
            marginBottom: 16 * ratio,
          }}
          onPress={() => navigation.navigate(route.DOWNLOADNEWDATABLOCK)}>
          <Text
            style={{
              fontSize: 16.7 * ratio,
              fontWeight: '500',
              color: '#FCFCFC',
            }}>
            Download New Untuk Blok Baru
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;
