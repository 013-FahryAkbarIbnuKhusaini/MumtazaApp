import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
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
  hitSlop,
}: {
  onPress?: () => void;
  className?: string;
  children: React.ReactNode;
  hitSlop?: number | { top?: number; bottom?: number; left?: number; right?: number };
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
      hitSlop={hitSlop}
    >
      {children}
    </AnimatedPressable>
  );
}

// ---------------------------------------------------------------------------
// FAQ DATA
// ---------------------------------------------------------------------------
interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: '1',
    question: 'Bagaimana cara memastikan keaslian emas?',
    answer:
      'Setiap produk emas di MUMTAZA dilengkapi sertifikat keaslian resmi dan telah melalui proses uji kadar oleh lembaga bersertifikat. Anda juga dapat memverifikasi kode unik sertifikat melalui halaman produk atau menghubungi tim kami untuk konfirmasi langsung.',
  },
  {
    id: '2',
    question: 'Apakah bisa cicil emas di MUMTAZA?',
    answer:
      'Saat ini MUMTAZA menyediakan opsi pembelian secara penuh. Kami sedang mempersiapkan program cicilan emas syariah yang akan hadir dalam waktu dekat. Pantau terus notifikasi kami untuk informasi peluncurannya.',
  },
  {
    id: '3',
    question: 'Berapa lama waktu pengiriman ke wilayah saya?',
    answer:
      'Pengiriman dalam Pulau Jawa umumnya memerlukan 2–3 hari kerja, sementara luar Pulau Jawa berkisar 4–7 hari kerja. Seluruh pengiriman menggunakan jasa ekspedisi berasuransi dengan nomor pelacakan yang dikirim melalui notifikasi aplikasi.',
  },
  {
    id: '4',
    question: 'Bagaimana cara melakukan buyback (jual kembali) emas saya?',
    answer:
      'Anda dapat mengajukan buyback langsung melalui menu "Harga Emas" di aplikasi atau menghubungi tim kami via WhatsApp. Proses verifikasi dan pencairan dana biasanya selesai dalam 1–2 hari kerja setelah barang diterima dan diverifikasi.',
  },
];

// ---------------------------------------------------------------------------
// WHATSAPP HANDLER
// ---------------------------------------------------------------------------
async function handleWhatsAppPress() {
  const url =
    'https://wa.me/6281214175087?text=Halo%20Dinar%20Emas%20MUMTAZA,%20saya%20butuh%20bantuan%20terkait%20layanan%20Anda.';
  try {
    await Linking.openURL(url);
  } catch (error) {
    console.warn('Failed to open WhatsApp:', error);
  }
}

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------
export default function HelpCenterScreen() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleFaq = useCallback(
    (id: string) => {
      setExpandedId((prev) => (prev === id ? null : id));
    },
    [],
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* ---------------------------------------------------------------- */}
      {/* BRAND HEADER                                                     */}
      {/* ---------------------------------------------------------------- */}
      <Animated.View entering={FadeInDown.duration(400).delay(0)}>
        <View className="flex-row items-center px-4 py-3 bg-white">
          {/* Back button */}
          <ScaleButton
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="arrow-left" size={22} color="#211D18" />
          </ScaleButton>

          {/* Centered brand wordmark — matches Home screen exactly */}
          <Text
            className="text-lg font-bold uppercase tracking-widest text-[#211D18] mx-auto"
            style={{
              fontFamily: Platform.select({
                ios: 'Georgia',
                android: 'serif',
                default: undefined,
              }),
            }}
          >
            MUMTAZA
          </Text>

          {/* Invisible right spacer to keep title optically centered */}
          <View style={{ width: 22 }} />
        </View>
      </Animated.View>

      {/* ---------------------------------------------------------------- */}
      {/* SCROLLABLE BODY                                                  */}
      {/* ---------------------------------------------------------------- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* -------------------------------------------------------------- */}
        {/* SEARCH BAR                                                     */}
        {/* -------------------------------------------------------------- */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <View className="bg-stone-50 rounded-xl px-4 py-3 mt-4 mx-4 flex-row items-center border border-stone-100">
            <Feather
              name="search"
              size={18}
              color="#a8a29e"
              style={{ marginRight: 8 }}
            />
            <TextInput
              className="flex-1 text-sm text-slate-800"
              placeholder="Cari pertanyaan Anda di sini..."
              placeholderTextColor="#a8a29e"
            />
          </View>
        </Animated.View>

        {/* -------------------------------------------------------------- */}
        {/* PAGE HEADER TEXT                                                */}
        {/* -------------------------------------------------------------- */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <Text
            className="text-2xl font-bold text-slate-800 px-4 mt-6"
            style={{
              fontFamily: Platform.select({
                ios: 'Georgia',
                android: 'serif',
                default: undefined,
              }),
            }}
          >
            Pusat Bantuan
          </Text>
          <Text className="text-sm text-stone-500 px-4 mt-1">
            Kami siap membantu Anda.
          </Text>
        </Animated.View>

        {/* -------------------------------------------------------------- */}
        {/* FAQ ACCORDION                                                  */}
        {/* -------------------------------------------------------------- */}
        <Animated.View entering={FadeInDown.duration(500).delay(350)}>
          <Text className="text-lg font-bold text-slate-800 px-4 mt-8 mb-4">
            Pertanyaan Populer
          </Text>
        </Animated.View>

        {FAQ_DATA.map((item, index) => {
          const isExpanded = expandedId === item.id;

          return (
            <Animated.View
              key={item.id}
              entering={FadeInDown.duration(500).delay(450 + index * 100)}
            >
              <Pressable
                onPress={() => toggleFaq(item.id)}
                className="bg-white rounded-xl px-4 py-4 mx-4 mb-3 shadow-sm border border-stone-100"
              >
                {/* Question row */}
                <View className="flex-row items-center">
                  <Text className="flex-1 text-slate-800 font-medium pr-3">
                    {item.question}
                  </Text>
                  <Feather
                    name="chevron-down"
                    size={18}
                    color="#78716c"
                    style={{
                      transform: [
                        { rotate: isExpanded ? '180deg' : '0deg' },
                      ],
                    }}
                  />
                </View>

                {/* Answer (conditionally rendered) */}
                {isExpanded && (
                  <Text className="text-sm text-stone-500 mt-3 leading-5">
                    {item.answer}
                  </Text>
                )}
              </Pressable>
            </Animated.View>
          );
        })}

        {/* -------------------------------------------------------------- */}
        {/* WHATSAPP CONTACT CARD                                          */}
        {/* -------------------------------------------------------------- */}
        <Animated.View entering={FadeInDown.duration(500).delay(900)}>
          <View className="bg-[#F5EEDC] rounded-2xl p-6 mx-4 mt-8 mb-10 items-center">
            <Text className="text-lg font-bold text-slate-800">
              Masih butuh bantuan?
            </Text>
            <Text className="text-sm text-stone-500 mt-1 text-center">
              Tim ahli kami siap mendampingi Anda.
            </Text>

            <ScaleButton
              onPress={handleWhatsAppPress}
              className="bg-[#785928] w-full py-4 rounded-xl mt-4 items-center justify-center"
            >
              <Text className="text-white font-bold">
                Hubungi Via WhatsApp
              </Text>
            </ScaleButton>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
