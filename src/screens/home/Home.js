import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, TouchableOpacity, Text, Dimensions, Modal} from 'react-native';
import RNFS from 'react-native-fs';
import {useFocusEffect} from '@react-navigation/native';

import {NetworkUtils} from '../../utils';

import {gStyle, route} from '../../constants';
import {StandardAlert} from '../../components';

import styles from './styles/HomeStyles';

import {API_URL} from '../../helper/helper';
import {useDispatch} from 'react-redux';

import SQLite from 'react-native-sqlcipher';
import {DownloadDropdownLabelAction} from '../../redux/actions/download_dropdown.action';
import {getLogoutData} from '../../redux/actions/logindetail.action';

const Home = ({navigation}) => {
  const theme = 'light';
  const {width, height} = Dimensions.get('window');
  const ratio = Math.min(width, height) / 375;

  const [PostData, setPostData] = useState([]);
  const [VerificationImage, setVerificationImage] = useState();
  const [TreeData, setTreeData] = useState(false);
  const [netInfo, setNetInfo] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modal, setModal] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [logout, setlogout] = useState(false);
  const [sync, setSync] = useState(true);
  const [passwordExpiryDate, setpasswordExpiryDate] = useState();
  // const [progress, setProgress] = useState(0);
  const [complete, setcomplete] = useState(false);

  const [overallProgress, setOverallProgress] = useState(0);
  const setProgress = progress => {
    setOverallProgress(progress);
  };

  const dispatch = useDispatch();

  let dbName = 'multispectral.db';
  const db = SQLite.openDatabase(
    {name: RNFS.ExternalDirectoryPath + '/' + dbName, key: '1234567890'},
    () => {},
    error => {
      console.log(error);
    },
  );
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

      checkFolderExists();

      setInterval(async () => {
        let NetworkInfo = JSON.parse(await NetworkUtils.isNetworkAvailable());
        setNetInfo(NetworkInfo);
      }, 10);
    }, []),
  );

  useEffect(() => {
    try {
      AsyncStorage.getItem('loginUserName').then(loginUser => {
        if (loginUser && loginUser !== null && loginUser !== undefined) {
          db.transaction(tx => {
            tx.executeSql(
              'SELECT DISTINCT(userName), userId, passwordDate FROM MDB_User WHERE userName = ?',
              [loginUser],
              (tx, results) => {
                var len = results.rows.length;
                var temp = '';
                if (len > 0) {
                  const now = new Date();
                  for (let i = 0; i < results.rows.length; ++i)
                    temp = results.rows.item(i)['passwordDate'];
                  const passwordDate = new Date(temp);
                  const expireDate = new Date(
                    passwordDate.getTime() + 30 * 24 * 60 * 60 * 1000,
                  );
                  const diffInMs = expireDate - now;
                  const diffInDays = Math.ceil(
                    diffInMs / (1000 * 60 * 60 * 24),
                  );
                  if (diffInDays <= 0) {
                    setlogout(true);
                  } else if (diffInDays <= 7) {
                    setModal(true);
                    setpasswordExpiryDate(diffInDays);
                  }
                }
              },
            );
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

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

  /*********** Image Missing ************* */
  const checkFolderExists = async () => {
    try {
      const folderPath = `${RNFS.ExternalDirectoryPath}/TreeImages`;
      const droneImagefolderPath = `${RNFS.ExternalDirectoryPath}/DroneImages`;
      const folderExists = await RNFS.exists(folderPath);
      const droneImagefolderExists = await RNFS.exists(droneImagefolderPath);
      if (!droneImagefolderExists) {
        await RNFS.mkdir(droneImagefolderPath);
      }
      if (!folderExists) {
        await RNFS.mkdir(folderPath);
      } else {
      }
    } catch (error) {
      console.error('Error checking folder existence:', error);
    }
  };

  /*********** Image Missing ************* */

  const synchronize = async () => {
    setIsAlertVisible(false);
    setTreeData(false);
    setVisible(true);
    let imagecount = '';

    if (VerificationImage != null && VerificationImage != '') {
      imagecount = VerificationImage.length;
    } else {
      imagecount = 0;
    }

    /************************/
    const folderPath = `${RNFS.ExternalDirectoryPath}/TreeImages`;
    // let totalRecords = PostData.length + VerificationImage.length;
    let totalRecords = PostData.length + imagecount;
    let completedTasks = 0;
    /************************/

    if (PostData != null && PostData != '') {
      for (let i = 0; i < PostData.length; i++) {
        await SendData(PostData[i]);
        completedTasks++;
        const progress = (completedTasks / totalRecords) * 100;
        setProgress(progress);
      }
    }
    if (VerificationImage != null && VerificationImage != '') {
      processFiles(folderPath, VerificationImage, completedTasks, totalRecords);
    }
    async function processFiles(
      folderPath,
      VerificationImage,
      completedTasks,
      totalRecords,
    ) {
      const files = await RNFS.readdir(folderPath);

      if (files.length > 0) {
        let processedFiles = 0;

        for (const file of files) {
          let foundInDatabase = false;

          for (let i = 0; i < VerificationImage.length; i++) {
            if (file === VerificationImage[i].filename) {
              foundInDatabase = true;
              await uploadImage(VerificationImage[i]);
              break;
            }
          }

          if (!foundInDatabase) {
            await deleteFile(folderPath, file);
            console.log(
              `${file} deleted because it does not exist in the database.`,
            );
          }

          processedFiles++;

          completedTasks++;
          const progress = (completedTasks / totalRecords) * 100;
          setProgress(progress);

          if (processedFiles === files.length) {
            await checkRemainingFiles();
          }
        }
      } else {
        console.log('No files found in the folder.');
        completedTasks += totalRecords;
        setProgress(100);
      }

      async function checkRemainingFiles() {
        const updatedFiles = await RNFS.readdir(folderPath);

        if (updatedFiles.length === 0) {
          console.log('No files left in the folder.');
          completedTasks += totalRecords;
          setProgress(100);
        } else {
          console.log('Number of remaining files:', updatedFiles.length);
          await processFiles(
            folderPath,
            VerificationImage,
            completedTasks,
            totalRecords,
          );
        }
      }
    }
    async function deleteFile(folderPath, filename) {
      const filePath = `${folderPath}/${filename}`;
      await RNFS.unlink(filePath);
    }

    setcomplete(true);
  };

  const SendData = async PostData => {
    try {
      let PostDataArray = [];
      PostDataArray.push(PostData);
      await fetch(`${API_URL}/api/mobile/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(PostDataArray),
      })
        .then(response => response.json(), setSync(true))
        .then(data => console.log(data))
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
        tx.executeSql('DROP TABLE MDB_trees', [], (tx, results) => {
          console.log('Table MDB_trees Deleted successfully');
        });
        tx.executeSql('DROP TABLE MDB_setting', [], (tx, results) => {
          console.log('Table MDB_setting Deleted successfully');
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
  const hidepasswordExpiry = () => {
    setModal(false);
  };
  const hideModal = () => {
    setVisible(false);
    setTreeData(true);
  };

  const handleConfirm = () => {
    setTreeData(false);
    setIsAlertVisible(true);
  };

  const handleCancel = () => {
    setTreeData(true);
    setIsAlertVisible(false);
  };
  const handleLogout = () => {
    setlogout(false);
    // db.transaction(tx => {
    //   tx.executeSql('DROP TABLE MDB_User', [], (tx, results) => {
    //     console.log('Table MDB_User Deleted Successfully');
    //   });
    // });
    AsyncStorage.removeItem('loginUserName');
    AsyncStorage.removeItem('login');
    AsyncStorage.removeItem('wipedData');
    AsyncStorage.removeItem('userobject');
    dispatch(getLogoutData());
    navigation.navigate('Home');
  };

  return (
    <View style={gStyle.container[theme]}>
      <View style={[styles.container]}>
        <StandardAlert
          visible={modal}
          color={'red'}
          iconname={`badge-account-alert`}
          title="Password Expiry !"
          message1={`Your password will expiry in :`}
          message2={passwordExpiryDate}
          message3={`Day(s)`}
          message4={`Please change the password in web before expire`}
          confirmOnpress={hidepasswordExpiry}
          passwordexpiry={true}
        />
        <StandardAlert
          visible={logout}
          color={'red'}
          iconname={`cellphone-lock`}
          title="Password Expired"
          message1={`Your password is expired.`}
          message3={`\nKindly change to new password.\n\nNote: if already changed, then login using new password`}
          confirmOnpress={handleLogout}
          logout={true}
        />
        <StandardAlert
          visible={isAlertVisible}
          color={'green'}
          iconname={`cellphone-cog`}
          title="Upload Data"
          message1={`Please confirm to upload all data.`}
          message3={`Note : Please change to intranet beofre uploading \nthe data. Data will not be uploaded in offline mode.`}
          confirmOnpress={synchronize}
          uploadData={true}
          cancelBtnOnpress={handleCancel}
        />
        {sync == true ? (
          // progress === 100 && complete == true ? (
          overallProgress === 100 && complete == true ? (
            <StandardAlert
              visible={visible}
              color={'green'}
              iconname={`cellphone-check`}
              title="Upload Data"
              message1={`Data berhasil di upload ke server.`}
              message3={`Note : All the data are erased from the device.\n\nPlease download the new data block to\n\nperform verifications.`}
              confirmOnpress={droptable}
              uploadData={true}
            />
          ) : (
            <StandardAlert
              visible={visible}
              color={'green'}
              title="Uploading Data"
              message1={`Upload Data ke Server.`}
              message3={`Harap tunggu sementara upload \n\nsedang berlangsung.`}
              // message2={`${Math.floor(progress)}%`}
              message2={`${Math.floor(overallProgress)}`}
              confirmOnpress={hidepasswordExpiry}
              downloadData={true}
              uploadDataProgress={true}
            />
          )
        ) : (
          <StandardAlert
            visible={visible}
            color={'red'}
            iconname={`wifi-alert`}
            title="Upload Error"
            message1={`Gagal Upload`}
            message3={`\nTidak dapat upload ke server.\n\nSilakan periksa koneksi jaringan`}
            confirmOnpress={hideModal}
            uploadData={true}
          />
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
