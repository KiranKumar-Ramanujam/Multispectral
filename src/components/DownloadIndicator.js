import React, {useState} from 'react';
import {Modal, View, Text, ActivityIndicator} from 'react-native';

const DownloadIndicator = ({visible}) => {
  const [progress, setProgress] = useState(0);

  const handleProgress = event => {
    const totalBytes = event.total;
    const bytesLoaded = event.loaded;
    const progressPercent = Math.round((bytesLoaded / totalBytes) * 100);
    setProgress(progressPercent);
  };

  return (
    <Modal visible={visible}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {progress === 100 ? (
          <Text>Data Loaded Successfully!</Text>
        ) : (
          <>
            <ActivityIndicator size="large" />
            <Text>Fetching Data...</Text>
            <Text>{progress}%</Text>
          </>
        )}
      </View>
    </Modal>
  );
};

export default DownloadIndicator;
