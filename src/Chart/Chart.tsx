import React, { useEffect, useState } from 'react';
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  CurrentPositionVerticalLine,
} from '@rainbow-me/animated-charts';
import { Dimensions, View } from 'react-native';
import { PriceLabel } from './PriceLabel/PriceLabel';
import { PercentDiff } from './PercentDiff/PercentDiff';
import { PeriodSelector } from './PeriodSelector/PeriodSelector';
import { ChartPeriod } from './Chart.types';
import { Rate } from './Rate/Rate';
import { useQuery } from 'react-query';
import { loadChartData } from './Chart.api';
import { ChartYLabels } from './ChartYLabels/ChartYLabels';

const strokeColor = '#69ADFA';

export const { width: SIZE } = Dimensions.get('window');
export const DEFAULT_CHART_PERIOD = ChartPeriod.ONE_DAY;

const ChartComponent: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>(DEFAULT_CHART_PERIOD);

  const { isLoading, isFetching, data } = useQuery(['chartFetch', selectedPeriod], () =>
    loadChartData(selectedPeriod),
  );

  const [cachedData, setCachedData] = useState([]);

  useEffect(() => {
    if (data) {
      setCachedData(data.data);
    }
  }, [data]);
  
  const fiatRate = 1;

  const [maxPrice, minPrice] = React.useMemo(() => {
    if (!cachedData.length) {
      return ['0', '0'];
    }
    const mappedPoints = cachedData.map((o) => o.y);
    return [Math.max(...mappedPoints), Math.min(...mappedPoints)].map((value) =>
      (value * fiatRate).toFixed(2) + '$',
    );
  }, [cachedData, fiatRate]);

  const [firstPoint, latestPoint] = React.useMemo(() => {
    if (!cachedData.length) {
      return [0, 0];
    }
    const latest = cachedData[cachedData.length - 1].y;
    const first = cachedData[0].y;
    return [first, latest];
  }, [cachedData]);

  if (isLoading && !cachedData) {
    return null;
  }

  return (
    <View>
      <View>
        <ChartPathProvider data={{ points: cachedData }}>
          <View style={{ paddingHorizontal: 28 }}>
            {latestPoint ? (
              <Rate
                fiatCurrency={'$'}
                fiatRate={fiatRate}
                latestPoint={latestPoint}
              />
            ) : null}
            {latestPoint ? (
              <PercentDiff
                fiatCurrency={'$'}
                fiatRate={fiatRate}
                latestPoint={latestPoint}
                firstPoint={firstPoint}
              />
            ) : null}
            <PriceLabel selectedPeriod={selectedPeriod} />
          </View>
          <View style={{ paddingVertical: 30 }}>
            <View>
              <ChartPath
                gradientEnabled
                longPressGestureHandlerProps={{ minDurationMs: 90 }}
                hapticsEnabled
                strokeWidth={2}
                selectedStrokeWidth={2}
                height={160}
                stroke={strokeColor}
                width={SIZE}
                selectedOpacity={1}
              />
              <ChartDot
                size={40}
                style={{
                  backgroundColor: 'rgba(69,174,245,0.24)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    height: 16,
                    width: 16,
                    backgroundColor: strokeColor,
                    borderRadius: 8,
                  }}
                />
              </ChartDot>
              <CurrentPositionVerticalLine
                thickness={2}
                strokeDasharray={0}
                length={170}
                color={strokeColor}
              />
            </View>
          </View>
          <ChartYLabels maxPrice={maxPrice} minPrice={minPrice} />
        </ChartPathProvider>
      </View>
      <PeriodSelector
        disabled={isLoading || isFetching}
        selectedPeriod={selectedPeriod}
        onSelect={setSelectedPeriod}
      />
    </View>
  );
};

export const Chart = React.memo(ChartComponent);
