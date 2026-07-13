import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react-native';
import { TextInput } from '../../components/ui/TextInput';
import { Button } from '../../components/ui/Button';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-12">
      {/* Logo */}
      <Text className="font-serif text-4xl tracking-[0.2em] text-black text-center mb-8">MUMTAZA</Text>

      {/* Title block */}
      <Text className="text-3xl font-bold text-black text-left mt-8">Welcome Back</Text>
      <Text className="text-base text-gray-500 text-left mt-2">Sign in to access your exclusive collections.</Text>

      {/* Form section wrapper */}
      <View className="mt-8 gap-4">
        {/* Email TextInput */}
        <TextInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          leftIcon={<Mail size={20} color="#9CA3AF" />}
          keyboardType="email-address"
        />

        {/* Password TextInput */}
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
        />
      </View>

      {/* Remember Me + Forgot Password row */}
      <View className="flex-row justify-between items-center mt-6 mb-6">
        {/* Left side: checkbox + label */}
        <View className="flex-row items-center gap-2">
          <Pressable 
            onPress={() => setRememberMe(!rememberMe)} 
            className={`w-5 h-5 rounded border items-center justify-center ${rememberMe ? 'bg-[#785928] border-[#785928]' : 'bg-white border-gray-300'}`}
          >
            {rememberMe && <Check size={14} color="#FFFFFF" />}
          </Pressable>
          <Text className="text-gray-600 text-sm">Remember Me</Text>
        </View>

        {/* Right side: Forgot Password */}
        <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
          <Text className="text-[#785928] text-sm font-medium">Forgot Password?</Text>
        </Pressable>
      </View>

      {/* Sign In button */}
      <Button label="SIGN IN" onPress={handleLogin} variant="primary" rightIcon={<ArrowRight size={18} color="#FFFFFF" />} className="mt-1" />

      {/* Footer row */}
      <View className="flex-row justify-center items-center gap-1 mt-6">
        <Text className="text-gray-500 text-sm">Don't have an account?</Text>
        <Pressable onPress={() => router.push('/(auth)/register')}>
          <Text className="text-[#785928] font-bold text-sm">Create Account</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
