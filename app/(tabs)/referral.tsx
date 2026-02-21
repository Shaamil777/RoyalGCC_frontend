import { AppColors } from '@/constants/colors';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReferralScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="light" />
            <View style={styles.container}>
                <Text style={styles.title}>Referral Program</Text>
                <View style={styles.card}>
                    <Text style={styles.cardIcon}>🎁</Text>
                    <Text style={styles.cardTitle}>Invite Friends & Earn</Text>
                    <Text style={styles.cardSubtitle}>
                        Share your referral code and earn rewards when your friends sign up and start trading.
                    </Text>

                    <View style={styles.codeBox}>
                        <Text style={styles.codeLabel}>Your Referral Code</Text>
                        <Text style={styles.codeText}>ROYAL12345</Text>
                    </View>

                    <TouchableOpacity style={styles.shareButton} activeOpacity={0.8}>
                        <Text style={styles.shareButtonText}>Share Code</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: AppColors.backgroundPrimary,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: AppColors.textPrimary,
        letterSpacing: -0.3,
        marginBottom: 24,
    },
    card: {
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        padding: 28,
        alignItems: 'center',
    },
    cardIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: AppColors.textPrimary,
        marginBottom: 8,
    },
    cardSubtitle: {
        fontSize: 14,
        color: AppColors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    codeBox: {
        width: '100%',
        backgroundColor: AppColors.backgroundPrimary,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        padding: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    codeLabel: {
        fontSize: 12,
        color: AppColors.textSecondary,
        fontWeight: '500',
        marginBottom: 6,
    },
    codeText: {
        fontSize: 22,
        fontWeight: '800',
        color: AppColors.gold,
        letterSpacing: 2,
    },
    shareButton: {
        width: '100%',
        backgroundColor: AppColors.gold,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    shareButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
});
