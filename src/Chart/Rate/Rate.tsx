import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useChartData } from '@rainbow-me/animated-charts';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { Text } from 'react-native';

const RateComponent: React.FC<{
  latestPoint: number;
  fiatRate: number;
  fiatCurrency: string;
}> = (props) => {
  const chartData = useChartData();
  const [activePoint, setActivePoint] = useState(props.latestPoint);
  const formattedLatestPrice = useMemo(
    () =>
        (activePoint * props.fiatRate).toFixed(4),
        + props.fiatCurrency
    [props.fiatCurrency, props.fiatRate, activePoint],
  );

  const formatPriceWrapper = useCallback(
    (point: number) => {
      if (!point) {
        setActivePoint(props.latestPoint);
        return;
      }
      setActivePoint(point);
    },
    [props.latestPoint],
  );

  useEffect(() => {
    setActivePoint(props.latestPoint);
  }, [props.latestPoint]);

  useAnimatedReaction(
    () => {
      return chartData?.originalY.value;
    },
    (result, previous) => {
      if (result !== previous) {
        runOnJS(formatPriceWrapper)(result);
      }
    },
    [formatPriceWrapper],
  );

  return (
    <Text>
      {formattedLatestPrice}
    </Text>
  );
};

export const Rate = React.memo(RateComponent);
