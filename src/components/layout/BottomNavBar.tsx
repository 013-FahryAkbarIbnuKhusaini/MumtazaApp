import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Home, TrendingUp, ShoppingBag, User, LucideIcon } from 'lucide-react-native';

interface BottomNavBarProps {
  activeTab: 'home' | 'price' | 'cart' | 'profile';
  onTabPress: (tab: 'home' | 'price' | 'cart' | 'profile') => void;
  cartCount?: number;
}

const tabs: { key: 'home' | 'price' | 'cart' | 'profile'; label: string; icon: LucideIcon }[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'price', label: 'Price', icon: TrendingUp },
  { key: 'cart', label: 'Cart', icon: ShoppingBag },
  { key: 'profile', label: 'Profile', icon: User },
];

export const BottomNavBar = ({ activeTab, onTabPress, cartCount }: BottomNavBarProps) => {
  return (
    <View className="h-[64px] flex-row bg-white border-t border-border px-4 items-center justify-around">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity key={tab.key} className="items-center" onPress={() => onTabPress(tab.key)}>
            <Icon size={24} color={isActive ? '#785928' : '#5E5E5E'} />
            {isActive && <View className="w-1.5 h-1.5 bg-primary rounded-full mt-1" />}
            <Text className={`text-xs mt-0.5 ${isActive ? 'text-primary font-bodySemiBold' : 'text-textSecondary'}`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNavBar;
