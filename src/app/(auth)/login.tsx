import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { TextInput } from '../../components/ui/TextInput';
import { Button } from '../../components/ui/Button';
import { AuthHeader } from '../../components/auth/AuthHeader';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg('');
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/(tabs)' as any);
    } catch (error: any) {
      let message = "Login failed. Please try again.";
      if (error.code === 'auth/invalid-credential' || error?.message?.includes('invalid-credential')) {
        message = "Incorrect email or password.";
      } else if (error.code === 'auth/invalid-email' || error?.message?.includes('invalid-email')) {
        message = "Please enter a valid email address.";
      } else if (error.code === 'auth/network-request-failed' || error?.message?.includes('network')) {
        message = "Please check your internet connection.";
      }
      
      // WARNING: Use the exact state setter name that exists in this file (e.g., setErrorMsg or setErrorMessage)
      setErrorMsg(message); 
    } finally {
      setIsLoading(false);
    }
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
                onChangeText={(text) => {
                  setEmail(text);
                  if (errorMsg) setErrorMsg('');
                }}
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
                onChangeText={(text) => {
                  setPassword(text);
                  if (errorMsg) setErrorMsg('');
                }}
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

            {/* Inline Error Message */}
            {errorMsg ? (
              <Text className="text-red-500 text-sm mb-4">{errorMsg}</Text>
            ) : null}

            {/* Sign In button */}
            <Button
              label={isLoading ? '' : 'SIGN IN'}
              loading={isLoading}
              onPress={handleSignIn}
              disabled={isLoading}
              variant="primary"
              rightIcon={!isLoading ? <ArrowRight size={18} color="#FFFFFF" /> : undefined}
            />

            {/* Footer link — route already exists at (auth)/register */}
            <Text className="text-center text-gray-500 text-sm mt-6">
              {"Don't have an account? "}
              <Text
                className="text-[#785928] font-bold"
                onPress={() => router.push('/(auth)/register')}
              >
                Create Account
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
