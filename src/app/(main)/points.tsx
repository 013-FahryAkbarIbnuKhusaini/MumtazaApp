import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Animated, Easing, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

// -----------------------------------------------------------------------------
// 1. MEMBERSHIP TIER SCHEMA & HELPER
// -----------------------------------------------------------------------------
interface TierInfo {
  name: string;
  minPoints: number;
  maxPoints: number | null;
}

interface TierCardStyle {
  gradientColors: string[] | null;
  solidBg: string;
  textColor: string;
  subtextColor: string;
  iconColor: string;
  borderColor: string;
  dividerColor: string;
}

const TIER_SCHEMA: TierInfo[] = [
  { name: 'Silver', minPoints: 0, maxPoints: 999 },
  { name: 'Gold', minPoints: 1000, maxPoints: 4999 },
  { name: 'Platinum', minPoints: 5000, maxPoints: 9999 },
  { name: 'Signature', minPoints: 10000, maxPoints: null },
];

function getCardStyle(rawTierName?: string | null): TierCardStyle {
  const normalized = (rawTierName || '').toLowerCase().trim();

  if (normalized.includes('gold')) {
    return {
      gradientColors: ['#FEF08A', '#FBBF24', '#D97706'],
      solidBg: '#FBBF24',
      textColor: '#0F172A',
      subtextColor: '#78350F',
      iconColor: '#0F172A',
      borderColor: '#F59E0B',
      dividerColor: 'rgba(120, 53, 15, 0.25)',
    };
  }

  if (normalized.includes('platinum')) {
    return {
      gradientColors: ['#BAE6FD', '#60A5FA', '#4F46E5'],
      solidBg: '#1E40AF',
      textColor: '#FFFFFF',
      subtextColor: '#93C5FD',
      iconColor: '#FFFFFF',
      borderColor: '#3B82F6',
      dividerColor: 'rgba(255, 255, 255, 0.25)',
    };
  }

  if (normalized.includes('signature')) {
    return {
      gradientColors: ['#0F172A', '#172554', '#000000'],
      solidBg: '#0F172A',
      textColor: '#FBBF24',
      subtextColor: '#FCD34D',
      iconColor: '#FBBF24',
      borderColor: '#334155',
      dividerColor: 'rgba(251, 191, 36, 0.25)',
    };
  }

  // Silver / Default
  return {
    gradientColors: ['#E2E8F0', '#CBD5E1', '#94A3B8'],
    solidBg: '#E2E8F0',
    textColor: '#0F172A',
    subtextColor: '#475569',
    iconColor: '#0F172A',
    borderColor: '#CBD5E1',
    dividerColor: 'rgba(71, 85, 105, 0.25)',
  };
}

function getTierDetails(points: number) {
  const currentTier =
    TIER_SCHEMA.find(
      (tier) =>
        points >= tier.minPoints &&
        (tier.maxPoints === null || points <= tier.maxPoints)
    ) || TIER_SCHEMA[0];

  const currentTierIndex = TIER_SCHEMA.findIndex(
    (t) => t.name === currentTier.name
  );
  const nextTier = TIER_SCHEMA[currentTierIndex + 1] || null;

  let progressRatio = 1;
  let progressText = 'Maximum Tier Achieved';

  if (nextTier) {
    const pointsNeeded = nextTier.minPoints - points;
    progressText = `${pointsNeeded.toLocaleString('en-US')} pts to ${nextTier.name}`;
    const range = nextTier.minPoints - currentTier.minPoints;
    const currentProgress = points - currentTier.minPoints;
    progressRatio = Math.min(Math.max(currentProgress / range, 0), 1);
  }

  return {
    tierName: `${currentTier.name} Tier Member`,
    rawTierName: currentTier.name,
    progressText,
    progressRatio,
    nextTierName: nextTier ? nextTier.name : null,
  };
}

