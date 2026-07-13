import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { TextInput } from '../../components/ui/TextInput';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    // TODO: call supabase.auth.updateUser({ password }) here
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    setLoading(false);
    router.replace('/(auth)/login');
  };

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      {/* Logo */}
      <Text className="font-serif text-4xl tracking-[0.2em] text-black text-center mt-16 mb-8">MUMTAZA</Text>

      {/* Title */}
      <Text className="text-2xl font-bold text-black text-left mt-8">Set New Password</Text>

      {/* Subtitle */}
      <Text className="text-sm text-gray-500 text-left mt-2">Choose a strong password to secure your account.</Text>

      {/* Form section */}
      <View className="mt-8 gap-4">
        <TextInput
          placeholder="New Password"
          value={password}
          onChangeText={(t) => { setPassword(t); setError(''); }}
          secureTextEntry={!showPassword}
          leftIcon={<Lock size={20} color="#9CA3AF" />}
          rightIcon={
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
            </Pressable>
          }
        />
        <TextInput
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChangeText={(t) => { setConfirmPassword(t); setError(''); }}
          secureTextEntry={!showConfirmPassword}
          leftIcon={<Lock size={20} color="#9CA3AF" />}
          rightIcon={
            <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
            </Pressable>
          }
        />
        {error ? <Text className="text-red-500 text-xs mt-2">{error}</Text> : null}
      </View>

      {/* Action button */}
      <View className="mt-6">
        <Button
          label={loading ? 'UPDATING...' : 'RESET PASSWORD'}
          disabled={loading}
          rightIcon={<ArrowRight size={18} color="#FFFFFF" />}
          onPress={handleReset}
        />
      </View>
    </View>
  );
}
