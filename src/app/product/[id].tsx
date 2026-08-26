import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Linking } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ShoppingBag } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Product } from '../../types';

const GOLD_BASE_PRICE_PER_GRAM = 1350000;
const WHATSAPP_NUMBER = '6281214175087';

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

  const handleWhatsApp = async () => {
    const vendorDisplay = 'MUMTAZA';
    const message = `Halo kak saya ingin bertanya terkait barang ini emas ${product.code}, dengan berat ${product.berat} gram kadar ${product.karat} dari ${vendorDisplay}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open WhatsApp:', error);
    }
  };

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
        {imageError ? (
          <View className="bg-stone-100 items-center justify-center p-8" style={{ width: '100%', height: 400 }}>
            <Image
              source={require('../../../assets/images/logo-mumtaza-hd.png')}
              className="bg-stone-100"
              style={{ width: '100%', height: '100%' }}
              contentFit="contain"
              transition={300}
            />
          </View>
        ) : (
          <Image
            source={{ uri: imageUrl }}
            className="bg-stone-100"
            style={{ width: '100%', height: 400 }}
            contentFit="cover"
            transition={300}
            onError={() => setImageError(true)}
          />
        )}

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
        className="absolute bottom-0 w-full bg-white border-t border-gray-200 px-5 pt-4 flex-row items-center gap-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Pressable
          className="w-12 h-12 rounded-xl border-2 border-[#C9A961] items-center justify-center"
          onPress={() => console.log('Add to cart: ', product.id)}
        >
          <ShoppingBag size={20} color="#C9A961" />
        </Pressable>
        <Pressable
          className="flex-1 bg-[#25D366] py-3 rounded-xl items-center flex-row justify-center"
          onPress={handleWhatsApp}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
              fill="white"
            />
          </Svg>
          <Text className="text-white font-bold text-xs ml-1.5">Tanya via WA</Text>
        </Pressable>
        <Pressable
          className="flex-[2] bg-[#C9A961] py-3 rounded-xl items-center"
          onPress={() => console.log('Buy now: ', product.id)}
        >
          <Text className="text-white font-bold text-sm">Beli Sekarang</Text>
        </Pressable>
      </View>
    </View>
  );
}

