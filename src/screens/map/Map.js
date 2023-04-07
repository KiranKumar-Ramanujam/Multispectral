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
} from 'react-native';
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
  const {Trees_Test} = useSelector(state => state.tree_reducer);
  const [OverlayImage, setOverlayImage] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const selected_block = route.params;

  useEffect(() => {
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.setOptions({
        tabBarStyle: {
          height: 70 * ratio,
        },
      });
    }
  }, [navigation]);

  useEffect(() => {
    if (selected_block != null && selected_block != '') {
      if (
        selected_block.selected_block != null &&
        selected_block.selected_block != ''
      ) {
        setSelectedRegion(selected_block.selected_block[0]);
      } else if (
        selected_block.selected_afdeling != null &&
        selected_block.selected_afdeling != ''
      ) {
        setSelectedRegion(selected_block.selected_afdeling[0]);
      } else if (
        selected_block.selected_estate != null &&
        selected_block.selected_estate != ''
      ) {
        setSelectedRegion(selected_block.selected_estate[0]);
      } else if (
        selected_block.selected_estategroup != null &&
        selected_block.selected_estategroup != ''
      ) {
        setSelectedRegion(selected_block.selected_estategroup[0]);
      }
    }
  }, [selected_block]);

  const dispatch = useDispatch();

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
      dispatch(getTreesAction());
    } catch (error) {
      console.log(error);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      db.transaction(tx => {
        tx.executeSql('SELECT * from MDB_trees', [], (tx, results) => {
          var temp = [];
          var len = results.rows.length;
          if (len > 0) {
            getpest_diseases();
            dispatch(getTreesAction());
          } else {
            dispatch(getTreesAction());
            setOverlayImage(null);
          }
        });
      });
    }, []),
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
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  useEffect(() => {
    if (selectedRegion) {
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

        tx.executeSql(
          'SELECT DISTINCT(compressedImageId), nw_latitude, nw_logitude, se_latitude, se_longitude, compressedImagePath from MDB_trees',
          [],
          (tx, results) => {
            var temp = [];
            var len = results.rows.length;

            if (len > 0) {
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
                setOverlayImage(temp);
              }
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
      <MapView
        ref={mapRef}
        style={styles.mapStyle}
        provider={PROVIDER_GOOGLE}
        zoomEnabled={true}
        minZoomLevel={18.5}
        maxZoomLevel={20}
        mapType={'none'}
        zoomControlEnabled={true}
        onMapReady={() => {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(granted => {});
        }}
        initialRegion={region}
        onRegionChangeComplete={region => setRegion(region)}>
        {OverlayImage != null && OverlayImage != '' ? (
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

        {Trees_Test.map((item, index) => {
          if (
            item.prediction == 'healthy' &&
            green_isActive == true &&
            item.status == null &&
            (item.validated_status == null || item.validated_status == '')
          ) {
            pillColor2 = colors.switch_icongreen;
            markerColor = colors.marker_green;
            return (
              <View key={item.treeId}>
                <Marker
                  coordinate={{
                    latitude: parseFloat(item.latitude),
                    longitude: parseFloat(item.longitude),
                  }}
                  onPress={() => {
                    setActiveMarkers(true);
                    setselectedTreeData(item);
                    setModalVisible(true);
                    onPressMarker(item);
                  }}>
                  <View style={styles.circle} />

                  {activeMarkers == true &&
                  selectedTreeData.treeId == item.treeId ? (
                    <Svg_Filter
                      viewBox={'0 0 70 70'}
                      color={colors.marker_green}
                    />
                  ) : null}
                </Marker>
                {activeMarkers == true &&
                selectedTreeData.treeId == item.treeId ? null : (
                  <Circle
                    center={{
                      latitude: parseFloat(item.latitude),
                      longitude: parseFloat(item.longitude),
                    }}
                    radius={5}
                    zIndex={3}
                    strokeColor={colors.marker_green}
                    strokeWidth={2}
                    fillColor="transparent"
                  />
                )}
              </View>
            );
          } else if (
            item.prediction == 'unhealthy' &&
            red_isActive == true &&
            item.status == null &&
            (item.validated_status == null || item.validated_status == '')
          ) {
            pillColor2 = colors.switch_iconred;
            markerColor = colors.marker_red;

            return (
              <View key={item.treeId}>
                <Marker
                  coordinate={{
                    latitude: parseFloat(item.latitude),
                    longitude: parseFloat(item.longitude),
                  }}
                  onPress={() => {
                    setActiveMarkers(true);
                    setselectedTreeData(item);
                    setModalVisible(true);
                    onPressMarker(item);
                  }}>
                  <View style={styles.circle} />

                  {activeMarkers == true &&
                  selectedTreeData.treeId == item.treeId ? (
                    <Svg_Filter
                      viewBox={'0 0 70 70'}
                      color={colors.marker_red}
                    />
                  ) : null}
                </Marker>
                {activeMarkers == true &&
                selectedTreeData.treeId == item.treeId ? null : (
                  <Circle
                    center={{
                      latitude: parseFloat(item.latitude),
                      longitude: parseFloat(item.longitude),
                    }}
                    radius={5}
                    zIndex={3}
                    strokeColor={colors.marker_red}
                    strokeWidth={2}
                    fillColor="transparent"
                  />
                )}
              </View>
            );
          } else if (
            item.status == 'Healthy' ||
            item.status == 'Unhealthy' ||
            (item.validated_status != null &&
              item.validated_status != '' &&
              blue_isActive == true)
          ) {
            pillColor2 = colors.switch_iconblue;
            markerColor = colors.marker_blue;

            return (
              <View key={item.treeId}>
                <Marker
                  coordinate={{
                    latitude: parseFloat(item.latitude),
                    longitude: parseFloat(item.longitude),
                  }}
                  onPress={() => {
                    setActiveMarkers(true);
                    setselectedTreeData(item);
                    setModalVisible(true);
                    onPressMarker(item);
                  }}>
                  <View style={styles.circle} />

                  {activeMarkers == true &&
                  selectedTreeData.treeId == item.treeId ? (
                    <Svg_Filter
                      viewBox={'0 0 70 70'}
                      color={colors.switch_iconblue}
                    />
                  ) : null}
                </Marker>
                {activeMarkers == true &&
                selectedTreeData.treeId == item.treeId ? null : (
                  <Circle
                    center={{
                      latitude: parseFloat(item.latitude),
                      longitude: parseFloat(item.longitude),
                    }}
                    radius={5}
                    zIndex={3}
                    strokeColor={colors.switch_iconblue}
                    strokeWidth={2}
                    fillColor="transparent"
                  />
                )}
              </View>
            );
          }
        })}
      </MapView>
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
                      {selectedTreeData.prediction}
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable style={[styles.poppredicted_button, redpillcolor]}>
                    <Text style={[styles.popstatus_text]}>
                      {selectedTreeData.prediction}
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
              <View style={styles.validated_popRectangleShape}>
                <Text style={[styles.validated_status_text]}>VERIFIED</Text>
              </View>
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

  {
  }
};

export default Map;
