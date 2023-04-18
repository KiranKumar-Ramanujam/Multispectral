import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');
const ratio = Math.min(width, height) / 375;

const SingleButtonPopup = ({
  visible,
  title,
  message,
  message2,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.container}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          {message2 != null && message2 != '' ? (
            <Text style={styles.message2}>{message2}</Text>
          ) : null}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onCancel}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    backgroundColor: '#fff',
    width: 300 * ratio,
    padding: 13 * ratio,
    borderRadius: 10 * ratio,
  },
  title: {
    fontSize: 19 * ratio,
    fontWeight: 'bold',
    color: 'blue',
    marginBottom: 15 * ratio,
  },
  message: {
    fontSize: 15 * ratio,
  },
  message2: {
    fontSize: 20 * ratio,
    marginBottom: 18 * ratio,
    alignSelf: 'center',
  },
  buttonContainer: {
    top: 5 * ratio,
    alignItems: 'center',
  },
  button: {
    padding: 12 * ratio,
    borderRadius: 5 * ratio,
    top: 5 * ratio,
  },
  confirmButton: {
    backgroundColor: 'green',
    width: 80 * ratio,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 14 * ratio,
  },
});

export default SingleButtonPopup;
