import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export const QuantityStepper = ({ quantity, onIncrease, onDecrease }: QuantityStepperProps) => {
  return (
    <View className="flex-row items-center border border-border rounded-full p-1 gap-3">
      <TouchableOpacity onPress={onDecrease} className="p-1">
        <Minus size={16} color="#1A1C1C" />
      </TouchableOpacity>
      <Text className="font-bodySemiBold text-base w-6 text-center">{quantity}</Text>
      <TouchableOpacity onPress={onIncrease} className="p-1">
        <Plus size={16} color="#1A1C1C" />
      </TouchableOpacity>
    </View>
  );
};

export default QuantityStepper;
