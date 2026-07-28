import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ShoppingBag } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Product } from '../../types';

const GOLD_BASE_PRICE_PER_GRAM = 1350000;

function titleCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function ProductDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { productData } = useLocalSearchParams<{ productData?: string | string[] }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const raw = Array.isArray(productData) ? productData[0] : productData;
    if (!raw) {
      setProduct(null);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && 'id' in parsed && 'code' in parsed && 'name' in parsed && 'berat' in parsed && 'karat' in parsed && 'image' in parsed) {
        setProduct(parsed as Product);
      } else {
        setProduct(null);
      }
    } catch {
      setProduct(null);
    }
  }, [productData]);

  useEffect(() => {
    setImageError(false);
  }, [product?.id]);

  if (!product) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-textPrimary text-lg font-bold mb-4">Produk tidak ditemukan</Text>
        <Pressable
          className="flex-row items-center gap-2 bg-[#F1EDE7] px-4 py-2 rounded-full"
          onPress={() => router.back()}
        >
          <ChevronLeft size={20} color="#211D18" />
          <Text className="text-textPrimary font-medium">Kembali</Text>
        </Pressable>
      </View>
    );
  }

  const displayName = `${titleCase(product.name)} - ${product.code}`;
  const weight = isNaN(parseFloat(product.berat)) ? 0 : parseFloat(product.berat);
  const price = weight * GOLD_BASE_PRICE_PER_GRAM;
  const displayPrice = `Rp. ${new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price)}`;
  const imageUrl = `https://www.emas.tokomumtaza.com/img/${product.image}`;
  const isAvailable = product.status === 'ADA';

  return (
    <View className="flex-1 bg-white">
      <Pressable
        className="absolute z-10 left-5 rounded-full bg-black/40 p-2"
        style={{ top: insets.top + 10 }}
        onPress={() => router.back()}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <ChevronLeft size={22} color="white" />
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Image
          source={imageError ? require('../../../assets/images/logoP.png') : { uri: imageUrl }}
          style={{ width: '100%', height: 400 }}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />

        <View className="bg-white rounded-b-3xl px-5 py-5 shadow-sm">
          <Text className="text-2xl font-bold text-[#C9A961]">{displayPrice}</Text>

          <View className={`self-start px-3 py-1 rounded-full mt-2 ${isAvailable ? 'bg-green-100' : 'bg-red-100'}`}>
            <Text className={`text-xs font-bold ${isAvailable ? 'text-green-700' : 'text-red-700'}`}>
              {product.status}
            </Text>
          </View>

          <Text className="text-lg font-bold text-textPrimary mt-3" numberOfLines={1}>{displayName}</Text>
        </View>

        <View className="mx-5 mt-6 mb-6 p-4 bg-white rounded-2xl border border-[#E8E3DB] shadow-sm">
          <Text className="text-sm font-bold text-textPrimary mb-3">Spesifikasi Produk</Text>
          <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
            <Text className="text-sm text-textSecondary">Kode</Text>
            <Text className="text-sm font-medium text-textPrimary">{product.code}</Text>
          </View>
          <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
            <Text className="text-sm text-textSecondary">Berat</Text>
            <Text className="text-sm font-medium text-textPrimary">{product.berat}g</Text>
          </View>
          <View className="flex-row justify-between items-center py-2">
            <Text className="text-sm text-textSecondary">Karat</Text>
            <Text className="text-sm font-medium text-textPrimary">{product.karat}</Text>
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 w-full bg-white border-t border-gray-200 px-5 pt-4 flex-row items-center"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Pressable
          className="w-12 h-12 rounded-xl border-2 border-[#C9A961] items-center justify-center"
          onPress={() => console.log('Add to cart: ', product.id)}
        >
          <ShoppingBag size={20} color="#C9A961" />
        </Pressable>
        <View className="flex-1 mx-3" />
        <Pressable
          className="flex-1 bg-[#C9A961] py-3 rounded-xl items-center"
          onPress={() => console.log('Buy now: ', product.id)}
        >
          <Text className="text-white font-bold text-sm">Beli Sekarang</Text>
        </Pressable>
      </View>
    </View>
  );
}