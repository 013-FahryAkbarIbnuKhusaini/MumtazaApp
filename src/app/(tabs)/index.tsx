import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Heart, Bell, ShoppingBag, ChevronRight, Menu } from 'lucide-react-native';
import { Badge } from '../../components/ui/Badge';

// Color tokens are centralized in src/constants/theme.ts and consumed via
// NativeWind utility classes (bg-primary, text-textPrimary, bg-surface, etc.).
// Icon colors below reuse the same hex values from that theme.
const ICON = {
  gold: '#785928',
  textPrimary: '#1A1C1C',
  textSecondary: '#5E5E5E',
  black: '#0D0D0D',
};

interface Product {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  image: string;
  badge?: 'BEST SELLER' | 'INVESTMENT' | 'NEW';
  size: 'large' | 'small';
}

// TODO: replace with real MUMTAZA product photography
const PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Surya Radiance Ring',
    subtitle: '22K Gold • Handcrafted',
    price: 'Rp 12.5M',
    image: 'https://picsum.photos/seed/surya-ring/800/800',
    badge: 'BEST SELLER',
    size: 'large',
  },
  {
    id: '2',
    title: 'Minimalist Drop',
    subtitle: '18K Gold Earrings',
    price: 'Rp 4.2M',
    image: 'https://picsum.photos/seed/minimalist-drop/600/600',
    size: 'small',
  },
  {
    id: '3',
    title: 'MUMTAZA 10g Bar',
    subtitle: '99.99% Fine Gold',
    price: 'Rp 11.8M',
    image: 'https://picsum.photos/seed/mumtaza-bar/600/600',
    badge: 'INVESTMENT',
    size: 'small',
  },
];

const CATEGORIES: string[] = ['Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Gold Bars'];

const HomeHeader: React.FC = () => {
  return (
    <View className="relative flex-row items-center justify-between px-5 py-3">
      {/* Left: hamburger menu */}
      <TouchableOpacity
        onPress={() => {}} // TODO: wire up drawer/menu navigation
        className="w-10 h-10 rounded-full bg-[#F1EDE7] items-center justify-center"
      >
        <Menu size={22} color="#211D18" />
      </TouchableOpacity>

      {/* Center: brand wordmark, absolutely centered over full header width.
          Serif is a platform fallback; swap for a loaded brand serif font later. */}
      <View className="absolute left-0 right-0 items-center justify-center" pointerEvents="none">
        <Text
          className="text-lg font-bold uppercase tracking-widest text-[#211D18]"
          style={{ fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: undefined }) }}
        >
          MUMTAZA
        </Text>
      </View>

      {/* Right: notification + bag icons */}
      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={() => {}}
          className="w-10 h-10 rounded-full bg-[#F1EDE7] items-center justify-center"
        >
          <Bell size={20} color="#211D18" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {}}
          className="relative w-10 h-10 rounded-full bg-[#F1EDE7] items-center justify-center"
        >
          <ShoppingBag size={20} color="#211D18" />
          <View className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary items-center justify-center">
            <Text className="text-white text-[10px] font-bodySemiBold">2</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SearchBar: React.FC = () => {
  return (
    <View className="mx-5 my-3 flex-row items-center bg-surface rounded-2xl px-4 py-3">
      <Search size={20} color={ICON.textSecondary} />
      {/* Presentational only. Swap this row for <TextInput> (see src/components/ui/TextInput)
          when wiring live search — keep the same wrapper styling. */}
      <Text className="ml-2 font-body text-textSecondary text-sm">Cari perhiasan emas...</Text>
    </View>
  );
};

