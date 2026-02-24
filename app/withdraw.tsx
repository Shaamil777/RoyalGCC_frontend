import { AppColors } from '@/constants/colors';
import { getBalance } from '@/services/wallet';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MIN_WITHDRAWAL = 20;

export default function WithdrawScreen() {
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [txnPassword, setTxnPassword] = useState('');
    const [usdtBalance, setUsdtBalance] = useState<number>(0);

    useEffect(() => {
        (async () => {
            try {
                const result = await getBalance();
                setUsdtBalance(result.available_balance || 0);
            } catch {
                // keep 0 fallback
            }
        })();
    }, []);

    const parsedAmount = parseFloat(amount) || 0;
    const serviceFee = 0;
    const youReceive = parsedAmount > 0 ? (parsedAmount - serviceFee).toFixed(2) : '0.00';

    const handleMax = () => {
        setAmount(usdtBalance.toFixed(2));
    };

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
                        <Text style={styles.title}>Withdraw USDT</Text>
                        <Text style={styles.subtitle}>Send USDT to external wallet</Text>
                    </View>
                </View>

                {/* Important Notice */}
                <View style={styles.warningBox}>
                    <View style={styles.warningHeader}>
                        <Text style={styles.warningIcon}>ⓘ</Text>
                        <Text style={styles.warningTitle}>Important Notice</Text>
                    </View>
                    <Text style={styles.warningText}>
                        Ensure you're withdrawing to a{' '}
                        <Text style={styles.warningBold}>TRC20 (Tron)</Text> address only. Sending to other networks will result in permanent loss of funds.
                    </Text>
                </View>

                {/* Available Balance */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Available Balance</Text>
                    <Text style={styles.balanceValue}>{usdtBalance.toFixed(2)} USDT</Text>
                </View>

                {/* Withdrawal Address */}
                <Text style={styles.fieldLabel}>Withdrawal Address (TRC20)</Text>
                <View style={styles.inputCard}>
                    <Text style={styles.fieldIcon}>📋</Text>
                    <TextInput
                        style={[styles.textInput, { flex: 1 }]}
                        placeholder="Enter TRC20 wallet address"
                        placeholderTextColor={AppColors.textMuted}
                        value={address}
                        onChangeText={setAddress}
                        autoCapitalize="none"
                    />
                </View>
                <View style={styles.addressNote}>
                    <Text style={styles.addressNoteIcon}>⚠</Text>
                    <Text style={styles.addressNoteText}>
                        Double-check the address. Transactions cannot be reversed.
                    </Text>
                </View>

                {/* Amount */}
                <View style={styles.amountHeader}>
                    <Text style={styles.fieldLabel}>Amount (USDT)</Text>
                    <TouchableOpacity onPress={handleMax} activeOpacity={0.7}>
                        <Text style={styles.maxText}>Max</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputCard}>
                    <TextInput
                        style={[styles.amountInput, { flex: 1 }]}
                        placeholder="0.00"
                        placeholderTextColor={AppColors.textMuted}
                        keyboardType="decimal-pad"
                        value={amount}
                        onChangeText={setAmount}
                    />
                    <Text style={styles.currencyTag}>USDT</Text>
                </View>
                <Text style={styles.minNote}>Minimum withdrawal: {MIN_WITHDRAWAL} USDT</Text>

                {/* Withdrawal Details */}
                <View style={styles.detailsCard}>
                    <Text style={styles.detailsTitle}>Withdrawal Details</Text>
                    <DetailRow label="Network" value="TRC20 (Tron)" />
                    <DetailRow label="Withdrawal Amount" value={`${parsedAmount.toFixed(2)} USDT`} />
                    <DetailRow label="Service Fee" value="₹0.00" />
                    <DetailRow label="You'll Receive" value={`${youReceive} USDT`} valueColor="#22C55E" last />
                </View>

                {/* Transaction Password */}
                <Text style={styles.fieldLabel}>Transaction Password</Text>
                <View style={styles.inputCard}>
                    <Text style={styles.fieldIcon}>🔒</Text>
                    <TextInput
                        style={[styles.textInput, { flex: 1 }]}
                        placeholder="Enter transaction password"
                        placeholderTextColor={AppColors.textMuted}
                        secureTextEntry
                        value={txnPassword}
                        onChangeText={setTxnPassword}
                    />
                </View>

                {/* Confirm */}
                <TouchableOpacity style={styles.confirmButton} activeOpacity={0.8}>
                    <Text style={styles.confirmText}>Confirm Withdrawal</Text>
                </TouchableOpacity>

                {/* Processing Info */}
                <View style={styles.processingCard}>
                    <Text style={styles.processingTitle}>Processing Time</Text>
                    <ProcessRow label="Confirmations Required" value="1 block" />
                    <ProcessRow label="Est. Processing Time" value="5-15 minutes" valueColor={AppColors.gold} last />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function DetailRow({ label, value, valueColor, last }: { label: string; value: string; valueColor?: string; last?: boolean }) {
    return (
        <View style={[styles.detailRow, !last && styles.detailRowBorder]}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={[styles.detailValue, valueColor ? { color: valueColor } : null]}>{value}</Text>
        </View>
    );
}

function ProcessRow({ label, value, valueColor, last }: { label: string; value: string; valueColor?: string; last?: boolean }) {
    return (
        <View style={[styles.detailRow, !last && styles.detailRowBorder]}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={[styles.detailValue, valueColor ? { color: valueColor } : null]}>{value}</Text>
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

    // Warning
    warningBox: {
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.25)',
        padding: 16,
        marginBottom: 16,
    },
    warningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    warningIcon: { fontSize: 16, color: '#EF4444' },
    warningTitle: { fontSize: 15, fontWeight: '700', color: '#EF4444' },
    warningText: { fontSize: 13, color: AppColors.textSecondary, lineHeight: 20 },
    warningBold: { fontWeight: '700', color: AppColors.textPrimary },

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
    balanceValue: { fontSize: 22, fontWeight: '800', color: AppColors.textPrimary },

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
    fieldIcon: { fontSize: 16, marginRight: 10 },
    textInput: {
        fontSize: 14,
        color: AppColors.textPrimary,
        paddingVertical: 14,
    },
    amountInput: {
        fontSize: 22,
        fontWeight: '700',
        color: AppColors.textPrimary,
        paddingVertical: 12,
    },
    currencyTag: { fontSize: 14, fontWeight: '600', color: AppColors.textSecondary },

    // Address note
    addressNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 20,
    },
    addressNoteIcon: { fontSize: 12, color: '#F59E0B' },
    addressNoteText: { fontSize: 12, color: AppColors.textMuted, flex: 1 },

    // Amount header
    amountHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    maxText: { fontSize: 14, fontWeight: '600', color: AppColors.gold },
    minNote: { fontSize: 12, color: AppColors.textMuted, marginBottom: 20 },

    // Details Card
    detailsCard: {
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        paddingHorizontal: 16,
        paddingTop: 16,
        marginBottom: 20,
    },
    detailsTitle: { fontSize: 15, fontWeight: '700', color: AppColors.textPrimary, marginBottom: 8 },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    detailRowBorder: { borderBottomWidth: 1, borderBottomColor: AppColors.borderDefault },
    detailLabel: { fontSize: 14, color: AppColors.textSecondary },
    detailValue: { fontSize: 14, fontWeight: '600', color: AppColors.textPrimary },

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

    // Processing
    processingCard: {
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    processingTitle: { fontSize: 15, fontWeight: '700', color: AppColors.textPrimary, marginBottom: 4 },
});
