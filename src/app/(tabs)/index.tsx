import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  Pressable,
  Animated,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Bell, ShoppingBag, Menu, Package, Frown, ArrowUp } from 'lucide-react-native';
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

const SearchBar: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
}> = ({ value, onChangeText }) => {
  return (
    <View className="mt-4 mb-4 mx-5">
      <View className="flex-row items-center bg-[#F1EDE7] rounded-full px-4 py-3.5 border border-[#E8E3DB]">
        <View className="mr-2">
          <Search size={18} color="#7A756D" />
        </View>
        <TextInput
          placeholder="Search collections, rings, necklaces..."
          placeholderTextColor="#7A756D"
          editable={true}
          value={value}
          onChangeText={onChangeText}
          className="flex-1 text-sm text-[#211D18]"
        />
      </View>
    </View>
  );
};

const EmptyState: React.FC<{ variant: 'emptyCategory' | 'noResults' }> = ({ variant }) => {
  const isNoResults = variant === 'noResults';
  return (
    <View className="items-center py-20 px-5">
      <View className="w-16 h-16 rounded-full bg-[#F5F0E6] items-center justify-center mb-4">
        {isNoResults ? <Frown size={28} color="#C9A961" /> : <Package size={28} color="#C9A961" />}
      </View>
      <Text className="text-base font-bold text-[#211D18] text-center">
        {isNoResults ? "Yah, barangnya nggak ketemu :(" : "Belum ada produk"}
      </Text>
      <Text className="text-sm text-[#7A756D] text-center mt-1">
        {isNoResults ? "Coba cari dengan kata kunci lain atau pilih kategori berbeda" : "Pilih kategori lain untuk melihat produk"}
      </Text>
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
    <View className="mt-2">
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

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Piece');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const flatListRef = useRef<FlatList<Product>>(null);

  const fetchProducts = async (pageNum: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/mutasi?page=${pageNum}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const apiProducts: ProductApi[] = data.data.data;
      const totalPages: number = data.data.last_page;

      const mappedProducts: Product[] = apiProducts.map((p) => ({
        id: p.id.toString(),
        name: p.name,
        code: p.code,
        category: p.name.charAt(0).toUpperCase() + p.name.slice(1).toLowerCase(),
        image: p.image,
        karat: p.karat,
        berat: p.berat,
        status: p.status,
        isBestSeller: p.type_id === 1 || p.type_id === 2,
        isNew: p.status === 'ADA',
      }));

      setProducts((prev) => (pageNum === 1 ? mappedProducts : [...prev, ...mappedProducts]));
      setLastPage(totalPages);
    } catch (e) {
      console.error('Failed to fetch products:', e);
      if (pageNum === 1) {
        setProducts([]);
      }
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setPage(1);
    fetchProducts(1);
  }, [selectedCategory]);

  useEffect(() => {
    if (page > 1) {
      setIsFetchingMore(true);
      fetchProducts(page);
    }
  }, [page]);

  const toggleLike = useCallback((id: string) => {
    setLikedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((likedId) => likedId !== id);
      }
      return [...prev, id];
    });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setIsFetchingMore(false);
    try {
      await fetchProducts(1);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredResults = useMemo(() => {
    let filtered = products;
    if (selectedCategory !== 'All Piece') {
      filtered = filtered.filter((item) =>
        item.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }
    const query = searchQuery.trim().toLowerCase();
    if (query !== '') {
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          item.code?.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [products, selectedCategory, searchQuery]);

  // First product renders as a large card in the header; rest go into the 2-column FlatList grid
  const firstProduct = filteredResults.length > 0 ? filteredResults[0] : null;
  const gridProducts = useMemo(() => filteredResults.slice(1), [filteredResults]);

  const handleEndReached = useCallback(() => {
    if (!isFetchingMore && !isLoading && page < lastPage) {
      setPage((prev) => prev + 1);
    }
  }, [isFetchingMore, isLoading, page, lastPage]);

  const renderGridItem = useCallback(({ item, index }: { item: Product; index: number }) => {
    const isLiked = likedIds.includes(item.id);
    const isLeft = index % 2 === 0;
    return (
      <View style={{ flex: 1, paddingLeft: isLeft ? 20 : 4, paddingRight: isLeft ? 4 : 20 }}>
        <ProductCard
          product={{ ...item, size: 'small' }}
          isLiked={isLiked}
          onPress={() => {}}
          onPressHeart={() => toggleLike(item.id)}
        />
      </View>
    );
  }, [likedIds, toggleLike]);

  const keyExtractor = useCallback((item: Product) => item.id, []);

  const ListHeader = useMemo(() => (
    <>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
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
        searchQuery.trim() !== '' ? <EmptyState variant="noResults" /> : <EmptyState variant="emptyCategory" />
      ) : (
        <View className="px-5 mt-8">
          <View className="flex-row items-center mb-4">
            <Text className="text-lg font-bold text-[#211D18] mb-3">Terbaru</Text>
          </View>
          {firstProduct && (
            <ProductCard
              product={{ ...firstProduct, size: 'large' }}
              isLiked={likedIds.includes(firstProduct.id)}
              onPress={() => {}}
              onPressHeart={() => toggleLike(firstProduct.id)}
            />
          )}
        </View>
      )}
    </>
  ), [searchQuery, selectedCategory, isLoading, filteredResults, firstProduct, likedIds, toggleLike]);

  const ListFooter = useMemo(() => {
    if (!isFetchingMore) return null;
    return (
      <View className="py-5 items-center">
        <ActivityIndicator size="large" color="#C9A961" />
      </View>
    );
  }, [isFetchingMore]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <HomeHeader />
      <FlatList
        ref={flatListRef}
        data={gridProducts}
        renderItem={renderGridItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#C9A961"
            colors={['#C9A961']}
          />
        }
        onScroll={({ nativeEvent }) => {
          setShowScrollTop(nativeEvent.contentOffset.y > 500);
        }}
        scrollEventThrottle={16}
        initialNumToRender={6}
        windowSize={5}
        removeClippedSubviews={true}
      />
      {showScrollTop && (
        <Pressable
          onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
          className="absolute bottom-28 right-5 w-12 h-12 rounded-full items-center justify-center shadow-lg"
          style={{ backgroundColor: '#C9A961' }}
        >
          <ArrowUp size={22} color="#FFFFFF" />
        </Pressable>
      )}
    </SafeAreaView>
  );
}
