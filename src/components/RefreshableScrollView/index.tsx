import React, { ReactNode } from 'react';
import { RefreshControl, ScrollView, ScrollViewProps } from 'react-native';

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
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      {...rest}>
      {children}
    </ScrollView>
  );
};

export default RefreshableScrollView;
