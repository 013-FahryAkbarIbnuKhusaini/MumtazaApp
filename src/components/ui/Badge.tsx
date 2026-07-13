import React from 'react';
import { View, Text } from 'react-native';

type BadgeVariant = 'gold' | 'dark' | 'success' | 'warning' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  gold: 'bg-primary text-white',
  dark: 'bg-blackCustom text-white',
  success: 'bg-successBg text-success',
  warning: 'bg-warningBg text-warning',
  neutral: 'bg-surface text-textSecondary',
};

export const Badge = ({ label, variant = 'neutral', className = '' }: BadgeProps) => {
  return (
    <View className={`px-2 py-1 rounded-full ${variantStyles[variant]} ${className}`}>
      <Text className="text-xs font-bodySemiBold uppercase">{label}</Text>
    </View>
  );
};

export default Badge;
