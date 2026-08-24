import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

// =============================================================================
// STATIC DATA (not driven by route params)
// =============================================================================
const VOUCHER_CODE = 'CODE: #MTZ-0500K';
const VALIDITY_DATE = 'Valid until 30 Sept 2026';

// TODO: Replace with a real balance source (e.g. a Zustand coinStore or context).
// No shared coin/balance state exists in the codebase yet — points.tsx uses a local
// useState(0) that is not exported. This placeholder should be replaced once a shared
// balance store is created.
const USER_BALANCE_PLACEHOLDER = 0;

const TERMS = [
  '• Voucher code can only be used once per custom checkout invoice.',
  '• Applicable only for 18K / 24K solid gold and bespoke collection orders.',
  '• Cannot be combined with other current active brand discount promotions.',
];

// =============================================================================
// HELPERS
// =============================================================================
/** Safely coerce an expo-router param (string | string[] | undefined) to a string. */
const getParam = (val: string | string[] | undefined, fallback: string): string =>
  Array.isArray(val) ? val[0] : (val ?? fallback);

// =============================================================================
// MAIN SCREEN
// =============================================================================
export default function VoucherDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // --- Dynamic route params (with safe fallbacks) ---
  const rawTitle = getParam(params.title, 'Rp 500,000 Off');
  const displayTitle = /^up to/i.test(rawTitle)
    ? rawTitle.toUpperCase()
    : `UP TO ${rawTitle.toUpperCase()}`;
  const coins = getParam(params.coins, '1,000');
  const description = getParam(
    params.desc,
    'Applicable for all gold jewelry & digital purchases',
  );

  // TODO: Replace with real balance source when available
  const userBalance = USER_BALANCE_PLACEHOLDER;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* ------------------------------------------------------------------- */}
      {/* 1. HEADER                                                           */}
      {/* ------------------------------------------------------------------- */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="chevron-left" size={22} color="#1c1c1c" />
        </Pressable>

        <View className="flex-1 items-center">
          <Text className="text-base font-bold">Voucher Details</Text>
        </View>

        <Feather name="bell" size={20} color="#1c1c1c" />
      </View>

      {/* ------------------------------------------------------------------- */}
      {/* 2. MAIN SCROLLVIEW                                                  */}
      {/* ------------------------------------------------------------------- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6 pt-4"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ----------------------------------------------------------------- */}
        {/* 3. TICKET CARD                                                    */}
        {/* ----------------------------------------------------------------- */}
        <View className="bg-[#FDFBF7] rounded-2xl p-6 mb-6">
          {/* Icon circle */}
          <View className="w-12 h-12 rounded-full bg-[#F3EFEA] mx-auto items-center justify-center">
            <Feather name="percent" size={20} color="#785928" />
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-[#4A3B28] text-center mt-4">
            {displayTitle}
          </Text>

          {/* Description */}
          <Text className="text-sm text-stone-500 text-center mt-2 px-4">
            {description}
          </Text>

          {/* Dashed separator */}
          <View
            className="my-5 border-t border-[#785928]/20"
            style={{ borderStyle: 'dashed' }}
          />

          {/* Code */}
          <Text className="text-sm font-medium text-stone-500 text-center">
            {VOUCHER_CODE}
          </Text>
        </View>

        {/* ----------------------------------------------------------------- */}
        {/* 4. COST & BALANCE ROW                                             */}
        {/* ----------------------------------------------------------------- */}
        <View className="flex-row justify-between items-center mb-4">
          {/* Left stack */}
          <View>
            <Text className="text-[10px] font-bold tracking-widest text-stone-400 uppercase mb-1">
              REDEMPTION COST
            </Text>
            <View className="flex-row items-center gap-1.5">
              <Feather name="disc" size={16} color="#785928" />
              <Text className="text-lg font-bold text-[#4A3B28]">
                {coins} Coins
              </Text>
            </View>
          </View>

          {/* Right */}
          <Text className="text-xs text-stone-500">
            Your balance: {userBalance.toLocaleString('en-US')} Coins
          </Text>
        </View>

        {/* ----------------------------------------------------------------- */}
        {/* 5. VALIDITY ROW                                                   */}
        {/* ----------------------------------------------------------------- */}
        <View className="flex-row items-center py-4 border-y border-stone-100 mb-6">
          <Feather
            name="calendar"
            size={16}
            color="#a8a29e"
            className="mr-3"
          />
          <Text className="text-sm text-stone-600 ml-3">{VALIDITY_DATE}</Text>
        </View>

        {/* ----------------------------------------------------------------- */}
        {/* 6. TERMS & CONDITIONS BOX                                         */}
        {/* ----------------------------------------------------------------- */}
        <View className="border border-stone-200 rounded-xl p-5 mb-8">
          <Text className="text-sm font-bold text-slate-800 mb-3">
            Terms & Conditions
          </Text>

          {TERMS.map((term, index) => (
            <Text key={index} className="text-xs text-stone-500 mb-2">
              {term}
            </Text>
          ))}

          {/* Read More link (visual only — no navigation/modal logic yet) */}
          <Pressable>
            {/* TODO: Wire to a modal or expanded terms view */}
            <Text className="text-xs font-bold text-[#4A3B28] underline mt-1">
              Read More
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* ------------------------------------------------------------------- */}
      {/* 7. FIXED BOTTOM ACTION BAR                                          */}
      {/* ------------------------------------------------------------------- */}
      <View className="absolute bottom-0 left-0 right-0 px-6 pt-4 pb-10 bg-white border-t border-stone-100">
        <Pressable className="bg-[#785928] w-full py-4 rounded-full items-center">
          {/* TODO: Wire to actual redeem API call */}
          <Text className="text-white font-bold text-base">Redeem Now</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
