import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';

// -----------------------------------------------------------------------------
// MOCK RECOMMENDATION DATA
// -----------------------------------------------------------------------------
const RECOMMENDATIONS = [
  {
    id: '1',
    name: 'Nusantara Crown Ring',
    price: 'Rp 12.500.000',
    image:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    name: 'Batik Weave Band',
    price: 'Rp 8.250.000',
    image:
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&auto=format&fit=crop&q=80',
  },
];

// -----------------------------------------------------------------------------
// CART SCREEN — EMPTY STATE
// -----------------------------------------------------------------------------
export default function CartScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* ----------------------------------------------------------------- */}
        {/* 1. EMPTY STATE SECTION                                            */}
        {/* ----------------------------------------------------------------- */}
        <View className="items-center justify-center px-6 pt-16">
          {/* Icon */}
          <View className="w-32 h-32 rounded-full bg-stone-50 justify-center items-center mb-6">
            <Feather name="shopping-bag" size={40} color="#785928" />
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-slate-800 mb-3">
            Keranjang Anda Kosong
          </Text>

          {/* Subtitle */}
          <Text className="text-sm text-stone-500 text-center px-6 leading-relaxed mb-8">
            Temukan perhiasan abadi dan tambahkan favorit Anda untuk memulai
            pengalaman belanja yang mewah.
          </Text>

          {/* Primary Button — Jelajahi Koleksi */}
          <Pressable
            onPress={() => router.push('/(tabs)')}
            className="w-[80%] bg-[#785928] py-4 rounded-full flex-row justify-center items-center gap-2 shadow-sm"
          >
            <Text className="text-white font-semibold">Jelajahi Koleksi</Text>
            <Feather name="arrow-right" size={18} color="#FFFFFF" />
          </Pressable>

          {/* Secondary Button — Lanjut Belanja */}
          <Pressable onPress={() => router.back()} className="mt-6">
            <Text className="text-[#785928] font-semibold">Lanjut Belanja</Text>
          </Pressable>
        </View>

        {/* ----------------------------------------------------------------- */}
        {/* 2. DIVIDER                                                        */}
        {/* ----------------------------------------------------------------- */}
        <View className="h-[1px] bg-stone-200 w-full my-8" />

        {/* ----------------------------------------------------------------- */}
        {/* 3. RECOMMENDATION SECTION — "Mungkin Anda Suka"                   */}
        {/* ----------------------------------------------------------------- */}
        <Text className="text-xl font-bold text-slate-800 mb-6 px-4">
          Mungkin Anda Suka
        </Text>

        <View className="flex-row flex-wrap justify-between px-4">
          {RECOMMENDATIONS.map((product) => (
            <View key={product.id} className="w-[48%] mb-6">
              {/* Image */}
              <View className="w-full aspect-[4/5] bg-stone-100 rounded-xl overflow-hidden mb-3">
                <Image
                  source={{ uri: product.image }}
                  className="w-full h-full"
                  contentFit="cover"
                  transition={300}
                />
              </View>

              {/* Product Name */}
              <Text className="text-sm font-medium text-slate-800">
                {product.name}
              </Text>

              {/* Price */}
              <Text className="text-xs font-semibold text-[#785928] mt-1">
                {product.price}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
