import { AppColors } from '@/constants/colors';
import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface FormInputProps {
    label: string;
    value: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    multiline?: boolean;
    editable?: boolean;
    onPress?: () => void;
    rightIcon?: React.ReactNode;
}

// supports text, multiline, and tappable (date picker) modes
export function FormInput({
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    editable = true,
    onPress,
    rightIcon,
}: FormInputProps) {
    const inputContent = (
        <View style={[styles.inputContainer, multiline && styles.inputMultiline]}>
            <TextInput
                style={[styles.input, multiline && styles.textMultiline]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={AppColors.textMuted}
                multiline={multiline}
                editable={editable && !onPress}
                selectionColor={AppColors.gold}
                cursorColor={AppColors.gold}
                textAlignVertical={multiline ? 'top' : 'center'}
            />
            {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
        </View>
    );

    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.label}>{label}</Text>
            {onPress ? (
                <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                    {inputContent}
                </TouchableOpacity>
            ) : (
                inputContent
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    fieldContainer: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.textSecondary,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppColors.backgroundSecondary,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    inputMultiline: {
        minHeight: 100,
        alignItems: 'flex-start',
        paddingVertical: 14,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: AppColors.textPrimary,
        fontWeight: '400',
        padding: 0,
    },
    textMultiline: {
        minHeight: 70,
    },
    iconContainer: {
        marginLeft: 10,
    },
});
