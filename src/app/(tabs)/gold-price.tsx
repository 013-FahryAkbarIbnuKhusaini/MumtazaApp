import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

// ---------------------------------------------------------------------------
// CONSTANTS — swappable for real data later
// ---------------------------------------------------------------------------
const LAST_UPDATED = 'Terakhir diperbarui: 26 Ags 2026, 10:00 WIB';
const PRICE_PER_GRAM = 1185000;
const SELL_PRICE = 1120000;

// ---------------------------------------------------------------------------
// MOCK CHART DATA — one array per range
// ---------------------------------------------------------------------------
// 1M (1 Minggu) — 5 points over last week
const DATA_1M = [
  { value: 1160000, label: '20 Ags' },
  { value: 1165000, label: '21 Ags' },
  { value: 1170000, label: '23 Ags' },
  { value: 1178000, label: '25 Ags' },
  { value: 1185000, label: '26 Ags' },
];

// 1B (1 Bulan) — 6 points over last month
const DATA_1B = [
  { value: 1135000, label: '28 Jul' },
  { value: 1142000, label: '02 Ags' },
  { value: 1155000, label: '08 Ags' },
  { value: 1160000, label: '14 Ags' },
  { value: 1172000, label: '20 Ags' },
  { value: 1185000, label: '26 Ags' },
];

// 1T (1 Tahun) — 7 points over last year
const DATA_1T = [
  { value: 980000, label: 'Sep 25' },
  { value: 1010000, label: 'Nov 25' },
  { value: 1045000, label: 'Jan 26' },
  { value: 1080000, label: 'Mar 26' },
  { value: 1120000, label: 'Mei 26' },
  { value: 1155000, label: 'Jul 26' },
  { value: 1185000, label: 'Ags 26' },
];

const RANGE_DATA: Record<string, typeof DATA_1B> = {
  '1M': DATA_1M,
  '1B': DATA_1B,
  '1T': DATA_1T,
};

const RANGE_PILLS: { key: string; label: string }[] = [
  { key: '1M', label: '1M' },
  { key: '1B', label: '1B' },
  { key: '1T', label: '1T' },
];

// ---------------------------------------------------------------------------
// HELPER — Indonesian thousand-separator formatting
// ---------------------------------------------------------------------------
function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ---------------------------------------------------------------------------
// SCREEN DIMENSIONS for chart width
// ---------------------------------------------------------------------------
const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_PARENT_PX = 48; // px-6 = 24px each side

// ---------------------------------------------------------------------------
// LIGHTWEIGHT SVG CHART
// ---------------------------------------------------------------------------
const CHART_HEIGHT = 180;
const CHART_WIDTH = SCREEN_WIDTH - CHART_PARENT_PX;
const CHART_PADDING_TOP = 16;
const CHART_PADDING_BOTTOM = 8;
const DRAWABLE_HEIGHT = CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;

/**
 * Builds a smooth cubic-bezier SVG path from data points.
 * Returns { linePath, areaPath } strings.
 */
