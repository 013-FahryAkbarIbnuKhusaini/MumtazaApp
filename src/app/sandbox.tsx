import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button } from '../components/ui/Button';
import { TextInput } from '../components/ui/TextInput';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNavBar } from '../components/layout/BottomNavBar';
import { PriceTag } from '../components/product/PriceTag';
import { ProductCard } from '../components/product/ProductCard';
import { QuantityStepper } from '../components/cart/QuantityStepper';
import { User } from 'lucide-react-native';

export default function Sandbox() {
  return (
    <View className="flex-1 bg-background pt-10">
      <AppHeader />
      <ScrollView className="p-screenPadding">
        <Card className="mb-4">
          <Button label="Primary Button" onPress={() => {}} />
          <Button label="Outline Button" variant="outline" onPress={() => {}} className="mt-2" />
        </Card>
        
        <TextInput value="" onChangeText={() => {}} placeholder="Enter text..." leftIcon={<User />} />
        
        <View className="flex-row gap-2 my-4">
          <Chip label="Gold" selected onPress={() => {}} />
          <Chip label="Silver" onPress={() => {}} />
        </View>

        <Badge label="New Arrival" variant="gold" />

        <ProductCard
          product={{
            id: 'sandbox-1',
            name: 'Kalung',
            code: 'K2428KJB',
            category: 'Kalung',
            image: '1773203795.jpeg',
            karat: '24K',
            berat: '2.42',
          }}
          onPress={() => {}}
        />

        <QuantityStepper quantity={1} onIncrease={() => {}} onDecrease={() => {}} />
      </ScrollView>
      <BottomNavBar activeTab="home" onTabPress={() => {}} />
    </View>
  );
}
