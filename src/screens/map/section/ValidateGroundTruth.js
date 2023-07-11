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
import SwitchSelector from 'react-native-switch-selector';
import {TextInput as Input} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {launchCamera} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import {MultiSelect} from 'react-native-element-dropdown';
import SQLite from 'react-native-sqlcipher';
import moment from 'moment';
import {colors, gStyle} from '../../../constants';
import {Toaster} from '../../../components';
import Route from '../../../constants/route.constant';
import {switchoptions} from '../../../assets/data/SwitchSelection';
import {Svg_Filter, AntDesignIcon} from '../../../icons/Icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/ValidateStyles';
import {updateStatusAction} from '../../../redux/actions/trees.action';
import {getPreciseDistance} from 'geolib';

const ValidateGroundTruth = ({navigation, route}) => {
  const theme = 'light';
  const {width, height} = Dimensions.get('window');
  const ratio = Math.min(width, height) / 375;

  const bgColorStyle = {
    backgroundColor: 'white',
  };
  const selectedTreeData = route.params.validate_selectedTreeData;

  const pestdisease = route.params.pestdisease;

  const userId = route.params.user_Id;

  const currentLatitude = route.params.user_latitude;

  const currentLongitude = route.params.user_longitude;

  const accuracy = route.params.user_accuracy;
  const [validate, setvalidate] = useState(false);

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
  } else if (selectedTreeData.validated_status == 'Healthy') {
    svgcolor = {
      backgroundColor: colors.switch_icongreen,
    };
    pill_color = {
      backgroundColor: colors.switch_icongreen,
    };
    pillColor = colors.switch_icongreen;
  } else if (selectedTreeData.validated_status == 'Unhealthy') {
    svgcolor = {
      backgroundColor: colors.switch_iconred,
    };
    pill_color = {
      backgroundColor: colors.switch_iconred,
    };
    pillColor = colors.switch_iconred;
  }
  var switchcolor = '';

  const [verificationId, setverificationId] = useState('');

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
      db.transaction(tx => {
        tx.executeSql(
          'SELECT proximity FROM MDB_setting WHERE blockId = ? LIMIT 1',
          [selectedTreeData.blockId],
          (tx, results) => {
            var temp = [];
            var len = results.rows.length;
            if (len > 0) {
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i)['proximity']);
              }
              var pdis = getPreciseDistance(
                {
                  latitude: parseFloat(currentLatitude),
                  longitude: parseFloat(currentLongitude),
                },
                {
                  latitude: parseFloat(selectedTreeData.latitude),
                  longitude: parseFloat(selectedTreeData.longitude),
                },
                1,
              );

              if (pdis <= temp[0]) {
                setvalidate(true);
              } else {
                setvalidate(false);
              }
            } else {
            }
          },
        );
      });
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
          'SELECT DISTINCT l.treeId, r.status AS status,  v.filename AS filename ,v.uploadPath AS uri FROM MDB_trees l LEFT JOIN MDB_manual_verification r ON l.predictionId = r.predictionId LEFT JOIN MDB_verification_image v ON v.verificationId = r.verificationId where l.treeId = ? AND r.status = ? AND v.uploadPath is NOT NULL',
          [selectedTreeData.treeId, selectedTreeData.status],
          (tx, results) => {
            var temp = [];
            var len = results.rows.length;
            if (len > 0) {
              if (selectedTreeData.status == 'Healthy') {
                for (let i = 0; i < results.rows.length; ++i)
                  temp.push(results.rows.item(i));
                setImage(temp);
              } else if (selectedTreeData.status == 'Unhealthy') {
                for (let i = 0; i < results.rows.length; ++i)
                  temp.push(results.rows.item(i));
                setImage2(temp);
              }
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
            'SELECT DISTINCT l.treeId, l.predictionId, r.verificationId, p.pestdiseaseId AS pestdiseaseId, p.pestdiseaseName FROM MDB_trees l LEFT JOIN MDB_manual_verification r ON l.predictionId = r.predictionId LEFT JOIN MDB_manualverification_pest_disease p ON p.verificationId = r.verificationId where l.treeId =? AND p.pestDiseaseId is NOT NULL  AND r.verificationId = (SELECT MAX(verificationId) FROM MDB_manual_verification WHERE predictionId = l.predictionId)',
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
          (selectedTreeData.validated_status == 'Unhealthy' &&
            selectedTreeData.status == null) ||
          selectedTreeData.status == ''
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
          (selectedTreeData.validated_status == 'Healthy' &&
            selectedTreeData.status == null) ||
          selectedTreeData.status == ''
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
  const [image2, setImage2] = useState([]);

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
      }
      return false;
    } else return true;
  };

  const captureImage = async type => {
    let options = {
      mediaType: type,
      maxWidth: 900,
      maxHeight: 1650,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30,
      saveToPhotos: false,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, async response => {
        if (response.didCancel) {
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          return;
        } else if (response.errorCode == 'permission') {
          return;
        } else if (response.errorCode == 'others') {
          return;
        }
        const folderPath = `${RNFS.ExternalDirectoryPath}/TreeImages`;
        if (!(await RNFS.exists(folderPath))) {
          await RNFS.mkdir(folderPath);
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
        const path = `${folderPath}/${filename}`;
        try {
          await RNFS.moveFile(response.assets[0].uri, path);
          if (
            status == 'Healthy' ||
            (selectedTreeData.status == 'Healthy' &&
              initialswitch == 0 &&
              status != 'Unhealthy')
          ) {
            setImage(image => [
              ...image,
              {
                filename: filename,
                uri: path,
              },
            ]);
          } else {
            setImage2(image2 => [
              ...image2,
              {
                filename: filename,
                uri: path,
              },
            ]);
          }
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
                      }
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
      if (image2 != null && image2 != '') {
        const updatedImages = image2.filter(image2 => image2.uri !== item);
        setImage2(updatedImages);
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
                      }
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
    if (Addnote != null && Addnote != '') {
      setSwitchValue(true);
    } else {
      setSwitchValue(value);
    }
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
                temp_addnote = Addnote;
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
              if (
                Addnote != selectedTreeData.remarks &&
                (selectedTreeData.prediction == 'unhealthy' ||
                  selectedTreeData.status == 'Unhealthy')
              ) {
                let temp_status = '';
                if (
                  (selectedTreeData.prediction == 'healthy' &&
                    (selectedTreeData.status == null ||
                      selectedTreeData.status == '') &&
                    (selectedTreeData.validated_status == '' ||
                      selectedTreeData.validated_status == null)) ||
                  (selectedTreeData.prediction == 'healthy' &&
                    selectedTreeData.status == 'Healthy' &&
                    (selectedTreeData.validated_status == '' ||
                      selectedTreeData.validated_status == null)) ||
                  (selectedTreeData.prediction == 'healthy' &&
                    selectedTreeData.status == 'Healthy' &&
                    selectedTreeData.validated_status == 'Healthy') ||
                  (selectedTreeData.prediction == 'healthy' &&
                    selectedTreeData.status == 'Healthy' &&
                    selectedTreeData.validated_status == 'Unhealthy') ||
                  (selectedTreeData.prediction == 'healthy' &&
                    (selectedTreeData.status == null ||
                      selectedTreeData.status == '') &&
                    selectedTreeData.validated_status == 'Healthy') ||
                  (selectedTreeData.prediction == 'unhealthy' &&
                    (selectedTreeData.status == null ||
                      selectedTreeData.status == '') &&
                    selectedTreeData.validated_status == 'Healthy') ||
                  (selectedTreeData.prediction == 'unhealthy' &&
                    selectedTreeData.status == 'Healthy' &&
                    selectedTreeData.validated_status == 'Healthy') ||
                  (selectedTreeData.prediction == 'unhealthy' &&
                    selectedTreeData.status == 'Healthy' &&
                    selectedTreeData.validated_status == 'Unhealthy') ||
                  (selectedTreeData.prediction == 'unhealthy' &&
                    selectedTreeData.status == 'Healthy' &&
                    (selectedTreeData.validated_status == '' ||
                      selectedTreeData.validated_status == null))
                ) {
                  temp_status = 'Healthy';
                } else if (
                  (selectedTreeData.prediction == 'unhealthy' &&
                    (selectedTreeData.status == null ||
                      selectedTreeData.status == '') &&
                    (selectedTreeData.validated_status == '' ||
                      selectedTreeData.validated_status == null)) ||
                  (selectedTreeData.prediction == 'unhealthy' &&
                    selectedTreeData.status == 'Unhealthy' &&
                    (selectedTreeData.validated_status == '' ||
                      selectedTreeData.validated_status == null)) ||
                  (selectedTreeData.prediction == 'unhealthy' &&
                    selectedTreeData.status == 'Unhealthy' &&
                    selectedTreeData.validated_status == 'Unhealthy') ||
                  (selectedTreeData.prediction == 'unhealthy' &&
                    selectedTreeData.status == 'Unhealthy' &&
                    selectedTreeData.validated_status == 'Healthy') ||
                  (selectedTreeData.prediction == 'unhealthy' &&
                    (selectedTreeData.status == null ||
                      selectedTreeData.status == '') &&
                    selectedTreeData.validated_status == 'Unhealthy') ||
                  (selectedTreeData.prediction == 'healthy' &&
                    (selectedTreeData.status == null ||
                      selectedTreeData.status == '') &&
                    selectedTreeData.validated_status == 'Unhealthy') ||
                  (selectedTreeData.prediction == 'healthy' &&
                    selectedTreeData.status == 'Unhealthy' &&
                    selectedTreeData.validated_status == 'Unhealthy') ||
                  (selectedTreeData.prediction == 'healthy' &&
                    selectedTreeData.status == 'Unhealthy' &&
                    selectedTreeData.validated_status == 'Healthy') ||
                  (selectedTreeData.prediction == 'healthy' &&
                    selectedTreeData.status == 'Unhealthy' &&
                    (selectedTreeData.validated_status == '' ||
                      selectedTreeData.validated_status == null))
                ) {
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
                let temp_status = '';
                if (
                  (selectedTreeData.prediction == 'healthy' &&
                    (selectedTreeData.status == null ||
                      selectedTreeData.status == '') &&
                    (selectedTreeData.validated_status == '' ||
                      selectedTreeData.validated_status == null)) ||
                  (selectedTreeData.prediction == 'healthy' &&
                    selectedTreeData.status == 'Healthy' &&
                    (selectedTreeData.validated_status == '' ||
                      selectedTreeData.validated_status == null)) ||
                  (selectedTreeData.prediction == 'healthy' &&
                    selectedTreeData.status == 'Healthy' &&
                    selectedTreeData.validated_status == 'Healthy') ||
                  (selectedTreeData.prediction == 'healthy' &&
                    selectedTreeData.status == 'Healthy' &&
                    selectedTreeData.validated_status == 'Unhealthy') ||
                  (selectedTreeData.prediction == 'healthy' &&
                    (selectedTreeData.status == null ||
                      selectedTreeData.status == '') &&
                    selectedTreeData.validated_status == 'Healthy') ||
                  (selectedTreeData.prediction == 'unhealthy' &&
                    (selectedTreeData.status == null ||
                      selectedTreeData.status == '') &&
                    selectedTreeData.validated_status == 'Healthy') ||
                  (selectedTreeData.prediction == 'unhealthy' &&
                    selectedTreeData.status == 'Healthy' &&
                    selectedTreeData.validated_status == 'Healthy') ||
                  (selectedTreeData.prediction == 'unhealthy' &&
                    selectedTreeData.status == 'Healthy' &&
                    selectedTreeData.validated_status == 'Unhealthy') ||
                  (selectedTreeData.prediction == 'unhealthy' &&
                    selectedTreeData.status == 'Healthy' &&
                    (selectedTreeData.validated_status == '' ||
                      selectedTreeData.validated_status == null))
                ) {
                  temp_status = 'Healthy';
                } else if (
                  (selectedTreeData.prediction == 'unhealthy' &&
                    (selectedTreeData.status == null ||
                      selectedTreeData.status == '') &&
                    (selectedTreeData.validated_status == '' ||
                      selectedTreeData.validated_status == null)) ||
                  (selectedTreeData.prediction == 'unhealthy' &&
                    selectedTreeData.status == 'Unhealthy' &&
                    (selectedTreeData.validated_status == '' ||
                      selectedTreeData.validated_status == null)) ||
                  (selectedTreeData.prediction == 'unhealthy' &&
                    selectedTreeData.status == 'Unhealthy' &&
                    selectedTreeData.validated_status == 'Unhealthy') ||
                  (selectedTreeData.prediction == 'unhealthy' &&
                    selectedTreeData.status == 'Unhealthy' &&
                    selectedTreeData.validated_status == 'Healthy') ||
                  (selectedTreeData.prediction == 'unhealthy' &&
                    (selectedTreeData.status == null ||
                      selectedTreeData.status == '') &&
                    selectedTreeData.validated_status == 'Unhealthy') ||
                  (selectedTreeData.prediction == 'healthy' &&
                    (selectedTreeData.status == null ||
                      selectedTreeData.status == '') &&
                    selectedTreeData.validated_status == 'Unhealthy') ||
                  (selectedTreeData.prediction == 'healthy' &&
                    selectedTreeData.status == 'Unhealthy' &&
                    selectedTreeData.validated_status == 'Unhealthy') ||
                  (selectedTreeData.prediction == 'healthy' &&
                    selectedTreeData.status == 'Unhealthy' &&
                    selectedTreeData.validated_status == 'Healthy') ||
                  (selectedTreeData.prediction == 'healthy' &&
                    selectedTreeData.status == 'Unhealthy' &&
                    (selectedTreeData.validated_status == '' ||
                      selectedTreeData.validated_status == null))
                ) {
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
              }
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
            if (
              Addnote != selectedTreeData.remarks ||
              status == 'Unhealthy' ||
              (status == undefined &&
                (selectedTreeData.prediction == 'unhealthy' ||
                  selectedTreeData.status == 'Unhealthy' ||
                  selectedTreeData.validated_status == 'Unhealthy'))
            ) {
              if (
                image != null &&
                image != '' &&
                (status == 'Healthy' ||
                  (status == undefined &&
                    selectedTreeData.prediction == 'unhealthy'))
              ) {
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
              } else if (
                (image2 != null &&
                  image2 != '' &&
                  (status == 'Unhealthy' ||
                    (selectedTreeData.prediction == 'unhealthy' &&
                      selectedTreeData.status == null) ||
                    selectedTreeData.status == '')) ||
                (selectedTreeData.prediction == 'unhealthy' &&
                  selectedTreeData.status == 'Unhealthy') ||
                (selectedTreeData.prediction == 'healthy' &&
                  selectedTreeData.status == 'Unhealthy') ||
                (image2 != null &&
                  image2 != '' &&
                  status == undefined &&
                  (selectedTreeData.status == 'Unhealthy' ||
                    selectedTreeData.validated_status == 'Unhealthy'))
              ) {
                for (let i = 0; i < image2.length; i++) {
                  await tx.executeSql(
                    'INSERT INTO MDB_verification_image (verificationId, userId, filename, uploadPath, uploadDate,  description, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?)',
                    [
                      verificationId + 1,
                      userId,
                      image2[i].filename,
                      image2[i].uri,
                      date,
                      '',
                      date,
                      date,
                    ],
                  );
                }
              }
            }

            if (status != 'Healthy') {
              selected.forEach((data, index) => {
                tx.executeSql(
                  'SELECT DISTINCT l.treeId, l.predictionId, r.verificationId, p.pestdiseaseId AS pestdiseaseId, p.pestdiseaseName FROM MDB_trees l LEFT JOIN MDB_manual_verification r ON l.predictionId = r.predictionId LEFT JOIN MDB_manualverification_pest_disease p ON p.verificationId = r.verificationId where l.treeId =? AND p.pestDiseaseId = ?',
                  [selectedTreeData.treeId, data],
                  (tx, results) => {
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
                    // }
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
                  }
                });
              }
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
        } else if (image2 != null && image2 != '') {
          var image_uri = JSON.stringify(image2);
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
                      <Text style={[styles.popstatus_text]}>{`Healthy`}</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={[styles.poppredicted_button, redpillcolor]}>
                      <Text style={[styles.popstatus_text]}>{`Unhealthy`}</Text>
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
                  ) : selectedTreeData.validated_status != null ? (
                    <Pressable style={[styles.popvalidated_button, svgcolor]}>
                      <Text style={[styles.status_text]}>
                        {selectedTreeData.validated_status}
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
              {image2 != null && image2 != '' ? (
                <View>
                  {image2.length == 3 ? (
                    <View>
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
                          {image2.map((item, index) => {
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
                      <Text style={styles.info_text_3}>{`(Max 3 Photos)`}</Text>
                    </View>
                  ) : (
                    <View>
                      {image2.length == 2 ? (
                        <View>
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
                                    onPress={() => captureImage('photo')}
                                  />
                                  <Text style={styles.touchableopacity_text}>
                                    Upload Image
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>

                            <View>
                              {image2.map((item, index) => {
                                if (item.uri != null && item.uri != '') {
                                  return (
                                    <View key={index}>
                                      <View
                                        style={styles.uploadinnerContainer_2}>
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
                          <Text
                            style={styles.info_text_2}>{`(Max 3 Photos)`}</Text>
                        </View>
                      ) : (
                        <View>
                          {image2.length == 1 ? (
                            <View>
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
                                        onPress={() => captureImage('photo')}
                                      />
                                      <Text
                                        style={styles.touchableopacity_text}>
                                        Upload Image
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                </View>

                                <View>
                                  {image2.map((item, index) => {
                                    if (item.uri != null && item.uri != '') {
                                      return (
                                        <View key={index}>
                                          <View
                                            style={
                                              styles.uploadinnerContainer_1
                                            }>
                                            <Image
                                              source={{
                                                uri: `file://${item.uri}`,
                                              }}
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
                              <Text
                                style={
                                  styles.info_text_1
                                }>{`(Max 3 Photos)`}</Text>
                            </View>
                          ) : (
                            <View>
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
                                        onPress={() => captureImage('photo')}
                                      />
                                      <Text
                                        style={styles.touchableopacity_text}>
                                        Upload Image
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              </View>
                              <Text
                                style={
                                  styles.info_text
                                }>{`(Max 3 Photos)`}</Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ) : (
                <View>
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
                            onPress={() => captureImage('photo')}
                          />
                          <Text style={styles.touchableopacity_text}>
                            Upload Image
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.info_text}>{`(Max 3 Photos)`}</Text>
                </View>
              )}

              {image2 != null && image2 != '' ? (
                <View>
                  {image2.length == 1 ? (
                    <View style={{paddingVertical: 50}}></View>
                  ) : (
                    <View>
                      {image2.length == 2 ? (
                        <View style={{paddingVertical: 50}}></View>
                      ) : (
                        <View>
                          {image2.length == 3 ? (
                            <View style={{paddingVertical: 40}}></View>
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
                    value={
                      (initialswitch == 0 &&
                        (status == '' || status == null)) ||
                      (initialswitch == 1 &&
                        (status == '' || status == null)) ||
                      status == selectedTreeData.status
                        ? Addnote
                        : null
                    }
                    onChangeText={text => setAddnote(text)}></Input>
                </View>
              ) : null}
            </View>
          ) : status == 'Healthy' &&
            (initialswitch == 1 ||
              (selectedTreeData.prediction == 'unhealthy' &&
                selectedTreeData.status != 'Healthy' &&
                (selectedTreeData.validated_status == '' ||
                  selectedTreeData.validated_status == null)) ||
              selectedTreeData.status == 'Unhealthy' ||
              selectedTreeData.validated_status == 'Unhealthy' ||
              (image != null &&
                image != '' &&
                selectedTreeData.status != '' &&
                selectedTreeData.status != null)) ? (
            <View>
              {image != null && image != '' ? (
                <View>
                  {image.length == 3 ? (
                    <View>
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
                      <Text style={styles.info_text_3}>{`(Max 3 Photos)`}</Text>
                    </View>
                  ) : (
                    <View>
                      {image.length == 2 ? (
                        <View>
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
                                    onPress={() => captureImage('photo')}
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
                                        style={styles.uploadinnerContainer_2}>
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
                          <Text
                            style={styles.info_text_2}>{`(Max 3 Photos)`}</Text>
                        </View>
                      ) : (
                        <View>
                          {image.length == 1 ? (
                            <View>
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
                                        onPress={() => captureImage('photo')}
                                      />
                                      <Text
                                        style={styles.touchableopacity_text}>
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
                                            style={
                                              styles.uploadinnerContainer_1
                                            }>
                                            <Image
                                              source={{
                                                uri: `file://${item.uri}`,
                                              }}
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
                              <Text
                                style={
                                  styles.info_text_1
                                }>{`(Max 3 Photos)`}</Text>
                            </View>
                          ) : (
                            <View>
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
                                        onPress={() => captureImage('photo')}
                                      />
                                      <Text
                                        style={styles.touchableopacity_text}>
                                        Upload Image
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              </View>
                              <Text
                                style={
                                  styles.info_text
                                }>{`(Max 3 Photos)`}</Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ) : (
                <View>
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
                            onPress={() => captureImage('photo')}
                          />
                          <Text style={styles.touchableopacity_text}>
                            Upload Image
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.info_text}>{`(Max 3 Photos)`}</Text>
                </View>
              )}

              {image != null && image != '' ? (
                <View>
                  {image.length == 1 ? (
                    <View style={{paddingVertical: 50}}></View>
                  ) : (
                    <View>
                      {image.length == 2 ? (
                        <View style={{paddingVertical: 50}}></View>
                      ) : (
                        <View>
                          {image.length == 3 ? (
                            <View style={{paddingVertical: 40}}></View>
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
                    value={
                      (initialswitch == 0 &&
                        (status == '' || status == null)) ||
                      (initialswitch == 1 &&
                        (status == '' || status == null)) ||
                      status == selectedTreeData.status
                        ? Addnote
                        : null
                    }
                    onChangeText={text => setAddnote(text)}></Input>
                </View>
              ) : null}
            </View>
          ) : status == '' ||
            (status == null &&
              initialswitch == 0 &&
              image != null &&
              image != '' &&
              (selectedTreeData.prediction == 'unhealthy' ||
                selectedTreeData.status == 'Unhealthy' ||
                selectedTreeData.validated_status == 'Unhealthy' ||
                (image != null &&
                  selectedTreeData.status != '' &&
                  selectedTreeData.status != null))) ? (
            <View>
              {image != null && image != '' ? (
                <View>
                  {image.length == 3 ? (
                    <View>
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
                      <Text style={styles.info_text_3}>{`(Max 3 Photos)`}</Text>
                    </View>
                  ) : (
                    <View>
                      {image.length == 2 ? (
                        <View>
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
                                    onPress={() => captureImage('photo')}
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
                                        style={styles.uploadinnerContainer_2}>
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
                          <Text
                            style={styles.info_text_2}>{`(Max 3 Photos)`}</Text>
                        </View>
                      ) : (
                        <View>
                          {image.length == 1 ? (
                            <View>
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
                                        onPress={() => captureImage('photo')}
                                      />
                                      <Text
                                        style={styles.touchableopacity_text}>
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
                                            style={
                                              styles.uploadinnerContainer_1
                                            }>
                                            <Image
                                              source={{
                                                uri: `file://${item.uri}`,
                                              }}
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
                              <Text
                                style={
                                  styles.info_text_1
                                }>{`(Max 3 Photos)`}</Text>
                            </View>
                          ) : (
                            <View>
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
                                        onPress={() => captureImage('photo')}
                                      />
                                      <Text
                                        style={styles.touchableopacity_text}>
                                        Upload Image
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              </View>
                              <Text
                                style={
                                  styles.info_text
                                }>{`(Max 3 Photos)`}</Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ) : (
                <View>
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
                            onPress={() => captureImage('photo')}
                          />
                          <Text style={styles.touchableopacity_text}>
                            Upload Image
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.info_text}>{`(Max 3 Photos)`}</Text>
                </View>
              )}

              {image != null && image != '' ? (
                <View>
                  {image.length == 1 ? (
                    <View style={{paddingVertical: 50}}></View>
                  ) : (
                    <View>
                      {image.length == 2 ? (
                        <View style={{paddingVertical: 50}}></View>
                      ) : (
                        <View>
                          {image.length == 3 ? (
                            <View style={{paddingVertical: 40}}></View>
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
                    value={
                      (initialswitch == 0 &&
                        (status == '' || status == null)) ||
                      (initialswitch == 1 &&
                        (status == '' || status == null)) ||
                      status == selectedTreeData.status
                        ? Addnote
                        : null
                    }
                    onChangeText={text => setAddnote(text)}></Input>
                </View>
              ) : null}
            </View>
          ) : null}

          {image != null && image != '' && status != 'Unhealthy' ? (
            initialswitch == 0 ? (
              status == 'Healthy' ? (
                <View style={styles.container}>
                  <Pressable
                    style={{
                      borderRadius: 5 * ratio,
                      padding: 10 * ratio,
                      width: '100%',
                      height: 44 * ratio,
                      backgroundColor:
                        status == 'Healthy' &&
                        Addnote != null &&
                        Addnote != '' &&
                        validate == true
                          ? '#33a02c'
                          : 'gray',
                    }}
                    onPress={() => {
                      updatestatus();
                      navigation.navigate(Route.MAP, {});
                    }}
                    disabled={
                      status == 'Healthy' &&
                      Addnote != null &&
                      Addnote != '' &&
                      validate == true
                        ? false
                        : true
                    }>
                    <Text style={styles.buttontext}>Save</Text>
                  </Pressable>
                  {validate == false ? (
                    <View style={{height: 110 * ratio}}>
                      <Toaster
                        style={styles.toaster}
                        textcolor={'red'}
                        res={false}
                        toastSuccess={false}
                        iconName={'exclamationcircleo'}
                        iconcolor={'#EF4444'}
                        toastMessage1={`Anda berada di luar batas dari\nlokasi pohon !`}
                        toastMessage2={`Harap pindah lebih dekat ke pohon untuk\nmenyimpan laporan validasi.`}
                      />
                    </View>
                  ) : null}
                </View>
              ) : image.length == 1 ? (
                <View style={styles.container}>
                  <Pressable
                    style={{
                      borderRadius: 5 * ratio,
                      padding: 10 * ratio,
                      width: '100%',
                      height: 44 * ratio,
                      backgroundColor:
                        (selected != null &&
                          selected != '' &&
                          value.includes('Others') &&
                          Addnote != null &&
                          Addnote != '' &&
                          validate == true) ||
                        (selected != null &&
                          selected != '' &&
                          !value.includes('Others') &&
                          validate == true) ||
                        (status == undefined &&
                          selectedTreeData.prediction == 'healthy' &&
                          validate == true) ||
                        (selectedTreeData.status == 'Healthy' &&
                          validate == true) ||
                        (status == 'Healthy' && validate == true)
                          ? '#33a02c'
                          : 'gray',
                    }}
                    onPress={() => {
                      updatestatus();
                      navigation.navigate(Route.MAP, {});
                    }}
                    disabled={
                      (selected != null &&
                        selected != '' &&
                        value.includes('Others') &&
                        Addnote != null &&
                        Addnote != '' &&
                        validate == true) ||
                      (selected != null &&
                        selected != '' &&
                        !value.includes('Others') &&
                        validate == true) ||
                      (status == undefined &&
                        selectedTreeData.prediction == 'healthy' &&
                        validate == true) ||
                      (selectedTreeData.status == 'Healthy' &&
                        validate == true) ||
                      (status == 'Healthy' && validate == true)
                        ? false
                        : true
                    }>
                    <Text style={styles.buttontext}>Save</Text>
                  </Pressable>
                  {validate == false ? (
                    <View style={{height: 110 * ratio}}>
                      <Toaster
                        style={styles.toaster}
                        textcolor={'red'}
                        res={false}
                        toastSuccess={false}
                        iconName={'exclamationcircleo'}
                        iconcolor={'#EF4444'}
                        toastMessage1={`Anda berada di luar batas dari\nlokasi pohon !`}
                        toastMessage2={`Harap pindah lebih dekat ke pohon untuk\nmenyimpan laporan validasi.`}
                      />
                    </View>
                  ) : null}
                </View>
              ) : image.length == 2 ? (
                <View style={styles.container}>
                  <Pressable
                    style={{
                      borderRadius: 5 * ratio,
                      padding: 10 * ratio,
                      width: '100%',
                      height: 44 * ratio,
                      backgroundColor:
                        (selected != null &&
                          selected != '' &&
                          value.includes('Others') &&
                          Addnote != null &&
                          Addnote != '' &&
                          validate == true) ||
                        (selected != null &&
                          selected != '' &&
                          !value.includes('Others') &&
                          validate == true) ||
                        (status == undefined &&
                          selectedTreeData.prediction == 'healthy' &&
                          validate == true) ||
                        (selectedTreeData.status == 'Healthy' &&
                          validate == true) ||
                        (status == 'Healthy' && validate == true)
                          ? '#33a02c'
                          : 'gray',
                    }}
                    onPress={() => {
                      updatestatus();
                      navigation.navigate(Route.MAP, {});
                    }}
                    disabled={
                      (selected != null &&
                        selected != '' &&
                        value.includes('Others') &&
                        Addnote != null &&
                        Addnote != '' &&
                        validate == true) ||
                      (selected != null &&
                        selected != '' &&
                        !value.includes('Others') &&
                        validate == true) ||
                      (status == undefined &&
                        selectedTreeData.prediction == 'healthy' &&
                        validate == true) ||
                      (selectedTreeData.status == 'Healthy' &&
                        validate == true) ||
                      (status == 'Healthy' && validate == true)
                        ? false
                        : true
                    }>
                    <Text style={styles.buttontext}>Save</Text>
                  </Pressable>
                  {validate == false ? (
                    <View style={{height: 110 * ratio}}>
                      <Toaster
                        style={styles.toaster}
                        textcolor={'red'}
                        res={false}
                        toastSuccess={false}
                        iconName={'exclamationcircleo'}
                        iconcolor={'#EF4444'}
                        toastMessage1={`Anda berada di luar batas dari\nlokasi pohon !`}
                        toastMessage2={`Harap pindah lebih dekat ke pohon untuk\nmenyimpan laporan validasi.`}
                      />
                    </View>
                  ) : null}
                </View>
              ) : image.length == 3 ? (
                <View style={styles.container}>
                  <Pressable
                    style={{
                      borderRadius: 5 * ratio,
                      padding: 10 * ratio,
                      width: '100%',
                      height: 44 * ratio,
                      backgroundColor:
                        (selected != null &&
                          selected != '' &&
                          value.includes('Others') &&
                          Addnote != null &&
                          Addnote != '' &&
                          validate == true) ||
                        (selected != null &&
                          selected != '' &&
                          !value.includes('Others') &&
                          validate == true) ||
                        (status == undefined &&
                          selectedTreeData.prediction == 'healthy' &&
                          validate == true) ||
                        (selectedTreeData.status == 'Healthy' &&
                          validate == true) ||
                        (status == 'Healthy' && validate == true)
                          ? '#33a02c'
                          : 'gray',
                    }}
                    onPress={() => {
                      updatestatus();
                      navigation.navigate(Route.MAP, {});
                    }}
                    disabled={
                      (selected != null &&
                        selected != '' &&
                        value.includes('Others') &&
                        Addnote != null &&
                        Addnote != '' &&
                        validate == true) ||
                      (selected != null &&
                        selected != '' &&
                        !value.includes('Others') &&
                        validate == true) ||
                      (status == undefined &&
                        selectedTreeData.prediction == 'healthy' &&
                        validate == true) ||
                      (selectedTreeData.status == 'Healthy' &&
                        validate == true) ||
                      (status == 'Healthy' && validate == true)
                        ? false
                        : true
                    }>
                    <Text style={styles.buttontext}>Save</Text>
                  </Pressable>
                  {validate == false ? (
                    <View style={{height: 110 * ratio}}>
                      <Toaster
                        style={styles.toaster}
                        textcolor={'red'}
                        res={false}
                        toastSuccess={false}
                        iconName={'exclamationcircleo'}
                        iconcolor={'#EF4444'}
                        toastMessage1={`Anda berada di luar batas dari\nlokasi pohon !`}
                        toastMessage2={`Harap pindah lebih dekat ke pohon untuk\nmenyimpan laporan validasi.`}
                      />
                    </View>
                  ) : null}
                </View>
              ) : null
            ) : initialswitch == 1 ? (
              status == 'Healthy' ? (
                <View style={styles.container}>
                  <View style={{paddingVertical: 46 * ratio}}></View>
                  <Pressable
                    style={{
                      borderRadius: 5 * ratio,
                      padding: 10 * ratio,
                      top: 180 * ratio,
                      width: '100%',
                      height: 44 * ratio,
                      backgroundColor:
                        (selected != null &&
                          selected != '' &&
                          value.includes('Others') &&
                          Addnote != null &&
                          Addnote != '' &&
                          validate == true) ||
                        (selected != null &&
                          selected != '' &&
                          !value.includes('Others') &&
                          validate == true) ||
                        (status == undefined &&
                          selectedTreeData.prediction == 'healthy' &&
                          validate == true) ||
                        (status == 'Healthy' && validate == true)
                          ? '#33a02c'
                          : 'gray',
                    }}
                    onPress={() => {
                      updatestatus();
                      navigation.navigate(Route.MAP, {});
                    }}
                    disabled={
                      (selected != null &&
                        selected != '' &&
                        value.includes('Others') &&
                        Addnote != null &&
                        Addnote != '' &&
                        validate == true) ||
                      (selected != null &&
                        selected != '' &&
                        !value.includes('Others') &&
                        validate == true) ||
                      (status == undefined &&
                        selectedTreeData.prediction == 'healthy' &&
                        validate == true) ||
                      (status == 'Healthy' && validate == true)
                        ? false
                        : true
                    }>
                    <Text style={styles.buttontext}>Save</Text>
                  </Pressable>
                  {validate == false ? (
                    <View style={{height: 110 * ratio}}>
                      <Toaster
                        style={styles.toaster}
                        textcolor={'red'}
                        res={false}
                        toastSuccess={false}
                        iconName={'exclamationcircleo'}
                        iconcolor={'#EF4444'}
                        toastMessage1={`Anda berada di luar batas dari\nlokasi pohon !`}
                        toastMessage2={`Harap pindah lebih dekat ke pohon untuk\nmenyimpan laporan validasi.`}
                      />
                    </View>
                  ) : null}
                </View>
              ) : image.length == 1 ? (
                <View style={styles.container}>
                  <Pressable
                    style={{
                      borderRadius: 5 * ratio,
                      padding: 10 * ratio,
                      width: '100%',
                      height: 44 * ratio,
                      backgroundColor:
                        (selected != null &&
                          selected != '' &&
                          value.includes('Others') &&
                          Addnote != null &&
                          Addnote != '' &&
                          validate == true) ||
                        (selected != null &&
                          selected != '' &&
                          !value.includes('Others') &&
                          validate == true) ||
                        (status == undefined &&
                          selectedTreeData.prediction == 'healthy' &&
                          validate == true) ||
                        (status == 'Healthy' && validate == true)
                          ? '#33a02c'
                          : 'gray',
                    }}
                    onPress={() => {
                      updatestatus();
                      navigation.navigate(Route.MAP, {});
                    }}
                    disabled={
                      (selected != null &&
                        selected != '' &&
                        value.includes('Others') &&
                        Addnote != null &&
                        Addnote != '' &&
                        validate == true) ||
                      (selected != null &&
                        selected != '' &&
                        !value.includes('Others') &&
                        validate == true) ||
                      (status == undefined &&
                        selectedTreeData.prediction == 'healthy' &&
                        validate == true) ||
                      (status == 'Healthy' && validate == true)
                        ? false
                        : true
                    }>
                    <Text style={styles.buttontext}>Save</Text>
                  </Pressable>
                  {validate == false ? (
                    <View style={{height: 110 * ratio}}>
                      <Toaster
                        style={styles.toaster}
                        textcolor={'red'}
                        res={false}
                        toastSuccess={false}
                        iconName={'exclamationcircleo'}
                        iconcolor={'#EF4444'}
                        toastMessage1={`Anda berada di luar batas dari\nlokasi pohon !`}
                        toastMessage2={`Harap pindah lebih dekat ke pohon untuk\nmenyimpan laporan validasi.`}
                      />
                    </View>
                  ) : null}
                </View>
              ) : image.length == 2 ? (
                <View style={styles.container}>
                  <Pressable
                    style={{
                      borderRadius: 5 * ratio,
                      padding: 10 * ratio,
                      width: '100%',
                      height: 44 * ratio,
                      backgroundColor:
                        (selected != null &&
                          selected != '' &&
                          value.includes('Others') &&
                          Addnote != null &&
                          Addnote != '' &&
                          validate == true) ||
                        (selected != null &&
                          selected != '' &&
                          !value.includes('Others') &&
                          validate == true) ||
                        (status == undefined &&
                          selectedTreeData.prediction == 'healthy' &&
                          validate == true) ||
                        (status == 'Healthy' && validate == true)
                          ? '#33a02c'
                          : 'gray',
                    }}
                    onPress={() => {
                      updatestatus();
                      navigation.navigate(Route.MAP, {});
                    }}
                    disabled={
                      (selected != null &&
                        selected != '' &&
                        value.includes('Others') &&
                        Addnote != null &&
                        Addnote != '' &&
                        validate == true) ||
                      (selected != null &&
                        selected != '' &&
                        !value.includes('Others') &&
                        validate == true) ||
                      (status == undefined &&
                        selectedTreeData.prediction == 'healthy' &&
                        validate == true) ||
                      (status == 'Healthy' && validate == true)
                        ? false
                        : true
                    }>
                    <Text style={styles.buttontext}>Save</Text>
                  </Pressable>
                  {validate == false ? (
                    <View style={{height: 110 * ratio}}>
                      <Toaster
                        style={styles.toaster}
                        textcolor={'red'}
                        res={false}
                        toastSuccess={false}
                        iconName={'exclamationcircleo'}
                        iconcolor={'#EF4444'}
                        toastMessage1={`Anda berada di luar batas dari\nlokasi pohon !`}
                        toastMessage2={`Harap pindah lebih dekat ke pohon untuk\nmenyimpan laporan validasi.`}
                      />
                    </View>
                  ) : null}
                </View>
              ) : image.length == 3 ? (
                <View style={styles.container}>
                  <Pressable
                    style={{
                      borderRadius: 5 * ratio,
                      padding: 10 * ratio,
                      width: '100%',
                      height: 44 * ratio,
                      backgroundColor:
                        (selected != null &&
                          selected != '' &&
                          value.includes('Others') &&
                          Addnote != null &&
                          Addnote != '' &&
                          validate == true) ||
                        (selected != null &&
                          selected != '' &&
                          !value.includes('Others') &&
                          validate == true) ||
                        (status == undefined &&
                          selectedTreeData.prediction == 'healthy' &&
                          validate == true) ||
                        (status == 'Healthy' && validate == true)
                          ? '#33a02c'
                          : 'gray',
                    }}
                    onPress={() => {
                      updatestatus();
                      navigation.navigate(Route.MAP, {});
                    }}
                    disabled={
                      (selected != null &&
                        selected != '' &&
                        value.includes('Others') &&
                        Addnote != null &&
                        Addnote != '' &&
                        validate == true) ||
                      (selected != null &&
                        selected != '' &&
                        !value.includes('Others') &&
                        validate == true) ||
                      (status == undefined &&
                        selectedTreeData.prediction == 'healthy' &&
                        validate == true) ||
                      (status == 'Healthy' && validate == true)
                        ? false
                        : true
                    }>
                    <Text style={styles.buttontext}>Save</Text>
                  </Pressable>
                  {validate == false ? (
                    <View style={{height: 110 * ratio}}>
                      <Toaster
                        style={styles.toaster}
                        textcolor={'red'}
                        res={false}
                        toastSuccess={false}
                        iconName={'exclamationcircleo'}
                        iconcolor={'#EF4444'}
                        toastMessage1={`Anda berada di luar batas dari\nlokasi pohon !`}
                        toastMessage2={`Harap pindah lebih dekat ke pohon untuk\nmenyimpan laporan validasi.`}
                      />
                    </View>
                  ) : null}
                </View>
              ) : null
            ) : null
          ) : initialswitch == 0 ? (
            status == '' || status == null ? (
              <View style={styles.container}>
                <View style={{paddingVertical: 46 * ratio}}></View>
                <Pressable
                  style={{
                    borderRadius: 5 * ratio,
                    padding: 10 * ratio,
                    width: '100%',
                    height: 44 * ratio,
                    backgroundColor:
                      (selected != null &&
                        selected != '' &&
                        value.includes('Others') &&
                        Addnote != null &&
                        Addnote != '' &&
                        validate == true) ||
                      (selected != null &&
                        selected != '' &&
                        !value.includes('Others') &&
                        validate == true) ||
                      (status == undefined &&
                        selectedTreeData.prediction == 'healthy' &&
                        validate == true) ||
                      (selectedTreeData.prediction == 'unhealthy' &&
                        validate == true &&
                        (selectedTreeData.status == 'Healthy' ||
                          selectedTreeData.validated_status == 'Healthy')) ||
                      (status == 'Healthy' && validate == true)
                        ? '#33a02c'
                        : 'gray',
                  }}
                  onPress={() => {
                    updatestatus();
                    navigation.navigate(Route.MAP, {});
                  }}
                  disabled={
                    (selected != null &&
                      selected != '' &&
                      value.includes('Others') &&
                      Addnote != null &&
                      Addnote != '' &&
                      validate == true) ||
                    (selected != null &&
                      selected != '' &&
                      !value.includes('Others') &&
                      validate == true) ||
                    (status == undefined &&
                      selectedTreeData.prediction == 'healthy' &&
                      validate == true) ||
                    (selectedTreeData.prediction == 'unhealthy' &&
                      validate == true &&
                      (selectedTreeData.status == 'Healthy' ||
                        selectedTreeData.validated_status == 'Healthy')) ||
                    (status == 'Healthy' && validate == true)
                      ? false
                      : true
                  }>
                  <Text style={styles.buttontext}>Save</Text>
                </Pressable>
                {validate == false ? (
                  <View style={{height: 110 * ratio}}>
                    <Toaster
                      style={styles.toaster}
                      textcolor={'red'}
                      res={false}
                      toastSuccess={false}
                      iconName={'exclamationcircleo'}
                      iconcolor={'#EF4444'}
                      toastMessage1={`Anda berada di luar batas dari\nlokasi pohon !`}
                      toastMessage2={`Harap pindah lebih dekat ke pohon untuk\nmenyimpan laporan validasi.`}
                    />
                  </View>
                ) : null}
              </View>
            ) : status == 'Healthy' &&
              selectedTreeData.prediction == 'healthy' &&
              selectedTreeData.status == 'Healthy' &&
              (selectedTreeData.validated_status == 'Healthy' ||
                selectedTreeData.validated_status == '' ||
                selectedTreeData.validated_status == null) ? (
              <View style={styles.container}>
                <View style={{paddingVertical: 46 * ratio}}></View>
                <Pressable
                  style={{
                    borderRadius: 5 * ratio,
                    padding: 10 * ratio,
                    width: '100%',
                    height: 44 * ratio,
                    backgroundColor:
                      (status == undefined &&
                        selectedTreeData.prediction == 'healthy' &&
                        validate == true) ||
                      (status == 'Healthy' && validate == true)
                        ? '#33a02c'
                        : 'gray',
                  }}
                  onPress={() => {
                    updatestatus();
                    navigation.navigate(Route.MAP, {});
                  }}
                  disabled={
                    (status == undefined &&
                      selectedTreeData.prediction == 'healthy' &&
                      validate == true) ||
                    (status == 'Healthy' && validate == true)
                      ? false
                      : true
                  }>
                  <Text style={styles.buttontext}>Save</Text>
                </Pressable>
                {validate == false ? (
                  <View style={{height: 110 * ratio}}>
                    <Toaster
                      style={styles.toaster}
                      textcolor={'red'}
                      res={false}
                      toastSuccess={false}
                      iconName={'exclamationcircleo'}
                      iconcolor={'#EF4444'}
                      toastMessage1={`Anda berada di luar batas dari\nlokasi pohon !`}
                      toastMessage2={`Harap pindah lebih dekat ke pohon untuk\nmenyimpan laporan validasi.`}
                    />
                  </View>
                ) : null}
              </View>
            ) : status == 'Healthy' &&
              selectedTreeData.prediction == 'healthy' &&
              selectedTreeData.status == 'Unhealthy' &&
              (selectedTreeData.validated_status == 'Healthy' ||
                selectedTreeData.validated_status == 'Unhealthy' ||
                selectedTreeData.validated_status == null ||
                selectedTreeData.validated_status == '') ? (
              <View style={styles.container}>
                <Pressable
                  style={{
                    borderRadius: 5 * ratio,
                    padding: 10 * ratio,
                    width: '100%',
                    height: 44 * ratio,
                    backgroundColor:
                      status == 'Healthy' &&
                      selectedTreeData.prediction == 'unhealthy' &&
                      image != null &&
                      image != '' &&
                      Addnote != null &&
                      Addnote != '' &&
                      validate == true
                        ? '#33a02c'
                        : 'gray',
                  }}
                  onPress={() => {
                    updatestatus();
                    navigation.navigate(Route.MAP, {});
                  }}
                  disabled={
                    status == 'Healthy' &&
                    selectedTreeData.prediction == 'unhealthy' &&
                    image != null &&
                    image != '' &&
                    Addnote != null &&
                    Addnote != '' &&
                    validate == true
                      ? false
                      : true
                  }>
                  <Text style={styles.buttontext}>Save</Text>
                </Pressable>
                {validate == false ? (
                  <View style={{height: 110 * ratio}}>
                    <Toaster
                      style={styles.toaster}
                      textcolor={'red'}
                      res={false}
                      toastSuccess={false}
                      iconName={'exclamationcircleo'}
                      iconcolor={'#EF4444'}
                      toastMessage1={`Anda berada di luar batas dari\nlokasi pohon !`}
                      toastMessage2={`Harap pindah lebih dekat ke pohon untuk\nmenyimpan laporan validasi.`}
                    />
                  </View>
                ) : null}
              </View>
            ) : status == 'Healthy' &&
              selectedTreeData.prediction == 'healthy' &&
              (selectedTreeData.status == 'Unhealthy' ||
                selectedTreeData.validated_status == 'Unhealthy') ? (
              <View style={styles.container}>
                <Pressable
                  style={{
                    borderRadius: 5 * ratio,
                    padding: 10 * ratio,
                    width: '100%',
                    height: 44 * ratio,
                    backgroundColor:
                      status == 'Healthy' &&
                      selectedTreeData.prediction == 'unhealthy' &&
                      image != null &&
                      image != '' &&
                      Addnote != null &&
                      Addnote != '' &&
                      validate == true
                        ? '#33a02c'
                        : 'gray',
                  }}
                  onPress={() => {
                    updatestatus();
                    navigation.navigate(Route.MAP, {});
                  }}
                  disabled={
                    status == 'Healthy' &&
                    selectedTreeData.prediction == 'unhealthy' &&
                    image != null &&
                    image != '' &&
                    Addnote != null &&
                    Addnote != '' &&
                    validate == true
                      ? false
                      : true
                  }>
                  <Text style={styles.buttontext}>Save</Text>
                </Pressable>
                {validate == false ? (
                  <View style={{height: 110 * ratio}}>
                    <Toaster
                      style={styles.toaster}
                      textcolor={'red'}
                      res={false}
                      toastSuccess={false}
                      iconName={'exclamationcircleo'}
                      iconcolor={'#EF4444'}
                      toastMessage1={`Anda berada di luar batas dari\nlokasi pohon !`}
                      toastMessage2={`Harap pindah lebih dekat ke pohon untuk\nmenyimpan laporan validasi.`}
                    />
                  </View>
                ) : null}
              </View>
            ) : status == 'Healthy' &&
              ((selectedTreeData.prediction == 'healthy' &&
                selectedTreeData.status == 'Healthy') ||
                selectedTreeData.validated_status == 'Healthy') ? (
              <View style={styles.container}>
                <View style={{paddingVertical: 46 * ratio}}></View>
                <Pressable
                  style={{
                    borderRadius: 5 * ratio,
                    padding: 10 * ratio,
                    width: '100%',
                    height: 44 * ratio,
                    backgroundColor:
                      status == 'Healthy' &&
                      validate == true &&
                      (selectedTreeData.prediction == 'healthy' ||
                        (selectedTreeData.validated_status == 'Healthy' &&
                          selectedTreeData.status != 'Unhealthy') ||
                        (selectedTreeData.status == 'Healthy' &&
                          selectedTreeData.validated_status != 'Unhealthy'))
                        ? '#33a02c'
                        : 'gray',
                  }}
                  onPress={() => {
                    updatestatus();
                    navigation.navigate(Route.MAP, {});
                  }}
                  disabled={
                    status == 'Healthy' &&
                    validate == true &&
                    (selectedTreeData.prediction == 'healthy' ||
                      (selectedTreeData.validated_status == 'Healthy' &&
                        selectedTreeData.status != 'Unhealthy') ||
                      (selectedTreeData.status == 'Healthy' &&
                        selectedTreeData.validated_status != 'Unhealthy'))
                      ? false
                      : true
                  }>
                  <Text style={styles.buttontext}>Save</Text>
                </Pressable>
                {validate == false ? (
                  <View style={{height: 110 * ratio}}>
                    <Toaster
                      style={styles.toaster}
                      textcolor={'red'}
                      res={false}
                      toastSuccess={false}
                      iconName={'exclamationcircleo'}
                      iconcolor={'#EF4444'}
                      toastMessage1={`Anda berada di luar batas dari\nlokasi pohon !`}
                      toastMessage2={`Harap pindah lebih dekat ke pohon untuk\nmenyimpan laporan validasi.`}
                    />
                  </View>
                ) : null}
              </View>
            ) : status == 'Healthy' &&
              (selectedTreeData.prediction == 'unhealthy' ||
                selectedTreeData.status == 'Healthy' ||
                selectedTreeData.validated_status == 'Healthy') ? (
              <View style={styles.container}>
                <Pressable
                  style={{
                    borderRadius: 5 * ratio,
                    padding: 10 * ratio,
                    width: '100%',
                    height: 44 * ratio,
                    backgroundColor:
                      (status == undefined &&
                        selectedTreeData.prediction == 'healthy' &&
                        validate == true) ||
                      (status == 'Healthy' &&
                        selectedTreeData.prediction == 'unhealthy' &&
                        image != null &&
                        image != '' &&
                        Addnote != null &&
                        Addnote != '' &&
                        validate == true)
                        ? '#33a02c'
                        : 'gray',
                  }}
                  onPress={() => {
                    updatestatus();
                    navigation.navigate(Route.MAP, {});
                  }}
                  disabled={
                    (status == undefined &&
                      selectedTreeData.prediction == 'healthy' &&
                      validate == true) ||
                    (status == 'Healthy' &&
                      selectedTreeData.prediction == 'unhealthy' &&
                      image != null &&
                      image != '' &&
                      Addnote != null &&
                      Addnote != '' &&
                      validate == true)
                      ? false
                      : true
                  }>
                  <Text style={styles.buttontext}>Save</Text>
                </Pressable>
                {validate == false ? (
                  <View style={{height: 110 * ratio}}>
                    <Toaster
                      style={styles.toaster}
                      textcolor={'red'}
                      res={false}
                      toastSuccess={false}
                      iconName={'exclamationcircleo'}
                      iconcolor={'#EF4444'}
                      toastMessage1={`Anda berada di luar batas dari\nlokasi pohon !`}
                      toastMessage2={`Harap pindah lebih dekat ke pohon untuk\nmenyimpan laporan validasi.`}
                    />
                  </View>
                ) : null}
              </View>
            ) : (
              <View style={styles.container}>
                {status == 'Healthy' &&
                selectedTreeData.prediction == 'healthy' &&
                (selectedTreeData.status == null ||
                  selectedTreeData.status == '') &&
                (selectedTreeData.validated_status == null ||
                  selectedTreeData.validated_status == '') ? (
                  <View style={{paddingVertical: 46 * ratio}}></View>
                ) : null}
                <Pressable
                  style={{
                    borderRadius: 5 * ratio,
                    padding: 10 * ratio,
                    width: '100%',
                    height: 44 * ratio,
                    backgroundColor:
                      (selected != null &&
                        selected != '' &&
                        value.includes('Others') &&
                        Addnote != null &&
                        Addnote != '' &&
                        validate == true) ||
                      (selected != null &&
                        selected != '' &&
                        !value.includes('Others') &&
                        validate == true) ||
                      (status == undefined &&
                        selectedTreeData.prediction == 'healthy' &&
                        validate == true) ||
                      (status == 'Healthy' && validate == true)
                        ? '#33a02c'
                        : 'gray',
                  }}
                  onPress={() => {
                    updatestatus();
                    navigation.navigate(Route.MAP, {});
                  }}
                  disabled={
                    (selected != null &&
                      selected != '' &&
                      value.includes('Others') &&
                      Addnote != null &&
                      Addnote != '' &&
                      validate == true) ||
                    (selected != null &&
                      selected != '' &&
                      !value.includes('Others') &&
                      validate == true) ||
                    (status == undefined &&
                      selectedTreeData.prediction == 'healthy' &&
                      validate == true) ||
                    (status == 'Healthy' && validate == true)
                      ? false
                      : true
                  }>
                  <Text style={styles.buttontext}>Save</Text>
                </Pressable>
                {validate == false ? (
                  <View style={{height: 110 * ratio}}>
                    <Toaster
                      style={styles.toaster}
                      textcolor={'red'}
                      res={false}
                      toastSuccess={false}
                      iconName={'exclamationcircleo'}
                      iconcolor={'#EF4444'}
                      toastMessage1={`Anda berada di luar batas dari\nlokasi pohon !`}
                      toastMessage2={`Harap pindah lebih dekat ke pohon untuk\nmenyimpan laporan validasi.`}
                    />
                  </View>
                ) : null}
              </View>
            )
          ) : initialswitch == 1 ? (
            status == '' || status == null ? (
              <View style={styles.container}>
                <Pressable
                  style={{
                    borderRadius: 5 * ratio,
                    padding: 10 * ratio,
                    width: '100%',
                    height: 44 * ratio,
                    backgroundColor:
                      (selected != null &&
                        selected != '' &&
                        value.includes('Others') &&
                        Addnote != null &&
                        Addnote != '' &&
                        validate == true) ||
                      (selected != null &&
                        selected != '' &&
                        !value.includes('Others') &&
                        validate == true) ||
                      (status == 'Healthy' && validate == true)
                        ? '#33a02c'
                        : 'gray',
                  }}
                  onPress={() => {
                    updatestatus();
                    navigation.navigate(Route.MAP, {});
                  }}
                  disabled={
                    (selected != null &&
                      selected != '' &&
                      value.includes('Others') &&
                      Addnote != null &&
                      Addnote != '' &&
                      validate == true) ||
                    (selected != null &&
                      selected != '' &&
                      !value.includes('Others') &&
                      validate == true) ||
                    (status == 'Healthy' && validate == true)
                      ? false
                      : true
                  }>
                  <Text style={styles.buttontext}>Save</Text>
                </Pressable>
                {validate == false ? (
                  <View style={{height: 110 * ratio}}>
                    <Toaster
                      style={styles.toaster}
                      textcolor={'red'}
                      res={false}
                      toastSuccess={false}
                      iconName={'exclamationcircleo'}
                      iconcolor={'#EF4444'}
                      toastMessage1={`Anda berada di luar batas dari\nlokasi pohon !`}
                      toastMessage2={`Harap pindah lebih dekat ke pohon untuk\nmenyimpan laporan validasi.`}
                    />
                  </View>
                ) : null}
              </View>
            ) : status == 'Healthy' ? (
              <View style={styles.container}>
                <View style={{paddingVertical: 46 * ratio}}></View>
                <Pressable
                  style={{
                    borderRadius: 5 * ratio,
                    padding: 10 * ratio,
                    width: '100%',
                    height: 44 * ratio,
                    backgroundColor:
                      (selected != null &&
                        selected != '' &&
                        value.includes('Others') &&
                        Addnote != null &&
                        Addnote != '' &&
                        validate == true) ||
                      (selected != null &&
                        selected != '' &&
                        !value.includes('Others') &&
                        validate == true) ||
                      (status == undefined &&
                        selectedTreeData.prediction == 'healthy' &&
                        validate == true) ||
                      (status == 'Healthy' && validate == true)
                        ? '#33a02c'
                        : 'gray',
                  }}
                  onPress={() => {
                    updatestatus();
                    navigation.navigate(Route.MAP, {});
                  }}
                  disabled={
                    (selected != null &&
                      selected != '' &&
                      value.includes('Others') &&
                      Addnote != null &&
                      Addnote != '' &&
                      validate == true) ||
                    (selected != null &&
                      selected != '' &&
                      !value.includes('Others') &&
                      validate == true) ||
                    (status == undefined &&
                      selectedTreeData.prediction == 'healthy' &&
                      validate == true) ||
                    (status == 'Healthy' && validate == true)
                      ? false
                      : true
                  }>
                  <Text style={styles.buttontext}>Save</Text>
                </Pressable>
                {validate == false ? (
                  <View style={{height: 110 * ratio}}>
                    <Toaster
                      style={styles.toaster}
                      textcolor={'red'}
                      res={false}
                      toastSuccess={false}
                      iconName={'exclamationcircleo'}
                      iconcolor={'#EF4444'}
                      toastMessage1={`Anda berada di luar batas dari\nlokasi pohon !`}
                      toastMessage2={`Harap pindah lebih dekat ke pohon untuk\nmenyimpan laporan validasi.`}
                    />
                  </View>
                ) : null}
              </View>
            ) : (
              <View style={styles.container}>
                <Pressable
                  style={{
                    borderRadius: 5 * ratio,
                    padding: 10 * ratio,
                    width: '100%',
                    height: 44 * ratio,
                    backgroundColor:
                      (selected != null &&
                        selected != '' &&
                        value.includes('Others') &&
                        Addnote != null &&
                        Addnote != '' &&
                        validate == true) ||
                      (selected != null &&
                        selected != '' &&
                        !value.includes('Others') &&
                        validate == true) ||
                      (status == undefined &&
                        selectedTreeData.prediction == 'healthy' &&
                        validate == true) ||
                      (status == 'Healthy' && validate == true)
                        ? '#33a02c'
                        : 'gray',
                  }}
                  onPress={() => {
                    updatestatus();
                    navigation.navigate(Route.MAP, {});
                  }}
                  disabled={
                    (selected != null &&
                      selected != '' &&
                      value.includes('Others') &&
                      Addnote != null &&
                      Addnote != '' &&
                      validate == true) ||
                    (selected != null &&
                      selected != '' &&
                      !value.includes('Others') &&
                      validate == true) ||
                    (status == undefined &&
                      selectedTreeData.prediction == 'healthy' &&
                      validate == true) ||
                    (status == 'Healthy' && validate == true)
                      ? false
                      : true
                  }>
                  <Text style={styles.buttontext}>Save</Text>
                </Pressable>
                {validate == false ? (
                  <View style={{height: 110 * ratio}}>
                    <Toaster
                      style={styles.toaster}
                      textcolor={'red'}
                      res={false}
                      toastSuccess={false}
                      iconName={'exclamationcircleo'}
                      iconcolor={'#EF4444'}
                      toastMessage1={`Anda berada di luar batas dari\nlokasi pohon !`}
                      toastMessage2={`Harap pindah lebih dekat ke pohon untuk\nmenyimpan laporan validasi.`}
                    />
                  </View>
                ) : null}
              </View>
            )
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};

export default ValidateGroundTruth;
