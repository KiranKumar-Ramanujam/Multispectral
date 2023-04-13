import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  Switch,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwitchSelector from 'react-native-switch-selector';
import {TextInput as Input} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {launchCamera} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import {MultiSelect} from 'react-native-element-dropdown';

import SQLite from 'react-native-sqlite-storage';

import moment from 'moment';

import {colors, gStyle} from '../../../constants';

import Route from '../../../constants/route.constant';

import {switchoptions} from '../../../assets/data/SwitchSelection';

import {Svg_Filter, AntDesignIcon} from '../../../icons/Icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from '../styles/ValidateStyles';

import {updateStatusAction} from '../../../redux/actions/trees.action';

const ValidateGroundTruth = ({navigation, route}) => {
  const theme = 'light';
  const {width, height} = Dimensions.get('window');
  const ratio = Math.min(width, height) / 375;

  const bgColorStyle = {
    backgroundColor: 'white',
  };
  const selectedTreeData = route.params.validate_selectedTreeData;

  const pestdisease = route.params.pestdisease;

  const currentLatitude = route.params.user_latitude;

  const currentLongitude = route.params.user_longitude;

  const accuracy = route.params.user_accuracy;

  var pill_color = {
    backgroundColor: '',
  };
  var pillColor = '';

  var greenpillcolor = {
    backgroundColor: colors.switch_icongreen,
  };
  var redpillcolor = {
    backgroundColor: colors.switch_iconred,
  };
  var svgcolor = {
    backgroundColor: route.params.validated_pillColor,
  };

  if (selectedTreeData.status == 'Healthy') {
    svgcolor = {
      backgroundColor: colors.switch_icongreen,
    };
    pill_color = {
      backgroundColor: colors.switch_icongreen,
    };
    pillColor = colors.switch_icongreen;
  } else if (selectedTreeData.status == 'Unhealthy') {
    svgcolor = {
      backgroundColor: colors.switch_iconred,
    };
    pill_color = {
      backgroundColor: colors.switch_iconred,
    };
    pillColor = colors.switch_iconred;
  }
  var switchcolor = '';

  const [userId, setuserId] = useState();
  const [verificationId, setverificationId] = useState('');

  useEffect(() => {
    try {
      // AsyncStorage.getItem('loginUserId').then(loginUserId => {
      //   if (loginUserId && loginUserId !== null && loginUserId !== undefined) {
      //     const temp = parseInt(loginUserId);
      //     setuserId(temp);
      //   }
      // });
      AsyncStorage.getItem('loginUserName').then(loginUser => {
        if (loginUser && loginUser !== null && loginUser !== undefined) {
          db.transaction(tx => {
            tx.executeSql(
              'SELECT DISTINCT(userName), userId FROM MDB_User WHERE userName = ?',
              [loginUser],
              (tx, results) => {
                var len = results.rows.length;
                if (len > 0) {
                  for (let i = 0; i < results.rows.length; ++i)
                    setuserId(results.rows.item(i)['userId']);
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
    try {
      getmanual_verification();
      setSelected(null);
      if (
        selectedTreeData.validated_remarks != null &&
        selectedTreeData.validated_remarks != '' &&
        (selectedTreeData.remarks == null || selectedTreeData.remarks == '')
      ) {
        setAddnote(selectedTreeData.validated_remarks);
        setSwitchValue(true);
      }
      if (Addnote != null && Addnote != '') {
        setSwitchValue(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getmanual_verification = () => {
    try {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM MDB_manual_verification',
          [],
          (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {
              setverificationId(len);
            }
          },
        );

        tx.executeSql(
          'SELECT DISTINCT l.treeId, v.filename AS filename ,v.uploadPath AS uri FROM MDB_trees l LEFT JOIN MDB_manual_verification r ON l.predictionId = r.predictionId LEFT JOIN MDB_verification_image v ON v.verificationId = r.verificationId where l.treeId =? AND v.uploadPath is NOT NULL',
          [selectedTreeData.treeId],
          (tx, results) => {
            var temp = [];
            var len = results.rows.length;
            if (len > 0) {
              for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
              setImage(temp);
            }
          },
        );

        if (
          selectedTreeData.validated_pestDiseaseId != null &&
          selectedTreeData.validated_pestDiseaseId != '' &&
          (selectedTreeData.pestDiseaseId == null ||
            selectedTreeData.pestDiseaseId == '')
        ) {
          tx.executeSql(
            // 'SELECT DISTINCT l.treeId, l.predictionId, r.verificationId, p.pestdiseaseId AS pestdiseaseId, p.pestdiseaseName FROM MDB_trees l LEFT JOIN MDB_manual_verification r ON l.predictionId = r.predictionId LEFT JOIN MDB_manualverification_pest_disease p ON p.verificationId = r.verificationId where l.treeId =? AND p.pestDiseaseId is NOT NULL GROUP BY p.pestDiseaseId',
            `SELECT DISTINCT treeId, validated_pestDiseaseId AS pestdiseaseId FROM MDB_trees  where treeId =? AND validated_pestDiseaseId is NOT NULL GROUP BY validated_pestDiseaseId`,
            [selectedTreeData.treeId],
            (tx, results) => {
              var temp = [];
              var temp2 = [];
              var len = results.rows.length;
              if (len > 0) {
                for (let i = 0; i < results.rows.length; ++i)
                  temp.push(results.rows.item(i)['pestdiseaseId']);
                setSelected(temp);
                setSelected_exist(temp);

                for (let i = 0; i < results.rows.length; ++i)
                  // if (results.rows.item(i)['pestdiseaseId'] != null) {
                  //   temp2.push(results.rows.item(i)['verificationId']);
                  // }
                  // setSelected_delete(temp2);
                  tx.executeSql(
                    'SELECT pestDiseaseId AS id, pestDiseaseName AS name FROM MDB_pest_disease',
                    [],
                    (tx, results) => {
                      var temp3 = [];
                      var len = results.rows.length;
                      if (len > 0) {
                        for (let i = 0; i < results.rows.length; ++i)
                          temp3.push(results.rows.item(i));
                        if (temp3 != null && temp3 != '') {
                          const newArray = temp3.filter(item =>
                            temp.includes(item.id),
                          );
                          const newArray2 = newArray.map(item => {
                            return item.name;
                          });
                          setValue(newArray2);
                          setvalue_exist(newArray2);
                        }
                      }
                    },
                  );
              } else {
                setSelected(temp);
              }
            },
          );
        } else if (
          selectedTreeData.validated_pestDiseaseId == null ||
          selectedTreeData.validated_pestDiseaseId == '' ||
          (selectedTreeData.validated_pestDiseaseId != null &&
            selectedTreeData.pestDiseaseId != null &&
            selectedTreeData.pestDiseaseId != '')
        ) {
          tx.executeSql(
            'SELECT DISTINCT l.treeId, l.predictionId, r.verificationId, p.pestdiseaseId AS pestdiseaseId, p.pestdiseaseName FROM MDB_trees l LEFT JOIN MDB_manual_verification r ON l.predictionId = r.predictionId LEFT JOIN MDB_manualverification_pest_disease p ON p.verificationId = r.verificationId where l.treeId =? AND p.pestDiseaseId is NOT NULL GROUP BY p.pestDiseaseId',
            [selectedTreeData.treeId],
            (tx, results) => {
              var temp = [];
              var temp2 = [];
              var len = results.rows.length;
              if (selectedTreeData.status != 'Healthy') {
                if (len > 0) {
                  for (let i = 0; i < results.rows.length; ++i)
                    temp.push(results.rows.item(i)['pestdiseaseId']);
                  setSelected(temp);
                  setSelected_exist(temp);

                  for (let i = 0; i < results.rows.length; ++i)
                    if (results.rows.item(i)['pestdiseaseId'] != null) {
                      temp2.push(results.rows.item(i)['verificationId']);
                    }
                  setSelected_delete(temp2);
                  tx.executeSql(
                    'SELECT pestDiseaseId AS id, pestDiseaseName AS name FROM MDB_pest_disease',
                    [],
                    (tx, results) => {
                      var temp3 = [];
                      var len = results.rows.length;
                      if (len > 0) {
                        for (let i = 0; i < results.rows.length; ++i)
                          temp3.push(results.rows.item(i));
                        if (temp3 != null && temp3 != '') {
                          const newArray = temp3.filter(item =>
                            temp.includes(item.id),
                          );
                          const newArray2 = newArray.map(item => {
                            return item.name;
                          });
                          setValue(newArray2);
                          setvalue_exist(newArray2);
                        }
                      }
                    },
                  );
                } else {
                  setSelected(temp);
                }
              } else {
                setSelected(temp);
              }
            },
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  var initialswitch = 0;

  const [status, setstatus] = useState();

  if (status == 'Healthy') {
    switchcolor = colors.switch_icongreen;
  } else if (status == 'Unhealthy') {
    switchcolor = colors.switch_iconred;
  } else {
    if (status == null) {
      if (selectedTreeData.prediction == 'healthy') {
        if (
          selectedTreeData.status == 'Unhealthy' ||
          selectedTreeData.validated_status == 'Unhealthy'
        ) {
          initialswitch = 1;
          switchcolor = colors.switch_iconred;
        } else {
          initialswitch = 0;
          switchcolor = colors.switch_icongreen;
        }
      }

      if (selectedTreeData.prediction == 'unhealthy') {
        if (
          selectedTreeData.status == 'Healthy' ||
          selectedTreeData.validated_status == 'Healthy'
        ) {
          initialswitch = 0;
          switchcolor = colors.switch_icongreen;
        } else {
          initialswitch = 1;
          switchcolor = colors.switch_iconred;
        }
      }
    }
  }

  const [selected, setSelected] = useState([]);
  const [selected_exist, setSelected_exist] = useState([]);
  const [value, setValue] = useState([]);
  const [value_exist, setvalue_exist] = useState([]);
  const [selecte_delete, setSelected_delete] = useState();

  const renderDataItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.name}</Text>
        {selected.map((item2, index) => {
          if (item2 == item.id) {
            return (
              <MaterialCommunityIcons
                key={index}
                color={colors.marker_green}
                name="check"
                size={25 * ratio}
              />
            );
          }
        })}
      </View>
    );
  };

  const onSelectedItemsChange = test => {
    if (pestdisease != null && pestdisease != '') {
      const newArray = pestdisease.filter(item => test.includes(item.id));

      const newArray2 = newArray.map(item => {
        return item.name;
      });
      setValue(newArray2);
    }
  };

  const [image, setImage] = useState([]);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 0.5,
      videoQuality: 'low',
      durationLimit: 30,
      saveToPhotos: false,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, async response => {
        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }

        const now = new Date();
        const dateString =
          now.getFullYear() +
          '-' +
          (now.getMonth() + 1) +
          '-' +
          now.getDate() +
          '_' +
          now.getHours() +
          '-' +
          now.getMinutes() +
          '-' +
          now.getSeconds();
        const filename =
          selectedTreeData.estateId +
          '_' +
          selectedTreeData.afdelingId +
          '_' +
          selectedTreeData.blockId +
          '_' +
          selectedTreeData.treeId +
          '_' +
          dateString +
          '.jpg';
        const path = RNFS.ExternalDirectoryPath + filename;
        try {
          await RNFS.moveFile(response.assets[0].uri, path);
          setImage(image => [
            ...image,
            {
              filename: filename,
              uri: path,
            },
          ]);
        } catch (error) {
          console.log(error);
        }
      });
    }
  };

  deletethefile = item => {
    try {
      if (image != null && image != '') {
        const updatedImages = image.filter(image => image.uri !== item);
        setImage(updatedImages);
        RNFS.unlink(`file://${item}`);
        try {
          db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM MDB_verification_image WHERE uploadPath = ?',
              [item],
              (tx, results) => {
                var len = results.rows.length;
                if (len > 0) {
                  tx.executeSql(
                    'DELETE FROM MDB_verification_image WHERE uploadPath = ?',
                    [item],
                    (tx, results) => {
                      if (results.rowsAffected > 0) {
                      } else alert('Deletion Failed');
                    },
                  );
                }
              },
            );
          });
        } catch (error) {
          console.log(error);
        }
      }
    } catch (e) {
      console.log('e', e);
    }
  };

  const [Addnote, setAddnote] = useState(selectedTreeData.remarks);

  const [switchValue, setSwitchValue] = useState(false);

  toggleSwitch = value => {
    setSwitchValue(value);
  };

  const dispatch = useDispatch();

  updatestatus = async () => {
    if (value != null || status == 'Healthy') {
      if (selectedTreeData.length == 0) {
        Alert.alert('Information!', 'No Updates Made.');
      } else {
        try {
          await db.transaction(async tx => {
            var date = moment().format('YYYY/MM/DD hh:mm:ss a');
            let temp_addnote = '';
            if (status != '' && status != null) {
              if (status == 'Healthy') {
                temp_addnote = '';
              } else {
                temp_addnote = Addnote;
              }
              await tx.executeSql(
                'INSERT INTO MDB_manual_verification (predictionId, userId, datetime, status, remarks, user_latitude, user_longitude, accuracy, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)',
                [
                  selectedTreeData.predictionId,
                  userId,
                  date,
                  status,
                  temp_addnote,
                  currentLatitude,
                  currentLongitude,
                  accuracy,
                  date,
                  date,
                ],
              );
            } else if (status == undefined) {
              let temp_status = '';
              if (selectedTreeData.prediction == 'healthy') {
                temp_status = 'Healthy';
              } else {
                temp_status = 'Unhealthy';
              }
              await tx.executeSql(
                'INSERT INTO MDB_manual_verification (predictionId, userId, datetime, status, remarks, user_latitude, user_longitude, accuracy, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)',
                [
                  selectedTreeData.predictionId,
                  userId,
                  date,
                  temp_status,
                  Addnote,
                  currentLatitude,
                  currentLongitude,
                  accuracy,
                  date,
                  date,
                ],
              );
            } else {
              await tx.executeSql(
                'INSERT INTO MDB_manual_verification (predictionId, userId, datetime, status, remarks, user_latitude, user_longitude, accuracy, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)',
                [
                  selectedTreeData.predictionId,
                  userId,
                  date,
                  selectedTreeData.status,
                  Addnote,
                  currentLatitude,
                  currentLongitude,
                  accuracy,
                  date,
                  date,
                ],
              );
            }

            if (image != null && image != '') {
              for (let i = 0; i < image.length; i++) {
                await tx.executeSql(
                  'INSERT INTO MDB_verification_image (verificationId, userId, filename, uploadPath, uploadDate,  description, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?)',
                  [
                    verificationId + 1,
                    userId,
                    image[i].filename,
                    image[i].uri,
                    date,
                    '',
                    date,
                    date,
                  ],
                );
              }
            }

            selected.forEach((data, index) => {
              tx.executeSql(
                'SELECT DISTINCT l.treeId, l.predictionId, r.verificationId, p.pestdiseaseId AS pestdiseaseId, p.pestdiseaseName FROM MDB_trees l LEFT JOIN MDB_manual_verification r ON l.predictionId = r.predictionId LEFT JOIN MDB_manualverification_pest_disease p ON p.verificationId = r.verificationId where l.treeId =? AND p.pestDiseaseId = ?',
                [selectedTreeData.treeId, data],
                (tx, results) => {
                  if (results.rows.length > 0) {
                  } else {
                    tx.executeSql(
                      'INSERT INTO MDB_manualverification_pest_disease (verificationId, pestDiseaseId, pestDiseaseName, createdAt, updatedAt) VALUES (?,?,?,?,?)',
                      [verificationId + 1, data, value[index], date, date],
                      (tx, results) => {
                        console.log(`${data} inserted`);
                      },
                      error => {
                        console.log(`Error inserting ${data}:`, error);
                      },
                    );
                  }
                },
                error => {
                  console.log(`Error checking ${data}:`, error);
                },
              );
            });

            if (selecte_delete != null && selecte_delete != '') {
              const query2 = `DELETE FROM MDB_manualverification_pest_disease WHERE pestDiseaseId NOT IN (${selected}) AND verificationId IN (${selecte_delete})`;
              tx.executeSql(query2, (tx, results) => {
                if (results.rowsAffected > 0) {
                } else alert('Deletion Failed');
              });
            }
          });
        } catch (error) {
          console.log(error);
        }

        if (image != null && image != '') {
          var image_uri = JSON.stringify(image);
          if (value != null && value != '' && value != value_exist) {
            var reason_all = JSON.stringify(value);
          } else {
            var reason_all = value_exist;
          }
          if (status != null && status != '' && status != undefined) {
            var updated_status = status;
          } else if (status == null || status == '') {
            if (
              selectedTreeData.status != null &&
              selectedTreeData.status != ''
            ) {
              var updated_status = selectedTreeData.status;
            }
          }
          dispatch(
            updateStatusAction(
              selectedTreeData.treeId,
              updated_status,
              reason_all,
              Addnote,
              image_uri,
            ),
          );
        } else {
          if (value != null && value != '' && value != value_exist) {
            var reason_all = JSON.stringify(value);
          } else {
            var reason_all = value_exist;
          }
          if (status != null && status != '') {
            var updated_status = status;
          }
          if (status == null || status == '') {
            if (
              selectedTreeData.status != null &&
              selectedTreeData.status != ''
            ) {
              var updated_status = selectedTreeData.status;
            }
          }
          dispatch(
            updateStatusAction(
              selectedTreeData.treeId,
              updated_status,
              reason_all,
              Addnote,
              image,
            ),
          );
        }
      }
    }
  };

  return (
    <ScrollView style={gStyle.container[theme]}>
      <View style={gStyle.container[theme]}>
        <View style={[styles.pop_container, bgColorStyle]}>
          <View style={[styles.pop_container_topsection]}>
            <View style={styles.popinnerContainer}>
              <View style={[styles.container, styles.poparrange_left]}>
                {selectedTreeData.status == '' ||
                (selectedTreeData.status == null &&
                  selectedTreeData.validated_status == null) ? (
                  selectedTreeData.prediction == 'healthy' ? (
                    <Svg_Filter
                      viewBox={'0 0 68 68'}
                      color={colors.switch_icongreen}
                    />
                  ) : (
                    <Svg_Filter
                      viewBox={'0 0 68 68'}
                      color={colors.switch_iconred}
                    />
                  )
                ) : (
                  <Svg_Filter
                    viewBox={'0 0 68 68'}
                    color={colors.switch_iconblue}
                  />
                )}
              </View>
              <View style={[styles.poparrange_right]}>
                <Text style={styles.poplabel}>ID</Text>
                <Text style={styles.popid}>{selectedTreeData.treeId}</Text>
              </View>
              <View style={styles.pop_attributecontainer}>
                <View style={styles.pop_attributecontainer2}>
                  <Text style={[styles.poplabel]}>Prediction</Text>
                  {selectedTreeData.prediction == 'healthy' ? (
                    <Pressable
                      style={[styles.poppredicted_button, greenpillcolor]}>
                      <Text style={[styles.popstatus_text]}>
                        {selectedTreeData.prediction}
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={[styles.poppredicted_button, redpillcolor]}>
                      <Text style={[styles.popstatus_text]}>
                        {selectedTreeData.prediction}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
              <View style={styles.pop_attributecontainer}>
                <View style={styles.pop_attributecontainer3}>
                  <Text style={[styles.poplabel]}>Validation</Text>
                  {selectedTreeData.status != null ? (
                    <Pressable style={[styles.popvalidated_button, svgcolor]}>
                      <Text style={[styles.status_text]}>
                        {selectedTreeData.status}
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={[
                        styles.popvalidated_button,
                        styles.notvalidated_pill,
                      ]}>
                      <Text style={[styles.notvalidated_text]}>
                        Not Validated
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.popinnerContainer}>
              <View style={styles.pop_attributecontainer}>
                <View style={styles.pop_attributecontainer4}>
                  <Text style={[styles.poplabel]}>Estate</Text>
                  <Text style={[styles.popvalue]}>
                    {selectedTreeData.estateName}
                  </Text>
                </View>
              </View>
              <View style={styles.pop_attributecontainer}>
                <Text style={[styles.poplabel]}>Afdel</Text>
                <Text style={[styles.popvalue]}>
                  {selectedTreeData.afdelingName}
                </Text>
              </View>
              <View style={styles.pop_attributecontainer}>
                <Text style={[styles.poplabel]}>Block</Text>
                <Text style={[styles.popvalue]}>
                  {selectedTreeData.blockName}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.modal_status}>
            <Text
              style={{
                fontSize: 19 * ratio,
                fontWeight: 'bold',
                color: colors.black,
              }}>
              Predicted Status
            </Text>
          </View>

          <View style={styles.innerContainer}>
            <View style={styles.modal_status}>
              <Text
                style={{
                  fontSize: 17 * ratio,
                  fontWeight: 'bold',
                  color: colors.black,
                }}>
                Status
              </Text>
            </View>

            <View style={styles.switch_button}>
              <SwitchSelector
                options={switchoptions}
                initial={initialswitch}
                fontSize={16 * ratio}
                buttonColor={switchcolor}
                selectedColor={colors.white}
                borderRadius={4 * ratio}
                borderColor={colors.grey2}
                textColor={colors.black}
                hasPadding={true}
                bold
                height={39 * ratio}
                onPress={value => setstatus(value)}
              />
            </View>
          </View>

          {status == 'Unhealthy' || initialswitch == 1 ? (
            <View style={styles.container}>
              <View style={styles.innerContainer}>
                <View style={styles.modal_status}>
                  <Text
                    style={{
                      fontSize: 16 * ratio,
                      fontWeight: 'bold',
                      color: colors.black,
                    }}>
                    Reason
                  </Text>
                </View>
                <View style={styles.dropdown_container}>
                  <MultiSelect
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={pestdisease}
                    activeColor="white"
                    labelField="name"
                    valueField="id"
                    value={selected}
                    placeholder={
                      selected != null && selected != ''
                        ? `${selected.length} selected`
                        : 'Select Reason'
                    }
                    search
                    searchPlaceholder="Search..."
                    onChange={item => {
                      setSelected(item);
                      onSelectedItemsChange(item);
                    }}
                    renderItem={renderDataItem}
                    renderSelectedItem={(item, unSelect) => (
                      <TouchableOpacity
                        onPress={() =>
                          unSelect && unSelect(item)
                        }></TouchableOpacity>
                    )}
                  />
                </View>
              </View>

              {image != null && image != '' ? (
                <View>
                  {image.length == 3 ? (
                    <View style={styles.innerContainer3}>
                      <View style={styles.modal_status}>
                        <Text
                          style={{
                            fontSize: 16 * ratio,
                            fontWeight: 'bold',
                            color: colors.black,
                          }}>
                          Upload
                        </Text>
                      </View>
                      <View style={styles.switch_button}>
                        <TouchableOpacity
                          activeOpacity={0}
                          style={styles.touchableopacity_buttonStyle}
                          onPress={() => captureImage('photo')}
                          disabled={true}>
                          <View style={styles.touchableopacity}>
                            <MaterialCommunityIcons
                              color={'#75787C'}
                              name="camera-off"
                              size={23 * ratio}
                            />
                            <Text style={styles.touchableopacity_text}>
                              Maximum image taken
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>

                      <View>
                        {image.map((item, index) => {
                          if (item.uri != null && item.uri != '') {
                            return (
                              <View key={index}>
                                <View style={styles.uploadinnerContainer_3}>
                                  <Image
                                    source={{uri: `file://${item.uri}`}}
                                    style={styles.imageStyle}
                                  />
                                  <Text style={styles.textStyle}>
                                    Image {index + 1}
                                  </Text>
                                  <AntDesignIcon
                                    name="closecircle"
                                    style={styles.popclosebutton}
                                    size={23 * ratio}
                                    color={'#FB4E4E'}
                                    onPress={() => deletethefile(item.uri)}
                                  />
                                </View>
                              </View>
                            );
                          }
                        })}
                      </View>
                    </View>
                  ) : (
                    <View>
                      {image.length == 2 ? (
                        <View style={styles.innerContainer2}>
                          <View style={styles.modal_status}>
                            <Text
                              style={{
                                fontSize: 16 * ratio,
                                fontWeight: 'bold',
                                color: colors.black,
                              }}>
                              Upload
                            </Text>
                          </View>
                          <View style={styles.switch_button}>
                            <TouchableOpacity
                              activeOpacity={0}
                              style={styles.touchableopacity_buttonStyle}
                              onPress={() => captureImage('photo')}>
                              <View style={styles.touchableopacity}>
                                <AntDesignIcon
                                  name="camera"
                                  size={23 * ratio}
                                  color={colors.marker_green}
                                />
                                <Text style={styles.touchableopacity_text}>
                                  Upload Image
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>

                          <View>
                            {image.map((item, index) => {
                              if (item.uri != null && item.uri != '') {
                                return (
                                  <View key={index}>
                                    <View style={styles.uploadinnerContainer_2}>
                                      <Image
                                        source={{uri: `file://${item.uri}`}}
                                        style={styles.imageStyle}
                                      />
                                      <Text style={styles.textStyle}>
                                        Image {index + 1}
                                      </Text>
                                      <AntDesignIcon
                                        name="closecircle"
                                        style={styles.popclosebutton}
                                        size={23 * ratio}
                                        color={'#FB4E4E'}
                                        onPress={() => deletethefile(item.uri)}
                                      />
                                    </View>
                                  </View>
                                );
                              }
                            })}
                          </View>
                        </View>
                      ) : (
                        <View>
                          {image.length == 1 ? (
                            <View style={styles.innerContainer1}>
                              <View style={styles.modal_status}>
                                <Text
                                  style={{
                                    fontSize: 17 * ratio,
                                    fontWeight: 'bold',
                                    color: colors.black,
                                  }}>
                                  Upload
                                </Text>
                              </View>
                              <View style={styles.switch_button}>
                                <TouchableOpacity
                                  activeOpacity={0}
                                  style={styles.touchableopacity_buttonStyle}
                                  onPress={() => captureImage('photo')}>
                                  <View style={styles.touchableopacity}>
                                    <AntDesignIcon
                                      name="camera"
                                      size={23 * ratio}
                                      color={colors.marker_green}
                                    />
                                    <Text style={styles.touchableopacity_text}>
                                      Upload Image
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              </View>

                              <View>
                                {image.map((item, index) => {
                                  if (item.uri != null && item.uri != '') {
                                    return (
                                      <View key={index}>
                                        <View
                                          style={styles.uploadinnerContainer_1}>
                                          <Image
                                            source={{uri: `file://${item.uri}`}}
                                            style={styles.imageStyle}
                                          />
                                          <Text style={styles.textStyle}>
                                            Image {index + 1}
                                          </Text>
                                          <AntDesignIcon
                                            name="closecircle"
                                            style={styles.popclosebutton}
                                            size={23 * ratio}
                                            color={'#FB4E4E'}
                                            onPress={() =>
                                              deletethefile(item.uri)
                                            }
                                          />
                                        </View>
                                      </View>
                                    );
                                  }
                                })}
                              </View>
                            </View>
                          ) : (
                            <View style={styles.innerContainer}>
                              <View style={styles.modal_status}>
                                <Text
                                  style={{
                                    fontSize: 17 * ratio,
                                    fontWeight: 'bold',
                                    color: colors.black,
                                  }}>
                                  Upload
                                </Text>
                              </View>
                              <View style={styles.switch_button}>
                                <TouchableOpacity
                                  activeOpacity={0}
                                  style={styles.touchableopacity_buttonStyle}
                                  onPress={() => captureImage('photo')}>
                                  <View style={styles.touchableopacity}>
                                    <AntDesignIcon
                                      name="camera"
                                      size={23 * ratio}
                                      color={'#75787C'}
                                    />
                                    <Text style={styles.touchableopacity_text}>
                                      Upload Image
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              </View>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.innerContainer}>
                  <View style={styles.modal_status}>
                    <Text
                      style={{
                        fontSize: 17 * ratio,
                        fontWeight: 'bold',
                        color: colors.black,
                      }}>
                      Upload
                    </Text>
                  </View>
                  <View style={styles.switch_button}>
                    <TouchableOpacity
                      activeOpacity={0}
                      style={styles.touchableopacity_buttonStyle}
                      onPress={() => captureImage('photo')}>
                      <View style={styles.touchableopacity}>
                        <AntDesignIcon
                          name="camera"
                          size={23 * ratio}
                          color={'#75787C'}
                        />
                        <Text style={styles.touchableopacity_text}>
                          Upload Image
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {image != null && image != '' ? (
                <View>
                  {image.length == 1 ? (
                    <View style={{paddingVertical: 50 * ratio}}></View>
                  ) : (
                    <View>
                      {image.length == 2 ? (
                        <View style={{paddingVertical: 50 * ratio}}></View>
                      ) : (
                        <View>
                          {image.length == 3 ? (
                            <View style={{paddingVertical: 40 * ratio}}></View>
                          ) : null}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ) : null}

              <View style={styles.innerContainer}>
                <View style={styles.modal_status}>
                  <Text
                    style={{
                      fontSize: 16 * ratio,
                      fontWeight: 'bold',
                      color: colors.black,
                    }}>
                    Add Note
                  </Text>
                </View>
                <View style={styles.toggle_button}>
                  <Switch
                    trackColor={{
                      false: colors.switchbtn,
                      true: colors.switchbtn,
                    }}
                    thumbColor={
                      switchValue === true
                        ? colors.greenColor
                        : colors.switchbtn2
                    }
                    onValueChange={toggleSwitch}
                    value={switchValue}
                  />
                </View>
              </View>

              {switchValue ? (
                <View style={styles.input_container}>
                  <Input
                    mode="outlined"
                    style={styles.input}
                    keyboardType="email-address"
                    multiline={true}
                    value={Addnote}
                    onChangeText={text => setAddnote(text)}></Input>
                </View>
              ) : null}
            </View>
          ) : null}

          {image != null && image != '' ? (
            <View style={styles.container}>
              <View style={{paddingVertical: 46 * ratio}}></View>

              {/* <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  updatestatus();
                  navigation.navigate(Route.MAP, {});
                }}>
                <Text style={styles.buttontext}>Validate Ground Truth</Text>
              </Pressable> */}

              <Pressable
                // style={[styles.button, styles.buttonClose]}
                style={{
                  borderRadius: 5 * ratio,
                  padding: 10 * ratio,
                  top: 180 * ratio,
                  width: '100%',
                  height: 44 * ratio,
                  backgroundColor:
                    (Addnote != null && Addnote != '') ||
                    (selected != null && selected != '') ||
                    (status == undefined &&
                      selectedTreeData.prediction == 'healthy') ||
                    status == 'Healthy'
                      ? '#33a02c'
                      : 'gray',
                }}
                onPress={() => {
                  updatestatus();
                  navigation.navigate(Route.MAP, {});
                }}
                disabled={
                  (Addnote != null && Addnote != '') ||
                  (selected != null && selected != '') ||
                  (status == undefined &&
                    selectedTreeData.prediction == 'healthy') ||
                  status == 'Healthy'
                    ? false
                    : true
                }>
                <Text style={styles.buttontext}>Save</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.container}>
              {/* <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  updatestatus();
                  navigation.navigate(Route.MAP, {});
                }}>
                <Text style={styles.buttontext}>Validate Ground Truth</Text>
              </Pressable> */}
              <Pressable
                // style={[styles.button, styles.buttonClose]}
                style={{
                  borderRadius: 5 * ratio,
                  padding: 10 * ratio,
                  top: 180 * ratio,
                  width: '100%',
                  height: 44 * ratio,
                  backgroundColor:
                    (Addnote != null && Addnote != '') ||
                    (selected != null && selected != '') ||
                    (status == undefined &&
                      selectedTreeData.prediction == 'healthy') ||
                    status == 'Healthy'
                      ? '#33a02c'
                      : 'gray',
                }}
                onPress={() => {
                  updatestatus();
                  navigation.navigate(Route.MAP, {});
                }}
                disabled={
                  (Addnote != null && Addnote != '') ||
                  (selected != null && selected != '') ||
                  (status == undefined &&
                    selectedTreeData.prediction == 'healthy') ||
                  status == 'Healthy'
                    ? false
                    : true
                }>
                <Text style={styles.buttontext}>Save</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ValidateGroundTruth;
