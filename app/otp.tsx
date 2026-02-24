import { OtpInput, ResendTimer } from '@/components/auth';
import { AppColors } from '@/constants/colors';
import { login, sendOtp } from '@/services/auth';
import { ApiError } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OtpScreen() {
    const { phone } = useLocalSearchParams<{ phone: string }>();
    const [otp, setOtp] = useState('');
    const { setUser } = useAuth();

    const handleOtpChange = (value: string) => {
        setOtp(value);

        // Auto-verify when all 6 digits are entered
        if (value.length === 6) {
            handleVerify(value);
        }
    };

    const handleVerify = async (otpValue: string) => {
        try {
            // Use the phone number as the accountNumber for login
            const result = await login(phone || '', otpValue);
            setUser(result.user);

            // Navigate based on KYC status
            if (result.user.kyc_status === 'not_submitted') {
                router.replace('/kyc');
            } else if (result.user.kyc_status === 'pending') {
                router.replace('/verification-pending');
            } else {
                router.replace('/(tabs)');
            }
        } catch (error) {
            const message = error instanceof ApiError ? error.message : 'Invalid OTP. Please try again.';
            Alert.alert('Error', message);
            setOtp('');
        }
    };

    const handleResend = async () => {
        try {
            await sendOtp(phone || '');
            Alert.alert('OTP Sent', `A new OTP has been sent to ${phone}`);
        } catch (error) {
            const message = error instanceof ApiError ? error.message : 'Failed to resend OTP.';
            Alert.alert('Error', message);
        }
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
                        {/* Back Button */}
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.backArrow}>←</Text>
                        </TouchableOpacity>

                        {/* Header */}
                        <View style={styles.headerSection}>
                            <Text style={styles.title}>Enter OTP</Text>
                            <Text style={styles.subtitle}>
                                We've sent a 6-digit code to
                            </Text>
                            <Text style={styles.phoneNumber}>{phone}</Text>
                        </View>

                        {/* OTP Input */}
                        <View style={styles.otpSection}>
                            <OtpInput
                                value={otp}
                                onChange={handleOtpChange}
                                length={6}
                            />
                        </View>

                        {/* Resend Timer */}
                        <ResendTimer duration={30} onResend={handleResend} />


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
    backButton: {
        marginTop: 8,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backArrow: {
        color: AppColors.textPrimary,
        fontSize: 24,
    },
    headerSection: {
        marginTop: 20,
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: AppColors.textPrimary,
        letterSpacing: -0.3,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 15,
        color: AppColors.textSecondary,
    },
    phoneNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: AppColors.textPrimary,
        marginTop: 4,
    },
    otpSection: {
        marginBottom: 24,
    },
    hintBox: {
        marginTop: 16,
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    hintText: {
        color: AppColors.textSecondary,
        fontSize: 13,
        textAlign: 'center',
    },
    hintHighlight: {
        color: AppColors.gold,
        fontWeight: '700',
    },
});
