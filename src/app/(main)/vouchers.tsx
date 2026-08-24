import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

// -----------------------------------------------------------------------------
// 1. MOCK DATA
// -----------------------------------------------------------------------------
interface Voucher {
  id: string;
  title: string;
  description: string;
  coinCost: number;
  icon: 'percent';
  category: 'discounts' | 'free-shipping';
}

const VOUCHERS: Voucher[] = [
  {
    id: '1',
    title: 'Up To Rp 500,000 Off',
    description: 'Applicable for all Gold Rings & Signets',
    coinCost: 1000,
    icon: 'percent',
    category: 'discounts',
  },
  {
    id: '2',
    title: 'Free Shipping',
    description: 'No minimum spend, nationwide secure courier',
    coinCost: 200,
    icon: 'percent',
    category: 'free-shipping',
  },
  {
    id: '3',
    title: 'Up To Rp 1,000,000 Off',
    description: 'Exclusive for Premium Diamond Collection',
    coinCost: 1800,
    icon: 'percent',
    category: 'discounts',
  },
  {
    id: '4',
    title: 'Complimentary Polish',
    description: 'Annual professional restoration for 1 item',
    coinCost: 450,
    icon: 'percent',
    category: 'discounts',
  },
];

interface FilterCategory {
  key: string;
  label: string;
}

const FILTERS: FilterCategory[] = [
  { key: 'all', label: 'All' },
  { key: 'discounts', label: 'Discounts' },
  { key: 'free-shipping', label: 'Free Shipping' },
];

// -----------------------------------------------------------------------------
// 2. ANIMATED REDEEM BUTTON (spring scale on press)
// -----------------------------------------------------------------------------
function AnimatedRedeemButton({ onPress }: { onPress?: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View
        style={{ transform: [{ scale }] }}
        className="bg-[#785928] rounded-full px-5 py-2"
      >
        <Text className="text-white font-bold text-center">Redeem</Text>
      </Animated.View>
    </Pressable>
  );
}

// -----------------------------------------------------------------------------
// 3. ANIMATED VOUCHER CARD (staggered fade + slide entrance)
// -----------------------------------------------------------------------------
function AnimatedVoucherCard({
  voucher,
  index,
  onRedeem,
}: {
  voucher: Voucher;
  index: number;
  onRedeem?: () => void;
}) {
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{ opacity, transform: [{ translateY }] }}
      className="bg-stone-50 border border-stone-100 rounded-2xl p-4 mb-4"
    >
      {/* TOP HALF */}
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-full bg-white items-center justify-center">
          <Feather name="percent" size={16} color="#785928" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-black">
            {voucher.title}
          </Text>
          <Text className="text-xs text-stone-400 mt-0.5">
            {voucher.description}
          </Text>
        </View>
      </View>

      {/* DIVIDER */}
      <View className="border-t border-stone-200 my-4" />

      {/* BOTTOM HALF */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5">
          <Feather name="circle" size={14} color="#785928" />
          <Text className="text-[#785928] font-medium text-sm">
            {voucher.coinCost.toLocaleString('en-US')} Coins
          </Text>
        </View>
        <AnimatedRedeemButton onPress={onRedeem} />
      </View>
    </Animated.View>
  );
}

// -----------------------------------------------------------------------------
// 4. MAIN SCREEN
// -----------------------------------------------------------------------------
export default function VouchersScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredVouchers =
    activeFilter === 'all'
      ? VOUCHERS
      : VOUCHERS.filter((v) => v.category === activeFilter);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* ------------------------------------------------------------------- */}
      {/* HEADER */}
      {/* ------------------------------------------------------------------- */}
      <View className="flex-row items-center justify-between px-6 py-3 bg-white border-b border-stone-100">
        <Pressable
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="arrow-left" size={20} color="#1c1c1c" />
        </Pressable>

        <View className="flex-1 items-center">
          <Text className="text-base font-semibold text-black">
            Redeem Vouchers
          </Text>
        </View>

        <Feather name="bell" size={20} color="#1c1c1c" />
      </View>

      {/* ------------------------------------------------------------------- */}
      {/* FILTER PILLS */}
      {/* ------------------------------------------------------------------- */}
      <View className="bg-white">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6 py-4"
        >
          <View className="flex-row gap-2">
            {FILTERS.map((cat) => {
              const isActive = activeFilter === cat.key;
              return (
                <Pressable
                  key={cat.key}
                  onPress={() => setActiveFilter(cat.key)}
                  className={`px-5 py-2 rounded-full border self-start ${
                    isActive ? 'border-[#785928] bg-white' : 'border-stone-200 bg-white'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      isActive ? 'text-[#785928]' : 'text-stone-400'
                    }`}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* ------------------------------------------------------------------- */}
      {/* VOUCHER LIST */}
      {/* ------------------------------------------------------------------- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View className="px-6 pt-2 pb-8">
          {filteredVouchers.map((voucher, index) => (
            <AnimatedVoucherCard
              key={voucher.id}
              voucher={voucher}
              index={index}
              onRedeem={() =>
                router.push({
                  pathname: '/(main)/voucher-detail',
                  params: {
                    title: voucher.title,
                    coins: String(voucher.coinCost),
                    desc: voucher.description,
                  },
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
