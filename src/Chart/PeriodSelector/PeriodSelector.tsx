import React, { useCallback } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { ChartPeriod } from '../Chart.types';

export interface PeriodSelectorProps {
  selectedPeriod: ChartPeriod;
  disabled?: boolean;
  onSelect: (newPeriod: ChartPeriod) => void;
}

const mappedPeriods = Object.values(ChartPeriod)
  .map((period) => ({ value: period, label: t(`chart.periods.${period}`) }))
  .reverse();

export const Period: React.FC<{
  onSelect: () => void;
  selected?: boolean;
  label: string;
  disabled?: boolean;
}> = (props) => {
  const backgroundColor = props.selected
    ? '#1D2633'
    : 'transparent';

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={props.selected || props.disabled}
      onPress={props.onSelect}
      style={{ paddingVertical: 7.5, borderRadius: 18, flex: 1, backgroundColor }}
    >
      <Text>
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};

export const PeriodSelector: React.FC<PeriodSelectorProps> = (props) => {
  const handleSelect = useCallback(
    (value: ChartPeriod) => () => {
      props.onSelect(value);
    },
    [props.onSelect],
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        paddingHorizontal: 27,
      }}
    >
      {mappedPeriods.map((period) => (
        <Period
          disabled={props.disabled}
          key={period.value}
          onSelect={handleSelect(period.value)}
          label={period.label}
          selected={props.selectedPeriod === period.value}
        />
      ))}
    </View>
  );
};
