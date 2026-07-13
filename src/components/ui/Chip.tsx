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
      className={`px-4 py-2 rounded-full ${
        selected
          ? 'bg-white border-[1.5px] border-[#C9A961]'
          : 'bg-[#F1EDE7] border border-transparent'
      } ${className}`}
      onPress={onPress}
    >
      <Text
        className={`text-sm ${
          selected ? 'font-semibold text-[#C9A961]' : 'font-medium text-[#211D18]'
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Chip;
