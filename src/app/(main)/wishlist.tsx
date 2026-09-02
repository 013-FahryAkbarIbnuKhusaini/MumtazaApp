import React, { useCallback } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heart, ChevronLeft } from 'lucide-react-native';
import { useWishlistStore } from '../../store/wishlistStore';
import { ProductCard } from '../../components/product/ProductCard';
import { Product } from '../../types';

export default function WishlistScreen() {
  const router = useRouter();
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);

  const renderItem = useCallback(
    ({ item, index }: { item: Product; index: number }) => {
      const isLeft = index % 2 === 0;
      return (
        <View
          style={{
            flex: 1,
            paddingLeft: isLeft ? 20 : 4,
            paddingRight: isLeft ? 4 : 20,
          }}
        >
          <ProductCard product={{ ...item, size: 'small' }} />
        </View>
      );
    },
    [],
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8]" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-[#F1EDE7] items-center justify-center"
        >
          <ChevronLeft size={22} color="#211D18" />
        </Pressable>
        <Text className="flex-1 text-center text-lg font-bold text-[#211D18] mr-10">
          Wishlist
        </Text>
      </View>

      {wishlistItems.length === 0 ? (
        /* ── Empty State ── */
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-20 h-20 rounded-full bg-[#F4EFEB] items-center justify-center mb-5">
            <Heart size={36} color="#C9A961" />
          </View>
          <Text className="text-xl font-bold text-[#211D18] mb-2">
            Wishlist Kosong
          </Text>
          <Text className="text-sm text-stone-500 text-center px-6">
            Anda belum menambahkan perhiasan ke daftar favorit.
          </Text>
        </View>
      ) : (
        /* ── Wishlist Grid ── */
        <FlatList
          data={wishlistItems}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
