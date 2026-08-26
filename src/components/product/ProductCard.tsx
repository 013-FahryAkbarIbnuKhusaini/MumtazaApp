import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Product } from '../../types';

const GOLD_BASE_PRICE_PER_GRAM = 1350000;
const FALLBACK_LOGO = require('../../../assets/images/logo-mumtaza-hd.png');

interface ProductCardProps {
  product: Product;
  isLiked: boolean;
  onPress?: () => void;
  onPressHeart: () => void;
}

function titleCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const ProductCard = ({
  product,
  isLiked,
  onPress,
  onPressHeart,
}: ProductCardProps) => {
  const router = useRouter();

  const handleCardPress = () => {
    router.push({ pathname: '/product/[id]', params: { id: product.id, productData: JSON.stringify(product) } });
    if (onPress) {
      onPress();
    }
  };

  const isLarge = product.size === 'large';

  const displayName = `${titleCase(product.name)} - ${product.code}`;
  const displaySubtitle = `${product.karat} Gold • ${product.berat}g`;

  // Proactive URL validity check: treat missing, empty, and whitespace-only as "no image"
  const hasValidImage = product.image != null && product.image.trim() !== '';
  const imageUrl = hasValidImage
    ? `https://www.emas.tokomumtaza.com/img/${product.image}`
    : '';

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [product.id]);

  // Show fallback when data says no image OR when a valid URL failed at runtime
  const showFallback = !hasValidImage || imageError;

  const rawWeight = parseFloat(product.berat);
  const weight: number = isNaN(rawWeight) ? 0 : rawWeight;
  const price: number = weight * GOLD_BASE_PRICE_PER_GRAM;
  const displayPrice: string = `Rp. ${new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price)}`;

  return (
    <Pressable
      className={`w-full bg-white border border-[#E8E3DB] shadow-sm ${isLarge ? 'rounded-2xl' : 'rounded-xl'} overflow-hidden mb-4 active:opacity-90`}
      onPress={handleCardPress}
    >
      <View
        className={`relative overflow-hidden bg-stone-200 rounded-t-xl w-full ${isLarge ? 'h-56' : 'h-40'}`}
      >
        {showFallback ? (
          <View className="absolute inset-0 items-center justify-center p-4">
            <Image
              source={FALLBACK_LOGO}
              style={{ width: '100%', height: '100%' }}
              contentFit="contain"
              transition={500}
            />
          </View>
        ) : (
          <Image
            source={{ uri: imageUrl }}
            className="bg-stone-200"
            style={{ width: '100%', height: '100%', position: 'absolute' }}
            contentFit="cover"
            transition={500}
            onError={() => setImageError(true)}
          />
        )}
        {product.badge && (
          <View className="absolute top-3 left-3 px-2 py-1 rounded-full ${product.badge === 'BEST SELLER' ? 'bg-[#785928]' : 'bg-white border border-gray-200'}">
            <Text className="text-[10px] font-bold tracking-wide ${product.badge === 'BEST SELLER' ? 'text-white' : 'text-black'}">{product.badge}</Text>
          </View>
        )}
        <Pressable className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow-sm" onPress={(e) => { e.stopPropagation(); onPressHeart(); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Heart size={16} color={isLiked ? '#785928' : '#785928'} fill={isLiked ? '#785928' : 'transparent'} />
        </Pressable>
      </View>
      <View className="p-3">
        {isLarge ? (
          <View className="flex-row justify-between items-start mt-3">
            <View className="flex-1 mr-2">
              <Text className="text-base font-bold text-textPrimary" numberOfLines={1}>{displayName}</Text>
              <Text className="text-sm text-textSecondary mt-1">{displaySubtitle}</Text>
            </View>
            <Text className="text-base font-bold text-[#785928]">{displayPrice}</Text>
          </View>
        ) : (
          <View className="flex-col mt-3">
            <Text className="text-sm font-bold text-textPrimary" numberOfLines={1}>{displayName}</Text>
            <Text className="text-sm font-bold text-[#785928] mt-1">{displayPrice}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default ProductCard;
