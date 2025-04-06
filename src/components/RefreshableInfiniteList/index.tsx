import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    FlatListProps,
    RefreshControl,
    Text,
    View,
} from 'react-native';

interface Props<T> extends FlatListProps<T> {
  onRefresh: () => Promise<void>;
  onLoadMore?: () => Promise<void>;
  isLoadingMore?: boolean;
  isInitialLoading?: boolean;
  hasNextPage?: boolean;
  error?: string | null;
  showEmpty?: boolean;
  EmptyComponent?: React.ReactNode;
  ErrorComponent?: (retry: () => void) => React.ReactNode;
  delay?: number;
}

function RefreshableInfiniteList<T>({
  onRefresh,
  onLoadMore,
  isLoadingMore = false,
  isInitialLoading = false,
  hasNextPage = true,
  error = null,
  showEmpty = true,
  EmptyComponent,
  ErrorComponent,
  delay = 800,
  ListFooterComponent,
  ...rest
}: Props<T>) {
  const [refreshing, setRefreshing] = useState(false);
  const [loadMoreTriggered, setLoadMoreTriggered] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    await new Promise(resolve => setTimeout(resolve, delay));
    setRefreshing(false);
  };

  const handleEndReached = useCallback(async () => {
    if (
      onLoadMore &&
      !loadMoreTriggered &&
      !refreshing &&
      hasNextPage !== false
    ) {
      setLoadMoreTriggered(true);
      await onLoadMore();
      setLoadMoreTriggered(false);
    }
  }, [onLoadMore, loadMoreTriggered, refreshing, hasNextPage]);

  if (isInitialLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error && ErrorComponent) {
    return <>{ErrorComponent(handleRefresh)}</>;
  }

  if (showEmpty && (!rest.data || rest.data.length === 0)) {
    return (
      <>
        {EmptyComponent || (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 16, color: '#999'}}>Data kosong</Text>
          </View>
        )}
      </>
    );
  }

  return (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.3}
      ListFooterComponent={
        isLoadingMore ? (
          <View style={{padding: 16}}>
            <ActivityIndicator size="small" />
          </View>
        ) : (
          ListFooterComponent || null
        )
      }
      {...rest}
    />
  );
}

export default RefreshableInfiniteList;
