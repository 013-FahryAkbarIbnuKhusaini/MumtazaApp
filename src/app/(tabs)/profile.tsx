import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import SidebarMenu from '../../components/layout/SidebarMenu';
import { useAuthStore } from '../../store/authStore';

// Static local mock constants for user profile
const USER_DATA = {
  name: 'Lianel Zaneti Malik Ibrahim',
  email: 'leonelmesi17@gmail.com',
  membership: 'Silver Member',
};

interface MenuItem {
  id: string;
  label: string;
  iconFamily: 'Feather' | 'Ionicons';
  iconName: string;
  onPress?: () => void;
  isDestructive?: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: 'point',
      label: 'Point & Voucher',
      iconFamily: 'Ionicons',
      iconName: 'cash-outline',
      onPress: () => router.push('/(main)/points' as any),
    },
    {
      id: 'help',
      label: 'Help Center',
      iconFamily: 'Feather',
      iconName: 'help-circle',
      onPress: () => router.push('/help-center' as any),
    },
    {
      id: 'logout',
      label: 'Log Out',
      iconFamily: 'Feather',
      iconName: 'log-out',
      onPress: () => setLogoutModalVisible(true),
      isDestructive: true,
    },
  ];

  const renderIcon = (
    family: 'Feather' | 'Ionicons',
    name: string,
    size: number,
    color: string
  ) => {
    if (family === 'Ionicons') {
      return <Ionicons name={name as any} size={size} color={color} />;
    }
    return <Feather name={name as any} size={size} color={color} />;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8]" edges={['top']}>
      {/* Top Header */}
      <View className="relative flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity
          onPress={() => setSidebarVisible(true)}
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          <Feather name="menu" size={22} color="#211D18" />
        </TouchableOpacity>

        <View className="absolute left-0 right-0 items-center justify-center" pointerEvents="none">
          <Text className="font-serif text-4xl tracking-[0.2em] text-[#211D18]">
            MUMTAZA
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/notifications')}
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          <Feather name="bell" size={20} color="#211D18" />
        </TouchableOpacity>
      </View>

      <SidebarMenu visible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-10">
        {/* User Info Block */}
        <View className="items-center mt-2 mb-6 px-5">
          {/* Avatar Container */}
          <View className="relative mb-3">
            <View className="w-24 h-24 rounded-full bg-[#E5E0D8] items-center justify-center">
              <Ionicons name="person-outline" size={42} color="#6B5938" />
            </View>
            <TouchableOpacity
              onPress={() => router.push('/edit-profile' as any)} // TODO: confirm this route exists — no matching screen found under src/app/ at time of edit
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#524128] items-center justify-center border-2 border-white"
            >
              <Feather name="edit-2" size={12} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* User Name & Email */}
          <Text className="text-xl font-bold text-[#1A1A1A] mb-1 text-center">
            {USER_DATA.name}
          </Text>
          <Text className="text-sm text-[#7A756D] mb-3 text-center">
            {USER_DATA.email}
          </Text>

          {/* Membership Badge */}
          <View className="flex-row items-center bg-[#F4EFEB] px-3.5 py-1.5 rounded-full border border-[#E5DDD2]">
            <Ionicons name="ribbon-outline" size={15} color="#8C6E3D" />
            <Text className="ml-1.5 text-xs font-semibold text-[#8C6E3D]">
              {USER_DATA.membership}
            </Text>
          </View>
        </View>

        {/* Quick Actions (My Orders & Wishlist) */}
        <View className="flex-row gap-x-4 px-5 mb-6">
          <TouchableOpacity
            onPress={() => router.push('/orders' as any)} // TODO: confirm this route exists — no matching screen found under src/app/ at time of edit
            className="flex-1 bg-white rounded-2xl p-5 items-center justify-center shadow-sm border border-[#F0ECE6]"
          >
            <View className="w-12 h-12 rounded-full bg-[#F4EFEB] items-center justify-center mb-3">
              <Feather name="shopping-bag" size={20} color="#8C6E3D" />
            </View>
            <Text className="text-sm font-semibold text-[#211D18]">My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(main)/wishlist' as any)}
            className="flex-1 bg-white rounded-2xl p-5 items-center justify-center shadow-sm border border-[#F0ECE6]"
          >
            <View className="w-12 h-12 rounded-full bg-[#F4EFEB] items-center justify-center mb-3">
              <Feather name="heart" size={20} color="#8C6E3D" />
            </View>
            <Text className="text-sm font-semibold text-[#211D18]">Wishlist</Text>
          </TouchableOpacity>
        </View>

        {/* List Menu Card */}
        <View className="mx-5 bg-white rounded-2xl shadow-sm border border-[#F0ECE6] overflow-hidden">
          {menuItems.map((item, index) => {
            const isLast = index === menuItems.length - 1;
            const isDestructive = item.isDestructive;

            return (
              <TouchableOpacity
                key={item.id}
                onPress={item.onPress}
                activeOpacity={0.7}
                className={`flex-row items-center px-4 py-4 ${
                  !isLast ? 'border-b border-[#F0ECE6]' : ''
                }`}
              >
                {/* Icon Circle */}
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center mr-3.5 ${
                    isDestructive ? 'bg-[#FEE2E2]' : 'bg-[#F4EFEB]'
                  }`}
                >
                  {renderIcon(
                    item.iconFamily,
                    item.iconName,
                    18,
                    isDestructive ? '#DC2626' : '#8C6E3D'
                  )}
                </View>

                {/* Label */}
                <Text
                  className={`flex-1 text-base font-medium ${
                    isDestructive ? 'text-[#DC2626] font-semibold' : 'text-[#211D18]'
                  }`}
                >
                  {item.label}
                </Text>

                {/* Right Chevron (hidden for Log Out) */}
                {!isDestructive && (
                  <Feather name="chevron-right" size={18} color="#B5B0A8" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal transparent={true} visible={isLogoutModalVisible} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/40 px-6">
          <View className="w-full bg-white rounded-[24px] p-6 items-center shadow-lg">

            {/* Icon Circle */}
            <View className="w-14 h-14 rounded-full bg-stone-50 justify-center items-center mb-4">
              <Feather name="log-out" size={24} color="#785928" />
            </View>

            {/* Title & Subtitle */}
            <Text className="text-lg font-bold text-slate-800 mb-2">Sign Out</Text>
            <Text className="text-sm text-stone-500 text-center mb-6">
              Are you sure you want to log out of your account?
            </Text>

            {/* Button Row */}
            <View className="flex-row w-full gap-3">
              {/* Cancel Button */}
              <Pressable
                className="flex-1 py-3.5 rounded-full bg-stone-100 items-center"
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text className="text-sm font-bold text-stone-500">Cancel</Text>
              </Pressable>

              {/* Confirm Logout Button */}
              <Pressable
                className="flex-1 py-3.5 rounded-full bg-[#785928] items-center"
                onPress={() => {
                  setLogoutModalVisible(false);
                  useAuthStore.getState().logout();
                  router.replace('/(auth)/login');
                }}
              >
                <Text className="text-sm font-bold text-white">Sign Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
