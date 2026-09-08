import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { TextInput } from '../../components/ui/TextInput';
import { Button } from '../../components/ui/Button';
import { AuthHeader } from '../../components/auth/AuthHeader';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignUp = async () => {
    if (!email.trim() || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg('');
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (fullName.trim()) {
        await updateProfile(userCredential.user, { displayName: fullName.trim() });
      }
      router.replace('/(tabs)' as any);
    } catch (error: any) {
      let message = "Registration failed. Please try again.";
      if (error.code === 'auth/email-already-in-use' || error?.message?.includes('email-already-in-use')) {
        message = "This email is already registered.";
      } else if (error.code === 'auth/weak-password' || error?.message?.includes('weak-password')) {
        message = "Password must be at least 6 characters.";
      } else if (error.code === 'auth/invalid-email' || error?.message?.includes('invalid-email')) {
        message = "Please enter a valid email address.";
      }
      
      // WARNING: Use the exact state setter name that exists in this file
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
            <Text className="text-2xl font-bold text-slate-900">Create Account</Text>
            <Text className="text-stone-500 mt-1">
              Join us to explore exclusive jewelry collections.
            </Text>

            {/* Form section */}
            <View className="mt-6 gap-4">
              {/* Full Name input */}
              <TextInput
                placeholder="Full Name"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (errorMsg) setErrorMsg('');
                }}
                leftIcon={<User size={20} color="#9CA3AF" />}
                autoCapitalize="words"
                textContentType="name"
                autoComplete="name"
              />

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

              {/* Confirm Password input */}
              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errorMsg) setErrorMsg('');
                }}
                secureTextEntry={!showConfirmPassword}
                leftIcon={<Lock size={20} color="#9CA3AF" />}
                rightIcon={
                  <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? (
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

            {/* Inline Error Message */}
            {errorMsg ? (
              <Text className="text-red-500 text-sm mt-4">{errorMsg}</Text>
            ) : null}

            {/* Sign Up button */}
            <View className="mt-6">
              <Button
                label={isLoading ? '' : 'SIGN UP'}
                loading={isLoading}
                onPress={handleSignUp}
                disabled={isLoading}
                variant="primary"
                rightIcon={!isLoading ? <ArrowRight size={18} color="#FFFFFF" /> : undefined}
              />
            </View>

            {/* Footer link */}
            <View className="flex-row justify-center items-center gap-1 mt-6">
              <Text className="text-gray-500 text-sm">Already have an account?</Text>
              <Pressable onPress={() => router.push('/(auth)/login')}>
                <Text className="text-[#785928] font-bold text-sm">Sign In</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
