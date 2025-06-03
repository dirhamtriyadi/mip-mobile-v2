import React from 'react';
import {ActivityIndicator, Modal, Text, View} from 'react-native';
import styles from './styles';

interface LoadingModalProps {
  visible: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({visible}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    statusBarTranslucent>
    <View style={styles.loadingContainer}>
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Mengirim data...</Text>
      </View>
    </View>
  </Modal>
);

export default LoadingModal;
