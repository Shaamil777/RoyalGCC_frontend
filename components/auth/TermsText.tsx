import { AppColors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

interface TermsTextProps {
    onTermsPress?: () => void;
    onPrivacyPress?: () => void;
}

/**
 * Terms of Service and Privacy Policy footer text.
 */
export function TermsText({ onTermsPress, onPrivacyPress }: TermsTextProps) {
    return (
        <Text style={styles.container}>
            By continuing, you agree to our{' '}
            <Text style={styles.link} onPress={onTermsPress}>
                Terms of Service
            </Text>{' '}
            and{' '}
            <Text style={styles.link} onPress={onPrivacyPress}>
                Privacy Policy
            </Text>
        </Text>
    );
}

const styles = StyleSheet.create({
    container: {
        color: AppColors.textSecondary,
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    link: {
        color: AppColors.textLink,
        textDecorationLine: 'underline',
    },
});
