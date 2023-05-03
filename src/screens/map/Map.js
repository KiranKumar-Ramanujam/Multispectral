import React, {useState, useRef, useEffect, useCallback} from 'react';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Circle,
  Overlay,
} from 'react-native-maps';
import {
  View,
  Modal,
  Text,
  PermissionsAndroid,
  Pressable,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import RNFS from 'react-native-fs';

import SQLite from 'react-native-sqlite-storage';

import {colors, gStyle} from '../../constants';

import {AntDesignIcon, Svg_Filter} from '../../icons/Icons';

import styles from './styles/MapStyles';

import {getTreesAction} from '../../redux/actions/trees.action';
import Route from '../../constants/route.constant';

const Map = ({navigation, route}) => {
  const {width, height} = Dimensions.get('window');
  const ratio = Math.min(width, height) / 375;
  const [OverlayImage, setOverlayImage] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const selected_block = route.params;
  const [Data, setData] = useState([]);
  const [userId, setuserId] = useState();
  const [Block, setBlock] = useState(selected_block);
  const {block_label} = useSelector(state => state.dropdownset_reducer);
  const [OverlayCondition, setOverlayCondition] = useState(false);

  useEffect(() => {
    try {
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

  useEffect(() => {
    if (selected_block != null && selected_block != '') {
      setBlock(selected_block);
      if (
        selected_block.selected_block != null &&
        selected_block.selected_block != ''
      ) {
        setSelectedRegion(selected_block.selected_block[0]);
      }
    }
  }, [selected_block]);

  const {green_isActive, red_isActive, blue_isActive} = useSelector(
    state => state.switchtoggle_reducer,
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

  useEffect(() => {
    try {
      getpest_diseases();
    } catch (error) {
      console.log(error);
    }
  }, []);

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

      checkTableExists('MDB_trees')
        .then(exists => {
          if (exists) {
          } else {
            setData(null);
            setOverlayImage(null);
            setOverlayCondition(false);
          }
        })
        .catch(error => {
          console.log('Error while checking table existence:', error);
        });

      db.transaction(tx => {
        tx.executeSql('SELECT * from MDB_trees LIMIT 1', [], (tx, results) => {
          var temp = [];
          var len = results.rows.length;
          if (len > 0) {
            getpest_diseases();
          } else {
            setData(null);
            setOverlayImage(null);
            setOverlayCondition(false);
          }
        });
      });

      getData2();
      async function getData2() {
        const trees = [];
        if (block_label != null && block_label != '') {
          await db.transaction(tx => {
            tx.executeSql(
              `SELECT l.treeId,l.blockId,l.blockName,l.latitude,l.longitude,l.yearOfPlanting,l.predictionId, l.droneImageId, l.compressedImagePath, l.nw_latitude, l.nw_logitude, l.se_latitude, l.se_longitude, l.prediction, l.afdelingId, l.afdelingName, l.estateId, l.estateName, l.estateGroupId, l.regionId, l.validated_verificationId, l.validated_status, l.validated_remarks, l.validated_pestDiseaseId, max(r.verificationId),r.userId,r.status, p.pestDiseaseId, r.remarks, v.verificationImageId, v.uploadPath FROM MDB_trees l LEFT JOIN MDB_manual_verification r ON l.predictionId = r.predictionId LEFT JOIN MDB_verification_image v ON v.verificationId = r.verificationId LEFT JOIN MDB_manualverification_pest_disease p ON p.verificationId = r.verificationId WHERE l.blockId = ? GROUP BY l.treeId`,
              [block_label.blockId],
              (tx, results) => {
                var len = results.rows.length;
                if (len > 0) {
                  for (let i = 0; i < results.rows.length; ++i) {
                    trees.push(results.rows.item(i));
                  }
                  setData(trees);
                }
              },
            );
          });
        } else {
          await db.transaction(tx => {
            tx.executeSql(
              `SELECT l.treeId,l.blockId,l.blockName,l.latitude,l.longitude,l.yearOfPlanting,l.predictionId, l.droneImageId, l.compressedImagePath, l.nw_latitude, l.nw_logitude, l.se_latitude, l.se_longitude, l.prediction, l.afdelingId, l.afdelingName, l.estateId, l.estateName, l.estateGroupId, l.regionId, l.validated_verificationId, l.validated_status, l.validated_remarks, l.validated_pestDiseaseId, max(r.verificationId),r.userId,r.status, p.pestDiseaseId, r.remarks, v.verificationImageId, v.uploadPath FROM MDB_trees l LEFT JOIN MDB_manual_verification r ON l.predictionId = r.predictionId LEFT JOIN MDB_verification_image v ON v.verificationId = r.verificationId LEFT JOIN MDB_manualverification_pest_disease p ON p.verificationId = r.verificationId WHERE l.blockId = ? GROUP BY l.treeId`,
              [Block.selected_block[0].blockId],
              (tx, results) => {
                var len = results.rows.length;
                if (len > 0) {
                  for (let i = 0; i < results.rows.length; ++i) {
                    trees.push(results.rows.item(i));
                  }
                  setData(trees);
                }
              },
            );
          });
        }
      }

      const parentNavigation = navigation.getParent();
      if (parentNavigation) {
        parentNavigation.setOptions({
          tabBarStyle: {
            height: 70 * ratio,
          },
        });
      }
    }, [Block]),
  );

  const [currentLatitude, setCurrentLatitude] = useState(null);
  const [currentLongitude, setCurrentLongitude] = useState(null);
  const [accuracy, setAccuracy] = useState(null);

  useEffect(() => {
    try {
      let timeInterval = setInterval(() => {
        getCurrentLocation();
      }, 1000);
      return () => {
        clearInterval(timeInterval);
      };
    } catch (error) {
      console.log(error);
    }
  }, [getCurrentLocation]);

  const getCurrentLocation = useCallback(async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getOneTimeLocation();
      } else {
      }
    } catch (err) {}
  }, []);

  const getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setCurrentLatitude(position?.coords?.latitude);
        setCurrentLongitude(position?.coords?.longitude);
        setAccuracy(position?.coords?.accuracy);
      },
      error => {},
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
    );
  };

  useEffect(() => {
    if (selectedRegion) {
      if (selected_block != null && selected_block != '') {
        setOverlayImage(null);
      }
      db.transaction(tx => {
        tx.executeSql(
          'SELECT DISTINCT(compressedImageId), nw_latitude, nw_logitude, se_latitude, se_longitude, compressedImagePath from MDB_trees WHERE blockId = ?',
          [Block.selected_block[0].blockId],
          (tx, results) => {
            var temp = [];
            var len = results.rows.length;
            if (len > 0) {
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
              }
              setOverlayImage(temp);
              setOverlayCondition(true);
            }
          },
        );
      });

      const nw_latitude = parseFloat(selectedRegion.nw_latitude);
      const nw_logitude = parseFloat(selectedRegion.nw_logitude);

      const se_latitude = parseFloat(selectedRegion.se_latitude);
      const se_longitude = parseFloat(selectedRegion.se_longitude);

      const latitude = (nw_latitude + se_latitude) / 2;
      const longitude = (nw_logitude + se_longitude) / 2;

      const newRegion = {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.001,
      };
      setRegion(newRegion);
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  }, [selectedRegion]);

  const [pestdisease, setpestdisease] = useState();

  const getpest_diseases = () => {
    try {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT pestDiseaseId AS id, pestDiseaseName AS name FROM MDB_pest_disease',
          [],
          (tx, results) => {
            var temp = [];
            var len = results.rows.length;
            if (len > 0) {
              for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
              setpestdisease(temp);
            }
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 2.7175823244617517,
    longitude: 99.42588119521083,
    latitudeDelta: 0.004,
    longitudeDelta: 0.002,
  });

  const [activeMarkers, setActiveMarkers] = useState();
  const [selectedTreeData, setselectedTreeData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  var pillColor = '';
  var pillColor2 = '';
  var markerColor = '';
  var validatepillColor = '';
  const bgColorStyle = {
    backgroundColor: 'white',
  };
  var pill_color = {
    backgroundColor: '',
  };
  var validation_color = {
    backgroundColor: '',
  };
  var greenpillcolor = {
    backgroundColor: colors.switch_icongreen,
  };
  var redpillcolor = {
    backgroundColor: colors.switch_iconred,
  };

  onPressMarker = item => {
    if (item.prediction == 'healthy') {
      pillColor = colors.switch_icongreen;
      if (item.status == 'Unhealthy') {
        validatepillColor = colors.switch_iconblue;
        validation_color = {
          backgroundColor: colors.switch_iconred,
        };
      } else if (item.status == 'Healthy') {
        validatepillColor = colors.switch_iconblue;
        validation_color = {
          backgroundColor: colors.switch_icongreen,
        };
      } else {
        validatepillColor = colors.switch_icongreen;
      }
    }
    if (item.prediction == 'unhealthy') {
      pillColor = colors.switch_iconred;
      if (item.status == 'Healthy') {
        validatepillColor = colors.switch_iconblue;
        validation_color = {
          backgroundColor: colors.switch_icongreen,
        };
      } else if (item.status == 'Unhealthy') {
        validatepillColor = colors.switch_iconblue;
        validation_color = {
          backgroundColor: colors.switch_iconred,
        };
      } else {
        validatepillColor = colors.switch_iconred;
      }
    }
    pill_color = {
      backgroundColor: pillColor,
    };
  };

  return (
    <View style={styles.MainContainer}>
      {block_label != null && block_label != '' ? (
        <MapView
          ref={mapRef}
          style={styles.mapStyle}
          provider={PROVIDER_GOOGLE}
          zoomEnabled={true}
          showsUserLocation={true}
          minZoomLevel={8}
          mapType={'none'}
          zoomControlEnabled={true}
          onMapReady={() => {
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ).then(granted => {});
          }}
          initialRegion={region}
          onRegionChangeComplete={region => setRegion(region)}>
          {OverlayImage != null &&
          OverlayImage != '' &&
          OverlayCondition == true ? (
            <View>
              {OverlayImage.map((item, index) => {
                const OVERLAY_BOTTOM_LEFT_COORDINATETest = [
                  parseFloat(item.se_latitude),
                  parseFloat(item.nw_logitude),
                ];
                const OVERLAY_TOP_RIGHT_COORDINATETest = [
                  parseFloat(item.nw_latitude),
                  parseFloat(item.se_longitude),
                ];

                const overlaytest = {
                  bounds: [
                    OVERLAY_BOTTOM_LEFT_COORDINATETest,
                    OVERLAY_TOP_RIGHT_COORDINATETest,
                  ],
                };
                return (
                  <Overlay
                    key={index}
                    bounds={overlaytest.bounds}
                    image={{uri: `file://${item.compressedImagePath}`}}
                  />
                );
              })}
            </View>
          ) : null}

          {Data != null && Data != '' ? (
            <View>
              {Data.map((item, index) => {
                return (
                  <View key={item.treeId}>
                    {item.prediction == 'healthy' &&
                    green_isActive == true &&
                    item.status == null &&
                    (item.validated_status == null ||
                      item.validated_status == '') ? (
                      <View>
                        <Marker
                          key={item.treeId}
                          coordinate={{
                            latitude: parseFloat(item.latitude),
                            longitude: parseFloat(item.longitude),
                          }}
                          opacity={0}
                          onPress={() => {
                            setActiveMarkers(true);
                            setselectedTreeData(item);
                            setModalVisible(true);
                            onPressMarker(item);
                          }}></Marker>
                        <Circle
                          center={{
                            latitude: parseFloat(item.latitude),
                            longitude: parseFloat(item.longitude),
                          }}
                          radius={5}
                          strokeColor={colors.marker_green}
                          fillColor={
                            activeMarkers == true &&
                            selectedTreeData.treeId == item.treeId
                              ? colors.marker_green
                              : 'transparent'
                          }
                          zIndex={3}></Circle>
                      </View>
                    ) : item.prediction == 'unhealthy' &&
                      red_isActive == true &&
                      item.status == null &&
                      (item.validated_status == null ||
                        item.validated_status == '') ? (
                      <View>
                        <Marker
                          key={item.treeId}
                          coordinate={{
                            latitude: parseFloat(item.latitude),
                            longitude: parseFloat(item.longitude),
                          }}
                          opacity={0}
                          onPress={() => {
                            setActiveMarkers(true);
                            setselectedTreeData(item);
                            setModalVisible(true);
                            onPressMarker(item);
                          }}></Marker>
                        <Circle
                          center={{
                            latitude: parseFloat(item.latitude),
                            longitude: parseFloat(item.longitude),
                          }}
                          radius={5}
                          strokeColor={colors.marker_red}
                          fillColor={
                            activeMarkers == true &&
                            selectedTreeData.treeId == item.treeId
                              ? colors.marker_red
                              : 'transparent'
                          }
                          zIndex={3}></Circle>
                      </View>
                    ) : (item.status == 'Healthy' && blue_isActive == true) ||
                      (item.status == 'Unhealthy' && blue_isActive == true) ||
                      (item.validated_status != null &&
                        item.validated_status != '' &&
                        blue_isActive == true) ? (
                      <View>
                        <Marker
                          key={item.treeId}
                          coordinate={{
                            latitude: parseFloat(item.latitude),
                            longitude: parseFloat(item.longitude),
                          }}
                          opacity={0}
                          onPress={() => {
                            setActiveMarkers(true);
                            setselectedTreeData(item);
                            setModalVisible(true);
                            onPressMarker(item);
                          }}></Marker>
                        <Circle
                          center={{
                            latitude: parseFloat(item.latitude),
                            longitude: parseFloat(item.longitude),
                          }}
                          radius={5}
                          strokeColor={colors.marker_blue}
                          fillColor={
                            activeMarkers == true &&
                            selectedTreeData.treeId == item.treeId
                              ? colors.marker_blue
                              : 'transparent'
                          }
                          zIndex={3}></Circle>
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          ) : null}
        </MapView>
      ) : null}
      {selectedTreeData != null && selectedTreeData != '' ? (
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {}}>
          <View style={[styles.pop_container, bgColorStyle]}>
            <View style={styles.popinnerContainer}>
              <View style={styles.container}>
                <Text style={styles.poptitle}>Information Tree</Text>
              </View>
              <View style={styles.container}>
                <AntDesignIcon
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    setActiveMarkers(false);
                  }}
                  name="closecircle"
                  style={styles.popclosebutton}
                  size={26 * ratio}
                  color={'#DADADA'}
                />
              </View>
            </View>

            <View style={styles.popinnerContainer}>
              {(selectedTreeData.status == '' ||
                selectedTreeData.status == null) &&
              selectedTreeData.validated_status == null ? (
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
              <View style={[styles.container, styles.poparrange_left]}>
                <Text style={styles.poplabel}>ID</Text>
                <Text style={styles.popid}>{selectedTreeData.treeId}</Text>
              </View>
              <View style={styles.pop_attributecontainer}>
                <Text style={[styles.poplabel]}>Prediction</Text>
                {selectedTreeData.prediction == 'healthy' ? (
                  <Pressable
                    style={[styles.poppredicted_button, greenpillcolor]}>
                    <Text style={[styles.popstatus_text]}>
                      {/* {selectedTreeData.prediction} */}
                      {`Healthy`}
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable style={[styles.poppredicted_button, redpillcolor]}>
                    <Text style={[styles.popstatus_text]}>
                      {/* {selectedTreeData.prediction} */}
                      {`Unhealthy`}
                    </Text>
                  </Pressable>
                )}
              </View>
              <View style={styles.pop_attributecontainer}>
                <Text style={[styles.poplabel]}>Validation</Text>
                {selectedTreeData.status != null ? (
                  selectedTreeData.status == 'Healthy' ? (
                    <Pressable
                      style={[styles.popvalidated_button, greenpillcolor]}>
                      <Text style={[styles.popstatus_text]}>
                        {selectedTreeData.status}
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={[styles.popvalidated_button, redpillcolor]}>
                      <Text style={[styles.popstatus_text]}>
                        {selectedTreeData.status}
                      </Text>
                    </Pressable>
                  )
                ) : selectedTreeData.validated_status != null &&
                  selectedTreeData.validated_status != '' ? (
                  selectedTreeData.validated_status == 'Healthy' ? (
                    <Pressable
                      style={[styles.popvalidated_button, greenpillcolor]}>
                      <Text style={[styles.popstatus_text]}>
                        {selectedTreeData.validated_status}
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={[styles.popvalidated_button, redpillcolor]}>
                      <Text style={[styles.popstatus_text]}>
                        {selectedTreeData.validated_status}
                      </Text>
                    </Pressable>
                  )
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

            <View style={styles.popRectangleShape}>
              <View style={styles.popinnerContainer}>
                <View style={styles.pop_attributecontainer}>
                  <Text style={[styles.poplabel]}>Estate</Text>
                  <Text style={[styles.popvalue]}>
                    {selectedTreeData.estateName}
                  </Text>
                </View>
                <View style={styles.pop_attributecontainer}>
                  <Text style={[styles.poplabel]}>Afdel</Text>
                  <Text style={[styles.popvalue]}>
                    {selectedTreeData.afdelingName}
                  </Text>
                </View>
                <View style={styles.pop_attributecontainer}>
                  <Text style={[styles.poplabel]}>Blok</Text>
                  <Text style={[styles.popvalue]}>
                    {selectedTreeData.blockName}
                  </Text>
                </View>
              </View>
            </View>
            {selectedTreeData.validated_status != null &&
            selectedTreeData.validated_status != '' ? (
              <Pressable
                style={[
                  styles.popvalidatebutton,
                  styles.popvalidatebutton_background,
                ]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setActiveMarkers(false);
                  navigation.navigate(Route.VALIDATEGROUNDTRUTH, {
                    validate_selectedTreeData: selectedTreeData,
                    predicted_pillColor: pillColor,
                    validated_pillColor: validation_color,
                    pestdisease: pestdisease,
                    user_Id: userId,
                    user_latitude: currentLatitude,
                    user_longitude: currentLongitude,
                    user_accuracy: accuracy,
                  });
                }}>
                <Text style={styles.popvalidatebuttontext}>
                  Validate Ground Truth Again
                </Text>
              </Pressable>
            ) : (
              <Pressable
                style={[
                  styles.popvalidatebutton,
                  styles.popvalidatebutton_background,
                ]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setActiveMarkers(false);
                  navigation.navigate(Route.VALIDATEGROUNDTRUTH, {
                    validate_selectedTreeData: selectedTreeData,
                    predicted_pillColor: pillColor,
                    validated_pillColor: validation_color,
                    pestdisease: pestdisease,
                    user_Id: userId,
                    user_latitude: currentLatitude,
                    user_longitude: currentLongitude,
                    user_accuracy: accuracy,
                  });
                }}>
                <Text style={styles.popvalidatebuttontext}>
                  Validate Ground Truth
                </Text>
              </Pressable>
            )}
          </View>
        </Modal>
      ) : null}
      <AntDesignIcon
        onPress={() => {
          navigation.navigate(Route.FILTERMAP);
        }}
        name="filter"
        style={[gStyle.circlebtn, styles.filter]}
        size={34 * ratio}
        color={gStyle.btn.backgroundColor}
      />
    </View>
  );
};

export default Map;
