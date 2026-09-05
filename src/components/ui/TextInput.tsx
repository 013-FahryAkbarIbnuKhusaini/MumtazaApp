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
      <View className="flex-row items-center bg-stone-100 border border-stone-200 rounded-2xl px-4 h-14 w-full">
        {leftIcon != null && (
          <View style={{ marginRight: 10 }}>{leftIcon}</View>
        )}
        <RNTextInput
          className="flex-1 text-base text-black"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          {...props}
        />
        {rightIcon != null && (
          <View style={{ marginLeft: 10 }}>{rightIcon}</View>
        )}
      </View>
      {error ? <Text className="text-red-500 mt-1 text-xs">{error}</Text> : null}
    </View>
  );
};

export default TextInput;
