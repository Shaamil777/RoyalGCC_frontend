import { AppColors } from '@/constants/colors';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DEPOSIT_ADDRESS = 'TXh4KVqJR8Zn9YmPzQwKfL3tUcBdMx7Swe';
const EXPIRY_SECONDS = 30 * 60; // 30 minutes

export default function DepositScreen() {
    const [timeLeft, setTimeLeft] = useState(EXPIRY_SECONDS);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    const progress = timeLeft / EXPIRY_SECONDS;

    const handleCopyAddress = useCallback(async () => {
        await Clipboard.setStringAsync(DEPOSIT_ADDRESS);
        Alert.alert('Copied!', 'Deposit address copied to clipboard.');
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="light" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.title}>Deposit USDT</Text>
                        <Text style={styles.subtitle}>Receive crypto to your wallet</Text>
                    </View>
                </View>

                {/* Important Notice */}
                <View style={styles.warningBox}>
                    <View style={styles.warningHeader}>
                        <Text style={styles.warningIcon}>⚠</Text>
                        <Text style={styles.warningTitle}>Important</Text>
                    </View>
                    <Text style={styles.warningText}>
                        Send only <Text style={styles.warningBold}>USDT on TRC20</Text> network to this address. Other tokens or networks will result in permanent loss.
                    </Text>
                </View>

                {/* Timer */}
                <View style={styles.timerCard}>
                    <Text style={styles.timerLabel}>Address expires in</Text>
                    <Text style={styles.timerValue}>{minutes}:{seconds}</Text>
                </View>
                <View style={styles.timerBarBg}>
                    <View style={[styles.timerBarFill, { width: `${progress * 100}%` }]} />
                </View>

                {/* QR Code Placeholder */}
                <View style={styles.qrSection}>
                    <View style={styles.qrPlaceholder}>
                        <Text style={styles.qrPlaceholderText}>QR</Text>
                    </View>
                    <Text style={styles.qrCaption}>Scan QR code to get deposit address</Text>
                </View>

                {/* Deposit Address */}
                <Text style={styles.addressLabel}>Deposit Address (TRC20)</Text>
                <View style={styles.addressBox}>
                    <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
                        {DEPOSIT_ADDRESS}
                    </Text>
                </View>

                <TouchableOpacity style={styles.copyButton} onPress={handleCopyAddress} activeOpacity={0.8}>
                    <Text style={styles.copyIcon}>📋</Text>
                    <Text style={styles.copyText}>Copy Address</Text>
                </TouchableOpacity>

                {/* Deposit Information */}
                <Text style={styles.infoTitle}>Deposit Information</Text>
                <View style={styles.infoCard}>
                    <InfoRow label="Network" value="TRC20 (Tron)" />
                    <InfoRow label="Min. Deposit" value="10 USDT" />
                    <InfoRow label="Confirmations" value="1 block" />
                    <InfoRow label="Processing Time" value="10-15 mins" valueColor={AppColors.gold} last />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function InfoRow({ label, value, valueColor, last }: { label: string; value: string; valueColor?: string; last?: boolean }) {
    return (
        <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={[styles.infoValue, valueColor ? { color: valueColor } : null]}>{value}</Text>
        </View>
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
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 40,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 20,
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
    subtitle: {
        fontSize: 13,
        color: AppColors.textSecondary,
        marginTop: 2,
    },

    // Warning
    warningBox: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.3)',
        padding: 16,
        marginBottom: 20,
    },
    warningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    warningIcon: {
        fontSize: 16,
        color: '#F59E0B',
    },
    warningTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#F59E0B',
    },
    warningText: {
        fontSize: 13,
        color: AppColors.textSecondary,
        lineHeight: 20,
    },
    warningBold: {
        fontWeight: '700',
        color: AppColors.textPrimary,
    },

    // Timer
    timerCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 4,
    },
    timerLabel: {
        fontSize: 14,
        color: AppColors.textSecondary,
    },
    timerValue: {
        fontSize: 20,
        fontWeight: '800',
        color: AppColors.gold,
    },
    timerBarBg: {
        height: 4,
        backgroundColor: AppColors.borderDefault,
        borderRadius: 2,
        marginBottom: 24,
        overflow: 'hidden',
    },
    timerBarFill: {
        height: '100%',
        backgroundColor: AppColors.gold,
        borderRadius: 2,
    },

    // QR
    qrSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    qrPlaceholder: {
        width: 180,
        height: 180,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    qrPlaceholderText: {
        fontSize: 32,
        fontWeight: '800',
        color: '#999',
    },
    qrCaption: {
        fontSize: 13,
        color: AppColors.textSecondary,
    },

    // Address
    addressLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.textSecondary,
        marginBottom: 8,
    },
    addressBox: {
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: AppColors.gold,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 12,
    },
    addressText: {
        fontSize: 14,
        fontWeight: '500',
        color: AppColors.textPrimary,
        letterSpacing: 0.3,
    },
    copyButton: {
        backgroundColor: AppColors.gold,
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 28,
    },
    copyIcon: {
        fontSize: 16,
    },
    copyText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },

    // Info
    infoTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: AppColors.textPrimary,
        marginBottom: 12,
    },
    infoCard: {
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        paddingHorizontal: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
    },
    infoRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: AppColors.borderDefault,
    },
    infoLabel: {
        fontSize: 14,
        color: AppColors.textSecondary,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.textPrimary,
    },
});
