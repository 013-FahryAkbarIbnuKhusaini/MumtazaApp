import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

// ---------------------------------------------------------------------------
// ANIMATED PRESSABLE — subtle scale + opacity micro-interaction
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// CONSTANTS — swappable for real data later
// ---------------------------------------------------------------------------
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
// HELPER — Indonesian date formatting (Hermes-safe, no Intl dependency)
// ---------------------------------------------------------------------------
const BULAN_SINGKAT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des',
];

function formatTanggalWIB(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mmm = BULAN_SINGKAT[now.getMonth()];
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  return `${dd} ${mmm} ${yyyy}, ${hh}:${mi} WIB`;
}

// ---------------------------------------------------------------------------
// SCREEN DIMENSIONS for chart width
// ---------------------------------------------------------------------------
const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_PARENT_PX = 48; // px-6 = 24px each side
const Y_AXIS_WIDTH = 44; // width reserved for Y-axis labels

// ---------------------------------------------------------------------------
// LIGHTWEIGHT SVG CHART
// ---------------------------------------------------------------------------
const CHART_HEIGHT = 180;
const CHART_WIDTH = SCREEN_WIDTH - CHART_PARENT_PX - Y_AXIS_WIDTH;
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

/**
 * Formats a number into a compact label for Y-axis (e.g. 1185000 → "1.19M").
 */
function formatYLabel(val: number): string {
  return (val / 1_000_000).toFixed(2) + 'M';
}

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------
export default function GoldPriceScreen() {
  const router = useRouter();
  const [activeRange, setActiveRange] = useState('1B');
  const [gramAmount, setGramAmount] = useState('10');

  const chartData = RANGE_DATA[activeRange] ?? DATA_1B;

  // Build SVG paths from chart data (memoised for perf)
  const { linePath, areaPath } = useMemo(
    () =>
      buildSmoothPath(chartData, CHART_WIDTH, DRAWABLE_HEIGHT, CHART_PADDING_TOP),
    [chartData],
  );

  // Compute Y-axis labels from the active chart data's actual range
  const yAxisLabels = useMemo(() => {
    const values = chartData.map((d) => d.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const floor = minVal * 0.98;
    const ceiling = maxVal * 1.02;
    // 4 labels evenly spaced from ceiling (top) to floor (bottom)
    return [
      formatYLabel(ceiling),
      formatYLabel(floor + (ceiling - floor) * (2 / 3)),
      formatYLabel(floor + (ceiling - floor) * (1 / 3)),
      formatYLabel(floor),
    ];
  }, [chartData]);

  // Dynamic date
  const currentDateTime = formatTanggalWIB();

  // Calculate estimated price
  const parsedGram = parseFloat(gramAmount) || 0;
  const estimatedPrice = parsedGram * PRICE_PER_GRAM;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* ------------------------------------------------------------------ */}
      {/* HEADER — sits outside KeyboardAvoidingView so it never shifts      */}
      {/* ------------------------------------------------------------------ */}
      <Animated.View entering={FadeInDown.duration(400).delay(0)}>
        <View className="h-14 flex-row items-center justify-center px-4">
          <Text className="font-serif text-4xl tracking-[0.2em] text-[#211D18]">
            MUMTAZA
          </Text>
          <ScaleButton
            onPress={() => router.push('/notifications')}
            className="absolute right-4"
          >
            <Feather name="bell" size={20} color="#211D18" />
          </ScaleButton>
        </View>
      </Animated.View>

      {/* ------------------------------------------------------------------ */}
      {/* KEYBOARD-AVOIDING SCROLLABLE BODY                                  */}
      {/* ------------------------------------------------------------------ */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 250 }}
        >
          <View className="px-6 pt-4 pb-8">
            {/* -------------------------------------------------------------- */}
            {/* SECTION 1: CURRENT PRICE HEADER                                */}
            {/* -------------------------------------------------------------- */}
            <Animated.View entering={FadeInDown.duration(500).delay(100)}>
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

              <Text className="text-stone-400 text-xs mt-1">
                Terakhir diperbarui: {currentDateTime}
              </Text>
            </Animated.View>

            {/* -------------------------------------------------------------- */}
            {/* SECTION 2: BUY / SELL PRICE CARDS                              */}
            {/* -------------------------------------------------------------- */}
            <Animated.View entering={FadeInDown.duration(500).delay(200)}>
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
            </Animated.View>

            {/* -------------------------------------------------------------- */}
            {/* SECTION 3: PERGERAKAN NILAI EMAS — SVG CHART                   */}
            {/* -------------------------------------------------------------- */}
            <Animated.View entering={FadeInDown.duration(500).delay(350)}>
              <View className="flex-row items-center justify-between mt-8 mb-4">
                <Text className="text-lg font-bold text-slate-800">
                  Pergerakan Nilai Emas
                </Text>
                <View className="flex-row gap-2">
                  {RANGE_PILLS.map((pill) => {
                    const isActive = activeRange === pill.key;
                    return (
                      <ScaleButton
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
                      </ScaleButton>
                    );
                  })}
                </View>
              </View>

              {/* Chart with Y-axis */}
              <View className="mt-2">
                <View className="flex-row">
                  {/* Y-axis labels */}
                  <View className="justify-between py-2" style={{ width: Y_AXIS_WIDTH, height: CHART_HEIGHT }}>
                    {yAxisLabels.map((label, idx) => (
                      <Text key={idx} className="text-[10px] text-stone-400">
                        {label}
                      </Text>
                    ))}
                  </View>

                  {/* SVG Chart */}
                  <View className="flex-1">
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
                  </View>
                </View>

                {/* X-axis labels */}
                <View className="flex-row justify-between mt-2" style={{ marginLeft: Y_AXIS_WIDTH }}>
                  {chartData.map((point, idx) => (
                    <Text key={idx} className="text-stone-400 text-xs">
                      {point.label}
                    </Text>
                  ))}
                </View>
              </View>
            </Animated.View>

            {/* -------------------------------------------------------------- */}
            {/* SECTION 4: KALKULATOR INVESTASI                                */}
            {/* -------------------------------------------------------------- */}
            <Animated.View entering={FadeInDown.duration(500).delay(500)}>
              <Text className="text-lg font-bold text-slate-800 mt-8 mb-4">
                Kalkulator Investasi
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
                    Total Estimasi
                  </Text>
                  <Text className="text-xl font-bold text-[#785928]">
                    {formatRupiah(estimatedPrice)}
                  </Text>
                </View>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