function buildSmoothPath(
  data: { value: number }[],
  width: number,
  drawableHeight: number,
  paddingTop: number,
): { linePath: string; areaPath: string } {
  if (data.length < 2) return { linePath: '', areaPath: '' };

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  // Add 2% headroom above max
  const rangeVal = maxVal * 1.02 - minVal * 0.98;
  const floorVal = minVal * 0.98;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y =
      paddingTop +
      drawableHeight -
      ((d.value - floorVal) / rangeVal) * drawableHeight;
    return { x, y };
  });

  // Build smooth cubic bezier through points
  let linePath = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];

    // Catmull-Rom to cubic bezier control points (tension = 0.3)
    const tension = 0.3;
    const cp1x = p1.x + ((p2.x - p0.x) * tension);
    const cp1y = p1.y + ((p2.y - p0.y) * tension);
    const cp2x = p2.x - ((p3.x - p1.x) * tension);
    const cp2y = p2.y - ((p3.y - p1.y) * tension);

    linePath += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }

  // Area path: close off at the bottom
  const bottomY = paddingTop + drawableHeight;
  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x},${bottomY}` +
    ` L ${points[0].x},${bottomY} Z`;

  return { linePath, areaPath };
}

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------
export default function GoldPriceScreen() {
  const [activeRange, setActiveRange] = useState('1B');
  const [gramAmount, setGramAmount] = useState('10');

  const chartData = RANGE_DATA[activeRange] ?? DATA_1B;

  // Build SVG paths from chart data (memoised for perf)
  const { linePath, areaPath } = useMemo(
    () =>
      buildSmoothPath(chartData, CHART_WIDTH, DRAWABLE_HEIGHT, CHART_PADDING_TOP),
    [chartData],
  );

  // Calculate estimated price
  const parsedGram = parseFloat(gramAmount) || 0;
  const estimatedPrice = parsedGram * PRICE_PER_GRAM;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-4 pb-8">
          {/* ---------------------------------------------------------------- */}
          {/* SECTION 1: CURRENT PRICE HEADER                                  */}
          {/* ---------------------------------------------------------------- */}
          <Text className="text-stone-500 text-sm">
            Harga Emas Hari Ini (24K)
          </Text>

          <View className="flex-row items-baseline gap-1 mt-1">
            <Text className="text-4xl font-bold text-[#4A3B28]">
              {formatRupiah(PRICE_PER_GRAM)}
            </Text>
            <Text className="text-[#785928] text-sm">/ gram</Text>
          </View>

          <View className="bg-green-100 rounded-full px-2 py-0.5 self-start mt-2">
            <Text className="text-green-700 text-xs">+1,2%</Text>
          </View>

          <Text className="text-stone-400 text-xs mt-1">{LAST_UPDATED}</Text>

          {/* ---------------------------------------------------------------- */}
          {/* SECTION 2: BUY / SELL PRICE CARDS                                */}
          {/* ---------------------------------------------------------------- */}
          <View className="flex-row gap-4 mt-6">
            {/* Card 1 — Harga Beli */}
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
              <View className="w-9 h-9 rounded-full bg-stone-100 items-center justify-center mb-3">
                <Feather name="shopping-bag" size={16} color="#57534e" />
              </View>
              <Text className="text-stone-500 text-xs">Harga Beli</Text>
              <Text className="text-base font-bold text-slate-800 mt-1">
                {formatRupiah(PRICE_PER_GRAM)}
              </Text>
            </View>

            {/* Card 2 — Harga Jual (Buyback) */}
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
              <View className="w-9 h-9 rounded-full bg-stone-100 items-center justify-center mb-3">
                <Feather name="tag" size={16} color="#57534e" />
              </View>
              <Text className="text-stone-500 text-xs">
                Harga Jual (Buyback)
              </Text>
              <Text className="text-base font-bold text-slate-800 mt-1">
                {formatRupiah(SELL_PRICE)}
              </Text>
            </View>
          </View>

          {/* ---------------------------------------------------------------- */}
          {/* SECTION 3: TREN HARGA — SVG CHART                                */}
          {/* ---------------------------------------------------------------- */}
          <View className="flex-row items-center justify-between mt-8 mb-4">
            <Text className="text-lg font-bold text-slate-800">
              Tren Harga
            </Text>
            <View className="flex-row gap-2">
              {RANGE_PILLS.map((pill) => {
                const isActive = activeRange === pill.key;
                return (
                  <Pressable
                    key={pill.key}
                    onPress={() => setActiveRange(pill.key)}
                    className={
                      isActive
                        ? 'bg-[#785928] rounded-full px-3 py-1'
                        : 'bg-stone-100 rounded-full px-3 py-1'
                    }
                  >
                    <Text
                      className={
                        isActive
                          ? 'text-white text-xs'
                          : 'text-stone-500 text-xs'
                      }
                    >
                      {pill.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* SVG Chart */}
          <View className="mt-2">
            <Svg
              width={CHART_WIDTH}
              height={CHART_HEIGHT}
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            >
              <Defs>
                <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#C9A961" stopOpacity={0.25} />
                  <Stop offset="100%" stopColor="#785928" stopOpacity={0} />
                </LinearGradient>
              </Defs>

              {/* Gradient fill area */}
              <Path d={areaPath} fill="url(#areaGrad)" />

              {/* Gold line */}
              <Path
                d={linePath}
                stroke="#785928"
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>

            {/* X-axis labels */}
            <View className="flex-row justify-between mt-2">
              {chartData.map((point, idx) => (
                <Text key={idx} className="text-stone-400 text-xs">
                  {point.label}
                </Text>
              ))}
            </View>
          </View>

          {/* ---------------------------------------------------------------- */}
          {/* SECTION 4: KALKULATOR ESTIMASI                                   */}
          {/* ---------------------------------------------------------------- */}
          <Text className="text-lg font-bold text-slate-800 mt-8 mb-4">
            Kalkulator Estimasi
          </Text>

          <View className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
            {/* Input Row */}
            <View className="flex-row items-center justify-between border border-stone-200 rounded-xl px-4 py-3">
              <TextInput
                className="text-base font-semibold text-slate-800 flex-1"
                keyboardType="numeric"
                value={gramAmount}
                onChangeText={setGramAmount}
                placeholder="0"
                placeholderTextColor="#a8a29e"
              />
              <Text className="text-stone-400 text-sm">Gram</Text>
            </View>

            {/* Result Row */}
            <View className="mt-4">
              <Text className="text-stone-500 text-sm mb-1">
                Estimasi Harga Beli
              </Text>
              <Text className="text-xl font-bold text-[#785928]">
                {formatRupiah(estimatedPrice)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
