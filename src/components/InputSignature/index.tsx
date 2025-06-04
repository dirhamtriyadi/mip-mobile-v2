import globalStyles from '@styles/styles';
import React, {useEffect, useRef, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import SignatureScreen, {SignatureViewRef} from 'react-native-signature-canvas';
import styles from './styles';
import webStyles from './webStyles';

interface InputSignatureProps {
  label: string;
  signature: string | null;
  onConfirm: (result: string) => void;
  onScrollEnabledChange?: (scrollEnabled: boolean) => void;
}

function InputSignature({
  label,
  signature,
  onConfirm,
  onScrollEnabledChange,
}: InputSignatureProps) {
  const ref = useRef<SignatureViewRef>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const lastTapRef = useRef(0);

  useEffect(() => {
    if (onScrollEnabledChange) {
      onScrollEnabledChange(scrollEnabled);
    }
  }, [scrollEnabled]);

  const handleDoubleTap = () => {
    const now = Date.now();
    const lastTap = lastTapRef.current;

    if (lastTap && now - lastTap < 300) {
      setIsLocked(false);
    } else {
      lastTapRef.current = now;
    }
  };

  const handleSignatureConfirm = (result: string) => {
    onConfirm(result);
    setIsLocked(true);
  };

  return (
    <View style={globalStyles.groupField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {signature ? (
        <Image
          resizeMode={'contain'}
          style={[
            {width: 335, height: 114},
            styles.fieldInput,
            webStyles.container,
          ]}
          source={{uri: signature}}
        />
      ) : null}
      {isLocked ? (
        <TouchableOpacity
          style={[styles.fieldInput, webStyles.container]}
          onPress={handleDoubleTap}
          activeOpacity={1}>
          <Text style={styles.lockedText}>Double tap to unlock</Text>
        </TouchableOpacity>
      ) : (
        <View style={webStyles.container}>
          <SignatureScreen
            ref={ref}
            onBegin={() => setScrollEnabled(false)}
            onEnd={() => setScrollEnabled(true)}
            onOK={handleSignatureConfirm}
            onEmpty={() => console.log('Empty')}
            onClear={() => console.log('clear')}
            autoClear={true}
            descriptionText={label}
            imageType="image/png"
            // Optimasi untuk performa
            minWidth={2}
            maxWidth={4}
            dotSize={0}
            penColor="black"
            backgroundColor="rgba(255,255,255,0)"
            webStyle={`
              .m-signature-pad {
                width: 100%;
                height: 100%;
                touch-action: none;
              }
              .m-signature-pad--body {
                border: none;
                background-color: transparent;
              }
              canvas {
                image-rendering: optimizeSpeed;
                image-rendering: -moz-crisp-edges;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: optimize-contrast;
                -ms-interpolation-mode: nearest-neighbor;
              }
            `}
          />
        </View>
      )}
    </View>
  );
}

export default InputSignature;
