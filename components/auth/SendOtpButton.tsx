import { AppColors } from '@/constants/colors';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';

interface SendOtpButtonProps {
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
}

/**
 * Gold-themed "Send OTP" button with loading state.
 */
export function SendOtpButton({
    onPress,
    disabled = false,
    loading = false,
}: SendOtpButtonProps) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                disabled && styles.buttonDisabled,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={AppColors.textPrimary} size="small" />
            ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: AppColors.gold,
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        backgroundColor: AppColors.goldDark,
        opacity: 0.6,
    },
    buttonText: {
        color: AppColors.textPrimary,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});
