import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown';

const {width, height} = Dimensions.get('window');
const ratio = Math.min(width, height) / 375;

const DropdownComponent = props => {
  const selecteditem_callback = childData => {
    props.selecteditem_callback(childData);
  };

  const dropdown2BtnStyle = {
    width: '72%',
    height: 45 * ratio,
    borderColor: props.disabled ? '#E5E5E6' : 'gray',
    borderWidth: 1 * ratio,
    backgroundColor: props.disabled ? '#E5E5E6' : 'white',
    borderRadius: 8 * ratio,
  };

  return (
    <SelectDropdown
      data={props.data}
      disabled={props.disabled}
      onSelect={(selectedItem, index) => {
        selecteditem_callback(selectedItem);
      }}
      defaultButtonText={props.placeholder}
      defaultValueByIndex={props.selected_Item}
      buttonTextAfterSelection={(selectedItem, index) => {
        const temp = props.item;
        buttonStyle = {backgroundColor: 'black'};
        return selectedItem[temp];
      }}
      rowTextForSelection={(item, index) => {
        const temp = props.item;
        buttonStyle = {backgroundColor: 'black'};
        return item[temp];
      }}
      buttonStyle={dropdown2BtnStyle}
      buttonTextStyle={styles.dropdown2BtnTxtStyle}
      renderDropdownIcon={isOpened => {
        return (
          <FontAwesome
            name={isOpened ? 'chevron-up' : 'chevron-down'}
            color={'gray'}
            size={14 * ratio}
            style={{left: 10 * ratio}}
          />
        );
      }}
      dropdownIconPosition={'right'}
      dropdownStyle={styles.dropdown2DropdownStyle}
      rowStyle={styles.dropdown2RowStyle}
      rowTextStyle={styles.dropdown2RowTxtStyle}
      selectedRowStyle={styles.dropdown2SelectedRowStyle}
      search={props.search}
      searchInputStyle={styles.dropdown2searchInputStyleStyle}
      searchPlaceHolder={'Search here'}
      searchPlaceHolderColor={'black'}
      searchInputTxtStyle={{fontSize: 15 * ratio}}
      renderSearchInputLeftIcon={() => {
        return <FontAwesome name={'search'} color={'gray'} size={18 * ratio} />;
      }}
    />
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '10%',
  },
  dropdown2BtnTxtStyle: {
    color: 'gray',
    textAlign: 'auto',
    fontSize: 15 * ratio,
  },
  dropdown2DropdownStyle: {
    backgroundColor: 'white',
    borderRadius: 1,
  },
  dropdown2RowStyle: {
    backgroundColor: 'white',
    borderBottomColor: 'black',
    height: 40 * ratio,
  },
  dropdown2RowTxtStyle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18 * ratio,
  },
  dropdown2SelectedRowStyle: {backgroundColor: '#AECA98'},
  dropdown2searchInputStyleStyle: {
    backgroundColor: 'lightgray',
    borderBottomWidth: 10 * ratio,
    borderBottomColor: 'white',
    height: 40 * ratio,
  },
});

export default DropdownComponent;
