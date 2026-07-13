import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  className?: string;
}

export const Chip = ({ label, selected, onPress, className = '' }: ChipProps) => {
  return (
    <TouchableOpacity
      className={`px-4 py-2 rounded-full border ${selected ? 'bg-white border-primary' : 'bg-surface border-transparent'} ${className}`}
      onPress={onPress}
    >
      <Text className={`font-bodyMedium text-sm ${selected ? 'text-primary' : 'text-textPrimary'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Chip;
