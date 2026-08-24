import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

// -----------------------------------------------------------------------------
// 1. MOCK DATA
// -----------------------------------------------------------------------------
interface HistoryItem {
  id: string;
  title: string;
  date: string;
  points: number;
  type: 'earned' | 'redeemed';
}

const HISTORY_ITEMS: HistoryItem[] = [
  {
    id: '1',
    title: 'Purchase — Diamond Necklace',
    date: '18 Aug 2026 • 14:32',
    points: 1200,
    type: 'earned',
  },
  {
    id: '2',
    title: 'Voucher Redempt. — Rp 500k OFF',
    date: '15 Aug 2026 • 09:15',
    points: -1000,
    type: 'redeemed',
  },
  {
    id: '3',
    title: 'Gold Atelier Privilege Fee',
    date: '10 Aug 2026 • 18:00',
    points: -500,
    type: 'redeemed',
  },
  {
    id: '4',
    title: 'Referral Reward — Jane Doe',
    date: '05 Aug 2026 • 11:24',
    points: 350,
    type: 'earned',
  },
  {
    id: '5',
    title: 'Purchase — Gold Bangle',
    date: '01 Aug 2026 • 16:45',
    points: 800,
    type: 'earned',
  },
];

interface FilterCategory {
  key: string;
  label: string;
}

const FILTERS: FilterCategory[] = [
  { key: 'all', label: 'All' },
  { key: 'earned', label: 'Earned' },
  { key: 'redeemed', label: 'Redeemed' },
];

// -----------------------------------------------------------------------------
// 2. ANIMATED HISTORY ROW (staggered fade + slide entrance)
// -----------------------------------------------------------------------------
function AnimatedHistoryRow({
  item,
  index,
  isLast,
}: {
  item: HistoryItem;
  index: number;
  isLast: boolean;
}) {
  const translateY = useRef(new Animated.Value(16)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 70,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 70,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isPositive = item.points > 0;
  const formattedPoints = isPositive
    ? `+${item.points.toLocaleString('en-US')}`
    : `${item.points.toLocaleString('en-US')}`;

  return (
    <Animated.View
      style={{ opacity, transform: [{ translateY }] }}
      className={`flex-row items-center py-4 ${!isLast ? 'border-b border-stone-100' : ''}`}
    >
      {/* Left Icon */}
      <View className="w-10 h-10 rounded-full bg-stone-100 items-center justify-center">
        <Feather
          name={isPositive ? 'plus' : 'minus'}
          size={16}
          color="#785928"
        />
      </View>

      {/* Text Content */}
      <View className="flex-1 ml-3">
        <Text className="text-sm font-semibold text-slate-800">
          {item.title}
        </Text>
        <Text className="text-xs text-stone-400 mt-0.5">
          {item.date}
        </Text>
      </View>

      {/* Right Side: Points + Chevron */}
      <Text className="text-sm font-bold text-slate-800">
        {formattedPoints}
      </Text>
      <Feather
        name="chevron-right"
        size={16}
        color="#d6d3d1"
        style={{ marginLeft: 8 }}
      />
    </Animated.View>
  );
}

// -----------------------------------------------------------------------------
// 3. MAIN SCREEN
// -----------------------------------------------------------------------------
export default function HistoryScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredItems =
    activeFilter === 'all'
      ? HISTORY_ITEMS
      : HISTORY_ITEMS.filter((item) => item.type === activeFilter);

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
            MUMTAZA Coins
          </Text>
        </View>

        <Feather name="bell" size={20} color="#1c1c1c" />
      </View>

      {/* ------------------------------------------------------------------- */}
      {/* FILTER PILLS — wrapped in a plain View to prevent vertical stretch */}
      {/* ------------------------------------------------------------------- */}
      <View className="bg-white">
        <View className="flex-row gap-3 px-6 mt-4">
          {FILTERS.map((cat) => {
            const isActive = activeFilter === cat.key;
            return (
              <Pressable
                key={cat.key}
                onPress={() => setActiveFilter(cat.key)}
                className={`self-start px-4 py-1.5 rounded-full border ${
                  isActive
                    ? 'bg-[#785928] border-[#785928]'
                    : 'bg-white border-stone-200'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    isActive ? 'text-white' : 'text-stone-500'
                  }`}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ------------------------------------------------------------------- */}
      {/* HISTORY LIST */}
      {/* ------------------------------------------------------------------- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {/* Section Title */}
        <Text className="text-[10px] font-bold text-stone-400 tracking-widest px-6 mt-6 mb-2">
          AUGUST 2026
        </Text>

        {/* List Items */}
        <View className="px-6 pb-8">
          {filteredItems.map((item, index) => (
            <AnimatedHistoryRow
              key={item.id}
              item={item}
              index={index}
              isLast={index === filteredItems.length - 1}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
