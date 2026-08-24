import React, { useRef, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Animated, ColorValue, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: 'transparent',
        tabBarInactiveBackgroundColor: 'transparent',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F5F5F4',
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 0,
          height: 64 + (insets.bottom > 0 ? insets.bottom : 0),
          paddingTop: 8,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        tabBarButton: (props) => {
          const { ref, ...rest } = props as any;
          return (
            <Pressable
              {...rest}
              android_ripple={null}
            />
          );
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <AnimatedTabIcon IconComponent={Home} focused={focused} color={focused ? '#785928' : '#A8A29E'} size={size} />
              {focused ? <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#785928', marginTop: 4 }} /> : null}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="gold-price"
        options={{
          title: 'Gold Price',
          tabBarIcon: ({ size, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <AnimatedTabIcon IconComponent={LineChart} focused={focused} color={focused ? '#785928' : '#A8A29E'} size={size} />
              {focused ? <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#785928', marginTop: 4 }} /> : null}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ size, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <AnimatedTabIcon IconComponent={ShoppingBag} focused={focused} color={focused ? '#785928' : '#A8A29E'} size={size} />
              {focused ? <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#785928', marginTop: 4 }} /> : null}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <AnimatedTabIcon IconComponent={User} focused={focused} color={focused ? '#785928' : '#A8A29E'} size={size} />
              {focused ? <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#785928', marginTop: 4 }} /> : null}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
