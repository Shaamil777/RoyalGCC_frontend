import { AppColors } from '@/constants/colors';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ResendTimerProps {
    duration?: number;
    onResend: () => void;
}

/**
 * Resend OTP countdown timer.
 * Shows "Resend OTP in Xs" while counting, then a tappable "Resend OTP" button.
 */
export function ResendTimer({ duration = 30, onResend }: ResendTimerProps) {
    const [seconds, setSeconds] = useState(duration);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (seconds <= 0) {
            setCanResend(true);
            return;
        }

        const timer = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [seconds]);

    const handleResend = useCallback(() => {
        setSeconds(duration);
        setCanResend(false);
        onResend();
    }, [duration, onResend]);

    if (canResend) {
        return (
            <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                <Text style={styles.resendActive}>Resend OTP</Text>
            </TouchableOpacity>
        );
    }

    return (
        <Text style={styles.timerText}>
            Resend OTP in <Text style={styles.timerHighlight}>{seconds}s</Text>
        </Text>
    );
}

const styles = StyleSheet.create({
    timerText: {
        color: AppColors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
    },
    timerHighlight: {
        color: AppColors.gold,
        fontWeight: '600',
    },
    resendActive: {
        color: AppColors.gold,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});
