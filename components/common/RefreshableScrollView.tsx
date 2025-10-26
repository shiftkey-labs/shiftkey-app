import React, { useCallback, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  ScrollViewProps,
} from "react-native";

type RefreshableScrollViewProps = ScrollViewProps & {
  onRefresh: () => Promise<void> | void;
  refreshing?: boolean;
};

const RefreshableScrollView: React.FC<RefreshableScrollViewProps> = ({
  onRefresh,
  refreshing: controlledRefreshing,
  children,
  ...rest
}) => {
  const [internalRefreshing, setInternalRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) {
      return;
    }

    if (controlledRefreshing === undefined) {
      setInternalRefreshing(true);
    }

    try {
      await Promise.resolve(onRefresh());
    } finally {
      if (controlledRefreshing === undefined) {
        setInternalRefreshing(false);
      }
    }
  }, [onRefresh, controlledRefreshing]);

  const refreshing = controlledRefreshing ?? internalRefreshing;

  return (
    <ScrollView
      {...rest}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {children}
    </ScrollView>
  );
};

export default RefreshableScrollView;
