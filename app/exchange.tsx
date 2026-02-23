import { AppColors } from '@/constants/colors';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Modal,
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

// Sample bank accounts data
const SAMPLE_BANK_ACCOUNTS = [
    {
        id: '1',
        bankName: 'HDFC Bank',
        accountHolder: 'John Doe',
        accountNumber: '****5678',
        ifscCode: 'HDFC0001234',
        isPrimary: true,
    },
    {
        id: '2',
        bankName: 'ICICI Bank',
        accountHolder: 'John Doe',
        accountNumber: '****1234',
        ifscCode: 'ICIC0005678',
        isPrimary: false,
    },
];

export default function ExchangeScreen() {
    const [inrAmount, setInrAmount] = useState('');
    const [usdtAmount, setUsdtAmount] = useState('');
    const [rate, setRate] = useState<number>(91.25);
    const [rateLoading, setRateLoading] = useState(true);
    const [txnPassword, setTxnPassword] = useState('');
    const [showBankAccounts, setShowBankAccounts] = useState(false);
    const [showAddBank, setShowAddBank] = useState(false);
    const [selectedBank, setSelectedBank] = useState<string | null>(null);

    // Add bank form state
    const [newAccountHolder, setNewAccountHolder] = useState('');
    const [newAccountNumber, setNewAccountNumber] = useState('');
    const [newIfscCode, setNewIfscCode] = useState('');
    const [newBankName, setNewBankName] = useState('');

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

    const handleSelectBank = (bankId: string) => {
        setSelectedBank(bankId);
        setShowBankAccounts(false);
    };

    const handleOpenAddBank = () => {
        setShowAddBank(true);
    };

    const handleCloseAddBank = () => {
        setShowAddBank(false);
        setNewAccountHolder('');
        setNewAccountNumber('');
        setNewIfscCode('');
        setNewBankName('');
    };

    const parsedInr = parseFloat(inrAmount) || 0;
    const parsedUsdt = parseFloat(usdtAmount) || 0;

    const selectedBankData = SAMPLE_BANK_ACCOUNTS.find(b => b.id === selectedBank);

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
                    <TouchableOpacity activeOpacity={0.7} onPress={() => setShowBankAccounts(true)}>
                        <Text style={styles.addNewText}>+ Add Bank</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.selectCard}
                    activeOpacity={0.7}
                    onPress={() => setShowBankAccounts(true)}
                >
                    <Text style={selectedBankData ? styles.selectTextActive : styles.selectText}>
                        {selectedBankData ? `${selectedBankData.bankName} (${selectedBankData.accountNumber})` : 'Select bank account'}
                    </Text>
                    <Text style={styles.selectArrow}>▾</Text>
                </TouchableOpacity>

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

            {/* ==================== BANK ACCOUNTS MODAL ==================== */}
            <Modal
                visible={showBankAccounts}
                transparent
                animationType="slide"
                onRequestClose={() => setShowBankAccounts(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setShowBankAccounts(false)} activeOpacity={0.7}>
                                <Text style={styles.modalBackArrow}>←</Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.modalTitle}>Bank Accounts</Text>
                                <Text style={styles.modalSubtitle}>Manage your bank accounts</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.addBankCircle}
                                activeOpacity={0.7}
                                onPress={handleOpenAddBank}
                            >
                                <Text style={styles.addBankCircleText}>+</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Bank Account Cards */}
                        <ScrollView
                            style={styles.modalScroll}
                            showsVerticalScrollIndicator={false}
                        >
                            {SAMPLE_BANK_ACCOUNTS.map((bank) => (
                                <TouchableOpacity
                                    key={bank.id}
                                    style={[
                                        styles.bankCard,
                                        selectedBank === bank.id && styles.bankCardSelected,
                                    ]}
                                    activeOpacity={0.7}
                                    onPress={() => handleSelectBank(bank.id)}
                                >
                                    {/* Bank icon & name */}
                                    <View style={styles.bankCardHeader}>
                                        <View style={styles.bankIconCircle}>
                                            <Text style={styles.bankIconText}>🏦</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.bankCardName}>{bank.bankName}</Text>
                                            {bank.isPrimary && (
                                                <View style={styles.primaryBadge}>
                                                    <Text style={styles.primaryBadgeText}>✓ Primary</Text>
                                                </View>
                                            )}
                                        </View>
                                        <TouchableOpacity activeOpacity={0.5}>
                                            <Text style={styles.bankDeleteIcon}>🗑</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Bank details */}
                                    <View style={styles.bankDetailRow}>
                                        <Text style={styles.bankDetailLabel}>Account Holder</Text>
                                        <Text style={styles.bankDetailValue}>{bank.accountHolder}</Text>
                                    </View>
                                    <View style={styles.bankDetailRow}>
                                        <Text style={styles.bankDetailLabel}>Account Number</Text>
                                        <Text style={styles.bankDetailValue}>{bank.accountNumber}</Text>
                                    </View>
                                    <View style={styles.bankDetailRow}>
                                        <Text style={styles.bankDetailLabel}>IFSC Code</Text>
                                        <Text style={styles.bankDetailValue}>{bank.ifscCode}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* ==================== ADD BANK ACCOUNT MODAL ==================== */}
            <Modal
                visible={showAddBank}
                transparent
                animationType="fade"
                onRequestClose={handleCloseAddBank}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.addBankModal}>
                        {/* Header */}
                        <View style={styles.addBankHeader}>
                            <Text style={styles.addBankTitle}>Add Bank Account</Text>
                            <TouchableOpacity onPress={handleCloseAddBank} activeOpacity={0.7}>
                                <Text style={styles.addBankClose}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Account Holder Name */}
                            <Text style={styles.addBankLabel}>Account Holder Name</Text>
                            <View style={styles.addBankInputCard}>
                                <TextInput
                                    style={styles.addBankInput}
                                    placeholder="Enter account holder name"
                                    placeholderTextColor={AppColors.textMuted}
                                    value={newAccountHolder}
                                    onChangeText={setNewAccountHolder}
                                />
                            </View>

                            {/* Account Number */}
                            <Text style={styles.addBankLabel}>Account Number</Text>
                            <View style={styles.addBankInputCard}>
                                <TextInput
                                    style={styles.addBankInput}
                                    placeholder="Enter account number"
                                    placeholderTextColor={AppColors.textMuted}
                                    keyboardType="number-pad"
                                    value={newAccountNumber}
                                    onChangeText={setNewAccountNumber}
                                />
                            </View>

                            {/* IFSC Code */}
                            <Text style={styles.addBankLabel}>IFSC Code</Text>
                            <View style={styles.addBankInputCard}>
                                <TextInput
                                    style={styles.addBankInput}
                                    placeholder="ENTER IFSC CODE"
                                    placeholderTextColor={AppColors.textMuted}
                                    autoCapitalize="characters"
                                    value={newIfscCode}
                                    onChangeText={setNewIfscCode}
                                />
                            </View>

                            {/* Bank Name (Auto-detected) */}
                            <Text style={styles.addBankLabel}>Bank Name (Auto-detected)</Text>
                            <View style={[styles.addBankInputCard, { opacity: 0.6 }]}>
                                <TextInput
                                    style={styles.addBankInput}
                                    placeholder="Will auto-fill from IFSC"
                                    placeholderTextColor={AppColors.textMuted}
                                    value={newBankName}
                                    editable={false}
                                />
                            </View>

                            {/* Info note */}
                            <View style={styles.addBankInfoNote}>
                                <Text style={styles.addBankInfoIcon}>💡</Text>
                                <Text style={styles.addBankInfoText}>
                                    Your bank details will be verified during the first withdrawal
                                </Text>
                            </View>

                            {/* Add Account button */}
                            <TouchableOpacity
                                style={styles.addBankButton}
                                activeOpacity={0.8}
                                onPress={handleCloseAddBank}
                            >
                                <Text style={styles.addBankButtonText}>Add Account</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
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
    selectTextActive: { fontSize: 14, color: AppColors.textPrimary, fontWeight: '600' },
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

    // =================== BANK ACCOUNTS MODAL ===================
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: AppColors.backgroundPrimary,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingHorizontal: 20,
        paddingBottom: 40,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 24,
    },
    modalBackArrow: {
        color: AppColors.textPrimary,
        fontSize: 24,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: AppColors.textPrimary,
        letterSpacing: -0.3,
    },
    modalSubtitle: {
        fontSize: 13,
        color: AppColors.textSecondary,
        marginTop: 2,
    },
    addBankCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: AppColors.gold,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addBankCircleText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginTop: -2,
    },
    modalScroll: {
        flex: 1,
    },

    // Bank Card
    bankCard: {
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        padding: 18,
        marginBottom: 14,
    },
    bankCardSelected: {
        borderColor: AppColors.gold,
        borderWidth: 1.5,
    },
    bankCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 16,
    },
    bankIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(184, 150, 12, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bankIconText: {
        fontSize: 20,
    },
    bankCardName: {
        fontSize: 17,
        fontWeight: '700',
        color: AppColors.textPrimary,
    },
    primaryBadge: {
        marginTop: 4,
    },
    primaryBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#22C55E',
    },
    bankDeleteIcon: {
        fontSize: 18,
        opacity: 0.6,
    },
    bankDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
    },
    bankDetailLabel: {
        fontSize: 13,
        color: AppColors.textSecondary,
    },
    bankDetailValue: {
        fontSize: 13,
        fontWeight: '600',
        color: AppColors.textPrimary,
    },

    // =================== ADD BANK MODAL ===================
    addBankModal: {
        backgroundColor: AppColors.backgroundSecondary,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingHorizontal: 24,
        paddingBottom: 40,
        maxHeight: '80%',
        marginTop: 'auto',
    },
    addBankHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    addBankTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: AppColors.textPrimary,
    },
    addBankClose: {
        fontSize: 20,
        color: AppColors.textSecondary,
        padding: 4,
    },
    addBankLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.textPrimary,
        marginBottom: 8,
        marginTop: 8,
    },
    addBankInputCard: {
        backgroundColor: AppColors.backgroundPrimary,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        paddingHorizontal: 16,
        paddingVertical: 4,
        marginBottom: 8,
    },
    addBankInput: {
        fontSize: 14,
        color: AppColors.textPrimary,
        paddingVertical: 14,
    },
    addBankInfoNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: AppColors.backgroundPrimary,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        paddingHorizontal: 14,
        paddingVertical: 14,
        marginTop: 12,
        marginBottom: 20,
    },
    addBankInfoIcon: {
        fontSize: 14,
    },
    addBankInfoText: {
        fontSize: 13,
        color: AppColors.textSecondary,
        lineHeight: 20,
        flex: 1,
    },
    addBankButton: {
        backgroundColor: AppColors.gold,
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
    },
    addBankButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
});
