import { AppColors } from '@/constants/colors';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
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

export default function BankScreen() {
    const [showAddBank, setShowAddBank] = useState(false);

    // Add bank form state
    const [newAccountHolder, setNewAccountHolder] = useState('');
    const [newAccountNumber, setNewAccountNumber] = useState('');
    const [newIfscCode, setNewIfscCode] = useState('');
    const [newBankName, setNewBankName] = useState('');

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

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>Bank Accounts</Text>
                    <Text style={styles.subtitle}>Manage your bank accounts</Text>
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
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {SAMPLE_BANK_ACCOUNTS.map((bank) => (
                    <View key={bank.id} style={styles.bankCard}>
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
                    </View>
                ))}
            </ScrollView>

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

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: AppColors.backgroundPrimary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 40,
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

    // =================== MODAL ===================
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    addBankModal: {
        backgroundColor: AppColors.backgroundSecondary,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingHorizontal: 24,
        paddingBottom: 40,
        maxHeight: '80%',
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