const HeroBanner: React.FC = () => {
  return (
    <View className="mx-5 my-3">
      <ImageBackground
        source={{ uri: 'https://picsum.photos/seed/hero-gold/1200/700' }}
        className="h-52 rounded-3xl overflow-hidden"
        resizeMode="cover"
      >
        <View className="absolute inset-0 bg-black/35" />
        <View className="flex-1 justify-end p-5">
          <Text className="font-headingSemiBold text-white text-2xl">Elegance Redefined in Gold</Text>
          <Text className="font-body text-white/85 text-sm mt-1">
            Discover handcrafted 22K heirlooms.
          </Text>
          <TouchableOpacity
            className="mt-3 self-start bg-primary rounded-full px-5 py-2.5"
            onPress={() => {}}
          >
            <Text className="font-bodySemiBold text-white text-sm">Shop Now</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

interface CategoryPillsProps {
  categories: string[];
  activeCategory: string;
  onSelect?: (category: string) => void;
}

const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  activeCategory,
  onSelect,
}) => {
  return (
    <View className="my-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-5"
      >
        {categories.map((category) => {
          const active = category === activeCategory;
          return (
            <TouchableOpacity
              key={category}
              className={`mr-3 px-4 py-2 rounded-full border ${
                active
                  ? 'bg-primary border-primary'
                  : 'bg-surface border-border'
              }`}
              onPress={() => onSelect?.(category)}
            >
              <Text
                className={`font-bodyMedium text-sm ${
                  active ? 'text-white' : 'text-textPrimary'
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onToggleFavorite?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onToggleFavorite,
}) => {
  const isLarge = product.size === 'large';
  const imageHeight = isLarge ? 'h-56' : 'h-36';
  const cardWidth = isLarge ? 'w-full' : 'w-[48%]';

  const badgeVariant =
    product.badge === 'INVESTMENT' ? 'dark' : 'gold';
  const badgeClassName =
    product.badge === 'INVESTMENT' ? 'text-primary text-[10px]' : 'text-[10px]';

  return (
    <TouchableOpacity
      className={`${cardWidth} bg-surface rounded-md overflow-hidden mb-4`}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View className={`${imageHeight} w-full relative bg-surfaceAlt`}>
        <Image source={{ uri: product.image }} className="w-full h-full" resizeMode="cover" />
        {product.badge && (
          <View className="absolute top-3 left-3">
            <Badge label={product.badge} variant={badgeVariant} className={badgeClassName} />
          </View>
        )}
        <TouchableOpacity
          className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full"
          onPress={onToggleFavorite}
        >
          <Heart size={20} color={ICON.textPrimary} />
        </TouchableOpacity>
      </View>
      <View className="p-3">
        <Text className="font-headingSemiBold text-textPrimary text-base" numberOfLines={1}>
          {product.title}
        </Text>
        <Text className="font-body text-textSecondary text-xs mt-1">{product.subtitle}</Text>
        <Text className="font-headingSemiBold text-primary text-base mt-2">{product.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const FeaturedProductsSection: React.FC = () => {
  const largeProduct = PRODUCTS.find((p) => p.size === 'large');
  const smallProducts = PRODUCTS.filter((p) => p.size === 'small');

  return (
    <View className="my-3 px-5">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="font-headingSemiBold text-textPrimary text-lg">Featured Products</Text>
        <TouchableOpacity className="flex-row items-center" onPress={() => {}}>
          <Text className="font-bodyMedium text-primary text-sm mr-1">See All</Text>
          <ChevronRight size={16} color={ICON.gold} />
        </TouchableOpacity>
      </View>

      {largeProduct && <ProductCard product={largeProduct} onPress={() => {}} onToggleFavorite={() => {}} />}

      <View className="flex-row justify-between">
        {smallProducts.map((product) => (
          <ProductCard key={product.id} product={product} onPress={() => {}} onToggleFavorite={() => {}} />
        ))}
      </View>
    </View>
  );
};

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-8">
        <HomeHeader />
        <SearchBar />
        <HeroBanner />
        <CategoryPills categories={CATEGORIES} activeCategory="Rings" onSelect={() => {}} />
        <FeaturedProductsSection />
      </ScrollView>
    </SafeAreaView>
  );
}
