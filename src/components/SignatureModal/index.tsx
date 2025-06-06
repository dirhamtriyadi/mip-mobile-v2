import React, {useCallback, useRef, useState} from 'react';
import {
  BackHandler,
  Dimensions,
  Modal,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SignatureScreen, {SignatureViewRef} from 'react-native-signature-canvas';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width, height} = Dimensions.get('window');

interface SignatureModalProps {
  visible: boolean;
  label: string;
  onConfirm: (result: string) => void;
  onCancel: () => void;
}

const SignatureModal: React.FC<SignatureModalProps> = ({
  visible,
  label,
  onConfirm,
  onCancel,
}) => {
  const ref = useRef<SignatureViewRef>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleConfirm = useCallback(
    (result: string) => {
      onConfirm(result);
    },
    [onConfirm],
  );

  const handleClear = useCallback(() => {
    ref.current?.clearSignature();
  }, []);

  const handleBegin = useCallback(() => {
    setIsDrawing(true);
  }, []);

  const handleEnd = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Handle Android back button
  React.useEffect(() => {
    if (visible) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          onCancel();
          return true;
        },
      );
      return () => backHandler.remove();
    }
  }, [visible, onCancel]);

  // Calculate exact canvas dimensions
  const modalPadding = 32; // 16px * 2
  const containerWidth = width * 0.95 - modalPadding;
  const containerHeight = height * 0.45; // Increased height for better proportion

  const optimizedWebStyle = `
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      overflow: hidden !important;
      height: 100% !important;
      width: 100% !important;
    }
    
    .m-signature-pad {
      width: 100% !important;
      height: 100% !important;
      border: none !important;
      margin: 0 !important;
      padding: 0 !important;
      touch-action: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      overflow: hidden !important;
    }
    
    .m-signature-pad--body {
      border: none !important;
      background-color: transparent !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      height: 100% !important;
      overflow: hidden !important;
    }
    
    .m-signature-pad--footer {
      display: none !important;
    }
    
    .m-signature-pad canvas {
      width: ${containerWidth}px !important;
      height: ${containerHeight}px !important;
      border: none !important;
      border-bottom: none !important;
      border-top: none !important;
      border-left: none !important;
      border-right: none !important;
      outline: none !important;
      box-shadow: none !important;
      margin: 0 !important;
      padding: 0 !important;
      background-color: transparent !important;
      image-rendering: optimizeSpeed;
      image-rendering: -moz-crisp-edges;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: optimize-contrast;
      -ms-interpolation-mode: nearest-neighbor;
      will-change: transform;
      transform: translateZ(0);
    }
    
    .m-signature-pad--body canvas {
      border: none !important;
      border-bottom: none !important;
      outline: none !important;
      box-shadow: none !important;
    }
    
    .signature-pad {
      border: none !important;
      overflow: hidden !important;
    }
    
    .signature-pad canvas {
      border: none !important;
      border-bottom: none !important;
      outline: none !important;
      box-shadow: none !important;
    }
    
    * {
      border: none !important;
      border-bottom: none !important;
      outline: none !important;
      box-shadow: none !important;
      overflow: hidden !important;
    }
  `;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onCancel}
      statusBarTranslucent>
      <StatusBar backgroundColor="rgba(0,0,0,0.8)" barStyle="light-content" />

      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.8)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: width * 0.95,
            height: height * 0.8,
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 16,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.3,
            shadowRadius: 8,
            flexDirection: 'column', // Ensure column layout
          }}>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              paddingBottom: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#e0e0e0',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#333',
              }}>
              {label}
            </Text>
            <TouchableOpacity
              onPress={onCancel}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: '#f0f0f0',
              }}>
              <Icon name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Content Area - Flex to fill space */}
          <View style={{flex: 1}}>
            {/* Signature Canvas Container */}
            <View
              style={{
                width: containerWidth,
                height: containerHeight,
                backgroundColor: '#fafafa',
                borderRadius: 8,
                borderWidth: 2,
                borderColor: isDrawing ? '#007AFF' : '#e0e0e0',
                borderStyle: 'dashed',
                marginBottom: 16,
                alignSelf: 'center',
                overflow: 'hidden',
                position: 'relative',
              }}>
              {/* Canvas wrapper with exact dimensions */}
              <View
                style={{
                  width: containerWidth,
                  height: containerHeight,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  backgroundColor: 'transparent',
                }}>
                <SignatureScreen
                  ref={ref}
                  onBegin={handleBegin}
                  onEnd={handleEnd}
                  onOK={handleConfirm}
                  onEmpty={() => {}}
                  onClear={() => {}}
                  autoClear={false}
                  descriptionText=""
                  imageType="image/png"
                  minWidth={1.5}
                  maxWidth={3}
                  dotSize={0}
                  penColor="#333"
                  backgroundColor="rgba(255,255,255,0)"
                  trimWhitespace={true}
                  scrollable={false}
                  webStyle={optimizedWebStyle}
                />
              </View>
            </View>

            {/* Instructions */}
            <View
              style={{
                backgroundColor: '#f8f9fa',
                padding: 12,
                borderRadius: 8,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#666',
                  textAlign: 'center',
                }}>
                Gambarlah tanda tangan Anda pada area di atas
              </Text>
            </View>
          </View>

          {/* Action Buttons - Fixed at bottom */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 16,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: '#e0e0e0',
            }}>
            <TouchableOpacity
              onPress={handleClear}
              style={{
                flex: 1,
                backgroundColor: '#f8f9fa',
                paddingVertical: 14,
                paddingHorizontal: 20,
                borderRadius: 8,
                marginRight: 8,
                borderWidth: 1,
                borderColor: '#dee2e6',
              }}>
              <Text
                style={{
                  color: '#666',
                  fontSize: 16,
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                Hapus
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => ref.current?.readSignature()}
              style={{
                flex: 1,
                backgroundColor: '#007AFF',
                paddingVertical: 14,
                paddingHorizontal: 20,
                borderRadius: 8,
                marginLeft: 8,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                Simpan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(SignatureModal);
