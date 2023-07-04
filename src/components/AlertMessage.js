import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  View,
} from 'react-native';

const {width, height} = Dimensions.get('window');
const ratio = Math.min(width, height) / 375;

const CustomAlert = ({
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
          <Text style={styles.message2}>{message2}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}>
              <Text style={styles.buttonText}>Confirm</Text>
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
    borderRadius: 7 * ratio,
  },
  title: {
    fontSize: 19 * ratio,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10 * ratio,
  },
  message: {
    fontSize: 15 * ratio,
    color: '#74777A',
  },
  message2: {
    fontSize: 20 * ratio,
    marginBottom: 18 * ratio,
    alignSelf: 'center',
    color: '#74777A',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    padding: 12 * ratio,
    borderRadius: 5 * ratio,
    marginLeft: 10 * ratio,
  },
  cancelButton: {
    backgroundColor: '#ddd',
    width: 80 * ratio,
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

export default CustomAlert;
