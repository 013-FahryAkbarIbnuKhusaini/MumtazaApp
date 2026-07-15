import React, { useRef, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Animated, ColorValue } from 'react-native';
import { Home, LineChart, ShoppingBag, User } from 'lucide-react-native';

function AnimatedTabIcon({ IconComponent, focused, color, size }: { IconComponent: React.ElementType; focused: boolean; color: string | ColorValue; size: number }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.2 : 1,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <IconComponent color={color} size={size} />
    </Animated.View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#C9A961',
        tabBarInactiveTintColor: '#7A756D',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          height: 64,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },

      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => <AnimatedTabIcon IconComponent={Home} focused={focused} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="gold-price"
        options={{
          title: 'Gold Price',
          tabBarIcon: ({ color, size, focused }) => <AnimatedTabIcon IconComponent={LineChart} focused={focused} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size, focused }) => <AnimatedTabIcon IconComponent={ShoppingBag} focused={focused} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => <AnimatedTabIcon IconComponent={User} focused={focused} color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
