import { FormInput, StepIndicator } from '@/components/kyc';
import { AppColors } from '@/constants/colors';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
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

/**
 * Formats a Date object into DD-MM-YYYY string.
 */
function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

export default function KycScreen() {
    const [currentStep, setCurrentStep] = useState(0);
    const [fullName, setFullName] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [address, setAddress] = useState('');

    const dateOfBirthText = selectedDate ? formatDate(selectedDate) : '';

    const isFormValid = fullName.trim().length > 0 && selectedDate !== null && address.trim().length > 0;

    const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (event.type === 'set' && date) {
            setSelectedDate(date);
        }
    };

    const handleDatePress = () => {
        Keyboard.dismiss();
        setShowDatePicker(true);
    };

    const handleContinue = () => {
        if (!isFormValid) {
            Alert.alert('Incomplete', 'Please fill in all fields to continue.');
            return;
        }

        // Navigate to Documents step
        router.push('/kyc-documents');
    };

    // Max date = today (user must be born in the past)
    const maxDate = new Date();
    // Min date = 120 years ago
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 120);

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
                                value={dateOfBirthText}
                                placeholder="dd-mm-yyyy"
                                editable={false}
                                onPress={handleDatePress}
                                rightIcon={
                                    <Text style={styles.calendarIcon}>📅</Text>
                                }
                            />

                            {/* Date Picker - iOS inline or Android dialog */}
                            {showDatePicker && (
                                <View>
                                    <DateTimePicker
                                        value={selectedDate || new Date(2000, 0, 1)}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={handleDateChange}
                                        maximumDate={maxDate}
                                        minimumDate={minDate}
                                        themeVariant="dark"
                                    />
                                    {Platform.OS === 'ios' && (
                                        <TouchableOpacity
                                            style={styles.datePickerDone}
                                            onPress={() => setShowDatePicker(false)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.datePickerDoneText}>Done</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}

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
    datePickerDone: {
        alignSelf: 'flex-end',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 4,
    },
    datePickerDoneText: {
        color: AppColors.gold,
        fontSize: 16,
        fontWeight: '600',
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
