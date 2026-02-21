import { AppColors } from '@/constants/colors';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const USDT_BALANCE = 1250.50;
const QUICK_AMOUNTS = [5000, 10000, 25000];

export default function ExchangeScreen() {
    const [inrAmount, setInrAmount] = useState('');
    const [usdtAmount, setUsdtAmount] = useState('');
    const [rate, setRate] = useState<number>(91.25);
    const [rateLoading, setRateLoading] = useState(true);
    const [txnPassword, setTxnPassword] = useState('');

    // Fetch live rate
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(
                    'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=inr'
                );
                const data = await res.json();
                if (data?.tether?.inr) setRate(data.tether.inr);
            } catch {
                // keep fallback
            } finally {
                setRateLoading(false);
            }
        })();
    }, []);

    const handleInrChange = useCallback(
        (val: string) => {
            setInrAmount(val);
            const num = parseFloat(val);
            if (!isNaN(num) && rate > 0) {
                setUsdtAmount((num / rate).toFixed(2));
            } else {
                setUsdtAmount('');
            }
        },
        [rate]
    );

    const handleQuickAmount = useCallback(
        (amount: number) => {
            handleInrChange(String(amount));
        },
        [handleInrChange]
    );

    const parsedInr = parseFloat(inrAmount) || 0;
    const parsedUsdt = parseFloat(usdtAmount) || 0;

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
                        <Text style={styles.title}>Exchange</Text>
                        <Text style={styles.subtitle}>Convert USDT to INR</Text>
                    </View>
                </View>

                {/* Current Rate */}
                <View style={styles.rateCard}>
                    <View>
                        <Text style={styles.rateLabel}>Current Rate</Text>
                        <Text style={styles.rateValue}>₹{rate.toFixed(2)}</Text>
                    </View>
                    <View style={styles.rateRight}>
                        <Text style={styles.ratePerUnit}>Per USDT</Text>
                        <View style={styles.liveBadge}>
                            <Text style={styles.liveText}>{rateLoading ? '...' : 'Live'}</Text>
                        </View>
                    </View>
                </View>

                {/* Available Balance */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Available Balance</Text>
                    <Text style={styles.balanceValue}>{USDT_BALANCE.toFixed(2)} USDT</Text>
                </View>

                {/* You Receive (INR) */}
                <Text style={styles.fieldLabel}>You Receive (INR)</Text>
                <View style={styles.inputCard}>
                    <Text style={styles.currencySymbol}>₹</Text>
                    <TextInput
                        style={styles.amountInput}
                        placeholder="0.00"
                        placeholderTextColor={AppColors.textMuted}
                        keyboardType="decimal-pad"
                        value={inrAmount}
                        onChangeText={handleInrChange}
                    />
                </View>
                <View style={styles.quickAmountsRow}>
                    <Text style={styles.quickLabel}>Quick amounts:</Text>
                    {QUICK_AMOUNTS.map((amt) => (
                        <TouchableOpacity key={amt} onPress={() => handleQuickAmount(amt)} activeOpacity={0.7}>
                            <Text style={styles.quickAmountText}>₹{amt.toLocaleString()}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Swap Arrow */}
                <View style={styles.swapRow}>
                    <View style={styles.swapCircle}>
                        <Text style={styles.swapIcon}>⇅</Text>
                    </View>
                </View>

                {/* You Pay (USDT) */}
                <Text style={styles.fieldLabel}>You Pay (USDT)</Text>
                <View style={styles.inputCard}>
                    <TextInput
                        style={[styles.amountInput, { flex: 1 }]}
                        placeholder="0.00"
                        placeholderTextColor={AppColors.textMuted}
                        keyboardType="decimal-pad"
                        value={usdtAmount}
                        editable={false}
                    />
                    <Text style={styles.currencyTag}>USDT</Text>
                </View>

                {/* Fee Breakdown */}
                <View style={styles.feeCard}>
                    <View style={styles.feeHeader}>
                        <Text style={styles.feeHeaderIcon}>ⓘ</Text>
                        <Text style={styles.feeHeaderText}>Fee Breakdown</Text>
                    </View>
                    <FeeRow label="Exchange Rate" value={`₹${rate.toFixed(2)}/USDT`} />
                    <FeeRow label="Service Fee" value="₹0.00" />
                    <FeeRow label="You'll Receive" value={`₹${parsedInr.toFixed(2)}`} valueColor="#22C55E" last />
                </View>

                {/* Bank Account */}
                <View style={styles.bankSectionHeader}>
                    <Text style={styles.fieldLabel}>Receive to Bank Account</Text>
                    <TouchableOpacity activeOpacity={0.7}>
                        <Text style={styles.addNewText}>+ Add New</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.selectCard}>
                    <Text style={styles.selectText}>Select bank account</Text>
                    <Text style={styles.selectArrow}>▾</Text>
                </View>

                {/* Transaction Password */}
                <Text style={styles.fieldLabel}>Transaction Password</Text>
                <View style={styles.inputCard}>
                    <Text style={styles.lockIcon}>🔒</Text>
                    <TextInput
                        style={[styles.amountInput, { flex: 1 }]}
                        placeholder="Enter transaction password"
                        placeholderTextColor={AppColors.textMuted}
                        secureTextEntry
                        value={txnPassword}
                        onChangeText={setTxnPassword}
                    />
                </View>

                {/* Confirm */}
                <TouchableOpacity style={styles.confirmButton} activeOpacity={0.8}>
                    <Text style={styles.confirmText}>Confirm Exchange</Text>
                </TouchableOpacity>

                {/* Footer Note */}
                <View style={styles.footerNote}>
                    <Text style={styles.footerIcon}>💡</Text>
                    <Text style={styles.footerText}>
                        Funds will be transferred to your bank account within 5-10 minutes after confirmation
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function FeeRow({ label, value, valueColor, last }: { label: string; value: string; valueColor?: string; last?: boolean }) {
    return (
        <View style={[styles.feeRow, !last && styles.feeRowBorder]}>
            <Text style={styles.feeLabel}>{label}</Text>
            <Text style={[styles.feeValue, valueColor ? { color: valueColor } : null]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: AppColors.backgroundPrimary,
    },
    scrollView: { flex: 1 },
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
    backArrow: { color: AppColors.textPrimary, fontSize: 24 },
    title: { fontSize: 24, fontWeight: '800', color: AppColors.textPrimary, letterSpacing: -0.3 },
    subtitle: { fontSize: 13, color: AppColors.textSecondary, marginTop: 2 },

    // Rate
    rateCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        paddingHorizontal: 18,
        paddingVertical: 16,
        marginBottom: 12,
    },
    rateLabel: { fontSize: 13, color: AppColors.textSecondary },
    rateValue: { fontSize: 26, fontWeight: '800', color: AppColors.textPrimary, marginTop: 2 },
    rateRight: { alignItems: 'flex-end', gap: 8 },
    ratePerUnit: { fontSize: 13, color: AppColors.textSecondary },
    liveBadge: {
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    liveText: { fontSize: 12, fontWeight: '600', color: '#22C55E' },

    // Balance
    balanceCard: {
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        paddingHorizontal: 18,
        paddingVertical: 14,
        marginBottom: 20,
    },
    balanceLabel: { fontSize: 13, color: AppColors.textSecondary, marginBottom: 4 },
    balanceValue: { fontSize: 20, fontWeight: '800', color: AppColors.textPrimary },

    // Fields
    fieldLabel: { fontSize: 14, fontWeight: '600', color: AppColors.textSecondary, marginBottom: 8 },
    inputCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        paddingHorizontal: 16,
        paddingVertical: 4,
        marginBottom: 8,
    },
    currencySymbol: { fontSize: 24, fontWeight: '700', color: AppColors.textPrimary, marginRight: 8 },
    amountInput: { fontSize: 22, fontWeight: '700', color: AppColors.textPrimary, paddingVertical: 12 },
    currencyTag: { fontSize: 14, fontWeight: '600', color: AppColors.textSecondary },
    lockIcon: { fontSize: 16, marginRight: 10 },

    // Quick amounts
    quickAmountsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    quickLabel: { fontSize: 12, color: AppColors.textMuted },
    quickAmountText: { fontSize: 13, fontWeight: '600', color: AppColors.gold },

    // Swap
    swapRow: { alignItems: 'center', marginBottom: 16 },
    swapCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: AppColors.backgroundSecondary,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        alignItems: 'center',
        justifyContent: 'center',
    },
    swapIcon: { fontSize: 18, color: AppColors.textPrimary },

    // Fee
    feeCard: {
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        paddingHorizontal: 16,
        paddingTop: 14,
        marginTop: 12,
        marginBottom: 20,
    },
    feeHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
    feeHeaderIcon: { fontSize: 14, color: AppColors.textSecondary },
    feeHeaderText: { fontSize: 14, fontWeight: '700', color: AppColors.textPrimary },
    feeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    feeRowBorder: { borderBottomWidth: 1, borderBottomColor: AppColors.borderDefault },
    feeLabel: { fontSize: 14, color: AppColors.textSecondary },
    feeValue: { fontSize: 14, fontWeight: '600', color: AppColors.textPrimary },

    // Bank
    bankSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    addNewText: { fontSize: 13, fontWeight: '600', color: AppColors.gold },
    selectCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 20,
    },
    selectText: { fontSize: 14, color: AppColors.textMuted },
    selectArrow: { fontSize: 16, color: AppColors.textMuted },

    // Confirm
    confirmButton: {
        backgroundColor: AppColors.gold,
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    confirmText: { fontSize: 16, fontWeight: '700', color: '#000' },

    // Footer
    footerNote: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        paddingHorizontal: 14,
        paddingVertical: 14,
    },
    footerIcon: { fontSize: 14 },
    footerText: { fontSize: 13, color: AppColors.textSecondary, lineHeight: 20, flex: 1 },
});