// -----------------------------------------------------------------------------
// 2. MAIN COMPONENT
// -----------------------------------------------------------------------------
export default function PointsScreen() {
  const router = useRouter();

  // Mock state per specification
  const [availableCoins] = useState<number>(0);

  const spinValue = useRef(new Animated.Value(0)).current;

  const handleRefresh = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const tierDetails = getTierDetails(availableCoins);
  const cardStyle = getCardStyle(tierDetails.rawTierName);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* ------------------------------------------------------------------- */}
      {/* 1. TOP HEADER */}
      {/* ------------------------------------------------------------------- */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white">
        <Pressable
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="w-9 h-9 rounded-full bg-stone-100 items-center justify-center"
        >
          <Feather name="arrow-left" size={18} color="#1c1c1c" />
        </Pressable>

        <View className="flex-1 items-center">
          <Text className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
            MUMTAZA PRIVILEGE
          </Text>
          <Text className="text-black text-base font-semibold">
            Rewards & Points
          </Text>
        </View>

        <View className="w-9 h-9" />
      </View>

      <View className="border-b border-stone-100" />

      {/* ------------------------------------------------------------------- */}
      {/* 3. PAGE BACKGROUND & SCROLL CONTAINER */}
      {/* ------------------------------------------------------------------- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-stone-50"
      >
        <View className="px-6 pb-8">
          {/* ------------------------------------------------------------------- */}
          {/* 2. THE VIP HERO CARD — DYNAMIC TIER AESTHETIC */}
          {/* ------------------------------------------------------------------- */}
          <View
            className="relative overflow-hidden rounded-2xl border shadow-md mt-4 p-5"
            style={{ backgroundColor: cardStyle.solidBg, borderColor: cardStyle.borderColor }}
          >
            {/* Glare Texture (absolute, behind content) */}
            <View className="absolute -rotate-45 -left-4 top-0 h-full w-16 bg-white/20" />

            {/* Content Container */}
            <View>
              {/* Row 1 */}
              <View className="flex-row items-start justify-between">
                <Text
                  className="text-[10px] uppercase tracking-widest font-bold"
                  style={{ color: cardStyle.subtextColor }}
                >
                  MUMTAZA REWARDS
                </Text>
                <TouchableOpacity onPress={handleRefresh} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Feather name="refresh-cw" size={18} color={cardStyle.iconColor} />
                  </Animated.View>
                </TouchableOpacity>
              </View>

              {/* Row 2 */}
              <View className="mt-3">
                <Text
                  className="text-5xl font-light"
                  style={{ color: cardStyle.textColor }}
                >
                  {availableCoins.toLocaleString('en-US')}
                </Text>
                <Text
                  className="text-[10px] uppercase tracking-widest font-bold mt-1"
                  style={{ color: cardStyle.subtextColor }}
                >
                  AVAILABLE COINS
                </Text>
              </View>

              {/* Divider */}
              <View
                className="mt-4 pt-3 border-t"
                style={{ borderTopColor: cardStyle.dividerColor }}
              >
                {/* Row 3 */}
                <View className="flex-row items-center justify-between">
                  <Text
                    className="text-sm font-medium"
                    style={{ color: cardStyle.textColor }}
                  >
                    {tierDetails.tierName}
                  </Text>
                  <Text
                    className="text-sm"
                    style={{ color: cardStyle.subtextColor }}
                  >
                    {tierDetails.progressText}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ------------------------------------------------------------------- */}
          {/* 4. LIST SECTIONS */}
          {/* ------------------------------------------------------------------- */}

          {/* REWARDS & HISTORY SECTION */}
          <View className="mt-8">
            <Text className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
              REWARDS & HISTORY
            </Text>

            <View className="bg-white rounded-2xl border border-stone-100 shadow-sm shadow-stone-200 overflow-hidden">
              <Pressable onPress={() => router.push('/(main)/vouchers' as any)} className="flex-row items-center px-4 py-4 gap-3 border-b border-stone-100">
                <View className="w-10 h-10 rounded-full bg-stone-100 items-center justify-center">
                  <Feather name="tag" size={18} color="#785928" />
                </View>
                <View className="flex-1">
                  <Text className="text-black text-[15px] font-medium">
                    Vouchers
                  </Text>
                  <Text className="text-stone-400 text-xs mt-0.5">
                    Redeem rewards & privileges
                  </Text>
                </View>
                <Feather name="chevron-right" size={18} color="#d6d3d1" />
              </Pressable>

              <Pressable onPress={() => router.push('/(main)/history' as any)} className="flex-row items-center px-4 py-4 gap-3">
                <View className="w-10 h-10 rounded-full bg-stone-100 items-center justify-center">
                  <Feather name="clock" size={18} color="#785928" />
                </View>
                <View className="flex-1">
                  <Text className="text-black text-[15px] font-medium">
                    Coin History
                  </Text>
                  <Text className="text-stone-400 text-xs mt-0.5">
                    View point transactions
                  </Text>
                </View>
                <Feather name="chevron-right" size={18} color="#d6d3d1" />
              </Pressable>
            </View>
          </View>

          {/* EXCLUSIVE OFFERS SECTION */}
          <View className="mt-8">
            <Text className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
              EXCLUSIVE OFFERS
            </Text>

            <View className="bg-stone-100 rounded-2xl flex-row items-center p-3 gap-3">
              <Image source={{ uri: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&auto=format&fit=crop&q=80' }} resizeMode="cover" className="w-12 h-12 rounded-lg bg-stone-200" />
              <View className="flex-1 ml-1">
                <Text className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                  EXCLUSIVE OFFERS
                </Text>
                <Text className="text-black text-[15px] font-medium mt-0.5">
                  Gold Atelier Privileges
                </Text>
              </View>
              <Feather name="arrow-right" size={18} color="#785928" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


