import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput as RNTextInput, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { ArrowRight } from 'lucide-react-native';

// Destructure email from local search parameters
const { email } = useLocalSearchParams<{ email: string }>();
const router = useRouter();

export default function VerifyOtpScreen() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<RNTextInput | null>>([]);

useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (timer > 0) {
      timeout = setTimeout(() => setTimer(timer - 1), 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [timer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleResend = async () => {
    // Call supabase.auth.resetPasswordForEmail(email)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    
    setTimer(60);
    setCanResend(false);
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) return;

    setLoading(true);

    const { error: verifyError } = await supabase.auth.verifyOtp({ email, token: code, type: 'recovery' });
    if (verifyError) {
      setError('Invalid or expired code. Please try again.');
      setLoading(false);
      return;
    }

    setLoading(false);
    router.replace({ pathname: '/(auth)/reset-password', params: { email } });
  };

  const handleChange = (text: string, index: number) => {
    let newOtp = [...otp];

    if (text.length > 1) {
      // Handle paste
      const digits = text.replace(/[^0-9]/g, '').slice(0, 6).split('');
      
      newOtp = Array(6).fill('');
      digits.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      
      const lastFilled = Math.min(digits.length - 1, 5);
      inputRefs.current[lastFilled]?.focus();
    } else {
      // Handle single keystroke
      newOtp[index] = text;
      setOtp(newOtp);
      if (text && index < 5) inputRefs.current[index + 1]?.focus();
    }
    
    setError('');

    // Check if all filled
    if (newOtp.every(digit => digit !== '')) {
      handleVerify();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      {/* Logo */}
      <Text className="font-serif text-4xl tracking-[0.2em] text-black text-center mt-16 mb-8">MUMTAZA</Text>

      {/* Title */}
      <Text className="text-2xl font-bold text-black text-left mt-8">Enter Code</Text>

      {/* Subtitle */}
      <Text className="text-sm text-gray-500 text-left mt-2">{`We sent a 6-digit code to ${email}`}</Text>

      {/* OTP Input section */}
      <View className="mt-8 flex-row justify-between items-center px-4">
        {otp.map((digit, index) => (
          <RNTextInput
            key={index}
            ref={(ref) => { inputRefs.current[index] = ref; }}
            value={digit}
            maxLength={6}
            keyboardType="number-pad"
            className="w-12 h-14 border border-gray-300 rounded-2xl text-center text-xl font-bold text-black bg-gray-50"
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>
      {error ? <Text className="text-red-500 text-xs mt-3 text-center">{error}</Text> : null}

      {/* Resend Code Section */}
      <View className="mt-6 items-center">
        {!canResend ? (
          <Text className="text-gray-400 text-sm text-center">Resend code in {timer}s</Text>
        ) : (
          <Pressable onPress={handleResend}>
            <Text className="text-[#785928] font-bold text-sm text-center">Resend Code</Text>
          </Pressable>
        )}
      </View>

      {/* Spacer */}
      <View className="flex-1" />

      {/* Action button */}
      <View className="mt-6 mb-8">
        <Button
          label={loading ? 'VERIFYING...' : 'VERIFY CODE'}
          disabled={loading}
          onPress={handleVerify}
        />
      </View>
    </View>
  );
}
