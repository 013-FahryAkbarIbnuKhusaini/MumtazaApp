import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Home, Bell, User, X, LogOut } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';

const DRAWER_WIDTH = Dimensions.get('window').width * 0.75;
const BRAND_GOLD = '#C9A961';
const MENU_ICON_GOLD = '#785928';

interface SidebarMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function SidebarMenu({ visible, onClose }: SidebarMenuProps) {
  const [mounted, setMounted] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isMountedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOut = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (!isMountedRef.current) return;
      setMounted(false);
      onClose();
    });
  };

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(-DRAWER_WIDTH);
      fadeAnim.setValue(0);
      setMounted(true);
      requestAnimationFrame(() => {
        animateIn();
      });
    }
    // Closing is always user-initiated via animateOut() — never triggered by
    // the effect reacting to visible becoming false, to prevent double-triggering.
  }, [visible]);

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    setLogoutModalVisible(false);
    animateOut();
    useAuthStore.getState().logout();
    router.replace('/(auth)/login');
  };

  return (
    <>
    <Modal transparent animationType="none" visible={mounted} onRequestClose={animateOut}>
      <View className="flex-row flex-1">
        <Animated.View
          className="absolute inset-0"
          style={{ opacity: fadeAnim }}
        >
          <Pressable className="flex-1 bg-black/50" onPress={animateOut} />
        </Animated.View>

        <Animated.View
          className="rounded-r-3xl"
          style={{
            width: DRAWER_WIDTH,
            height: '100%',
            backgroundColor: '#FAFAFC',
            shadowColor: '#000',
            shadowOffset: { width: 2, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 10,
            transform: [{ translateX: slideAnim }],
          }}
        >
          <SafeAreaView className="flex-1">
            <Pressable
              onPress={animateOut}
              className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            >
              <X size={18} color="#4B5563" />
            </Pressable>

            <View className="items-center pt-14 pb-6">
              <View className="border-2 border-[#C9A961] p-1 rounded-full mb-4">
                <View className="w-16 h-16 rounded-full bg-[#F5F0EB] items-center justify-center">
                  <User size={28} color="#C9A961" />
                </View>
              </View>
              <Text className="text-gray-900 text-lg font-bold">Mumtaza User</Text>
              <Text className="text-gray-500 text-sm">mumtaza@example.com</Text>
            </View>

            <Text className="text-xs text-gray-400 font-semibold tracking-wider px-6 pb-2 pt-6">EKSPLORASI</Text>
            <Pressable
              onPress={() => {
                animateOut();
                router.replace('/(tabs)');
              }}
              className="flex-row items-center px-6 py-3.5 active:bg-gray-100"
            >
              <Home size={20} color={MENU_ICON_GOLD} />
              <Text className="flex-1 ml-4 text-[15px] font-semibold text-gray-800">Beranda</Text>
            </Pressable>

            <Text className="text-xs text-gray-400 font-semibold tracking-wider px-6 pb-2 pt-6">AKUN UTAMA</Text>
            <Pressable
              onPress={() => { animateOut(); router.push('/notifications'); }}
              className="flex-row items-center px-6 py-3.5 active:bg-gray-100"
            >
              <Bell size={20} color={MENU_ICON_GOLD} />
              <Text className="flex-1 ml-4 text-[15px] font-semibold text-gray-800">Notifikasi</Text>
            </Pressable>

            <View className="mt-auto px-6 pb-6 pt-4">
              <Pressable
                onPress={handleLogout}
                className="flex-row items-center py-2"
              >
                <LogOut size={20} color="#F87171" />
                <Text className="ml-4 text-[15px] font-semibold text-red-400">Logout</Text>
              </Pressable>
              <Text className="text-[10px] text-gray-300 text-center mt-5">MUMTAZA v1.0.0</Text>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>

    {/* Logout Confirmation Modal — identical to Profile screen's modal */}
    <Modal transparent={true} visible={isLogoutModalVisible} animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/40 px-6">
        <View className="w-full bg-white rounded-[24px] p-6 items-center shadow-lg">

          {/* Icon Circle */}
          <View className="w-14 h-14 rounded-full bg-stone-50 justify-center items-center mb-4">
            <LogOut size={24} color="#785928" />
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
              onPress={confirmLogout}
            >
              <Text className="text-sm font-bold text-white">Sign Out</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
    </>
  );
}
