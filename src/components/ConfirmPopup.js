import React from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ConfirmPopup = props => {
  const {
    visible,
    iconOnpress,
    backToSCreen,
    confirmOnpress,
    onRequestClose,
    cancelBtnOnpress,
  } = props;
  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={visible}
      onRequestClose={onRequestClose}>
      <View style={styles.modalContainer}>
        <View style={styles.headerView}>
          <TouchableOpacity style={styles.headerIcon}>
            <FontAwesome
              raised
              name="chevron-down"
              size={20}
              color="#000000"
              onPress={iconOnpress}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>
            {backToSCreen ? 'Unfinished Data' : 'Confirm Done'}
          </Text>
        </View>
        <View style={styles.bodyPart}>
          <Text style={styles.bodyText}>
            {backToSCreen
              ? 'Are you sure to return to the main page'
              : 'Is all data filled in correctly?'}
          </Text>
          <Text
            style={[
              styles.bodySubText,
              {fontWeight: backToSCreen ? 'bold' : '100'},
            ]}>
            {backToSCreen
              ? 'Existing data has not been saved'
              : 'After confirming this data, you cannot change it again'}
          </Text>
          {backToSCreen && (
            <Text style={styles.extraText}>This data will not be saved.</Text>
          )}
          <AntDesign
            raised
            name="exclamationcircle"
            size={50}
            style={{position: 'absolute', right: 0, padding: 22}}
            color="#c6481c"
          />
          <View
            style={[
              styles.mainBtn,
              {
                ...(Platform.OS !== 'android' && {zIndex: 10}),
              },
            ]}>
            <TouchableOpacity style={styles.btnView} onPress={confirmOnpress}>
              <Text style={styles.btnText}>
                {backToSCreen ? 'Return to Main Page' : 'Confirmation'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtnView}
              onPress={cancelBtnOnpress}>
              <Text style={styles.cancelBtnText}>Cancelled</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    height: '43%',
    borderWidth: 1,
    position: 'absolute',
    alignItems: 'center',
    borderColor: '#000000',
    flexDirection: 'column',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: '#FDFDFD',
    justifyContent: 'space-around',
  },
  headerView: {
    top: 0,
    left: 0,
    right: 0,
    height: '20%',
    width: '100%',
    borderBottomWidth: 3,
    borderBottomColor: '#aa6a6a',
  },
  headerIcon: {
    padding: 17,
    marginLeft: 0,
    position: 'absolute',
  },
  headerText: {
    top: 14,
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  bodyPart: {
    height: '80%',
    width: '100%',
    backgroundColor: '#FDFDFD',
  },
  bodyText: {
    top: 10,
    width: '65%',
    fontSize: 17,
    marginLeft: 18,
    fontWeight: 'bold',
    position: 'absolute',
  },
  extraText: {
    top: 82,
    width: '75%',
    fontSize: 14,
    marginLeft: 18,
    position: 'absolute',
  },
  bodySubText: {
    top: 60,
    width: '75%',
    fontSize: 15,
    marginLeft: 18,
    position: 'absolute',
  },
  mainBtn: {
    left: 15,
    right: 15,
    marginTop: 90,
    marginRight: 25,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  btnView: {
    height: 50,
    marginTop: 20,
    borderWidth: 0,
    color: '#000000',
    borderRadius: 10,
    marginBottom: 15,
    fontWeight: 'bold',
    alignItems: 'center',
    borderColor: '#228B22',
    backgroundColor: '#c6481c',
    fontFamily: 'sans-serif-light',
  },
  btnText: {
    padding: 13,
    fontSize: 17,
    color: '#FDFDFD',
    fontWeight: 'bold',
  },
  cancelBtnView: {
    marginTop: 0,
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  cancelBtnText: {
    fontSize: 19,
    alignSelf: 'center',
    alignItems: 'center',
    textDecorationLine: 'underline',
  },
});

export default ConfirmPopup;
