import { AppColors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DocumentUploadProps {
    label: string;
    buttonText: string;
    onPress: () => void;
    fileName?: string | null;
}

// dashed upload box, shows filename when selected
export function DocumentUpload({
    label,
    buttonText,
    onPress,
    fileName,
}: DocumentUploadProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={styles.uploadBox}
                onPress={onPress}
                activeOpacity={0.7}
            >
                {fileName ? (
                    <View style={styles.fileInfo}>
                        <Text style={styles.checkIcon}>✅</Text>
                        <Text style={styles.fileName} numberOfLines={1}>
                            {fileName}
                        </Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.iconContainer}>
                            <Text style={styles.uploadIcon}>⬆</Text>
                        </View>
                        <Text style={styles.uploadText}>{buttonText}</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.textSecondary,
    },
    uploadBox: {
        borderWidth: 1.5,
        borderColor: AppColors.borderDefault,
        borderStyle: 'dashed',
        borderRadius: 12,
        paddingVertical: 28,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: AppColors.backgroundSecondary,
        gap: 8,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1.5,
        borderColor: AppColors.borderDefault,
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadIcon: {
        fontSize: 18,
        color: AppColors.textSecondary,
    },
    uploadText: {
        fontSize: 14,
        fontWeight: '500',
        color: AppColors.textSecondary,
    },
    fileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    checkIcon: {
        fontSize: 18,
    },
    fileName: {
        fontSize: 14,
        color: AppColors.textPrimary,
        fontWeight: '500',
        flex: 1,
    },
});
