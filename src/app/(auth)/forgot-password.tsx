import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, ArrowRight } from 'lucide-react-native';
import { TextInput } from '../../components/ui/TextInput';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

// NOTE: This performs an email-enumeration check for UX purposes. If email-enumeration protection is a priority, remove this check and always show a generic "If this email is registered, a code has been sent" message instead.
const checkEmailExists = async (email: string) => {
  const { data } = await supabase.from('profiles').select('email').eq('email', email.toLowerCase()).maybeSingle();
  return !!data;
};

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendCode = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    // This check is for UX purposes, as Supabase's resetPasswordForEmail()
    // does not reveal whether an email exists.
    const emailExists = await checkEmailExists(trimmedEmail);

    if (!emailExists) {
      setError('No account is registered with this email.');
      setLoading(false);
      return;
    }

    // TODO: call supabase.auth.resetPasswordForEmail(trimmedEmail) here
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmedEmail);
    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push({ pathname: '/(auth)/verify-otp', params: { email: trimmedEmail } });
  };

  return (
    <View className="flex-1 bg-white px-6">
      {/* Logo */}
      <Text className="font-serif text-4xl tracking-[0.2em] text-black text-center mt-16 mb-8">MUMTAZA</Text>

      {/* Title */}
      <Text className="text-2xl font-bold text-black text-center mt-6">Reset Password</Text>

      {/* Subtitle */}
      <Text className="text-sm text-gray-500 text-left mt-2">Enter your email and we'll send a 6-digit code to reset your password.</Text>

      {/* Form section */}
      <View className="mt-8">
        <TextInput
          placeholder="Email Address"
          value={email}
          onChangeText={(text) => { setEmail(text); setError(''); }}
          leftIcon={<Mail size={20} color="#9CA3AF" />}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {error ? <Text className="text-red-500 text-xs mt-2">{error}</Text> : null}
      </View>

      {/* Action button */}
      <Button
        label={loading ? 'SENDING...' : 'SEND CODE'}
        disabled={loading}
        rightIcon={<ArrowRight size={18} color="#FFFFFF" />}
        className="mt-6"
        onPress={handleSendCode}
      />

      {/* Spacer */}
      <View className="flex-1" />

      {/* Footer */}
      <Pressable onPress={() => router.push('/(auth)/login')} className="items-center mb-8">
        <Text className="text-[#785928] font-semibold text-sm">Back to Login</Text>
      </Pressable>
    </View>
  );
}
