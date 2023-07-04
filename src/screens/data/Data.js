import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import {useDispatch} from 'react-redux';

import {DownloadDropdownLabelAction} from '../../redux/actions/download_dropdown.action';
import {FilterDropdownLabelAction} from '../../redux/actions/dropdown.action';

import SQLite from 'react-native-sqlcipher';

import ModalDropdown from '../../components/DropDown';
import {StandardAlert} from '../../components';

import {colors, gStyle} from '../../constants';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './styles/DataStyles';

const Stats = () => {
  const theme = 'light';

  const {width, height} = Dimensions.get('window');
  const ratio = Math.min(width, height) / 375;

  const [Data, setData] = useState([]);
  const [Region, setRegion] = useState([]);
  const [EstateGroup, setEstateGroup] = useState([]);
  const [Estate, setEstate] = useState([]);
  const [Afdeling, setAfdeling] = useState([]);
  const [Temp, setTemp] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isAlertVisible2, setIsAlertVisible2] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      setRegion(null);
      setEstateGroup(null);
      setEstate(null);
      setAfdeling(null);
      setData(null);

      db.transaction(tx => {
        tx.executeSql('SELECT * from MDB_trees LIMIT 1', [], (tx, results) => {
          var temp = [];
          var len = results.rows.length;
          if (len > 0) {
            setTemp(true);
          } else {
            setTemp(false);
          }
        });

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
            } else {
              setRegion(null);
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
            } else {
              setEstateGroup(null);
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
            } else {
              setEstate(null);
            }
          },
        );

        tx.executeSql(
          'SELECT DISTINCT(afdelingId), afdelingName from MDB_trees',
          [],
          (tx, results) => {
            var temp = [];
            var len = results.rows.length;
            if (len > 0) {
              for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
              setAfdeling(temp);
            } else {
              setAfdeling(null);
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
                  const temp_blok = results.rows.raw();
                  setData(
                    temp_blok.map(block => ({
                      blockId: block.blockId,
                      blockName: block.blockName,
                    })),
                  );
                },
              );
            });
          },
        );
      });
    }, []),
  );

  let dbName = 'multispectral.db';
  const db = SQLite.openDatabase(
    {name: RNFS.ExternalDirectoryPath + '/' + dbName, key: '1234567890'},
    () => {},
    error => {
      console.log(error);
    },
  );

  const options_afdeling = ['afdelingName'];
  const options_estate = ['estateName'];
  const options_estategroup = ['estateGroupName'];
  const options_region = ['regionName'];

  const dispatch = useDispatch();

  const handleDeleteAllBlock = () => {
    setIsAlertVisible(true);
  };

  const handleConfirmAllDeleteBlock = items => {
    try {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT DISTINCT(compressedImagePath) FROM MDB_trees',
          [],

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
        tx.executeSql(
          'DROP TABLE MDB_verification_image',
          [],
          (tx, results) => {
            console.log('Table MDB_verification_image Deleted Successfully');
          },
        );
      });
      setRegion(null);
      setEstateGroup(null);
      setEstate(null);
      setAfdeling(null);
      setData(null);
      setTemp(false);
      setIsAlertVisible(false);

      dispatch(DownloadDropdownLabelAction('', '', '', '', ''));
      dispatch(FilterDropdownLabelAction('', '', '', '', ''));
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelAllDeleteBlock = () => {
    setIsAlertVisible(false);
  };

  const handleDeleteBlock = item => {
    setSelectedRecord(item);
    setIsAlertVisible2(true);
  };

  const handleConfirmDeleteBlock = items => {
    try {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT DISTINCT(predictionId) FROM MDB_trees WHERE blockId = ? AND blockName = ?`,
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
                        }
                      },
                    );

                    const temp_verificationId_String =
                      temp_verificationId.join(',');
                    tx.executeSql(
                      `DELETE FROM MDB_verification_image WHERE verificationId IN (${temp_verificationId_String})`,
                      [],
                      (tx, results) => {
                        if (results.rowsAffected > 0) {
                        }
                      },
                    );
                    tx.executeSql(
                      `DELETE FROM MDB_manualverification_pest_disease WHERE verificationId IN (${temp_verificationId_String})`,
                      [],
                      (tx, results) => {
                        if (results.rowsAffected > 0) {
                        }
                      },
                    );
                  }
                },
              );
            }
          },
        );
      });

      db.transaction(tx => {
        tx.executeSql(
          'SELECT DISTINCT(compressedImagePath) FROM MDB_trees WHERE blockId = ? AND blockName = ?',
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
      });

      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM MDB_trees WHERE blockId = ? AND blockName = ? ',
          [items.blockId, items.blockName],
          (tx, results) => {
            if (results.rowsAffected > 0) {
            }
          },
        );
        tx.executeSql(
          'DELETE FROM MDB_setting WHERE blockId = ? AND blockName = ? ',
          [items.blockId, items.blockName],
          (tx, results) => {
            if (results.rowsAffected > 0) {
            } else alert('Deletion Failed');
          },
        );
      });

      const updatedSubcategory = Data.filter(
        item => item.blockId !== items.blockId,
      );

      setData(updatedSubcategory);

      if (updatedSubcategory == null || updatedSubcategory == '') {
        setRegion(null);
        setEstateGroup(null);
        setEstate(null);
        setAfdeling(null);
        dispatch(DownloadDropdownLabelAction('', '', '', '', ''));
        dispatch(FilterDropdownLabelAction('', '', '', '', ''));
      }
      setIsAlertVisible2(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelDeleteBlock = () => {
    setIsAlertVisible2(false);
  };

  /***********************************************************/

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
                  placeholder={'No Data'}
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
                  placeholder={'No Data'}
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
                  placeholder={'No Data'}
                  options={options_estate}
                  item={'estateName'}
                />
              </View>
            </View>
          )}

          {Afdeling != null && Afdeling != '' && Temp == true ? (
            <View style={styles.innerContainer}>
              <View style={styles.modal_status}>
                <Text
                  style={[
                    gStyle.text[theme],
                    styles.dropdown_text,
                    styles.textallign,
                  ]}>
                  Afdeling
                </Text>
              </View>
              <View style={styles.dropdown_container}>
                <ModalDropdown
                  data={Afdeling}
                  disabled={true}
                  selected_Item={0}
                  options={options_afdeling}
                  item={'afdelingName'}
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
                  Afdeling
                </Text>
              </View>
              <View style={styles.dropdown_container}>
                <ModalDropdown
                  data={Afdeling}
                  disabled={true}
                  placeholder={'No Data'}
                  options={options_afdeling}
                  item={'afedlingName'}
                />
              </View>
            </View>
          )}

          {Data != null && Data != '' && Temp == true ? (
            <View>
              <TouchableOpacity style={styles.Subheader} disabled={true}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.Subtext}>Blok</Text>
                  <MaterialCommunityIcons
                    name="trash-can"
                    style={{marginLeft: 255 * ratio}}
                    color={colors.switch_iconred}
                    size={28 * ratio}
                    onPress={handleDeleteAllBlock}
                  />
                </View>
              </TouchableOpacity>
              <View style={{flexDirection: 'row', padding: 10 * ratio}}></View>
              <View>
                {Data.map((item, index) => (
                  <View style={styles.container} key={index}>
                    <TouchableOpacity
                      style={[
                        styles.recordItem,
                        {
                          backgroundColor:
                            index % 2 === 0 ? 'white' : '#E6F5EE',
                        },
                      ]}
                      disabled={true}>
                      <Text style={styles.text}>{item.blockName}</Text>
                      <MaterialCommunityIcons
                        name="trash-can"
                        style={styles.deletebutton}
                        color={colors.switch_iconred}
                        size={28 * ratio}
                        onPress={() => handleDeleteBlock(item)}
                      />
                    </TouchableOpacity>
                    <StandardAlert
                      visible={isAlertVisible2}
                      color={'red'}
                      iconname={`delete-empty`}
                      title="Blok Deletion"
                      message1={`Please confirm to delete blok.`}
                      message2={
                        selectedRecord != null && selectedRecord != ''
                          ? selectedRecord.blockName
                          : null
                      }
                      message3={`Note : All the recorded verification will be lost\nOnce deleted cannot be reverted back.`}
                      confirmOnpress={() => {
                        handleConfirmDeleteBlock(selectedRecord);
                      }}
                      blockdeletion={true}
                      cancelBtnOnpress={handleCancelDeleteBlock}
                    />
                  </View>
                ))}
                <StandardAlert
                  visible={isAlertVisible}
                  color={'red'}
                  iconname={`delete-empty`}
                  title="Blok Deletion"
                  message1={`Please confirm to delete all blok(s).`}
                  message3={`Note : All the recorded verification will be lost\n\nOnce deleted cannot be reverted back.`}
                  confirmOnpress={() => {
                    handleConfirmAllDeleteBlock();
                  }}
                  blockdeletion={true}
                  cancelBtnOnpress={handleCancelAllDeleteBlock}
                />
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
