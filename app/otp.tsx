import { OtpInput, ResendTimer } from '@/components/auth';
import { AppColors } from '@/constants/colors';
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

    const handleOtpChange = (value: string) => {
        setOtp(value);

        // Auto-verify when all 6 digits are entered
        if (value.length === 6) {
            handleVerify(value);
        }
    };

    const handleVerify = async (otpValue: string) => {
        try {
            // TODO: Integrate with backend OTP verification API
            console.log(`Verifying OTP: ${otpValue} for phone: ${phone}`);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // Navigate to KYC screen after successful verification
            router.replace('/kyc');
        } catch (error) {
            Alert.alert('Error', 'Invalid OTP. Please try again.');
            setOtp('');
        }
    };

    const handleResend = () => {
        // TODO: Integrate with backend resend OTP API
        console.log(`Resending OTP to ${phone}`);
        Alert.alert('OTP Sent', `A new OTP has been sent to ${phone}`);
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

                        {/* Demo Hint */}
                        <View style={styles.hintBox}>
                            <Text style={styles.hintText}>
                                💡 For demo: Use any 6-digit code or{' '}
                                <Text style={styles.hintHighlight}>123456</Text>
                            </Text>
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
