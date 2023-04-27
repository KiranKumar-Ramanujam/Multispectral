import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Alert,
  TouchableOpacity,
  Text,
  Dimensions,
  Modal,
} from 'react-native';
import RNFS from 'react-native-fs';
import {useFocusEffect} from '@react-navigation/native';

import {NetworkUtils} from '../../utils';

import {gStyle, route, colors} from '../../constants';
import {CustomAlert} from '../../components';

import styles from './styles/HomeStyles';

import {API_URL} from '../../helper/helper';
import {useDispatch} from 'react-redux';

import SQLite from 'react-native-sqlite-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {DownloadDropdownLabelAction} from '../../redux/actions/download_dropdown.action';

const Home = ({navigation}) => {
  const theme = 'light';
  const {width, height} = Dimensions.get('window');
  const ratio = Math.min(width, height) / 375;

  const [PostData, setPostData] = useState([]);
  const [VerificationImage, setVerificationImage] = useState();
  const [TreeData, setTreeData] = useState(false);
  const [netInfo, setNetInfo] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [sync, setSync] = useState(true);

  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      const checkTableExists = tableName => {
        return new Promise((resolve, reject) => {
          db.transaction(tx => {
            tx.executeSql(
              `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
              [tableName],
              (_, result) => {
                if (result.rows.length > 0) {
                  resolve(true);
                } else {
                  resolve(false);
                }
              },
              (_, error) => {
                reject(error);
              },
            );
          });
        });
      };

      checkTableExists('MDB_manual_verification')
        .then(exists => {
          if (exists) {
          } else {
            setTreeData(false);
            setPostData(null);
            setVerificationImage(null);
          }
        })
        .catch(error => {
          console.log('Error while checking table existence:', error);
        });

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
            } else {
              setTreeData(false);
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

  const getuploadData = () => {
    try {
      let jsonArray = [];
      db.transaction(tx => {
        tx.executeSql(
          'SELECT verificationId, predictionId, userId, datetime, status, remarks, user_latitude, user_longitude,accuracy FROM MDB_manual_verification',
          // 'SELECT  max(verificationId) AS verificationId, predictionId, userId, datetime, status, remarks, user_latitude, user_longitude,accuracy FROM MDB_manual_verification GROUP BY predictionId',
          [],
          (tx, results) => {
            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i);
              const jsonObject = {
                predictionId: row.predictionId,
                userId: row.userId,
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
                      uploadPath: `D:/multispectral-file/verification_image/${childRow.filename}`,
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
    setIsAlertVisible(false);
    setTreeData(false);
    if (PostData != null && PostData != '') {
      await SendData(PostData);
    }
    if (VerificationImage != null && VerificationImage != '') {
      for (let i = 0; i < VerificationImage.length; i++) {
        await uploadImage(VerificationImage[i]);
      }
    }
    setVisible(true);
  };

  const SendData = async PostData => {
    try {
      await fetch(`${API_URL}/api/mobile/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(PostData),
      })
        .then(response => response.json(), setSync(true))
        .then(data => console.log(data))
        // .catch(error => Alert.alert(`ERROR .${error}`));
        .catch(error => setSync(false));
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

  const droptable = async => {
    try {
      setVisible(false);
      setTreeData(false);
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

      db.transaction(tx => {
        tx.executeSql(
          'DROP TABLE MDB_verification_image',
          [],
          (tx, results) => {
            console.log('Table MDB_verification_image Deleted Successfully');
          },
        );
      });
      dispatch(DownloadDropdownLabelAction('', '', '', '', ''));
    } catch (error) {
      console.log('Error in Deleting data :', error);
    }
  };

  const hideModal = () => {
    setVisible(false);
    setTreeData(true);
  };

  const handleConfirm = () => {
    setIsAlertVisible(true);
  };

  const handleCancel = () => {
    setIsAlertVisible(false);
  };

  return (
    <View style={gStyle.container[theme]}>
      <View style={[styles.container]}>
        <CustomAlert
          visible={isAlertVisible}
          title="Information !"
          message={`Are you sure you want to Upload all data to server. \n\n Note: Please change to intranet before uploading data`}
          onConfirm={synchronize}
          onCancel={handleCancel}
        />
        {sync == true ? (
          <View>
            <Modal visible={visible} transparent={true} animationType="fade">
              <View style={styles.popcontainer}>
                <View style={styles.alertBox}>
                  <Text style={styles.title}>Upload Data</Text>
                  <View style={styles.innerContainer2}>
                    <Text
                      style={{
                        fontSize: 12 * ratio,
                        alignSelf: 'flex-start',
                        color: 'black',
                      }}>
                      {`Data berhasil di upload ke server.`}
                    </Text>
                    <MaterialCommunityIcons
                      name="cellphone-check"
                      size={60 * ratio}
                      color={'#10B981'}
                      style={{
                        left: 10 * ratio,
                        bottom: 40 * ratio,
                      }}
                    />
                  </View>
                  <View style={styles.popbuttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, styles.popconfirmButton]}
                      onPress={droptable}>
                      <Text style={styles.popbuttonText}>Kembali</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        ) : (
          <View>
            <Modal visible={visible} transparent={true} animationType="fade">
              <View style={styles.popcontainer}>
                <View style={styles.alertBox_error}>
                  <Text style={styles.poptitle}>Error !</Text>
                  <View style={styles.innerContainer2}>
                    <Text
                      style={{
                        fontSize: 14 * ratio,
                        alignSelf: 'flex-start',
                        color: 'black',
                        top: 5 * ratio,
                      }}>
                      {`Unable to upload to server. \n\nPlease check the Network Connection.`}
                    </Text>
                    <Entypo
                      name="warning"
                      size={45 * ratio}
                      color={'#C80000'}
                      style={{
                        right: 40 * ratio,
                        bottom: 50 * ratio,
                      }}
                    />
                  </View>
                  <View style={styles.popbuttonContainer_error}>
                    <TouchableOpacity
                      style={[styles.button, styles.popconfirmButton_error]}
                      onPress={hideModal}>
                      <Text style={styles.popbuttonText}>Kembali</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}

        <TouchableOpacity
          style={{
            color: '#000000',
            height: 44 * ratio,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            marginBottom: 14 * ratio,
            backgroundColor: TreeData && netInfo ? '#009D57' : 'gray',
            borderColor: TreeData && netInfo ? '#009D57' : 'gray',
          }}
          disabled={TreeData && netInfo ? false : true}
          onPress={() => handleConfirm()}>
          <Text
            style={{
              fontSize: 16.7 * ratio,
              fontWeight: '500',
              color: '#FCFCFC',
            }}>
            Upload Data
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
            Download Data Untuk Blok Baru
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
