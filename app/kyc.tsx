import { FormInput, StepIndicator } from '@/components/kyc';
import { AppColors } from '@/constants/colors';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const KYC_STEPS = [
    { label: 'Personal Info' },
    { label: 'Documents' },
];

export default function KycScreen() {
    const [currentStep, setCurrentStep] = useState(0);
    const [fullName, setFullName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [address, setAddress] = useState('');

    const isFormValid = fullName.trim().length > 0 && dateOfBirth.trim().length > 0 && address.trim().length > 0;

    const handleDatePress = () => {
        // TODO: Show native date picker
        // For now, allow manual text input
        Alert.alert('Date Picker', 'Native date picker will be integrated here.');
    };

    const handleContinue = () => {
        if (!isFormValid) {
            Alert.alert('Incomplete', 'Please fill in all fields to continue.');
            return;
        }

        // Navigate to Documents step
        router.push('/kyc-documents');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Title */}
                        <Text style={styles.title}>KYC Verification</Text>

                        {/* Step Indicator */}
                        <StepIndicator steps={KYC_STEPS} currentStep={currentStep} />

                        {/* Form Fields */}
                        <View style={styles.formSection}>
                            <FormInput
                                label="Full Legal Name"
                                value={fullName}
                                onChangeText={setFullName}
                                placeholder="Enter your full name"
                            />

                            <FormInput
                                label="Date of Birth"
                                value={dateOfBirth}
                                onChangeText={setDateOfBirth}
                                placeholder="dd-mm-yyyy"
                                rightIcon={
                                    <Text style={styles.calendarIcon}>📅</Text>
                                }
                            />

                            <FormInput
                                label="Address"
                                value={address}
                                onChangeText={setAddress}
                                placeholder="Enter your full address"
                                multiline
                            />
                        </View>

                        {/* Continue Button */}
                        <TouchableOpacity
                            style={[
                                styles.continueButton,
                                !isFormValid && styles.continueButtonDisabled,
                            ]}
                            onPress={handleContinue}
                            disabled={!isFormValid}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.continueButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </ScrollView>
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: AppColors.textPrimary,
        letterSpacing: -0.3,
        marginBottom: 20,
    },
    formSection: {
        gap: 24,
        marginTop: 24,
    },
    calendarIcon: {
        fontSize: 18,
    },
    continueButton: {
        backgroundColor: AppColors.gold,
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 32,
    },
    continueButtonDisabled: {
        backgroundColor: AppColors.goldDark,
        opacity: 0.6,
    },
    continueButtonText: {
        color: AppColors.textPrimary,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});
