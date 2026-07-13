import React, { ReactNode } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Check } from 'lucide-react-native';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label?: string | ReactNode;
  labelClassName?: string;
  className?: string;
}

export const Checkbox = ({ checked, onToggle, label, labelClassName = '', className = '' }: CheckboxProps) => {
  return (
    <View className={`flex-row items-center ${className}`}>
      <TouchableOpacity
        onPress={onToggle}
        className={`h-5 w-5 rounded-[4px] border border-border items-center justify-center ${checked ? 'bg-primary border-primary' : 'bg-transparent'}`}
      >
        {checked && <Check size={14} color="white" />}
      </TouchableOpacity>
      {label && (
        <TouchableOpacity onPress={onToggle}>
            {typeof label === 'string' ? (
                <Text className={`text-textPrimary text-sm font-body ml-2 ${labelClassName}`}>
                    {label}
                </Text>
            ) : (
                <View className="ml-2">{label}</View>
            )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Checkbox;
