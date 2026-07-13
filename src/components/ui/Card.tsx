import React, { ReactNode } from 'react';
import { View } from 'react-native';

interface CardProps {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}

export const Card = ({ children, className = '', padded = true }: CardProps) => {
  return (
    <View className={`bg-white rounded-md border border-border ${padded ? 'p-lg' : ''} ${className}`}>
      {children}
    </View>
  );
};

export default Card;
