import React, {useState, useEffect} from 'react';
import {View, Text, Switch, Dimensions, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import SQLite from 'react-native-sqlcipher';
import {colors, route, gStyle} from '../../../constants';
import ModalDropdown from '../../../components/DropDown';
import styles from '../styles/FilterStyles';
import {Svg_Filter} from '../../../icons/Icons';
import {SwitchToggleAction} from '../../../redux/actions/switch.action';
import {FilterDropdownLabelAction} from '../../../redux/actions/dropdown.action';

const FilterMap = ({navigation}) => {
  const theme = 'light';

  const {width, height} = Dimensions.get('window');
  const ratio = Math.min(width, height) / 375;

  const [Region, setRegion] = useState([]);
  const [EstateGroup, setEstateGroup] = useState([]);
  const [Estate, setEstate] = useState([]);
  const [Afdeling, setAfdeling] = useState([]);
  const [Block, setBlock] = useState([]);

  const dispatch = useDispatch();

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
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.setOptions({
        tabBarStyle: {
          height: 0,
        },
      });
    }
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT DISTINCT(blockId), blockName from MDB_trees',
          [],
          (tx, results) => {
            var temp = [];
            var len = results.rows.length;
            if (len > 0) {
              for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
              setBlock(temp);
            } else {
              setBlock(null);
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
          'SELECT blockId, se_latitude , se_longitude,nw_latitude,  nw_logitude from MDB_trees where blockId = ? LIMIT 1',
          [block_label.blockId],
          (tx, results) => {
            var temp = [];
            var len = results.rows.length;
            if (len > 0) {
              for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
              setSelectedBlock_2(temp);
            }
          },
        );
      });
    }, []),
  );

  const {
    region_label,
    estate_group_label,
    estate_label,
    afdeling_label,
    block_label,
  } = useSelector(state => state.dropdownset_reducer);

  const [selected_region, setSelectedRegion] = useState(region_label);
  const [selected_estate_group, setSelectedEstateGroup] =
    useState(estate_group_label);
  const [selected_estate, setSelectedEstate] = useState(estate_label);
  const [selected_afdeling, setSelectedAfdeling] = useState(afdeling_label);
  const [selected_block, setSelectedBlock] = useState(block_label);
  const [selected_block2, setSelectedBlock_2] = useState('');

  const options_block = ['blockName'];
  const options_afdeling = ['afdelingName'];
  const options_estate = ['estateName'];
  const options_estategroup = ['estateGroupName'];
  const options_region = ['regionName'];

  DropdownCallback_Block = childData => {
    try {
      setSelectedBlock(childData);
      db.transaction(tx => {
        tx.executeSql(
          'SELECT blockId, se_latitude , se_longitude,nw_latitude,  nw_logitude from MDB_trees where blockId = ? LIMIT 1',
          [childData.blockId],
          (tx, results) => {
            var temp = [];
            var len = results.rows.length;
            if (len > 0) {
              for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
              setSelectedBlock_2(temp);
            }
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  DropdownCallback_Afdeling = childData => {
    try {
      setSelectedAfdeling(childData);
    } catch (error) {
      console.log(error);
    }
  };

  DropdownCallback_Estate = childData => {
    try {
      setSelectedEstate(childData);
    } catch (error) {
      console.log(error);
    }
  };

  DropdownCallback_EstateGroup = childData => {
    try {
      setSelectedEstateGroup(childData);
    } catch (error) {
      console.log(error);
    }
  };

  DropdownCallback_Region = childData => {
    try {
      setSelectedRegion(childData);
    } catch (error) {
      console.log(error);
    }
  };

  DropdownReduxDispatch = () => {
    dispatch(
      FilterDropdownLabelAction(
        selected_region,
        selected_estate_group,
        selected_estate,
        selected_afdeling,
        selected_block,
      ),
    );
  };

  const {green_isActive, red_isActive, blue_isActive} = useSelector(
    state => state.switchtoggle_reducer,
  );

  const [green_isActive_1, setGreenToggle] = useState(green_isActive);
  const [red_isActive_1, setRedToggle] = useState(red_isActive);
  const [blue_isActive_1, setBlueToggle] = useState(blue_isActive);

  const GreenToggleSwitch = () => {
    setGreenToggle(green_isActive => !green_isActive);
  };
  const RedToggleSwitch = () => {
    setRedToggle(red_isActive => !red_isActive);
  };
  const BlueToggleSwitch = () => {
    setBlueToggle(blue_isActive => !blue_isActive);
  };

  ToggleSwitchReduxDispatch = () => {
    dispatch(
      SwitchToggleAction(green_isActive_1, red_isActive_1, blue_isActive_1),
    );
  };

  return (
    <View style={gStyle.container[theme]}>
      <View
        style={{
          flex: 1,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}>
        <Text style={[gStyle.text[theme], styles.title]}>
          Pilih kriteria dikehendaki
        </Text>
        {Region != null && Region != '' ? (
          <View
            style={{
              flex: 1,
              alignSelf: 'flex-start',
              paddingLeft: 14 * ratio,
              width: '130%',
            }}>
            <Text style={[gStyle.text[theme], styles.text]}>Region</Text>
            <ModalDropdown
              data={Region}
              disabled={true}
              placeholder={'Select Region'}
              selecteditem_callback={DropdownCallback_Region}
              selected_Item={0}
              options={options_region}
              item={'regionName'}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              alignSelf: 'flex-start',
              paddingLeft: 14 * ratio,
              width: '130%',
            }}>
            <Text style={[gStyle.text[theme], styles.text]}>Region</Text>
            <ModalDropdown
              data={Region}
              disabled={true}
              placeholder={'No Data'}
              selecteditem_callback={DropdownCallback_Region}
              options={options_region}
              item={'regionName'}
            />
          </View>
        )}

        {EstateGroup != null && EstateGroup != '' ? (
          <View
            style={{
              flex: 1,
              alignSelf: 'flex-start',
              paddingLeft: 14 * ratio,
              width: '130%',
            }}>
            <Text style={[gStyle.text[theme], styles.text]}>Estate Group</Text>
            <ModalDropdown
              data={EstateGroup}
              disabled={true}
              placeholder={'Select Estate Group'}
              selecteditem_callback={DropdownCallback_EstateGroup}
              selected_Item={0}
              options={options_estategroup}
              item={'estateGroupName'}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              alignSelf: 'flex-start',
              paddingLeft: 14 * ratio,
              width: '130%',
            }}>
            <Text style={[gStyle.text[theme], styles.text]}>Estate Group</Text>
            <ModalDropdown
              data={EstateGroup}
              disabled={true}
              placeholder={'No Data'}
              selecteditem_callback={DropdownCallback_EstateGroup}
              options={options_estategroup}
              item={'estateGroupName'}
            />
          </View>
        )}

        {Estate != null && Estate != '' ? (
          <View
            style={{
              flex: 1,
              alignSelf: 'flex-start',
              paddingLeft: 14 * ratio,
              width: '130%',
            }}>
            <Text style={[gStyle.text[theme], styles.text]}>Estate</Text>
            <ModalDropdown
              data={Estate}
              disabled={true}
              placeholder={'Select Estate'}
              selecteditem_callback={DropdownCallback_Estate}
              selected_Item={0}
              options={options_estate}
              item={'estateName'}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              alignSelf: 'flex-start',
              paddingLeft: 14 * ratio,
              width: '130%',
            }}>
            <Text style={[gStyle.text[theme], styles.text]}>Estate</Text>
            <ModalDropdown
              data={Estate}
              disabled={true}
              placeholder={'No Data'}
              selecteditem_callback={DropdownCallback_Estate}
              options={options_estate}
              item={'estateName'}
            />
          </View>
        )}

        {Afdeling != null && Afdeling != '' ? (
          <View
            style={{
              flex: 1,
              alignSelf: 'flex-start',
              paddingLeft: 14 * ratio,
              width: '130%',
            }}>
            <Text style={[gStyle.text[theme], styles.text]}>Afdeling</Text>
            <ModalDropdown
              data={Afdeling}
              disabled={true}
              placeholder={'Select Afdeling'}
              selecteditem_callback={DropdownCallback_Afdeling}
              selected_Item={0}
              options={options_afdeling}
              item={'afdelingName'}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              alignSelf: 'flex-start',
              paddingLeft: 14 * ratio,
              width: '130%',
            }}>
            <Text style={[gStyle.text[theme], styles.text]}>Afdeling</Text>
            <ModalDropdown
              data={Afdeling}
              disabled={true}
              placeholder={'No Data'}
              selecteditem_callback={DropdownCallback_Afdeling}
              options={options_afdeling}
              item={'afdelingName'}
            />
          </View>
        )}

        <View
          style={{
            flex: 1,
            alignSelf: 'flex-start',
            paddingLeft: 14 * ratio,
            width: '130%',
          }}>
          <Text style={[gStyle.text[theme], styles.text]}>Blok</Text>
          <ModalDropdown
            data={Block}
            placeholder={'Select Block'}
            selecteditem_callback={DropdownCallback_Block}
            selected_Item={
              block_label != null &&
              block_label != '' &&
              Block != null &&
              Block != ''
                ? Block.findIndex(item => item.blockId === block_label.blockId)
                : null
            }
            options={options_block}
            item={'blockName'}
          />
        </View>

        <View
          style={{
            marginTop: 5 * ratio,
          }}>
          <View style={styles.switch_container}>
            <Svg_Filter viewBox={'0 0 80 80'} color={colors.switch_icongreen} />
            <View style={styles.switch_text}>
              <Text style={styles.switch_text}>
                {'Show all the Healthy trees'}
              </Text>
            </View>
            <Switch
              style={[styles.switch]}
              trackColor={{false: colors.switchbtn, true: colors.switchbtn}}
              thumbColor={
                green_isActive_1 === true
                  ? colors.greenColor
                  : colors.switchbtn2
              }
              onValueChange={GreenToggleSwitch}
              value={green_isActive_1}
            />
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
          }}>
          <View style={styles.switch_container}>
            <Svg_Filter viewBox={'0 0 80 80'} color={colors.switch_iconred} />
            <Text style={styles.switch_text}>
              {'Show all the Unhealthy trees'}
            </Text>
            <Switch
              style={[styles.switch]}
              trackColor={{false: colors.switchbtn, true: colors.switchbtn}}
              thumbColor={
                red_isActive_1 === true ? colors.greenColor : colors.switchbtn2
              }
              onValueChange={RedToggleSwitch}
              value={red_isActive_1}
            />
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
            marginBottom: 20 * ratio,
          }}>
          <View style={styles.switch_container}>
            <Svg_Filter viewBox={'0 0 80 80'} color={colors.switch_iconblue} />
            <Text style={styles.switch_text}>
              {'Show all the Validated trees'}
            </Text>
            <Switch
              style={[styles.switch]}
              trackColor={{false: colors.switchbtn, true: colors.switchbtn}}
              thumbColor={
                blue_isActive_1 === true ? colors.greenColor : colors.switchbtn2
              }
              onValueChange={BlueToggleSwitch}
              value={blue_isActive_1}
            />
          </View>
        </View>
        <View
          style={[
            {
              width: '100%',
              paddingLeft: 17 * ratio,
              paddingRight: 17 * ratio,
            },
          ]}>
          <TouchableOpacity
            style={{
              color: '#000000',
              height: 44 * ratio,
              alignItems: 'center',
              backgroundColor: '#009D57',
              justifyContent: 'center',
              borderRadius: 8,
              marginBottom: 24 * ratio,
            }}
            onPress={() => {
              navigation.navigate(route.MAP, {
                selected_block: selected_block2,
              });
              this.DropdownReduxDispatch();
              this.ToggleSwitchReduxDispatch();
            }}>
            <Text
              style={{
                fontSize: 16.7 * ratio,
                fontWeight: '500',
                color: '#FCFCFC',
              }}>
              Apply Filter
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FilterMap;
