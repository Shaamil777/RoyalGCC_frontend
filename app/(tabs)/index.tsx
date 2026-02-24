import { AppColors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { getBalance } from '@/services/wallet';
import { getRate } from '@/services/exchange';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// format in indian numbering (e.g. 1,14,108.13)
function formatINR(amount: number): string {
    const [intPart, decPart] = amount.toFixed(2).split('.');
    // Indian grouping: last 3 digits, then groups of 2
    let result = '';
    const len = intPart.length;
    if (len <= 3) {
        result = intPart;
    } else {
        result = intPart.slice(len - 3);
        let remaining = intPart.slice(0, len - 3);
        while (remaining.length > 2) {
            result = remaining.slice(remaining.length - 2) + ',' + result;
            remaining = remaining.slice(0, remaining.length - 2);
        }
        if (remaining.length > 0) {
            result = remaining + ',' + result;
        }
    }
    return `₹${result}.${decPart}`;
}

export default function HomeScreen() {
    const { user } = useAuth();
    const [usdtBalance, setUsdtBalance] = useState<number>(0);
    const [usdtInrRate, setUsdtInrRate] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string>('--');
    const [balanceVisible, setBalanceVisible] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            // Fetch balance and rate in parallel
            const [balanceResult, rateResult] = await Promise.allSettled([
                getBalance(),
                getRate(),
            ]);

            if (balanceResult.status === 'fulfilled') {
                setUsdtBalance(balanceResult.value.available_balance || 0);
            }

            if (rateResult.status === 'fulfilled') {
                setUsdtInrRate(rateResult.value.rate);
            } else {
                // Fallback to CoinGecko if backend rate fails
                try {
                    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=inr');
                    const data = await res.json();
                    if (data?.tether?.inr) setUsdtInrRate(data.tether.inr);
                } catch {
                    setUsdtInrRate(91.25);
                }
            }

            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            setLastUpdated(`${hours}:${minutes}`);
        } catch (error) {
            console.warn('Failed to fetch data:', error);
            setUsdtInrRate(91.25);
            setLastUpdated('Offline');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        // Refresh every 60 seconds
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const inrBalance = usdtInrRate ? usdtBalance * usdtInrRate : 0;
    const rateDisplay = usdtInrRate ? `1 USDT = ₹${usdtInrRate.toFixed(2)} INR` : 'Loading...';
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="light" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.logoIcon}>
                            <Text style={styles.logoEmoji}>✦</Text>
                        </View>
                        <View>
                            <Text style={styles.welcomeText}>Welcome back,</Text>
                            <Text style={styles.userName}>{user?.account_holder_name || 'User'}</Text>
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
                            <Text style={styles.headerIcon}>🔔</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
                            <Text style={styles.headerIcon}>👤</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Balance Card */}
                <LinearGradient
                    colors={['#D4AF37', '#B8960C', '#8B7209']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.balanceCard}
                >
                    <View style={styles.balanceHeader}>
                        <Text style={styles.balanceLabel}>Total Balance</Text>
                        <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)} activeOpacity={0.7}>
                            <Text style={styles.eyeIcon}>{balanceVisible ? '👁' : '👁‍🗨'}</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.balanceAmount}>
                        {balanceVisible ? usdtBalance.toFixed(2) : '••••••'} <Text style={styles.balanceCurrency}>USDT</Text>
                    </Text>

                    <Text style={styles.balanceInr}>
                        {balanceVisible
                            ? (loading ? '≈ Loading...' : `≈ ${formatINR(inrBalance)}`)
                            : '≈ ••••••'}
                    </Text>

                    <View style={styles.exchangeRateBar}>
                        <View style={styles.exchangeRateLeft}>
                            <Text style={styles.trendIcon}>📈</Text>
                            <Text style={styles.exchangeRateText}>
                                {rateDisplay}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.liveBadge}
                            onPress={fetchData}
                            activeOpacity={0.7}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="rgba(0,0,0,0.6)" />
                            ) : (
                                <Text style={styles.liveText}>Live</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActionsRow}>
                    <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.7} onPress={() => router.push('/deposit' as any)}>
                        <View style={[styles.quickActionIcon, styles.depositIcon]}>
                            <Text style={styles.actionEmoji}>↓</Text>
                        </View>
                        <Text style={styles.quickActionLabel}>Deposit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.7} onPress={() => router.push('/exchange' as any)}>
                        <View style={[styles.quickActionIcon, styles.exchangeIcon]}>
                            <Text style={styles.actionEmoji}>⇄</Text>
                        </View>
                        <Text style={styles.quickActionLabel}>Exchange</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.7} onPress={() => router.push('/withdraw' as any)}>
                        <View style={[styles.quickActionIcon, styles.withdrawIcon]}>
                            <Text style={styles.actionEmojiWithdraw}>↑</Text>
                        </View>
                        <Text style={styles.quickActionLabel}>Withdraw</Text>
                    </TouchableOpacity>
                </View>

                {/* Assets */}
                <Text style={styles.sectionTitle}>Assets</Text>
                <View style={styles.assetCard}>
                    <View style={styles.assetRow}>
                        <View style={styles.assetLeft}>
                            <View style={styles.assetIcon}>
                                <Text style={styles.assetEmoji}>₮</Text>
                            </View>
                            <View>
                                <Text style={styles.assetName}>USDT</Text>
                                <Text style={styles.assetNetwork}>TRC20</Text>
                            </View>
                        </View>
                        <View style={styles.assetRight}>
                            <Text style={styles.assetBalance}>
                                {balanceVisible ? usdtBalance.toFixed(2) : '••••••'}
                            </Text>
                            <Text style={styles.assetInr}>
                                {balanceVisible
                                    ? (loading ? '≈ ...' : `≈ ${formatINR(inrBalance)}`)
                                    : '≈ ••••••'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Network Info Bar */}
                <View style={styles.networkBar}>
                    <Text style={styles.networkText}>
                        Network: <Text style={styles.networkBold}>TRC20 (Tron)</Text>
                    </Text>
                    <Text style={styles.networkText}>
                        Last updated: <Text style={styles.networkBold}>{lastUpdated}</Text>
                    </Text>
                </View>
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
        paddingBottom: 24,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: AppColors.gold,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoEmoji: {
        fontSize: 20,
        color: '#000',
    },
    welcomeText: {
        fontSize: 13,
        color: AppColors.textSecondary,
        fontWeight: '400',
    },
    userName: {
        fontSize: 18,
        fontWeight: '800',
        color: AppColors.textPrimary,
        letterSpacing: -0.3,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 8,
    },
    headerIconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: AppColors.backgroundSecondary,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerIcon: {
        fontSize: 18,
    },

    // Balance Card
    balanceCard: {
        borderRadius: 20,
        padding: 24,
        marginBottom: 28,
    },
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    balanceLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: 'rgba(0, 0, 0, 0.7)',
    },
    eyeIcon: {
        fontSize: 18,
        opacity: 0.6,
    },
    balanceAmount: {
        fontSize: 38,
        fontWeight: '900',
        color: '#000',
        letterSpacing: -1,
        marginBottom: 4,
    },
    balanceCurrency: {
        fontSize: 20,
        fontWeight: '600',
        color: 'rgba(0, 0, 0, 0.6)',
    },
    balanceInr: {
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.5)',
        fontWeight: '500',
        marginBottom: 16,
    },
    exchangeRateBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    exchangeRateLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    trendIcon: {
        fontSize: 14,
    },
    exchangeRateText: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(0, 0, 0, 0.75)',
    },
    liveBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    liveText: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(0, 0, 0, 0.6)',
    },

    // Section Title
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: AppColors.textPrimary,
        marginBottom: 16,
        letterSpacing: -0.2,
    },

    // Quick Actions
    quickActionsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 28,
    },
    quickActionCard: {
        flex: 1,
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        paddingVertical: 20,
        alignItems: 'center',
        gap: 12,
    },
    quickActionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    depositIcon: {
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
    },
    exchangeIcon: {
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
    },
    withdrawIcon: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
    },
    actionEmoji: {
        fontSize: 22,
        color: '#22C55E',
        fontWeight: '700',
    },
    actionEmojiWithdraw: {
        fontSize: 22,
        color: '#EF4444',
        fontWeight: '700',
    },
    quickActionLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: AppColors.textPrimary,
    },

    // Assets
    assetCard: {
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        padding: 18,
        marginBottom: 12,
    },
    assetRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    assetLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    assetIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(38, 166, 154, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    assetEmoji: {
        fontSize: 22,
        color: '#26A69A',
        fontWeight: '700',
    },
    assetName: {
        fontSize: 16,
        fontWeight: '700',
        color: AppColors.textPrimary,
    },
    assetNetwork: {
        fontSize: 13,
        color: AppColors.textSecondary,
        fontWeight: '400',
        marginTop: 2,
    },
    assetRight: {
        alignItems: 'flex-end',
    },
    assetBalance: {
        fontSize: 18,
        fontWeight: '700',
        color: AppColors.textPrimary,
    },
    assetInr: {
        fontSize: 13,
        color: AppColors.textSecondary,
        fontWeight: '400',
        marginTop: 2,
    },

    // Network Bar
    networkBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    networkText: {
        fontSize: 12,
        color: AppColors.textSecondary,
        fontWeight: '400',
    },
    networkBold: {
        fontWeight: '700',
        color: AppColors.textPrimary,
    },
});
