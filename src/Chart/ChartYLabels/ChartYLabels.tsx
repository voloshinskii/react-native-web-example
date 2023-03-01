import React from 'react';
import { Text } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useChartData } from '@rainbow-me/animated-charts';

export interface ChartYLabelsProps {
  minPrice: string;
  maxPrice: string;
}

export const ChartYLabelsComponent: React.FC<ChartYLabelsProps> = (props) => {
  const chartData = useChartData();

  const labelStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming([0, 5, 1].includes(chartData?.state.value) ? 1 : 0, {
        duration: 200,
      }),
    };
  }, [chartData?.state.value]);

  return (
    <>
      <Animated.View
        style={[labelStyle, { position: 'absolute', right: 15.5, bottom: 23 }]}
      >
        <Text>
          {props.minPrice}
        </Text>
      </Animated.View>
      <Animated.View
        style={[labelStyle, { position: 'absolute', right: 15.5, top: 68.5 }]}
      >
        <Text>
          {props.maxPrice}
        </Text>
      </Animated.View>
    </>
  );
};

export const ChartYLabels = React.memo(ChartYLabelsComponent);
