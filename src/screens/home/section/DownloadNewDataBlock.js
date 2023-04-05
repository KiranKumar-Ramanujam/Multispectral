import React, {useState, useEffect, useRef} from 'react';
import {View, Alert, Text, TouchableOpacity, Dimensions} from 'react-native';
import {MultiSelect, Dropdown} from 'react-native-element-dropdown';
import base64 from 'react-native-base64';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {useFocusEffect} from '@react-navigation/native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {NetworkUtils} from '../../../utils';

import SQLite from 'react-native-sqlite-storage';

import moment from 'moment';

import {API_URL} from '../../../helper/helper';

import {gStyle, colors} from '../../../constants';

import {Touch} from '../../../components';
import {SingleButtonPopup} from '../../../components';

import styles from '../styles/DownNewDataStyles';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const DownloadNewDataBlock = ({navigation}) => {
  const theme = 'light';
  const {width, height} = Dimensions.get('window');
  const ratio = Math.min(width, height) / 375;

  const [dbdata, setdbdata] = useState([]);
  const [dbpestdisease, setdbpestdisease] = useState('');
  const [predicted_region, setpredicted_region] = useState([]);
  const [predicted_estate_group, setpredicted_estate_group] = useState([]);
  const [predicted_estate, setpredicted_estate] = useState([]);
  const [predicted_afdeling, setpredicted_afdeling] = useState([]);
  const [predicted_block, setpredicted_block] = useState([]);
  const [predicted_capturedate, setpredicted_capturedate] = useState([]);

  const [selected_region, setSelectedRegion] = useState('');
  const [selected_estate_group, setSelectedEstateGroup] = useState('');
  const [selected_estate, setSelectedEstate] = useState('');
  const [selected_afdeling, setSelectedAfdeling] = useState('');
  const [selected, setSelected] = useState([]);
  const [value, setValue] = useState([]);
  const [selected_capturedDate, setSelectedcapturedDate] = useState('');

  var Trees = '';
  const [temp, settemp] = useState(false);
  const [temp2, settemp2] = useState(false);
  const [netInfo, setNetInfo] = useState(false);

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
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.setOptions({
        tabBarStyle: {
          height: 0,
        },
      });
    }
    return () => {
      if (parentNavigation) {
        parentNavigation.setOptions({
          tabBarStyle: {
            height: 70 * ratio,
          },
        });
      }
    };
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      createTable();
      getData();
      getPredictedData();
      setSelected(null);
      setInterval(async () => {
        let NetworkInfo = JSON.parse(await NetworkUtils.isNetworkAvailable());
        setNetInfo(NetworkInfo);
      }, 10);
    }, []),
  );

  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' +
          'MDB_trees ' +
          '(treeId INTEGER, blockId INTEGER, blockName TEXT, latitude INTEGER, longitude INTEGER, yearOfPlanting INTEGER,  predictionId INTEGER, prediction TEXT, droneImageId INTEGER, verified BOOLEAN, compressedImageId INTEGER, compressedImagePath TEXT, nw_latitude TEXT, nw_logitude TEXT, se_latitude TEXT, se_longitude TEXT, regionId INTEGER, regionName TEXT, estateGroupId INTEGER, estateGroupName TEXT, estateId INTEGER, estateName TEXT, afdelingId INTEGER, afdelingName TEXT, validated_verificationId INTEGER, validated_status TEXT, createdAt TIMESTAMP, updatedAt TIMESTAMP);',
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' +
          'MDB_pest_disease ' +
          '(pestDiseaseId INTEGER PRIMARY KEY, pestDiseaseCode TEXT, pestDiseaseName TEXT, pestDiseaseType TEXT, responsibilityGroup TEXT, createdAt TIMESTAMP, updatedAt TIMESTAMP);',
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' +
          'MDB_manual_verification ' +
          '(verificationId INTEGER PRIMARY KEY AUTOINCREMENT, predictionId INTEGER, userId INTEGER, datetime TIMESTAMP, status TEXT, remarks TEXT, user_latitude INTEGER,  user_longitude INTEGER, accuracy TEXT, createdAt TIMESTAMP, updatedAt TIMESTAMP);',
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' +
          'MDB_verification_image ' +
          '(verificationImageId INTEGER PRIMARY KEY AUTOINCREMENT, verificationId INTEGER, userId INTEGER, filename TEXT, uploadPath TEXT, uploadDate TIMESTAMP, description TEXT, createdAt TIMESTAMP, updatedAt TIMESTAMP);',
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' +
          'MDB_manualverification_pest_disease ' +
          '(manualverification_pdId INTEGER PRIMARY KEY AUTOINCREMENT, verificationId INTEGER, pestDiseaseId INTEGER, pestDiseaseName TEXT, createdAt TIMESTAMP, updatedAt TIMESTAMP);',
      );
    });
  };

  const getData = () => {
    try {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM MDB_trees', [], (tx, results) => {
          var temp = [];
          var len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setdbdata(temp);
          }
        });

        tx.executeSql('SELECT * FROM MDB_pest_disease', [], (tx, results) => {
          var temp = [];
          var len = results.rows.length;

          if (len > 0) {
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setdbpestdisease(temp);
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getPredictedData = async () => {
    try {
      await fetch(`${API_URL}/api/shared/predicted_region`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(async result => {
          try {
            const jsonRes = await result.json();
            const predicted_region = jsonRes.data;
            setpredicted_region(predicted_region);
          } catch (err) {
            console.log(err);
          }
        })
        .catch(err => {
          console.log(err);
        });

      await fetch(`${API_URL}/api/shared/predicted_estate_group`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(async result => {
          try {
            const jsonRes = await result.json();
            const predicted_estate_group = jsonRes.data;
            setpredicted_estate_group(predicted_estate_group);
          } catch (err) {
            console.log(err);
          }
        })
        .catch(err => {
          console.log(err);
        });

      await fetch(`${API_URL}/api/shared/predicted_estate`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(async result => {
          try {
            const jsonRes = await result.json();
            const predicted_estate = jsonRes.data;
            setpredicted_estate(predicted_estate);
          } catch (err) {
            console.log(err);
          }
        })
        .catch(err => {
          console.log(err);
        });

      await fetch(`${API_URL}/api/shared/predicted_afdeling`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(async result => {
          try {
            const jsonRes = await result.json();
            const predicted_afdeling = jsonRes.data;
            setpredicted_afdeling(predicted_afdeling);
          } catch (err) {
            console.log(err);
          }
        })
        .catch(err => {
          console.log(err);
        });

      await fetch(`${API_URL}/api/shared/predicted_block`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(async result => {
          try {
            const jsonRes = await result.json();
            const predicted_block = jsonRes.data;
            setpredicted_block(predicted_block);
            // }
          } catch (err) {
            console.log(err);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkDropdowns();
  }, [
    selected_region,
    selected_estate_group,
    selected_estate,
    selected_afdeling,
    selected,
  ]);

  const [downloadEnabled, setDownloadEnabled] = useState(false);

  const checkDropdowns = () => {
    if (
      selected_region &&
      selected_estate_group &&
      selected_estate &&
      selected_afdeling &&
      selected &&
      netInfo
    ) {
      setDownloadEnabled(true);
    } else {
      setDownloadEnabled(false);
    }
  };

  const DownloadOffline = async () => {
    try {
      var blockId = '';

      if (selected != null) {
        const temp =
          JSON.stringify(selected_region.id) +
          '/' +
          JSON.stringify(selected_estate_group.id) +
          '/' +
          JSON.stringify(selected_estate.id) +
          '/' +
          JSON.stringify(selected_afdeling.id) +
          '/' +
          JSON.stringify(selected);
        blockId = 'blockId=' + base64.encode(temp);
      }
      if (dbdata.length == 0 && temp == false) {
        if (Trees == null || Trees == '') {
          await fetch(`${API_URL}/api/mobile/tree?${blockId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(async result => {
              try {
                const jsonRes = await result.json();
                Trees = jsonRes.data;
                if (Trees.length == 0) {
                  Alert.alert(
                    'Warning!',
                    'Master Data is Empty. Please check the Master Data First.',
                  );
                } else {
                  if (dbdata.length == 0) {
                    console.log(Trees);
                    await db.transaction(async tx => {
                      var date = moment().format('YYYY/MM/DD hh:mm:ss a');
                      for (let i = 0; i < Trees.length; i++) {
                        await tx.executeSql(
                          'INSERT INTO MDB_trees ( treeId, blockId, blockName, latitude, longitude, yearOfPlanting,  predictionId, prediction, droneImageId, verified, compressedImageId, compressedImagePath, nw_latitude, nw_logitude, se_latitude, se_longitude, regionId, regionName, estateGroupId, estateGroupName, estateId, estateName, afdelingId, afdelingName, validated_verificationId, validated_status, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                          [
                            Trees[i].treeId,
                            Trees[i].blockId,
                            Trees[i].blockName,
                            Trees[i].latitude,
                            Trees[i].longitude,
                            Trees[i].yearOfPlanting,
                            Trees[i].predictionId,
                            Trees[i].prediction,
                            Trees[i].droneImageId,
                            Trees[i].verified,
                            Trees[i].compressedImageId,
                            Trees[i].compressedImagePath,
                            Trees[i].nw_latitude,
                            Trees[i].nw_longitude,
                            Trees[i].se_latitude,
                            Trees[i].se_longitude,
                            Trees[i].regionId,
                            Trees[i].regionName,
                            Trees[i].estateGroupId,
                            Trees[i].estateGroupName,
                            Trees[i].estateId,
                            Trees[i].estateName,
                            Trees[i].afdelingId,
                            Trees[i].afdelingName,
                            Trees[i].verificationId,
                            Trees[i].status,
                            date,
                            date,
                          ],
                        );
                      }
                    });
                    setmodalVisible(true);
                  }
                }
              } catch (err) {
                console.log(err);
              }
            })
            .catch(err => {
              console.log(err);
            });

          await fetch(`${API_URL}/api/shared/pest_disease`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(async result => {
              try {
                const jsonRes = await result.json();
                const Pest_Disease = jsonRes.data;
                if (Pest_Disease.length == 0) {
                  Alert.alert(
                    'Warning!',
                    ' Pest Disease Master Data is Empty. Please check the Master Data First.',
                  );
                } else {
                  if (dbpestdisease.length == 0) {
                    await db.transaction(async tx => {
                      var date = moment().format('YYYY/MM/DD hh:mm:ss a');
                      for (let i = 0; i < Pest_Disease.length; i++) {
                        await tx.executeSql(
                          'INSERT INTO MDB_pest_disease (pestDiseaseId, pestDiseaseCode, pestDiseaseName, pestDiseaseType, responsibilityGroup, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?)',
                          [
                            Pest_Disease[i].pestDiseaseId,
                            Pest_Disease[i].pestDiseaseCode,
                            Pest_Disease[i].pestDiseaseName,
                            Pest_Disease[i].pestDiseaseType,
                            Pest_Disease[i].responsibilityGroup,
                            date,
                            date,
                          ],
                        );
                      }
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

          db.transaction(tx => {
            tx.executeSql(
              'SELECT DISTINCT(compressedImageId), compressedImagePath from MDB_trees',
              [],
              (tx, results) => {
                var temp = [];
                var len = results.rows.length;

                if (len > 0) {
                  for (let i = 0; i < results.rows.length; ++i) {
                    let droneImagePath =
                      results.rows.item(i)['compressedImagePath'];
                    const cutPoint = 'drone_image_shapefile';
                    const cutIndex =
                      droneImagePath.indexOf(cutPoint) + cutPoint.length;
                    const newPath = droneImagePath.slice(cutIndex);
                    const compressedImageId =
                      results.rows.item(i)['compressedImageId'];
                    const imagePath = `${
                      ReactNativeBlobUtil.fs.dirs.DocumentDir
                    }/image${[i]}.webp`;

                    ReactNativeBlobUtil.config({
                      fileCache: true,
                      appendExt: 'webp',
                    })
                      .fetch(
                        'GET',
                        `${API_URL}/api/map/compress_image${newPath}`,
                      )
                      .then(response => {
                        return response.readFile('base64');
                      })
                      .then(base64Data => {
                        return ReactNativeBlobUtil.fs.writeFile(
                          imagePath,
                          base64Data,
                          'base64',
                        );
                      })
                      .then(() => {
                        console.log(
                          'Image downloaded and saved to local storage',
                        );
                      })
                      .catch(error => {
                        console.log(error);
                      });

                    tx.executeSql(
                      'UPDATE MDB_trees SET compressedImagePath = ? WHERE compressedImageId  = ?',
                      [imagePath, compressedImageId],
                      (tx, results) => {},
                      (tx, error) => {
                        console.log('error');
                      },
                    );
                  }
                }
                settemp(true);
              },
            );
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Resetdropdown = async () => {
    setSelectedRegion(null);
    setSelectedEstateGroup(null);
    setSelectedEstate(null);
    setSelectedAfdeling(null);
    setSelected(null);
  };

  DropdownCallback_Region = async childData => {
    setSelectedRegion(childData);
    await fetch(
      `${API_URL}/api/shared/predicted_estate_group?regionId=${childData.id}`,
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
          const predicted_estate_group = jsonRes.data;
          setpredicted_estate_group(predicted_estate_group);
          setSelectedEstateGroup(null);
          setSelectedEstate(null);
          setSelectedAfdeling(null);
          setSelected(null);
        } catch (err) {
          console.log(err);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  DropdownCallback_Estate_Group = async childData => {
    setSelectedEstateGroup(childData);

    await fetch(
      `${API_URL}/api/shared/predicted_estate?estateGroupId=${childData.id}`,
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
          const predicted_estate = jsonRes.data;
          setpredicted_estate(predicted_estate);
          setSelectedEstate(null);
          setSelectedAfdeling(null);
          setSelected(null);
        } catch (err) {
          console.log(err);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  DropdownCallback_Estate = async childData => {
    setSelectedEstate(childData);

    await fetch(
      `${API_URL}/api/shared/predicted_afdeling?estateId=${childData.id}`,
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
          const predicted_afdeling = jsonRes.data;
          setpredicted_afdeling(predicted_afdeling);
          setSelectedAfdeling(null);
          setSelected(null);
        } catch (err) {
          console.log(err);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  DropdownCallback_Afdeling = async childData => {
    setSelectedAfdeling(childData);
    await fetch(
      `${API_URL}/api/shared/predicted_block?afdelingId=${childData.id}`,
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
          const predicted_block = jsonRes.data;
          setpredicted_block(predicted_block);
          setSelected(null);
        } catch (err) {
          console.log(err);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const renderDataItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.name}</Text>
        {(selected != null) & (selected != '') ? (
          <View>
            {selected.map((item2, index) => {
              if (item2 == item.id) {
                return (
                  <MaterialCommunityIcons
                    key={index}
                    color={colors.marker_green}
                    name="check"
                    size={25}
                  />
                );
              }
            })}
          </View>
        ) : null}
      </View>
    );
  };

  const onSelectedItemsChange = async test => {
    if (predicted_block != null && predicted_block != '') {
      const newArray = predicted_block.filter(item => test.includes(item.id));

      const newArray2 = newArray.map(item => {
        return item.name;
      });
      setValue(newArray2);

      await fetch(
        `${API_URL}/api/shared/predicted_capturedate?blockId=${test.id}`,
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
            const predicted_capturedate = jsonRes.data;
            setpredicted_capturedate(predicted_capturedate);
          } catch (err) {
            console.log(err);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const [modalVisible, setmodalVisible] = useState(false);

  const hideModal = () => {
    setmodalVisible(false);
    settemp2(true);
  };

  DropdownCallback_CapturedDate = async childData => {
    setSelectedcapturedDate(childData);
  };

  return (
    <View style={gStyle.container[theme]}>
      <View
        style={[
          {
            width: '100%',
            paddingLeft: hp('1.7%'),
            paddingRight: hp('1.7%'),
            position: 'absolute',
            marginTop: 10 * ratio,
          },
        ]}>
        {temp == true ? (
          <View>
            <SingleButtonPopup
              visible={modalVisible}
              onCancel={hideModal}
              title="Information.."
              message={'Data is Downloaded Successfully.'}
            />
          </View>
        ) : null}

        {dbdata.length != 0 || temp2 == true ? (
          <View>
            <SingleButtonPopup
              visible={modalVisible}
              onCancel={hideModal}
              title="Information.."
              message={
                'Data is already downloaded. \nPlease Synchronize first to download the new data. '
              }
            />
          </View>
        ) : null}

        <View style={styles.innerContainer}>
          <View style={styles.modal_status}>
            <Text style={[gStyle.text[theme], styles.text]}>Region</Text>
          </View>
          <View style={styles.dropdown_container}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              labelField="name"
              valueField="id"
              data={predicted_region}
              placeholder={'Select Region'}
              value={selected_region}
              onChange={value => DropdownCallback_Region(value)}
              search
              searchPlaceholder="Search..."
              activeColor={'#AECA98'}
              itemTextStyle={styles.itemTextStyle}
            />
          </View>
        </View>

        <View style={styles.innerContainer}>
          <View style={styles.modal_status}>
            <Text style={[gStyle.text[theme], styles.text]}>Estate Group</Text>
          </View>
          <View style={styles.dropdown_container}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              placeholder={'Select Estate Group'}
              labelField="name"
              valueField="id"
              data={predicted_estate_group}
              value={selected_estate_group}
              onChange={value => DropdownCallback_Estate_Group(value)}
              search
              searchPlaceholder="Search..."
              disable={!selected_region}
              activeColor={'#AECA98'}
              itemTextStyle={styles.itemTextStyle}
            />
          </View>
        </View>

        <View style={styles.innerContainer}>
          <View style={styles.modal_status}>
            <Text style={[gStyle.text[theme], styles.text]}>Estate</Text>
          </View>
          <View style={styles.dropdown_container}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              placeholder={'Select Estate'}
              labelField="name"
              valueField="id"
              data={predicted_estate}
              value={selected_estate}
              onChange={value => DropdownCallback_Estate(value)}
              search
              searchPlaceholder="Search..."
              disable={!selected_estate_group}
              activeColor={'#AECA98'}
              itemTextStyle={styles.itemTextStyle}
            />
          </View>
        </View>

        <View style={styles.innerContainer}>
          <View style={styles.modal_status}>
            <Text style={[gStyle.text[theme], styles.text]}>Afdeling</Text>
          </View>
          <View style={styles.dropdown_container}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              placeholder={'Select Afdeling'}
              labelField="name"
              valueField="id"
              data={predicted_afdeling}
              value={selected_afdeling}
              onChange={value => DropdownCallback_Afdeling(value)}
              search
              searchPlaceholder="Search..."
              disable={!selected_estate}
              activeColor={'#AECA98'}
              itemTextStyle={styles.itemTextStyle}
            />
          </View>
        </View>

        <View style={styles.innerContainer}>
          <View style={styles.modal_status}>
            <Text style={[gStyle.text[theme], styles.text]}>Blok</Text>
          </View>
          <View style={styles.dropdown_container}>
            <MultiSelect
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={predicted_block}
              activeColor="white"
              labelField="name"
              valueField="id"
              value={selected}
              maxSelect={3}
              placeholder={
                selected != null &&
                selected != '' &&
                value != null &&
                value != ''
                  ? value + ','
                  : 'Select Block'
              }
              search
              searchPlaceholder="Search..."
              onChange={item => {
                setSelected(item);
                onSelectedItemsChange(item);
              }}
              disable={!selected_afdeling}
              renderItem={renderDataItem}
              renderSelectedItem={(item, unSelect) => (
                <View style={styles.date_dropdown_bubble}>
                  <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                    {selected != null && selected != '' ? (
                      <View style={styles.selectedStyle_1}>
                        <Text style={styles.textSelectedStyle_1}>
                          {item.name}
                        </Text>
                        <AntDesign
                          color="white"
                          name="closecircle"
                          size={15 * ratio}
                        />
                      </View>
                    ) : null}
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
        <View>
          {selected != null && selected != '' ? (
            <View style={styles.date_dropdown}>
              <View style={styles.innerContainer}>
                <View style={styles.modal_status}>
                  <Text style={[gStyle.text[theme], styles.text]}>Tanggal</Text>
                </View>
                <View style={styles.dropdown_container}>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    labelField="name"
                    valueField="id"
                    data={predicted_capturedate}
                    placeholder={'Select Date'}
                    value={selected_capturedDate}
                    onChange={value => DropdownCallback_CapturedDate(value)}
                    search
                    searchPlaceholder="Search..."
                    activeColor={'#AECA98'}
                    itemTextStyle={styles.itemTextStyle}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.innerContainer}>
              <View style={styles.modal_status}>
                <Text style={[gStyle.text[theme], styles.text]}>Tanggal</Text>
              </View>
              <View style={styles.dropdown_container}>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  labelField="name"
                  valueField="id"
                  data={predicted_capturedate}
                  placeholder={'Select Date'}
                  value={selected_capturedDate}
                  onChange={value => DropdownCallback_CapturedDate(value)}
                  search
                  searchPlaceholder="Search..."
                  activeColor={'#AECA98'}
                  itemTextStyle={styles.itemTextStyle}
                />
              </View>
            </View>
          )}
        </View>
      </View>
      <View style={styles.DownloadBtn}>
        <TouchableOpacity
          style={{
            color: '#000000',
            height: hp('5.5%'),
            alignItems: 'center',
            backgroundColor: '#009D57',
            justifyContent: 'center',
            borderRadius: 8,
            marginBottom: '3%',
            backgroundColor: downloadEnabled ? colors.greenColor : '#C0C0C0',
            borderColor: downloadEnabled ? colors.greenColor : '#C0C0C0',
          }}
          disabled={downloadEnabled ? false : true}
          onPress={() => {
            DownloadOffline();
            setmodalVisible(true);
          }}>
          <Text
            style={{
              fontSize: 16.7 * ratio,
              fontWeight: '500',
              color: downloadEnabled ? '#FCFCFC' : 'gray',
            }}>
            Download
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DownloadNewDataBlock;
