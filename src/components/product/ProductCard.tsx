import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { Heart } from 'lucide-react-native';
import { Badge } from '../ui/Badge';
import { PriceTag } from './PriceTag';

type BadgeVariant = 'gold' | 'dark' | 'success' | 'warning' | 'neutral';

interface ProductCardProps {
  image: string;
  name: string;
  subtitle: string;
  price: number;
  badge?: { label: string; variant: BadgeVariant };
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
  onPress: () => void;
  size?: 'full' | 'half';
}

export const ProductCard = ({
  image,
  name,
  subtitle,
  price,
  badge,
  isFavorited,
  onToggleFavorite,
  onPress,
  size = 'full',
}: ProductCardProps) => {
  return (
    <TouchableOpacity className={`${size === 'half' ? 'w-[48%]' : 'w-full'} bg-white rounded-md p-2`} onPress={onPress}>
      <View className="aspect-square bg-surface rounded-md relative">
        <Image source={{ uri: image }} className="w-full h-full rounded-md" />
        {badge && (
          <View className="absolute top-2 left-2">
            <Badge label={badge.label} variant={badge.variant} />
          </View>
        )}
        <TouchableOpacity className="absolute top-2 right-2 p-1.5 bg-white rounded-full" onPress={onToggleFavorite}>
          <Heart size={20} color={isFavorited ? '#BA1A1A' : '#5E5E5E'} fill={isFavorited ? '#BA1A1A' : 'none'} />
        </TouchableOpacity>
      </View>
      <View className="mt-3">
        <Text className="font-headingSemiBold text-textPrimary" numberOfLines={1}>{name}</Text>
        <Text className="font-body text-textSecondary text-xs">{subtitle}</Text>
        <View className="mt-2">
          <PriceTag amount={price} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
