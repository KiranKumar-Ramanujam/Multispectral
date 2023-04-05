import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  LayoutAnimation,
  View,
  Text,
  ScrollView,
  UIManager,
  TouchableOpacity,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import RNFS from 'react-native-fs';

import SQLite from 'react-native-sqlite-storage';

import ModalDropdown from '../../components/DropDown';
import {CustomAlert} from '../../components';

import {colors, gStyle} from '../../constants';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './styles/DataStyles';

const ExpandableComponent = ({item, onClickFunction}) => {
  const theme = 'light';
  const {width, height} = Dimensions.get('window');
  const ratio = Math.min(width, height) / 375;
  const [layoutHeight, setLayoutHeight] = useState(0);
  const [Dropdown, setDropdown] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const [item2, setItem2] = useState(item);

  useEffect(() => {
    if (item.isExpanded) {
      setLayoutHeight(null);
    } else {
      setLayoutHeight(0);
    }
  }, [item.isExpanded]);

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

  const handleDeleteBlock = () => {
    setIsAlertVisible(true);
  };

  const handleConfirmDeleteBlock = items => {
    try {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT DISTINCT(predictionId) FROM MDB_trees WHERE blockId = ? AND blockName = ?',
          [items.blockId, items.blockName],
          (tx, results) => {
            var temp_predictionId = [];
            var temp_verificationId = [];

            var len = results.rows.length;
            if (len > 0) {
              for (let i = 0; i < results.rows.length; ++i) {
                temp_predictionId.push(results.rows.item(i)['predictionId']);
              }
              const temp_predictionId_String = temp_predictionId.join(',');
              tx.executeSql(
                `SELECT verificationId FROM MDB_manual_verification WHERE predictionId IN (${temp_predictionId_String})`,
                [],
                (tx, results) => {
                  var len = results.rows.length;
                  if (len > 0) {
                    for (let i = 0; i < results.rows.length; ++i) {
                      temp_verificationId.push(
                        results.rows.item(i)['verificationId'],
                      );
                    }
                    tx.executeSql(
                      `DELETE FROM MDB_manual_verification WHERE predictionId IN (${temp_predictionId_String})`,
                      [],
                      (tx, results) => {
                        if (results.rowsAffected > 0) {
                        } else alert('Deletion Failed');
                      },
                    );

                    const temp_verificationId_String =
                      temp_verificationId.join(',');
                    tx.executeSql(
                      `DELETE FROM MDB_verification_image WHERE verificationId IN (${temp_verificationId_String})`,
                      [],
                      (tx, results) => {
                        if (results.rowsAffected > 0) {
                        } else alert('Deletion Failed');
                      },
                    );
                    tx.executeSql(
                      `DELETE FROM MDB_manualverification_pest_disease WHERE verificationId IN (${temp_verificationId_String})`,
                      [],
                      (tx, results) => {
                        if (results.rowsAffected > 0) {
                        } else alert('Deletion Failed');
                      },
                    );
                  }
                },
              );
            }
          },
        );

        tx.executeSql(
          'SELECT DISTINCT(compressedImagePath) FROM MDB_trees WHERE blockId = ? AND blockName = ? ',
          [items.blockId, items.blockName],
          (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {
              for (let i = 0; i < results.rows.length; ++i) {
                const temp = results.rows.item(i)['compressedImagePath'];
                RNFS.unlink(`file://${temp}`);
              }
            }
          },
        );
        tx.executeSql(
          'DELETE FROM MDB_trees WHERE blockId = ? AND blockName = ? ',
          [items.blockId, items.blockName],
          (tx, results) => {
            if (results.rowsAffected > 0) {
            } else alert('Deletion Failed');
          },
        );
        const updatedSubcategory = item2.subcategory.filter(
          item => item.blockId !== items.blockId,
        );
        const item = {
          ...item2,
          subcategory: updatedSubcategory,
        };
        setItem2(item);
      });

      setIsAlertVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelDeleteBlock = () => {
    setIsAlertVisible(false);
  };

  return (
    <View>
      {item2.subcategory != null && item2.subcategory != '' ? (
        <View>
          <TouchableOpacity style={styles.Subheader}>
            <Text style={styles.Subtext}>Afdeling</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              onClickFunction();
              setDropdown(!Dropdown);
            }}
            style={[
              styles.header,
              {
                backgroundColor: Dropdown ? '#079613' : colors.white,
              },
            ]}>
            <View style={styles.touchableopacity}>
              <Text
                style={[
                  styles.headerText,
                  {
                    color: Dropdown ? colors.white : 'gray',
                  },
                ]}>
                {item2.category_name}
              </Text>
              {Dropdown ? (
                <MaterialCommunityIcons
                  name="chevron-up"
                  size={26 * ratio}
                  color={'white'}
                  style={styles.dropdownbutton}
                />
              ) : (
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={26 * ratio}
                  color={'gray'}
                  style={styles.dropdownbutton}
                />
              )}
            </View>
          </TouchableOpacity>
          <View
            style={{
              height: layoutHeight,
              overflow: 'hidden',
            }}>
            <TouchableOpacity style={styles.Subheader}>
              <Text style={styles.Subtext}>Blok</Text>
            </TouchableOpacity>
            {item2.subcategory.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.content,
                  {backgroundColor: index % 2 === 0 ? 'white' : '#E6F5EE'},
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginStart: -10 * ratio,
                  }}>
                  <Text style={styles.text}>{item.blockName}</Text>
                  <MaterialCommunityIcons
                    name="trash-can"
                    style={styles.deletebutton}
                    color={colors.switch_iconred}
                    size={28 * ratio}
                    onPress={handleDeleteBlock}
                  />
                  <CustomAlert
                    visible={isAlertVisible}
                    title="Warning !"
                    message={`Are you sure you want to delete block ? \n\nPlease note that all the recorded verifications will be lost for below block.`}
                    message2={
                      <Text style={{color: 'blue', fontWeight: 'bold'}}>
                        {item.blockName}
                      </Text>
                    }
                    onConfirm={() => {
                      handleConfirmDeleteBlock(item);
                    }}
                    onCancel={handleCancelDeleteBlock}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            padding: 80 * ratio,
            alignSelf: 'center',
          }}>
          <Text
            style={[
              gStyle.text[theme],
              styles.dropdown_text,
              styles.nodatashow,
            ]}>
            No records to Show.
          </Text>
        </View>
      )}
    </View>
  );
};

