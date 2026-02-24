import type { CountryCode } from '@/components/auth';
import {
    CountryCodePicker,
    Logo,
    PhoneInput,
    SendOtpButton,
    TermsText,
} from '@/components/auth';
import { AppColors } from '@/constants/colors';
import { sendOtp } from '@/services/auth';
import { ApiError } from '@/services/api';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DEFAULT_COUNTRY: CountryCode = {
    code: 'IN',
    dialCode: '+91',
    flag: '🇮🇳',
};

export default function LoginScreen() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
    const [loading, setLoading] = useState(false);

    const isPhoneValid = phoneNumber.length >= 10;

    const handleSendOtp = async () => {
        if (!isPhoneValid) {
            Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
            return;
        }

        setLoading(true);
        try {
            const accountNumber = `${selectedCountry.dialCode}${phoneNumber}`;
            await sendOtp(accountNumber);
            // Navigate to OTP screen with phone number
            router.push({
                pathname: '/otp',
                params: { phone: accountNumber },
            });
        } catch (error) {
            const message = error instanceof ApiError ? error.message : 'Failed to send OTP. Please try again.';
            Alert.alert('Error', message);
        } finally {
            setLoading(false);
        }
    };

    const handleTermsPress = () => {
        // TODO: Navigate to Terms of Service
        console.log('Terms pressed');
    };

    const handlePrivacyPress = () => {
        // TODO: Navigate to Privacy Policy
        console.log('Privacy pressed');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        {/* Header Section */}
                        <View style={styles.headerSection}>
                            <Logo size={64} />
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>
                                Enter your mobile number to continue
                            </Text>
                        </View>

                        {/* Form Section */}
                        <View style={styles.formSection}>
                            <Text style={styles.label}>Mobile Number</Text>

                            <View style={styles.inputRow}>
                                <CountryCodePicker
                                    selected={selectedCountry}
                                    onSelect={setSelectedCountry}
                                />
                                <PhoneInput
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                />
                            </View>

                            <SendOtpButton
                                onPress={handleSendOtp}
                                disabled={!isPhoneValid}
                                loading={loading}
                            />

                            <TermsText
                                onTermsPress={handleTermsPress}
                                onPrivacyPress={handlePrivacyPress}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: AppColors.backgroundPrimary,
    },
    keyboardView: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    headerSection: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 48,
        gap: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: AppColors.textPrimary,
        marginTop: 16,
        letterSpacing: -0.3,
    },
    subtitle: {
        fontSize: 15,
        color: AppColors.textSecondary,
        marginTop: 4,
    },
    formSection: {
        gap: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.gold,
        marginBottom: -8,
        letterSpacing: 0.3,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 10,
    },
});
