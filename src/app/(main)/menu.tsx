import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function MenuScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center px-4 py-4">
        <Pressable onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ArrowLeft size={24} color="#1A1C1C" />
        </Pressable>
        <Text className="flex-1 text-center text-lg font-bold text-[#1A1C1C] mr-6">Menu Pengaturan</Text>
      </View>
      {/* Menu items go here */}
    </SafeAreaView>
  );
}
