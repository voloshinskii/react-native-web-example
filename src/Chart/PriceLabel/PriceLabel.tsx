import React, { useCallback, useMemo, useState } from 'react';
import { useChartData } from '@rainbow-me/animated-charts';
import { format, subMonths } from 'date-fns';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { Text } from 'react-native';
import { ChartPeriod } from '../Chart.types';

export const PriceLabel: React.FC<{ selectedPeriod: ChartPeriod }> = (props) => {
  const shouldShowHoursLabel = useMemo(
    () =>
      [ChartPeriod.ONE_HOUR, ChartPeriod.ONE_DAY, ChartPeriod.SEVEN_DAYS].includes(
        props.selectedPeriod,
      ),
    [props.selectedPeriod],
  );
  const chartData = useChartData();
  const [state, setState] = useState('');

  const formatDateWrapper = useCallback(
    (text: string) => {
      if (!text) {
        setState('Price');
        return;
      }
      const subbedText = subMonths(new Date(parseInt(text) * 1000), 1);
      setState(
        format(
          subbedText,
          `${'ccc'}, dd MMM ${
            shouldShowHoursLabel ? 'HH:mm' : ''
          }`,
          { locale: { code: 'en' } },
        ),
      );
    },
    [shouldShowHoursLabel],
  );

  useAnimatedReaction(
    () => {
      return chartData?.originalX.value;
    },
    (result, previous) => {
      if (result !== previous) {
        runOnJS(formatDateWrapper)(result);
      }
    },
    [formatDateWrapper],
  );

  return (
    <Text>
      {state}
    </Text>
  );
};
