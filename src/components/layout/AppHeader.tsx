import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft, Bell, Menu, LucideIcon } from 'lucide-react-native';

interface AppHeaderProps {
  variant?: 'default' | 'transparent' | 'title';
  title?: string;
  onBackPress?: () => void;
  onRightPress?: () => void;
  rightIcon?: LucideIcon;
  showNotificationDot?: boolean;
}

export const AppHeader = ({
  variant = 'default',
  title = 'MUMTAZA',
  onBackPress,
  onRightPress,
  rightIcon: RightIcon = Bell,
  showNotificationDot,
}: AppHeaderProps) => {
  if (variant === 'transparent') {
    return (
      <View className="absolute top-10 left-screenPadding right-screenPadding flex-row justify-between z-10">
        <TouchableOpacity className="bg-white/50 p-2 rounded-full" onPress={onBackPress}>
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="h-16 flex-row items-center justify-between px-screenPadding bg-white">
      <TouchableOpacity onPress={onBackPress}>
        {variant === 'title' ? <ChevronLeft size={24} color="#1A1C1C" /> : <Menu size={24} color="#1A1C1C" />}
      </TouchableOpacity>
      <Text className="font-heading text-lg">{title}</Text>
      <TouchableOpacity onPress={onRightPress}>
        <RightIcon size={24} color="#1A1C1C" />
        {showNotificationDot && <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-danger rounded-full" />}
      </TouchableOpacity>
    </View>
  );
};

export default AppHeader;
