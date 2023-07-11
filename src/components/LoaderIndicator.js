import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';

const Loader = props => {
  const {
    loading,
    DataDownloadText,
    DataDownloadImage,
    DownloadCompleteText,
    ...attributes
  } = props;
  const progressNumberData =
    (attributes?.totalDataSuccess / attributes?.totalAllData) * 100;
  const progressNumberFile =
    (attributes?.totalFileSuccess / attributes?.totalAllFile) * 100;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {}}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <View style={styles.TitleTextView}>
            <Text style={styles.TitleText}>Please wait ...</Text>
          </View>
          {attributes.showLoading && (
            <ActivityIndicator
              animating={true}
              color="black"
              size="large"
              style={styles.activityIndicator}
            />
          )}
          <Text>{DataDownloadText}</Text>
          <View style={styles.progressArea}>
            <View style={styles.row}>
              <Text>{progressNumberData}</Text>
              <View style={{width: '100%'}}>
                <View
                  style={[
                    styles.progress,
                    {
                      width: `${
                        progressNumberData
                          ? progressNumberData <= 90
                            ? progressNumberData - 10
                            : 90
                          : 0
                      }%`,
                    },
                  ]}
                />
              </View>
              <Text>{100} % Completed </Text>
            </View>
          </View>
          {attributes?.totalFileSuccess > 0 && (
            <>
              <Text>{DataDownloadImage}</Text>
              <View style={styles.progressArea}>
                <View style={styles.row}>
                  <Text>{progressNumberFile}</Text>
                  <View style={{width: '100%'}}>
                    <View
                      style={[
                        styles.progress,
                        {
                          width: `${
                            progressNumberFile
                              ? progressNumberFile <= 90
                                ? progressNumberFile - 10
                                : 88
                              : 0
                          }%`,
                        },
                      ]}
                    />
                  </View>
                  <Text>{100} % Completed </Text>
                </View>
              </View>
            </>
          )}
          {!attributes.showLoading && (
            <View style={styles.DownloadBtnView}>
              <TouchableOpacity
                style={styles.DownloadBtn}
                onPress={() => attributes.onOkPress()}>
                <Text style={styles.DownloadBtnText}>
                  {DownloadCompleteText}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default Loader;

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
    height: 400,
    width: '80%',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 70,
  },
  progressArea: {
    width: '50%',
    marginBottom: 15,
    marginTop: 1,
  },
  progress: {
    height: 5,
    backgroundColor: 'green',
    marginHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TitleTextView: {
    top: 12,
    alignItems: 'center',
  },
  TitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'blue',
  },

  DownloadBtnView: {
    backgroundColor: '#FFFFFF',
    height: 80,
    width: '80%',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  DownloadBtn: {
    backgroundColor: 'white',
    width: 200,
    borderWidth: 1,
    borderColor: 'green',
    borderTopColor: 'green',
    borderBottomColor: 'green',
    borderRadius: 5,
    height: 39,
    justifyContent: 'center',
  },
  DownloadBtnText: {
    alignSelf: 'center',
  },
});
