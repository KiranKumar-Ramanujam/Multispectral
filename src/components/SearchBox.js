import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const SearchBox = props => {
  const {visibleSearchBox, onChangeText, searchText} = props;
  return (
    visibleSearchBox && (
      <View style={styles.searchInputStyle}>
        <TextInput
          style={{width: '85%', color: '#191919', fontSize: 18}}
          onChangeText={onChangeText}
          value={searchText}
        />
        <View
          style={{
            width: '15%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <EvilIcons raised name="search" size={35} color="#1d1c13" />
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  searchInputStyle: {
    marginTop: 30,
    borderWidth: 1,
    width: '95%',
    marginBottom: 25,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 5,
    paddingRight: 5,
  },
});

export default SearchBox;
