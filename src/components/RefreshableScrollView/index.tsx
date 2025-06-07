import React, {ReactNode} from 'react';
import {RefreshControl, ScrollViewProps} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface Props extends ScrollViewProps {
  refreshing: boolean;
  onRefresh: () => void;
  children: ReactNode;
}

const RefreshableScrollView = ({
  refreshing,
  onRefresh,
  children,
  ...rest
}: Props) => {
  return (
    <KeyboardAwareScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={{flex: 1}}
      // contentContainerStyle={{
      //   paddingBottom: 120, // ✅ Extra space at bottom
      // }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true} // ✅ Enable for Android
      enableAutomaticScroll={true} // ✅ Auto scroll to focused input
      // extraHeight={150} // ✅ Extra space above keyboard
      extraScrollHeight={150} // ✅ Extra scroll height
      showsVerticalScrollIndicator={false}
      {...rest}>
      {children}
    </KeyboardAwareScrollView>
  );
};

export default RefreshableScrollView;
