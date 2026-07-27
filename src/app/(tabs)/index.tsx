import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Pressable,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Bell, ShoppingBag, Menu, ArrowRight } from 'lucide-react-native';
import { ProductCard } from '../../components/product/ProductCard';
import SidebarMenu from '../../components/layout/SidebarMenu';
import { Product, ProductApi } from '../../types';

const API_BASE_URL = 'https://emas.tokomumtaza.com';

const HomeHeader: React.FC = () => {
  const router = useRouter();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  return (
    <>
      <View className="relative flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity
          onPress={() => setSidebarVisible(true)}
          className="w-10 h-10 rounded-full bg-[#F1EDE7] items-center justify-center"
        >
          <Menu size={22} color="#211d18" />
        </TouchableOpacity>

        <View className="absolute left-0 right-0 items-center justify-center" pointerEvents="none">
          <Text
            className="text-lg font-bold uppercase tracking-widest text-[#211D18]"
            style={{ fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: undefined }) }}
          >
            MUMTAZA
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => console.log('Navigating to notifications')}
            className="w-10 h-10 rounded-full bg-[#F1EDE7] items-center justify-center"
          >
            <Bell size={20} color="#211D18" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/cart')}
            className="relative w-10 h-10 rounded-full bg-[#F1EDE7] items-center justify-center"
          >
            <ShoppingBag size={20} color="#211D18" />
            <View className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary items-center justify-center">
              <Text className="text-white text-[10px] font-bodySemiBold">2</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <SidebarMenu visible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
    </>
  );
};

const SearchBar: React.FC = () => {
  return (
    <View className="mt-6 mb-8 mx-5">
      <View className="flex-row items-center bg-[#F1EDE7] rounded-full px-4 py-3.5 border border-[#E8E3DB]">
        <View className="mr-2">
          <Search size={18} color="#7A756D" />
        </View>
        {/* TODO: wire up search state/navigation */}
        <TextInput
          placeholder="Search collections, rings, necklaces..."
          placeholderTextColor="#7A756D"
          editable={true}
          className="flex-1 text-sm text-[#211D18]"
        />
      </View>
    </View>
  );
};

const HeroBanner: React.FC = () => {
  return (
    <View className="mx-5 rounded-2xl overflow-hidden">
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1638617501607-5dfb8b079ebf?q=80&w=1200&auto=format&fit=crop' }}
        resizeMode="cover"
        className="h-52"
      >
        <View className="absolute inset-0 bg-black/40" />

        <View className="flex-1 justify-end p-5">
          <View className="self-start flex-row items-center px-3 py-1 rounded-full border border-white/40 bg-white/10 mb-3">
            <Text className="text-[10px] font-semibold uppercase tracking-widest text-white">
              THE HERITAGE COLLECTION
            </Text>
          </View>

          <Text
            className="text-3xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: undefined }) }}
          >
            {'Elegance Redefined\nin Gold'}
          </Text>

          <TouchableOpacity
            onPress={() => {}} // TODO: wire up collection navigation
            className="self-start bg-[#785928] rounded-full px-5 py-2.5"
          >
            <Text className="text-white font-semibold text-sm">Explore Collection</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

function AnimatedCategoryPill({ label, isActive, onPress }: { label: string; isActive: boolean; onPress: () => void }) {
  const progress = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: isActive ? 1 : 0,
      duration: 220,
      useNativeDriver: false, // backgroundColor/borderColor interpolation requires JS-driven animation
    }).start();
  }, [isActive, progress]);

  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', '#C9A961'], // inactive: transparent, active: gold fill
  });
  const borderColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['#C9A961', '#C9A961'], // always gold outline
  });
  const textColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['#7A756D', '#FFFFFF'], // inactive: muted, active: white
  });
  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <Animated.View
      style={{
        backgroundColor,
        borderColor,
        borderWidth: 1,
        transform: [{ scale }],
      }}
      className="rounded-full px-5 py-2 mr-2"
    >
      <Pressable onPress={onPress}>
        <Animated.Text style={{ color: textColor }} className="text-sm font-medium">
          {label}
        </Animated.Text>
      </Pressable>
    </Animated.View>
  );
}

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
    <View className="mt-6">
      <View className="px-5">
        <Text className="text-lg font-bold text-[#211D18] mb-3">Categories</Text>
      </View>
      <View className="mt-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-5"
        >
          {categories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <AnimatedCategoryPill
                key={category}
                label={category}
                isActive={isActive}
                onPress={() => onSelect?.(category)}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

interface FeaturedProductsSectionProps {
  products: Product[];
  likedIds: string[];
  onPressHeart: (id: string) => void;
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({ products, likedIds, onPressHeart }) => {
  return (
    <View className="my-3 px-5 mt-8">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-[#211D18] mb-3">Featured</Text>
        <Pressable className="flex-row items-center gap-1" onPress={() => {}}>
          <Text className="text-sm font-medium text-[#785928]">View All</Text>
          <ArrowRight size={16} color="#785928" />
        </Pressable>
      </View>

      {products.map((item, index) => {
        const isLiked = likedIds.includes(item.id);
        if (index === 0) {
          return (
            <ProductCard
              key={item.id}
              product={{ ...item, size: 'large' }}
              isLiked={isLiked}
              onPress={() => {}}
              onPressHeart={() => onPressHeart(item.id)}
            />
          );
        }

        if (index === 1) {
          return (
            <View key="small-grid" className="flex-row flex-wrap justify-between">
              {products.slice(1).map((smallItem) => {
                const smallIsLiked = likedIds.includes(smallItem.id);
                return (
                  <ProductCard
                    key={smallItem.id}
                    product={{ ...smallItem, size: 'small' }}
                    isLiked={smallIsLiked}
                    onPress={() => {}}
                    onPressHeart={() => onPressHeart(smallItem.id)}
                  />
                );
              })}
            </View>
          );
        }

        return null;
      })}
    </View>
  );
};

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All Piece');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/mutasi`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const apiProducts: ProductApi[] = data.data.data;

        const mappedProducts: Product[] = apiProducts.map((p) => ({
          id: p.id.toString(),
          name: p.name,
          code: p.code,
          category: p.name.charAt(0).toUpperCase() + p.name.slice(1).toLowerCase(),
          image: p.image,
          karat: p.karat,
          berat: p.berat,
          isBestSeller: p.type_id === 1 || p.type_id === 2,
          isNew: p.status === 'ADA',
        }));

          setProducts(mappedProducts);
      } catch (e) {
        console.error('Failed to fetch products:', e);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((likedId) => likedId !== id);
      }
      return [...prev, id];
    });
  };

  const filteredResults = useMemo(() => {
    if (selectedCategory === 'All Piece') {
      return products;
    }
    return products.filter((item) =>
      item.category.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }, [products, selectedCategory]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-8">
        <HomeHeader />
        <SearchBar />
        <HeroBanner />
        <CategoryPills
          categories={['All Piece', 'Cincin', 'Kalung', 'Gelang', 'Anting']}
          activeCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
        {isLoading ? (
          <View className="items-center mt-12">
            <ActivityIndicator size="large" color="#C9A961" />
            <Text className="text-textSecondary mt-3 font-body">Loading products...</Text>
          </View>
        ) : filteredResults.length === 0 ? (
          <Text className="text-center text-textSecondary mt-12 font-body">No products found</Text>
        ) : (
          <FeaturedProductsSection products={filteredResults} likedIds={likedIds} onPressHeart={toggleLike} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
