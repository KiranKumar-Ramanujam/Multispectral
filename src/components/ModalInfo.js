import React from 'react';
import {StyleSheet, View, Modal, Text, TouchableOpacity} from 'react-native';

const nameRowData = {
  0: 'Form detail',
  1: 'Estate',
  2: 'Trial',
  3: 'Block',
  4: 'Palm',
  5: 'Palm status',
  6: 'Plot',
  7: 'Form palm',
};

const RowData = props => {
  return (
    <View style={styles.row}>
      <View style={{width: '50%'}}>
        <Text>{props.name}</Text>
      </View>
      <View style={{width: '10%'}}>
        <Text>:</Text>
      </View>
      <View style={{width: '40%'}}>
        <Text>{props.data}</Text>
      </View>
    </View>
  );
};

const ModalInfo = props => {
  const {show, data, onClose} = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={show}
      onRequestClose={() => {}}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <Text>Data berhasil di sinkronisasi</Text>
          <View style={{width: '100%', marginTop: 5}}>
            {data.map((dataRow, dataIndex) => (
              <RowData name={nameRowData[dataIndex]} data={dataRow?.length} />
            ))}
          </View>
          <TouchableOpacity
            onPress={() => onClose()}
            style={{
              width: 100,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>Ok</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalInfo;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    minHeight: '35%',
    width: '60%',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
