import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import ProductCard from '../../components/product/ProductCard';
import { Product, ProductApi } from '../../types';

const API_BASE_URL = 'https://emas.tokomumtaza.com';

// -----------------------------------------------------------------------------
// ANIMATED PRESSABLE — subtle scale + opacity micro-interaction
// -----------------------------------------------------------------------------
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ScaleButton({
  onPress,
  className: cn,
  children,
}: {
  onPress?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = useCallback(() => {
    'worklet';
    scale.value = withTiming(0.96, { duration: 120 });
    opacity.value = withTiming(0.85, { duration: 120 });
  }, [scale, opacity]);

  const handlePressOut = useCallback(() => {
    'worklet';
    scale.value = withTiming(1, { duration: 180 });
    opacity.value = withTiming(1, { duration: 180 });
  }, [scale, opacity]);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={cn}
      style={animatedStyle}
    >
      {children}
    </AnimatedPressable>
  );
}

// -----------------------------------------------------------------------------
// CART SCREEN — EMPTY STATE
// -----------------------------------------------------------------------------
export default function CartScreen() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoadingRecs(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/mutasi?page=1&limit=20`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const apiProducts: ProductApi[] = data?.data?.data || [];

        const mappedProducts: Product[] = apiProducts.map((p) => ({
          id: p.id ? p.id.toString() : Math.random().toString(),
          name: p.name || 'Nama produk tidak tersedia',
          code: p.code || '',
          category: p.name ? (p.name.charAt(0).toUpperCase() + p.name.slice(1).toLowerCase()) : 'Lainnya',
          image: p.image || '',
          karat: p.karat || '',
          berat: p.berat || '',
          status: p.status || '',
          isBestSeller: p.type_id === 1 || p.type_id === 2,
          isNew: p.status === 'ADA',
        }));

        const filteredData = mappedProducts.filter(
          (item) => item.image && item.image.trim() !== ''
        );
        const topFour = filteredData.slice(0, 4);
        setRecommendations(topFour);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        setRecommendations([]);
      } finally {
        setIsLoadingRecs(false);
      }
    };

    fetchRecommendations();
  }, []);

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
          <Animated.View entering={FadeInDown.duration(500).delay(0)}>
            <View className="w-32 h-32 rounded-full bg-stone-50 justify-center items-center mb-6">
              <Feather name="shopping-bag" size={40} color="#785928" />
            </View>
          </Animated.View>

          {/* Title */}
          <Animated.View entering={FadeInDown.duration(500).delay(100)}>
            <Text className="text-2xl font-bold text-slate-800 mb-3">
              Keranjang Anda Kosong
            </Text>
          </Animated.View>

          {/* Subtitle */}
          <Animated.View entering={FadeInDown.duration(500).delay(200)}>
            <Text className="text-sm text-stone-500 text-center px-6 leading-relaxed mb-8">
              Temukan perhiasan abadi dan tambahkan favorit Anda untuk memulai
              pengalaman belanja yang mewah.
            </Text>
          </Animated.View>

          {/* Primary Button — Jelajahi Koleksi */}
          <Animated.View
            entering={FadeInDown.duration(500).delay(300)}
            className="w-[80%]"
          >
            <ScaleButton
              onPress={() => router.push('/(tabs)')}
              className="w-full bg-[#785928] py-4 rounded-full flex-row justify-center items-center gap-2 shadow-sm"
            >
              <Text className="text-white font-semibold">Jelajahi Koleksi</Text>
              <Feather name="arrow-right" size={18} color="#FFFFFF" />
            </ScaleButton>
          </Animated.View>
        </View>

        {/* ----------------------------------------------------------------- */}
        {/* 2. DIVIDER                                                        */}
        {/* ----------------------------------------------------------------- */}
        <Animated.View entering={FadeInDown.duration(500).delay(500)}>
          <View className="h-[1px] bg-stone-200 w-full my-8" />
        </Animated.View>

        {/* ----------------------------------------------------------------- */}
        {/* 3. RECOMMENDATION SECTION — "Mungkin Anda Suka"                   */}
        {/* ----------------------------------------------------------------- */}
        {isLoadingRecs ? (
          <ActivityIndicator size="small" color="#785928" className="my-8" />
        ) : recommendations.length > 0 ? (
          <>
            <Animated.View entering={FadeInDown.duration(500).delay(600)}>
              <Text className="text-xl font-bold text-slate-800 mb-6 px-4">
                Mungkin Anda Suka
              </Text>
            </Animated.View>

            <View className="flex-row flex-wrap justify-between px-4">
              {recommendations.map((product, index) => (
                <Animated.View
                  key={product.id}
                  entering={FadeInDown.duration(500).delay(700 + index * 120)}
                  className="w-[48%]"
                >
                  <ProductCard product={product} />
                </Animated.View>
              ))}
            </View>

            {/* "Lihat Koleksi Lengkap ➔" Button */}
            <Pressable
              onPress={() => router.push('/(tabs)')}
              className="mt-6 mb-8"
            >
              <Text className="text-sm font-bold text-[#785928] text-center">
                Lihat Koleksi Lengkap ➔
              </Text>
            </Pressable>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
