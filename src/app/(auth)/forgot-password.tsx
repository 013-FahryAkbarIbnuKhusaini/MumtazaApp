import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, ArrowRight } from 'lucide-react-native';
import { TextInput } from '../../components/ui/TextInput';
import { Button } from '../../components/ui/Button';
import { AuthHeader } from '../../components/auth/AuthHeader';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSendResetLink = () => {
    // TODO: wire up password reset request once backend is ready
    console.log('Send reset link pressed', { email });
    router.push({ pathname: '/(auth)/verify-otp', params: { email: email.trim() } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#785928' }}>
      {/* Gradient header with logo + wordmark (reusable across auth screens) */}
      <AuthHeader />

      {/* White content card — overlaps header via negative margin + rounded top corners */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, marginTop: -40, zIndex: 2, elevation: 2 }}
      >
        <ScrollView
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
          bounces={false}
          style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40, overflow: 'hidden' }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: '#ffffff',
              paddingTop: 32,
              paddingHorizontal: 24,
              paddingBottom: 24,
            }}
          >
            {/* Title block */}
            <Text className="text-2xl font-bold text-slate-900">Reset Password</Text>
            <Text className="text-stone-500 mt-1">
              {"Enter your email address and we'll send you instructions to reset your password."}
            </Text>

            {/* Form section */}
            <View className="mt-6 gap-4">
              {/* Email input */}
              <TextInput
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                leftIcon={<Mail size={20} color="#9CA3AF" />}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                autoComplete="email"
              />
            </View>

            {/* Send Reset Link button */}
            <View className="mt-6">
              <Button
                label="SEND RESET LINK"
                onPress={handleSendResetLink}
                variant="primary"
                rightIcon={<ArrowRight size={18} color="#FFFFFF" />}
              />
            </View>

            {/* Footer link */}
            <View className="flex-row justify-center items-center gap-1 mt-6">
              <Text className="text-gray-500 text-sm">Remember your password?</Text>
              <Pressable onPress={() => router.push('/(auth)/login')}>
                <Text className="text-[#785928] font-bold text-sm">Back to Sign In</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
