import React, { useEffect, useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import SignatureScreen, { SignatureViewRef } from 'react-native-signature-canvas';
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
  const lastTapRef = useRef(0); // Menyimpan waktu tap terakhir

  useEffect(() => {
    if (onScrollEnabledChange) {
      onScrollEnabledChange(scrollEnabled);
    }
  }, [scrollEnabled]);

  const handleDoubleTap = () => {
    const now = Date.now();
    const lastTap = lastTapRef.current;

    if (lastTap && now - lastTap < 300) {
      setIsLocked(false); // Unlock jika double tap terdeteksi
    } else {
      lastTapRef.current = now; // Simpan waktu tap saat ini
    }
  };

  const handleSignatureConfirm = (result: string) => {
    onConfirm(result);
    setIsLocked(true);
  };

  return (
    <View style={styles.groupField}>
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
          />
        </View>
      )}
    </View>
  );
}

export default InputSignature;
