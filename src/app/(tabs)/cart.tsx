import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Feather from '@expo/vector-icons/Feather';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import ProductCard from '../../components/product/ProductCard';
import { Product, ProductApi, CartItem } from '../../types';
import { useWishlistStore } from '../../store/wishlistStore';
import { formatRupiah } from '../../utils/currency';

const API_BASE_URL = 'https://emas.tokomumtaza.com';
const GOLD_BASE_PRICE_PER_GRAM = 1350000;
const FALLBACK_LOGO = require('../../../assets/images/logo-mumtaza-hd.png');

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
// HELPER — compute price from weight (matching ProductCard logic)
// -----------------------------------------------------------------------------
function getItemPrice(product: Product): number {
  const rawWeight = parseFloat(product.berat);
  const weight = isNaN(rawWeight) ? 0 : rawWeight;
  return weight * GOLD_BASE_PRICE_PER_GRAM;
}

function titleCase(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// -----------------------------------------------------------------------------
// CART ITEM ROW
// -----------------------------------------------------------------------------
const CartItemRow = React.memo(function CartItemRow({
  item,
  onRemove,
}: {
  item: CartItem;
  onRemove: (id: string) => void;
}) {
  const { product, quantity } = item;

  const namePart = product.name ? titleCase(product.name) : 'Nama produk tidak tersedia';
  const codePart = product.code || '';
  const displayName = codePart ? `${namePart} - ${codePart}` : namePart;

  const unitPrice = getItemPrice(product);
  const displayPrice = formatRupiah(unitPrice);

  const hasValidImage = product.image != null && product.image.trim() !== '';
  const imageUrl = hasValidImage
    ? `https://www.emas.tokomumtaza.com/img/${product.image}`
    : '';

  const [imageError, setImageError] = useState(false);
  const showFallback = !hasValidImage || imageError;

  return (
    <View className="flex-row items-center bg-white border border-[#E8E3DB] rounded-xl p-3 mx-4 mb-3">
      {/* Product image */}
      <View className="w-20 h-20 rounded-lg overflow-hidden bg-stone-200 mr-3">
        {showFallback ? (
          <View className="flex-1 items-center justify-center p-2">
            <Image
              source={FALLBACK_LOGO}
              style={{ width: '100%', height: '100%' }}
              contentFit="contain"
              transition={300}
            />
          </View>
        ) : (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={300}
            onError={() => setImageError(true)}
          />
        )}
      </View>

      {/* Name, price, quantity */}
      <View className="flex-1 mr-2">
        <Text className="text-sm font-bold text-slate-800" numberOfLines={2}>
          {displayName}
        </Text>
        <Text className="text-sm font-bold text-[#785928] mt-1">
          {displayPrice}
        </Text>
        {quantity > 1 && (
          <Text className="text-xs text-stone-500 mt-0.5">
            Qty: {quantity}
          </Text>
        )}
      </View>

      {/* Remove button */}
      <Pressable
        onPress={() => onRemove(product.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        className="p-2"
      >
        <Feather name="trash-2" size={18} color="#991B1B" />
      </Pressable>
    </View>
  );
});

// -----------------------------------------------------------------------------
// EMPTY CART UI (preserved from earlier task — extracted as sub-component)
// -----------------------------------------------------------------------------
function EmptyCartContent({
  router,
  recommendations,
  isLoadingRecs,
}: {
  router: ReturnType<typeof useRouter>;
  recommendations: Product[];
  isLoadingRecs: boolean;
}) {
  return (
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
  );
}

// -----------------------------------------------------------------------------
// CART SCREEN
// -----------------------------------------------------------------------------
export default function CartScreen() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState<boolean>(true);

  // ── Store subscriptions ──
  const cartItems = useWishlistStore((s) => s.cartItems);
  const removeFromCart = useWishlistStore((s) => s.removeFromCart);
  const hasHydrated = useWishlistStore((s) => s._hasHydrated);

  // ── Fetch recommendations (only needed for empty state, but keep the
  //    fetch unconditional to avoid a flash when the last item is removed) ──
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

  // ── Compute cart total ──
  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, ci) => {
      return sum + getItemPrice(ci.product) * ci.quantity;
    }, 0);
  }, [cartItems]);

  const handleRemove = useCallback(
    (id: string) => {
      removeFromCart(id);
    },
    [removeFromCart],
  );

  // TODO: wire up checkout flow
  const handleCheckout = useCallback(() => {
    // TODO: wire up checkout flow
  }, []);

  const renderCartItem = useCallback(
    ({ item }: { item: CartItem }) => (
      <CartItemRow item={item} onRemove={handleRemove} />
    ),
    [handleRemove],
  );

  const keyExtractor = useCallback((item: CartItem) => item.product.id, []);

  // ── Hydration gate — show neutral loading until persisted data is ready ──
  if (!hasHydrated) {
    return (
      <SafeAreaView className="flex-1 bg-[#FAFAFA] items-center justify-center" edges={['top']}>
        <ActivityIndicator size="small" color="#785928" />
      </SafeAreaView>
    );
  }

  // ── Empty state ──
  if (cartItems.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={['top']}>
        <EmptyCartContent
          router={router}
          recommendations={recommendations}
          isLoadingRecs={isLoadingRecs}
        />
      </SafeAreaView>
    );
  }

  // ── Populated state ──
  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={['top']}>
      {/* Header */}
      <View className="px-4 pt-4 pb-3">
        <Text className="text-2xl font-bold text-slate-800">Keranjang</Text>
        <Text className="text-sm text-stone-500 mt-1">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'item'}
        </Text>
      </View>

      {/* Cart items list */}
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
      />

      {/* Fixed bottom checkout button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-4 pt-3 pb-8">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm text-stone-500">Total</Text>
          <Text className="text-lg font-bold text-slate-800">
            {formatRupiah(cartTotal)}
          </Text>
        </View>
        <Pressable
          onPress={handleCheckout}
          className="w-full bg-[#785928] py-4 rounded-full items-center justify-center shadow-sm active:opacity-90"
        >
          <Text className="text-white font-semibold text-base">Checkout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
