import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react-native';
import { TextInput } from '../../components/ui/TextInput';
import { Button } from '../../components/ui/Button';
import { AuthHeader } from '../../components/auth/AuthHeader';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = () => {
    // TODO: wire up authentication once backend is ready
    console.log('Sign in pressed', { email });
    router.replace('/(tabs)');
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
            <Text className="text-2xl font-bold text-slate-900">Welcome Back</Text>
            <Text className="text-stone-500 mt-1">
              Sign in to access your exclusive collections.
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

              {/* Password input */}
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                leftIcon={<Lock size={20} color="#9CA3AF" />}
                rightIcon={
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff size={20} color="#9CA3AF" />
                    ) : (
                      <Eye size={20} color="#9CA3AF" />
                    )}
                  </Pressable>
                }
                textContentType="password"
                autoComplete="password"
              />
            </View>

            {/* Remember Me + Forgot Password row */}
            <View className="flex-row justify-between items-center mt-5 mb-6">
              {/* Remember Me checkbox (local state only — no persistence to storage yet) */}
              <View className="flex-row items-center gap-2">
                <Pressable
                  onPress={() => setRememberMe(!rememberMe)}
                  className={`w-5 h-5 rounded border items-center justify-center ${
                    rememberMe
                      ? 'bg-[#785928] border-[#785928]'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {rememberMe ? <Check size={14} color="#FFFFFF" /> : null}
                </Pressable>
                <Text className="text-gray-600 text-sm">Remember Me</Text>
              </View>

              {/* Forgot Password link — route already exists at (auth)/forgot-password */}
              <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
                <Text className="text-[#785928] text-sm font-bold">Forgot Password?</Text>
              </Pressable>
            </View>

            {/* Sign In button */}
            <Button
              label="SIGN IN"
              onPress={handleSignIn}
              variant="primary"
              rightIcon={<ArrowRight size={18} color="#FFFFFF" />}
            />

            {/* Spacer pushes footer to bottom when content is short */}
            <View className="flex-1" />

            {/* Footer link — route already exists at (auth)/register */}
            <View className="flex-row justify-center items-center gap-1 mt-8 pb-4">
              <Text className="text-gray-500 text-sm">{"Don't have an account?"}</Text>
              <Pressable onPress={() => router.push('/(auth)/register')}>
                <Text className="text-[#785928] font-bold text-sm">Create Account</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
