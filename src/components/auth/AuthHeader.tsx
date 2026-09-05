import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const LOGO_SOURCE = require('../../../assets/images/logo-mumtaza-hd.png');

/**
 * Reusable auth header with gradient brown background, brand logo crest,
 * and "MUMTAZA" wordmark. Designed to be imported by all auth screens
 * (Login, Register, Forgot Password, etc.) for visual consistency.
 *
 * NOTE ON FIDELITY: The reference design shows layered organic curve shapes
 * (a lighter tan curve behind a darker brown one), not a single flat gradient.
 * This implementation uses a top-to-bottom LinearGradient which approximates
 * the color mood but does NOT reproduce the layered-curve silhouette.
 * Pixel-accurate overlapping curves would require custom SVG shapes.
 */
export function AuthHeader() {
  return (
    <>
      {/* Per-screen StatusBar override — dark header needs light content */}
      <StatusBar style="light" />

      <LinearGradient
        colors={['#5E4212', '#785928', '#926C32']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ paddingTop: 80, paddingBottom: 60, alignItems: 'center', zIndex: 1 }}
      >
        {/* Brand logo crest — explicit centering wrapper */}
        <View className="items-center justify-center">
          <Image
            source={LOGO_SOURCE}
            style={{ width: 64, height: 64 }}
            contentFit="contain"
          />
        </View>

        {/* Brand wordmark — matches Home screen: font-serif text-4xl tracking-[0.2em] */}
        <Text className="font-serif text-4xl tracking-[0.2em] text-white text-center mt-3">
          MUMTAZA
        </Text>
      </LinearGradient>
    </>
  );
}

export default AuthHeader;
