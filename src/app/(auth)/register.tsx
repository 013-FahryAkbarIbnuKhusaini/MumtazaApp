import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native';
import { User, Phone, Mail, Lock, Check, ArrowRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TextInput } from '../../components/ui/TextInput';
import { Button } from '../../components/ui/Button';

export default function RegisterScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleRegister = async () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-12">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-center">
        <ScrollView contentContainerClassName="flex-grow justify-center py-8" keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View className="items-center">
            <Text className="font-serif text-4xl tracking-[0.2em] text-black text-center mb-8">MUMTAZA</Text>
          </View>

          <View className="items-start mb-6">
            <Text className="text-3xl font-bold text-black text-left mt-8">Create Account</Text>
            <Text className="text-gray-500 text-sm text-left mt-2">Join our exclusive world of timeless elegance.</Text>
          </View>

          {/* Form Area Container with Consistent Spacing */}
          <View className="flex-col gap-4 mt-6">
            <TextInput placeholder="Full Name" value={fullName} onChangeText={setFullName} leftIcon={<User size={20} color="#9CA3AF" />} />
            <TextInput placeholder="Phone Number" value={phone} onChangeText={setPhone} leftIcon={<Phone size={20} color="#9CA3AF" />} />
            <TextInput placeholder="Email Address" value={email} onChangeText={setEmail} leftIcon={<Mail size={20} color="#9CA3AF" />} />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry leftIcon={<Lock size={20} color="#9CA3AF" />} />
            <TextInput placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry leftIcon={<Lock size={20} color="#9CA3AF" />} />

            {/* Terms Checkbox */}
            <View className="flex-row items-center gap-2 mt-4">
              <Pressable onPress={() => setAgreedToTerms(!agreedToTerms)} className={`w-5 h-5 rounded border items-center justify-center ${agreedToTerms ? 'bg-[#785928] border-[#785928]' : 'bg-white border-gray-300'}`}>
                {agreedToTerms && <Check size={14} color="#FFFFFF" />}
              </Pressable>
              <Text className="text-gray-600 text-sm">I agree to the </Text>
              <Pressable onPress={() => setShowTermsModal(true)}><Text className="text-[#785928] text-sm font-semibold underline">Terms and Conditions</Text></Pressable>
            </View>

            {/* Register Button */}
            <Button label="REGISTER" onPress={handleRegister} variant="primary" rightIcon={<ArrowRight size={18} color="#FFFFFF" />} className="mt-6" />
          </View>

           {/* Footer Row */}
           <View className="flex-row justify-center items-center gap-1 mt-6">
             <Text className="text-gray-500 text-sm">Already have an account?</Text>
             <Pressable onPress={() => router.push('/(auth)/login')}>
               <Text className="text-[#785928] font-bold text-sm">Sign In</Text>
             </Pressable>
           </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showTermsModal} transparent animationType="fade" onRequestClose={() => setShowTermsModal(false)}>
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-h-[70%]">
            <Text className="text-xl font-bold text-black mb-3">Terms and Conditions</Text>
            <ScrollView className="mb-4">
              <Text className="text-sm text-gray-600 leading-6">
                Welcome to DINAR EMAS. By creating an account and using our services, you agree to comply with and be bound by the following terms and conditions. These terms govern your access to and use of DINAR EMAS, including any content, functionality, and services offered on or through MumtazaApp.

                Your use of DINAR EMAS is also subject to our Privacy Policy, which outlines how we collect, use, and protect your personal information. Please review our Privacy Policy carefully before using our services.

                You agree not to use MumtazaApp for any unlawful purpose or any purpose prohibited by these terms. You may not use MumtazaApp in any manner that could damage, disable, overburden, or impair the MumtazaApp server, or interfere with any other party's use and enjoyment of MumtazaApp.

                DINAR EMAS reserves the right to terminate or suspend your account and access to our services at our sole discretion, without prior notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users of MumtazaApp, us, or third parties, or for any other reason.
              </Text>
            </ScrollView>
            <Button label="I Understand" onPress={() => setShowTermsModal(false)} fullWidth />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