const Stats = () => {
  const theme = 'light';

  const {width, height} = Dimensions.get('window');
  const ratio = Math.min(width, height) / 375;

  const [Data, setData] = useState([]);
  const [Region, setRegion] = useState([]);
  const [EstateGroup, setEstateGroup] = useState([]);
  const [Estate, setEstate] = useState([]);
  const [Temp, setTemp] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      db.transaction(tx => {
        tx.executeSql('SELECT * from MDB_trees', [], (tx, results) => {
          var temp = [];
          var len = results.rows.length;
          if (len > 0) {
            setTemp(true);
          } else {
            setTemp(false);
          }
        });
      });
    }, []),
  );

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT DISTINCT(regionId), regionName from MDB_trees',
        [],
        (tx, results) => {
          var temp = [];
          var len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setRegion(temp);
          }
        },
      );

      tx.executeSql(
        'SELECT DISTINCT(estateGroupId), estateGroupName from MDB_trees',
        [],
        (tx, results) => {
          var temp = [];
          var len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setEstateGroup(temp);
          }
        },
      );

      tx.executeSql(
        'SELECT DISTINCT(estateId), estateName from MDB_trees',
        [],
        (tx, results) => {
          var temp = [];
          var len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setEstate(temp);
          }
        },
      );

      tx.executeSql(
        'SELECT  DISTINCT(afdelingId) FROM MDB_trees',
        [],
        (tx, results) => {
          const afdelingIds = results.rows.raw().map(row => row.afdelingId);

          afdelingIds.forEach(afdelingId => {
            tx.executeSql(
              'SELECT DISTINCT (blockId), blockName FROM MDB_trees WHERE afdelingId = ?',
              [afdelingId],
              (tx, results) => {
                const blocks = results.rows.raw();
                const category = {
                  isExpanded: false,
                  category_name: `Afdeling ${afdelingId}`,
                  subcategory: blocks.map(block => ({
                    blockId: block.blockId,
                    blockName: block.blockName,
                  })),
                };
                content.push(category);
                setData(content);
              },
            );
          });
        },
      );
    });
  }, []);

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

  let content = [];

  const options_estate = ['estateName'];
  const options_estategroup = ['estateGroupName'];
  const options_region = ['regionName'];

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const updateLayout = index => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...Data];
    array.map((value, placeindex) =>
      placeindex === index
        ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
        : (array[placeindex]['isExpanded'] = false),
    );
    setData(array);
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={{flexDirection: 'row', padding: 5 * ratio}}></View>
        <ScrollView>
          {Region != null && Region != '' && Temp == true ? (
            <View style={styles.innerContainer}>
              <View style={styles.modal_status}>
                <Text
                  style={[
                    gStyle.text[theme],
                    styles.dropdown_text,
                    styles.textallign,
                  ]}>
                  Region
                </Text>
              </View>
              <View style={styles.dropdown_container}>
                <ModalDropdown
                  data={Region}
                  disabled={true}
                  selected_Item={0}
                  placeholder={'Select Region'}
                  options={options_region}
                  item={'regionName'}
                />
              </View>
            </View>
          ) : (
            <View style={styles.innerContainer}>
              <View style={styles.modal_status}>
                <Text
                  style={[
                    gStyle.text[theme],
                    styles.dropdown_text,
                    styles.textallign,
                  ]}>
                  Region
                </Text>
              </View>
              <View style={styles.dropdown_container}>
                <ModalDropdown
                  data={Region}
                  disabled={true}
                  placeholder={'Select Region'}
                  options={options_region}
                  item={'regionName'}
                />
              </View>
            </View>
          )}

          {EstateGroup != null && EstateGroup != '' && Temp == true ? (
            <View style={styles.innerContainer}>
              <View style={styles.modal_status}>
                <Text
                  style={[
                    gStyle.text[theme],
                    styles.dropdown_text,
                    styles.textallign,
                  ]}>
                  Estate Group
                </Text>
              </View>
              <View style={styles.dropdown_container}>
                <ModalDropdown
                  data={EstateGroup}
                  disabled={true}
                  selected_Item={0}
                  placeholder={'Select Estate Group'}
                  options={options_estategroup}
                  item={'estateGroupName'}
                />
              </View>
            </View>
          ) : (
            <View style={styles.innerContainer}>
              <View style={styles.modal_status}>
                <Text
                  style={[
                    gStyle.text[theme],
                    styles.dropdown_text,
                    styles.textallign,
                  ]}>
                  Estate Group
                </Text>
              </View>
              <View style={styles.dropdown_container}>
                <ModalDropdown
                  data={EstateGroup}
                  disabled={true}
                  placeholder={'Select Estate Group'}
                  options={options_estategroup}
                  item={'estateGroupName'}
                />
              </View>
            </View>
          )}

          {Estate != null && Estate != '' && Temp == true ? (
            <View style={styles.innerContainer}>
              <View style={styles.modal_status}>
                <Text
                  style={[
                    gStyle.text[theme],
                    styles.dropdown_text,
                    styles.textallign,
                  ]}>
                  Estate
                </Text>
              </View>
              <View style={styles.dropdown_container}>
                <ModalDropdown
                  data={Estate}
                  disabled={true}
                  selected_Item={0}
                  placeholder={'Select Estate'}
                  options={options_estate}
                  item={'estateName'}
                />
              </View>
            </View>
          ) : (
            <View style={styles.innerContainer}>
              <View style={styles.modal_status}>
                <Text
                  style={[
                    gStyle.text[theme],
                    styles.dropdown_text,
                    styles.textallign,
                  ]}>
                  Estate
                </Text>
              </View>
              <View style={styles.dropdown_container}>
                <ModalDropdown
                  data={Estate}
                  disabled={true}
                  placeholder={'Select Estate'}
                  options={options_estate}
                  item={'estateName'}
                />
              </View>
            </View>
          )}
          <View style={{flexDirection: 'row', padding: 10 * ratio}}></View>
          {Data != null && Data != '' && Temp == true ? (
            <View>
              {Data.map((item, key) => (
                <ExpandableComponent
                  key={item.category_name}
                  onClickFunction={() => {
                    updateLayout(key);
                  }}
                  item={item}
                />
              ))}
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                padding: 80 * ratio,
                alignSelf: 'center',
              }}>
              <Text
                style={[
                  gStyle.text[theme],
                  styles.dropdown_text,
                  styles.nodatashow,
                ]}>
                No records to Show.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

Stats.navigationOptions = {
  headerTitleStyle: gStyle.headerTitleStyle,
  title: 'Stats',
};

export default Stats;
