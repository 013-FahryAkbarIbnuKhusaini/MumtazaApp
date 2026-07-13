import React from 'react';
import { View, TextInput as RNTextInput, Text, TextInputProps as RNTextInputProps } from 'react-native';

interface TextInputProps extends Omit<RNTextInputProps, 'className'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const TextInput = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  className = '',
  leftIcon,
  rightIcon,
  ...props
}: TextInputProps) => {
  return (
    <View className={`w-full ${className}`}>
      <View className="flex-row items-center bg-[#F5F5F5] rounded-2xl px-4 h-14 w-full">
        {leftIcon && React.isValidElement(leftIcon)
          ? React.cloneElement(leftIcon as React.ReactElement<any>, {
              className: `mr-2 ${(leftIcon.props as any)?.className || ''}`.trim()
            })
          : leftIcon}
        <RNTextInput
          className="flex-1 text-base text-black"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          {...props}
        />
        {rightIcon && <View className="ml-2">{rightIcon}</View>}
      </View>
      {error && <Text className="text-red-500 mt-1 text-xs">{error}</Text>}
    </View>
  );
};

export default TextInput;
