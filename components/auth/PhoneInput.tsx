import { AppColors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

interface PhoneInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

export function PhoneInput({
    value,
    onChangeText,
    placeholder = 'Enter mobile number',
}: PhoneInputProps) {
    return (
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={AppColors.textMuted}
            keyboardType="phone-pad"
            maxLength={10}
            selectionColor={AppColors.gold}
            cursorColor={AppColors.gold}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        flex: 1,
        backgroundColor: AppColors.backgroundSecondary,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 15,
        color: AppColors.textPrimary,
        fontWeight: '400',
    },
});
