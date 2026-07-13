import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  rightIcon?: React.ReactNode;
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'dark' | 'text';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  uppercase?: boolean;
  className?: string;
}

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  fullWidth = true,
  uppercase = false,
  className = '',
  rightIcon,
}: ButtonProps) => {
  const variants = {
    primary: "bg-[#785928]",
    outline: "border border-primary border-amber-700 bg-transparent",
    dark: "bg-blackCustom bg-black",
    text: "bg-transparent",
  };
  const textVariants = {
    primary: "text-white font-semibold text-base",
    outline: "text-primary text-amber-700 font-semibold text-base",
    dark: "text-white font-semibold text-base",
    text: "text-primary text-amber-700 font-semibold text-base",
  };

  return (
    <TouchableOpacity
      className={`${variants[variant]} rounded-xl py-3 px-4 h-14 flex-row items-center justify-center gap-2 ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50' : ''} ${className ?? ''}`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'dark' ? 'white' : '#785928'} />
) : (
        <>
          <Text className="text-white font-bold text-lg text-center">
            {label}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
