import React from 'react';
import { Text } from 'react-native';

interface PriceTagProps {
  amount: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  emphasized?: boolean;
}

const sizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
};

export const PriceTag = ({ amount, currency = 'Rp', size = 'md', emphasized }: PriceTagProps) => {
  return (
    <Text className={`font-heading ${sizeStyles[size]} ${emphasized ? 'text-primary' : 'text-textPrimary'}`}>
      {currency} {amount.toLocaleString('id-ID')}
    </Text>
  );
};

export default PriceTag;
