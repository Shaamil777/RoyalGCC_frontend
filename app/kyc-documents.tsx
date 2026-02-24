import { DocumentUpload, IdTypePicker, StepIndicator } from '@/components/kyc';
import { AppColors } from '@/constants/colors';
import { submitKyc } from '@/services/kyc';
import { ApiError } from '@/services/api';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const KYC_STEPS = [
    { label: 'Personal Info' },
    { label: 'Documents' },
];

export default function KycDocumentsScreen() {
    const { fullName, dateOfBirth, address } = useLocalSearchParams<{
        fullName: string;
        dateOfBirth: string;
        address: string;
    }>();

    const [idType, setIdType] = useState('Aadhaar Card');
    const [idFront, setIdFront] = useState<string | null>(null);
    const [idBack, setIdBack] = useState<string | null>(null);
    const [selfie, setSelfie] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleUpload = (
        type: 'front' | 'back' | 'selfie',
    ) => {
        // TODO: Integrate with expo-image-picker
        // For now, simulate a file selection
        const fileName = `${type}_photo_${Date.now()}.jpg`;
        switch (type) {
            case 'front':
                setIdFront(fileName);
                break;
            case 'back':
                setIdBack(fileName);
                break;
            case 'selfie':
                setSelfie(fileName);
                break;
        }
    };

    const isFormValid = idFront && idBack && selfie;

    const handleSubmit = async () => {
        if (!isFormValid) {
            Alert.alert('Incomplete', 'Please upload all required documents.');
            return;
        }

        setSubmitting(true);
        try {
            await submitKyc({
                full_name: fullName || '',
                date_of_birth: dateOfBirth || '',
                address: address || '',
                id_type: idType,
                // When image picker is integrated, pass the actual file URI here:
                // aadhaar_image: { uri: idFront, name: 'aadhaar.jpg', type: 'image/jpeg' },
            });
            // Navigate to verification pending screen
            router.replace('/verification-pending');
        } catch (error) {
            const message = error instanceof ApiError ? error.message : 'Failed to submit KYC. Please try again.';
            Alert.alert('Error', message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="light" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header with Back Button */}
                <View style={styles.headerRow}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>KYC Verification</Text>
                </View>

                {/* Step Indicator */}
                <StepIndicator steps={KYC_STEPS} currentStep={1} />

                {/* Form Fields */}
                <View style={styles.formSection}>
                    <IdTypePicker selected={idType} onSelect={setIdType} />

                    <DocumentUpload
                        label="ID Front"
                        buttonText="Upload Front Side"
                        onPress={() => handleUpload('front')}
                        fileName={idFront}
                    />

                    <DocumentUpload
                        label="ID Back"
                        buttonText="Upload Back Side"
                        onPress={() => handleUpload('back')}
                        fileName={idBack}
                    />

                    <DocumentUpload
                        label="Selfie"
                        buttonText="Upload Selfie"
                        onPress={() => handleUpload('selfie')}
                        fileName={selfie}
                    />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        !isFormValid && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={!isFormValid}
                    activeOpacity={0.8}
                >
                    <Text style={styles.submitButtonText}>Submit for Verification</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: AppColors.backgroundPrimary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 40,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    backButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backArrow: {
        color: AppColors.textPrimary,
        fontSize: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: AppColors.textPrimary,
        letterSpacing: -0.3,
    },
    formSection: {
        gap: 24,
        marginTop: 24,
    },
    submitButton: {
        backgroundColor: AppColors.gold,
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 32,
    },
    submitButtonDisabled: {
        backgroundColor: AppColors.goldDark,
        opacity: 0.6,
    },
    submitButtonText: {
        color: AppColors.textPrimary,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});
