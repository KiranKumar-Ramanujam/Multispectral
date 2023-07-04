import React from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CircularProgress from './CircleIndicator';

const {width, height} = Dimensions.get('window');
const ratio = Math.min(width, height) / 375;

const StandardAlert = props => {
  const {
    visible,
    color,
    iconname,
    title,
    message1,
    message2,
    message3,
    message4,
    passwordexpiry,
    downloadData,
    blockdeletion,
    uploadData,
    uploadDataProgress,
    dataEmpty,
    logout,
    confirmOnpress,
    onRequestClose,
    cancelBtnOnpress,
  } = props;
  const headerBorderColor =
    color === 'red' ? '#c6481c' : color == 'blue' ? '#3460DC' : '#009D57';
  const headerTextColor =
    color === 'red' ? '#c6481c' : color == 'blue' ? '#3460DC' : '#009D57';

  return (
    <Modal
      transparent={true}
      animationType={'slide'}
      visible={visible}
      onRequestClose={onRequestClose}>
      <View style={styles.modalContainer}>
        <View
          style={[styles.headerView, {borderBottomColor: headerBorderColor}]}>
          <TouchableOpacity style={styles.headerIcon}></TouchableOpacity>
          <Text style={[styles.headerText, {color: headerTextColor}]}>
            {title}
          </Text>
        </View>
        <View style={styles.bodyPart}>
          <Text style={styles.bodyText}>{message1}</Text>
          {passwordexpiry && (
            <View>
              <View style={styles.row}>
                <Text
                  style={[
                    {
                      fontWeight: 'bold',
                      fontSize: 60 * ratio,
                      color: '#ff0000',
                      top: 35 * ratio,
                    },
                  ]}>
                  {message2}
                </Text>
                <Text
                  style={[
                    {
                      fontWeight: 'bold',
                      fontSize: 10 * ratio,
                      top: 85 * ratio,
                      marginLeft: 3 * ratio,
                      color: '#74777A',
                    },
                  ]}>
                  {message3}
                </Text>
              </View>
              <Text
                style={[
                  {
                    top: 38 * ratio,
                    fontSize: 8 * ratio,
                    marginLeft: 15 * ratio,
                    color: '#74777A',
                  },
                ]}>
                {message4}
              </Text>
            </View>
          )}
          {downloadData && message2 != null && message2 != '' && (
            <View>
              <Text
                style={[
                  {
                    fontWeight: '500',
                    fontSize: 10 * ratio,
                    color: '#737070',
                    top: message2 != null && message2 != null ? 60 * ratio : 30,
                    marginLeft: 15 * ratio,
                  },
                ]}>
                {message3}
              </Text>
            </View>
          )}
          {downloadData && (message2 == null || message2 == '') && (
            <View>
              <View>
                <Text
                  style={[
                    {
                      fontWeight: 'bold',
                      fontSize: 20 * ratio,
                      color: '#f58802',
                      marginLeft: 15 * ratio,
                      top: 40,
                      alignSelf: 'center',
                    },
                  ]}>
                  {message2}
                </Text>
              </View>
              <Text
                style={[
                  {
                    fontWeight: '500',
                    fontSize: 10 * ratio,
                    color: '#737070',
                    top: message2 != null && message2 != null ? 60 : 20 * ratio,
                    marginLeft: 15 * ratio,
                  },
                ]}>
                {message3}
              </Text>
            </View>
          )}
          {blockdeletion && (
            <View>
              <View>
                <Text
                  style={[
                    {
                      fontWeight: 'bold',
                      fontSize: 20 * ratio,
                      color: '#f58802',
                      marginLeft: 15 * ratio,
                      top: 35 * ratio,
                      alignSelf: 'center',
                    },
                  ]}>
                  {message2}
                </Text>
              </View>
              <Text
                style={[
                  {
                    fontWeight: '500',
                    fontSize: 10 * ratio,
                    color: '#737070',
                    top:
                      message2 != null && message2 != null
                        ? 45 * ratio
                        : 25 * ratio,
                    marginLeft: 15 * ratio,
                  },
                ]}>
                {message3}
              </Text>
            </View>
          )}
          {uploadData && (
            <View>
              <View>
                <Text
                  style={[
                    {
                      fontWeight: 'bold',
                      fontSize: 25,
                      color: '#f58802',
                      marginLeft: 18,
                      top: 40,
                      alignSelf: 'center',
                    },
                  ]}>
                  {message2}
                </Text>
              </View>
              <Text
                style={[
                  {
                    fontWeight: '500',
                    fontSize: 10 * ratio,
                    color: '#737070',
                    top: message2 != null && message2 != null ? 60 : 20 * ratio,
                    marginLeft: 15 * ratio,
                  },
                ]}>
                {message3}
              </Text>
            </View>
          )}
          {dataEmpty && (
            <View>
              <View>
                <Text
                  style={[
                    {
                      fontWeight: 'bold',
                      fontSize: 25,
                      color: '#f58802',
                      marginLeft: 15 * ratio,
                      top: 40,
                      alignSelf: 'center',
                    },
                  ]}>
                  {message2}
                </Text>
              </View>
              <Text
                style={[
                  {
                    fontWeight: '500',
                    fontSize: 10 * ratio,
                    color: '#737070',
                    top: message2 != null && message2 != null ? 60 : 28 * ratio,
                    marginLeft: 15 * ratio,
                  },
                ]}>
                {message3}
              </Text>
            </View>
          )}
          {logout && (
            <View>
              <View>
                <Text
                  style={[
                    {
                      fontWeight: 'bold',
                      fontSize: 25,
                      color: '#f58802',
                      marginLeft: 18,
                      top: 40,
                      alignSelf: 'center',
                    },
                  ]}>
                  {message2}
                </Text>
              </View>
              <Text
                style={[
                  {
                    fontWeight: '500',
                    fontSize: 10 * ratio,
                    color: '#737070',
                    top: message2 != null && message2 != null ? 60 : 20 * ratio,
                    marginLeft: 15 * ratio,
                  },
                ]}>
                {message3}
              </Text>
            </View>
          )}
          <MaterialCommunityIcons
            raised
            name={iconname}
            size={65 * ratio}
            style={{position: 'absolute', right: 0, padding: 15 * ratio}}
            color={
              color === 'red'
                ? '#c6481c'
                : color == 'blue'
                ? '#3460DC'
                : '#009D57'
            }
          />
          {(iconname == null || iconname == '') &&
          uploadDataProgress == true ? (
            <View
              style={[
                {
                  left: 240 * ratio,
                  bottom: 35 * ratio,
                },
              ]}>
              <CircularProgress
                progressPercent={message2}
                size={95 * ratio}
                strokeWidth={11 * ratio}
                pgColor={'#009D57'}
                text={`${message2}%`}
                textSize={16 * ratio}
                textColor={'darkgreen'}
              />
            </View>
          ) : null}
          <View
            style={[
              styles.mainBtn,
              {
                ...(Platform.OS !== 'android' && {zIndex: 10}),
              },
            ]}>
            {cancelBtnOnpress != null && blockdeletion && message2 != null ? (
              <View>
                <TouchableOpacity
                  style={[
                    styles.btnView,
                    {
                      marginTop: 60 * ratio,
                      backgroundColor:
                        color == 'blue'
                          ? '#3460DC'
                          : color == 'red'
                          ? '#c6481c'
                          : '#009D57',
                    },
                  ]}
                  onPress={confirmOnpress}>
                  <Text style={styles.btnText}>{'Confirmation'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelBtnView}
                  onPress={cancelBtnOnpress}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : cancelBtnOnpress != null ? (
              <View>
                <TouchableOpacity
                  style={[
                    styles.btnView,
                    {
                      marginTop: 50 * ratio,
                      backgroundColor:
                        color == 'blue'
                          ? '#3460DC'
                          : color == 'red'
                          ? '#c6481c'
                          : '#009D57',
                    },
                  ]}
                  onPress={confirmOnpress}>
                  <Text style={styles.btnText}>{'Confirmation'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelBtnView}
                  onPress={cancelBtnOnpress}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : passwordexpiry == true ? (
              <View>
                <TouchableOpacity
                  style={[
                    styles.btnView,
                    {
                      marginTop: 53 * ratio,
                      backgroundColor:
                        color == 'blue'
                          ? '#3460DC'
                          : color == 'red'
                          ? '#c6481c'
                          : '#009D57',
                    },
                  ]}
                  onPress={confirmOnpress}>
                  <Text style={styles.btnText}>{'Ok'}</Text>
                </TouchableOpacity>
              </View>
            ) : downloadData == true ? (
              <View>
                <TouchableOpacity
                  style={[
                    styles.btnView,
                    {
                      marginTop:
                        iconname != null && iconname != ''
                          ? 45 * ratio
                          : -6 * ratio,
                      backgroundColor:
                        color == 'blue'
                          ? '#3460DC'
                          : color == 'red'
                          ? '#c6481c'
                          : color == 'green' &&
                            iconname != null &&
                            iconname != ''
                          ? '#009D57'
                          : 'gray',
                    },
                  ]}
                  disabled={iconname == null || iconname == '' ? true : false}
                  onPress={confirmOnpress}>
                  {iconname == null || iconname == '' ? (
                    <View>
                      <Text style={styles.btnText}>{'Please wait ..'}</Text>
                    </View>
                  ) : (
                    <Text style={styles.btnText}>{'kembali'}</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : uploadData == true ? (
              <View>
                <TouchableOpacity
                  style={[
                    styles.btnView,
                    {
                      marginTop: 50 * ratio,
                      backgroundColor:
                        color == 'blue'
                          ? '#3460DC'
                          : color == 'red'
                          ? '#c6481c'
                          : '#009D57',
                    },
                  ]}
                  onPress={confirmOnpress}>
                  <Text style={styles.btnText}>{'kembali'}</Text>
                </TouchableOpacity>
              </View>
            ) : dataEmpty == true ? (
              <View>
                <TouchableOpacity
                  style={[
                    styles.btnView,
                    {
                      marginTop: 60 * ratio,
                      backgroundColor:
                        color == 'blue'
                          ? '#3460DC'
                          : color == 'red'
                          ? '#c6481c'
                          : '#009D57',
                    },
                  ]}
                  onPress={confirmOnpress}>
                  <Text style={styles.btnText}>{'kembali'}</Text>
                </TouchableOpacity>
              </View>
            ) : logout == true ? (
              <View>
                <TouchableOpacity
                  style={[
                    styles.btnView,
                    {
                      marginTop: 45 * ratio,
                      backgroundColor:
                        color == 'blue'
                          ? '#3460DC'
                          : color == 'red'
                          ? '#c6481c'
                          : '#009D57',
                    },
                  ]}
                  onPress={confirmOnpress}>
                  <Text style={styles.btnText}>{'logout'}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  style={[
                    styles.btnView,
                    {
                      marginTop: 70 * ratio,
                      backgroundColor:
                        color == 'blue'
                          ? '#3460DC'
                          : color == 'red'
                          ? '#c6481c'
                          : '#009D57',
                    },
                  ]}
                  onPress={confirmOnpress}>
                  <Text style={styles.btnText}>{'kembali'}</Text>
                </TouchableOpacity>
              </View>
            )}
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
    height: 262 * ratio,
    borderWidth: 1,
    position: 'absolute',
    alignItems: 'center',
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
  },
  headerIcon: {
    padding: 17,
    marginLeft: 0,
    position: 'absolute',
  },
  headerText: {
    top: 14,
    fontSize: 25,
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
    top: 10 * ratio,
    width: '65%',
    fontSize: 13 * ratio,
    marginLeft: 15 * ratio,
    fontWeight: 'bold',
    position: 'absolute',
    color: '#74777A',
  },
  extraText: {
    top: 82,
    width: '75%',
    fontSize: 14,
    marginLeft: 18,
    position: 'absolute',
  },
  bodySubText: {
    top: 40,
    width: '75%',
    marginLeft: 18,
    position: 'absolute',
  },
  mainBtn: {
    left: 15,
    right: 15,
    marginRight: 25,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  btnView: {
    height: 40 * ratio,
    borderWidth: 0,
    color: '#000000',
    borderRadius: 7 * ratio,
    fontWeight: 'bold',
    alignItems: 'center',
    fontFamily: 'sans-serif-light',
  },
  btnText: {
    padding: 9 * ratio,
    fontSize: 16 * ratio,
    color: '#FDFDFD',
    fontWeight: 'bold',
  },
  cancelBtnView: {
    marginTop: 12 * ratio,
    marginLeft: 20 * ratio,
    marginRight: 20 * ratio,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  cancelBtnText: {
    fontSize: 15 * ratio,
    alignSelf: 'center',
    alignItems: 'center',
    textDecorationLine: 'underline',
    color: '#74777A',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default StandardAlert;
