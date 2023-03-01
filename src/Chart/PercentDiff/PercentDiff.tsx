import React, { useEffect } from 'react';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { useChartData } from '@rainbow-me/animated-charts';
import { Platform, Text } from 'react-native';

export interface PercentDiffProps {
  latestPoint: number;
  firstPoint: number;
  fiatRate: number;
  fiatCurrency: string;
}

const fontFamily = Platform.select({
  ios: 'SFMono-Medium',
  android: 'RobotoMono-Medium',
});

const PercentDiffComponent: React.FC<PercentDiffProps> = (props) => {
  const chartData = useChartData();
  const [activePoint, setActivePoint] = React.useState(props.latestPoint);

  const priceDiff = React.useMemo(() => {
    return (((activePoint - props.firstPoint) / props.firstPoint) * 100).toFixed(2);
  }, [activePoint, props.firstPoint]);

  useEffect(() => {
    setActivePoint(props.latestPoint);
  }, [props.latestPoint]);

  const fiatInfo = React.useMemo(() => {
    let percent = '0.0%';
    let color = 'red';
    let amountResult: string;

    const diffInFiat = Math.abs(((activePoint * parseFloat(priceDiff)) / 100) * props.fiatRate).toFixed(2)
      + props.fiatCurrency;

    percent =
      priceDiff === null
        ? '-'
        : (+priceDiff > 0 ? '+ ' : '- ') + Math.abs(Number(priceDiff)) + ' %';
    if (priceDiff !== null) {
      color = +priceDiff > 0 ? 'green' : 'red';
    }

    return {
      percent,
      diffInFiat,
      color,
    };
  }, [priceDiff, activePoint]);

  const formatPriceWrapper = (point: number) => {
    if (!point) {
      setActivePoint(props.latestPoint);
      return;
    }
    setActivePoint(point);
  };

  useAnimatedReaction(
    () => {
      return chartData?.originalY.value;
    },
    (result, previous) => {
      if (result !== previous) {
        runOnJS(formatPriceWrapper)(result);
      }
    },
    [props.latestPoint],
  );

  return (
    <Text style={{ color: fiatInfo.color }}>
      {fiatInfo.percent}{' '}
      <Text
        style={{ opacity: 0.42, fontFamily, marginLeft: 8, color: fiatInfo.color }}
      >
        {fiatInfo.diffInFiat}
      </Text>
    </Text>
  );
};

export const PercentDiff = React.memo(PercentDiffComponent);
