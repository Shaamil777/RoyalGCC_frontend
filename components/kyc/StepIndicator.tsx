import { AppColors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Step {
    label: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
}

/**
 * Two-step progress indicator with gold active/completed underline.
 * Steps before the current step are shown as completed (gold line).
 */
export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
    return (
        <View style={styles.container}>
            {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                const isHighlighted = isActive || isCompleted;
                return (
                    <View key={index} style={styles.step}>
                        <View
                            style={[
                                styles.line,
                                isHighlighted ? styles.lineActive : styles.lineInactive,
                            ]}
                        />
                        <Text
                            style={[
                                styles.label,
                                isHighlighted ? styles.labelActive : styles.labelInactive,
                            ]}
                        >
                            {step.label}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    step: {
        flex: 1,
        gap: 8,
    },
    line: {
        height: 3,
        borderRadius: 2,
    },
    lineActive: {
        backgroundColor: AppColors.gold,
    },
    lineInactive: {
        backgroundColor: AppColors.borderDefault,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
    },
    labelActive: {
        color: AppColors.gold,
    },
    labelInactive: {
        color: AppColors.textSecondary,
    },
});
