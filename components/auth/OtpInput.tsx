import { AppColors } from '@/constants/colors';
import React, { useEffect, useRef } from 'react';
import {
    NativeSyntheticEvent,
    StyleSheet,
    TextInput,
    TextInputKeyPressEventData,
    View,
} from 'react-native';

interface OtpInputProps {
    length?: number;
    value: string;
    onChange: (otp: string) => void;
}

/**
 * 6-digit OTP input with individual styled boxes.
 * Auto-focuses next box on input, handles backspace navigation.
 */
export function OtpInput({ length = 6, value, onChange }: OtpInputProps) {
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

    useEffect(() => {
        // Auto-focus first input on mount
        setTimeout(() => {
            inputRefs.current[0]?.focus();
        }, 300);
    }, []);

    const handleChange = (text: string, index: number) => {
        // Only allow digits
        const digit = text.replace(/[^0-9]/g, '').slice(-1);
        const newDigits = [...digits];
        newDigits[index] = digit;
        const newOtp = newDigits.join('');
        onChange(newOtp);

        // Auto-focus next input
        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (
        e: NativeSyntheticEvent<TextInputKeyPressEventData>,
        index: number,
    ) => {
        if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
            // Move to previous input on backspace if current is empty
            const newDigits = [...digits];
            newDigits[index - 1] = '';
            onChange(newDigits.join(''));
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <View style={styles.container}>
            {Array.from({ length }, (_, index) => (
                <TextInput
                    key={index}
                    ref={(ref) => {
                        inputRefs.current[index] = ref;
                    }}
                    style={[
                        styles.cell,
                        digits[index] ? styles.cellFilled : null,
                    ]}
                    value={digits[index]}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectionColor={AppColors.gold}
                    cursorColor={AppColors.gold}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
    },
    cell: {
        width: 50,
        height: 56,
        borderRadius: 12,
        backgroundColor: AppColors.backgroundSecondary,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: AppColors.textPrimary,
    },
    cellFilled: {
        borderColor: AppColors.gold,
    },
});
