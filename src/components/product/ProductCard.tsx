import React from 'react';
import { View, Image, TouchableOpacity, Text, Pressable } from 'react-native';
import { Heart } from 'lucide-react-native';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onToggleFavorite?: () => void;
}

function titleCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const ProductCard = ({
  product,
  onPress,
  onToggleFavorite,
}: ProductCardProps) => {
  const isLarge = product.size === 'large';

  const displayName = `${titleCase(product.name)} - ${product.code}`;
  const displaySubtitle = `${product.karat} Gold • ${product.berat}g`;
  const imageUrl = `https://www.emas.tokomumtaza.com/img/${product.image}`;

  return (
    <TouchableOpacity
      className={`${isLarge ? 'w-full' : 'w-[48%]'} bg-surface rounded-md overflow-hidden mb-4`}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View
        className={`relative overflow-hidden rounded-2xl bg-[#F8F6F2] w-full ${isLarge ? 'h-56' : 'h-40'}`}
      >
        <Image
          source={{ uri: imageUrl }}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          resizeMode="cover"
        />
        {product.badge && (
          <View className="absolute top-3 left-3 px-2 py-1 rounded-full ${product.badge === 'BEST SELLER' ? 'bg-[#785928]' : 'bg-white border border-gray-200'}">
            <Text className="text-[10px] font-bold tracking-wide ${product.badge === 'BEST SELLER' ? 'text-white' : 'text-black'}">{product.badge}</Text>
          </View>
        )}
        <Pressable className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow-sm" onPress={onToggleFavorite}>
          <Heart size={16} color="#785928" fill={product.isFavorited ? '#785928' : 'transparent'} />
        </Pressable>
      </View>
      <View className="p-3">
        {isLarge ? (
          <View className="flex-row justify-between items-start mt-3">
            <View className="flex-1 mr-2">
              <Text className="text-base font-bold text-textPrimary" numberOfLines={1}>{displayName}</Text>
              <Text className="text-sm text-textSecondary mt-1">{displaySubtitle}</Text>
            </View>
            <Text className="text-base font-bold text-[#785928]">Rp 12.5M</Text>
          </View>
        ) : (
          <View className="flex-col mt-3">
            <Text className="text-sm font-bold text-textPrimary" numberOfLines={1}>{displayName}</Text>
            <Text className="text-sm font-bold text-[#785928] mt-1">Rp 12.5M</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
