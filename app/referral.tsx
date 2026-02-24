import { AppColors } from '@/constants/colors';
import { getReferralStats, ReferralStats } from '@/services/referral';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HOW_IT_WORKS = [
    {
        step: 1,
        title: 'Share your code',
        description: 'Share your unique referral code with friends and family',
    },
    {
        step: 2,
        title: 'They sign up',
        description: 'When they register using your code, they become your referral',
    },
    {
        step: 3,
        title: 'Earn commission',
        description: 'Earn 0.3% commission on all their exchange transactions',
    },
];

export default function ReferralScreen() {
    const [stats, setStats] = useState<ReferralStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const result = await getReferralStats();
                setStats(result);
            } catch {
                // Use empty fallback
                setStats({
                    referral_code: 'N/A',
                    total_referrals: 0,
                    total_earnings: 0,
                    commission_rate: 0.3,
                    referrals: [],
                });
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const referralCode = stats?.referral_code || 'N/A';
    const referralLink = `https://cryptoinr.app/ref/${referralCode}`;
    const referralHistory = stats?.referrals || [];

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar style="light" />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={AppColors.gold} />
                </View>
            </SafeAreaView>
        );
    }

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
                        <Text style={styles.title}>Referral Program</Text>
                        <Text style={styles.subtitle}>Earn {stats?.commission_rate || 0.3}% on every trade</Text>
                    </View>
                </View>

                {/* Total Earnings Card */}
                <View style={styles.earningsCard}>
                    <View style={styles.earningsHeader}>
                        <Text style={styles.earningsHeaderIcon}>🏆</Text>
                        <Text style={styles.earningsHeaderText}>Total Earnings</Text>
                    </View>
                    <Text style={styles.earningsAmount}>₹{(stats?.total_earnings || 0).toFixed(2)}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <View style={styles.statLabelRow}>
                                <Text style={styles.statIcon}>👥</Text>
                                <Text style={styles.statLabel}>Total Referrals</Text>
                            </View>
                            <Text style={styles.statValue}>{stats?.total_referrals || 0}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <View style={styles.statLabelRow}>
                                <Text style={styles.statIcon}>📈</Text>
                                <Text style={styles.statLabel}>Commission Rate</Text>
                            </View>
                            <Text style={styles.statValue}>{stats?.commission_rate || 0.3}%</Text>
                        </View>
                    </View>
                </View>

                {/* Your Referral Code */}
                <Text style={styles.sectionTitle}>Your Referral Code</Text>
                <View style={styles.referralCodeCard}>
                    <Text style={styles.referralCodeLabel}>Referral Code</Text>
                    <View style={styles.referralCodeRow}>
                        <Text style={styles.referralCodeText}>{referralCode}</Text>
                        <TouchableOpacity style={styles.copyButton} activeOpacity={0.7}>
                            <Text style={styles.copyIcon}>📋</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.referralLinkLabel}>Referral Link</Text>
                    <View style={styles.referralLinkBox}>
                        <Text style={styles.referralLinkText} numberOfLines={1}>
                            {referralLink}
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.shareButton} activeOpacity={0.8}>
                        <Text style={styles.shareButtonIcon}>🔗</Text>
                        <Text style={styles.shareButtonText}>Share Referral Link</Text>
                    </TouchableOpacity>
                </View>

                {/* How It Works */}
                <Text style={styles.sectionTitle}>How It Works</Text>
                <View style={styles.howItWorksCard}>
                    {HOW_IT_WORKS.map((item, index) => (
                        <View
                            key={item.step}
                            style={[
                                styles.howItWorksItem,
                                index < HOW_IT_WORKS.length - 1 && styles.howItWorksItemBorder,
                            ]}
                        >
                            <View style={styles.stepCircle}>
                                <Text style={styles.stepNumber}>{item.step}</Text>
                            </View>
                            <View style={styles.flexFill}>
                                <Text style={styles.howItWorksTitle}>{item.title}</Text>
                                <Text style={styles.howItWorksDesc}>{item.description}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Referral History */}
                <Text style={styles.sectionTitle}>Referral History</Text>
                {referralHistory.length > 0 ? (
                    referralHistory.map((item) => (
                        <View key={item.id} style={styles.historyCard}>
                            <View style={styles.historyTop}>
                                <Text style={styles.historyUser}>{item.user}</Text>
                                <View
                                    style={[
                                        styles.statusBadge,
                                        item.status === 'active'
                                            ? styles.statusActive
                                            : styles.statusInactive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.statusText,
                                            item.status === 'active'
                                                ? styles.statusTextActive
                                                : styles.statusTextInactive,
                                        ]}
                                    >
                                        {item.status}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.historyBottom}>
                                <Text style={styles.historyDate}>Joined {item.joined_date}</Text>
                                <Text
                                    style={[
                                        styles.historyEarnings,
                                        item.status === 'active'
                                            ? styles.earningsActive
                                            : styles.earningsInactive,
                                    ]}
                                >
                                    +₹{item.earnings.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.historyCard}>
                        <Text style={[styles.historyUser, { textAlign: 'center' }]}>No referrals yet</Text>
                    </View>
                )}

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
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

    // Header
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

    // Earnings Card
    earningsCard: {
        backgroundColor: AppColors.goldBg,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: AppColors.goldBorder,
        padding: 22,
        marginBottom: 24,
    },
    earningsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    earningsHeaderIcon: {
        fontSize: 16,
    },
    earningsHeaderText: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.gold,
    },
    earningsAmount: {
        fontSize: 34,
        fontWeight: '800',
        color: AppColors.textPrimary,
        marginBottom: 18,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    statBox: {
        flex: 1,
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
    },
    statLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    statIcon: {
        fontSize: 14,
    },
    statLabel: {
        fontSize: 12,
        color: AppColors.textSecondary,
        fontWeight: '500',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        color: AppColors.textPrimary,
    },

    // Section Title
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: AppColors.textSecondary,
        marginBottom: 12,
        marginTop: 4,
    },

    // Referral Code Card
    referralCodeCard: {
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        padding: 20,
        marginBottom: 24,
    },
    referralCodeLabel: {
        fontSize: 13,
        color: AppColors.textSecondary,
        fontWeight: '500',
        marginBottom: 6,
    },
    referralCodeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
    },
    referralCodeText: {
        fontSize: 24,
        fontWeight: '800',
        color: AppColors.gold,
        letterSpacing: 1.5,
    },
    copyButton: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: AppColors.backgroundPrimary,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        alignItems: 'center',
        justifyContent: 'center',
    },
    copyIcon: {
        fontSize: 16,
    },
    referralLinkLabel: {
        fontSize: 13,
        color: AppColors.textSecondary,
        fontWeight: '500',
        marginBottom: 6,
    },
    referralLinkBox: {
        backgroundColor: AppColors.backgroundPrimary,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 16,
    },
    referralLinkText: {
        fontSize: 13,
        color: AppColors.textSecondary,
        fontWeight: '500',
    },
    shareButton: {
        backgroundColor: AppColors.gold,
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    shareButtonIcon: {
        fontSize: 16,
    },
    shareButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: AppColors.textDark,
    },

    // How It Works
    howItWorksCard: {
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        overflow: 'hidden',
        marginBottom: 24,
    },
    howItWorksItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
        paddingHorizontal: 18,
        paddingVertical: 16,
    },
    howItWorksItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: AppColors.borderDefault,
    },
    stepCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: AppColors.gold,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    stepNumber: {
        fontSize: 14,
        fontWeight: '800',
        color: AppColors.textDark,
    },
    howItWorksTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: AppColors.textPrimary,
        marginBottom: 4,
    },
    howItWorksDesc: {
        fontSize: 13,
        color: AppColors.textSecondary,
        lineHeight: 19,
    },

    // Referral History
    historyCard: {
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        paddingHorizontal: 18,
        paddingVertical: 16,
        marginBottom: 10,
    },
    historyTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    historyUser: {
        fontSize: 15,
        fontWeight: '700',
        color: AppColors.textPrimary,
    },
    statusBadge: {
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    statusActive: {
        backgroundColor: AppColors.successBg,
    },
    statusInactive: {
        backgroundColor: AppColors.inactiveBg,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusTextActive: {
        color: AppColors.success,
    },
    statusTextInactive: {
        color: AppColors.textSecondary,
    },
    historyBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    historyDate: {
        fontSize: 13,
        color: AppColors.textSecondary,
    },
    historyEarnings: {
        fontSize: 15,
        fontWeight: '700',
    },
    flexFill: {
        flex: 1,
    },
    bottomSpacer: {
        height: 24,
    },
    earningsActive: {
        color: AppColors.success,
    },
    earningsInactive: {
        color: AppColors.textSecondary,
    },
});
