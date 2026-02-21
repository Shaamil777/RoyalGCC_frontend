import { AppColors } from '@/constants/colors';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Types ───────────────────────────────────────────────
type TransactionType = 'Deposit' | 'Exchange' | 'Withdraw';
type TransactionStatus = 'Completed' | 'Pending' | 'Failed';
type FilterTab = 'All' | 'Deposits' | 'Exchange' | 'Withdraw';

interface Transaction {
    id: string;
    type: TransactionType;
    amount: string;
    date: string;
    status: TransactionStatus;
    hash: string;
}

// ─── Mock Data ───────────────────────────────────────────
const TRANSACTIONS: Transaction[] = [
    {
        id: 'TXN001',
        type: 'Deposit',
        amount: '500.00 USDT',
        date: '2026-02-05 14:30',
        status: 'Completed',
        hash: '0x7f8b3c9d2e4f6a1b5c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    },
    {
        id: 'TXN002',
        type: 'Exchange',
        amount: '₹45625.00',
        date: '2026-02-04 11:15',
        status: 'Completed',
        hash: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    },
    {
        id: 'TXN003',
        type: 'Withdraw',
        amount: '250.00 USDT',
        date: '2026-02-03 09:45',
        status: 'Pending',
        hash: '0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
    },
    {
        id: 'TXN004',
        type: 'Deposit',
        amount: '1000.00 USDT',
        date: '2026-02-02 16:20',
        status: 'Completed',
        hash: '0xf6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7',
    },
    {
        id: 'TXN005',
        type: 'Exchange',
        amount: '₹18250.00',
        date: '2026-02-01 13:00',
        status: 'Failed',
        hash: '0xb8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9',
    },
];

const FILTER_TABS: FilterTab[] = ['All', 'Deposits', 'Exchange', 'Withdraw'];

// ─── Helpers ─────────────────────────────────────────────
function getTypeIcon(type: TransactionType): string {
    switch (type) {
        case 'Deposit':
            return '↓';
        case 'Exchange':
            return '⇄';
        case 'Withdraw':
            return '↑';
    }
}

function getTypeColor(type: TransactionType): string {
    switch (type) {
        case 'Deposit':
            return '#22C55E';
        case 'Exchange':
            return '#D4AF37';
        case 'Withdraw':
            return '#EF4444';
    }
}

function getStatusColor(status: TransactionStatus): string {
    switch (status) {
        case 'Completed':
            return '#22C55E';
        case 'Pending':
            return '#F59E0B';
        case 'Failed':
            return '#EF4444';
    }
}

function getStatusIcon(status: TransactionStatus): string {
    switch (status) {
        case 'Completed':
            return '✓';
        case 'Pending':
            return '◷';
        case 'Failed':
            return '✕';
    }
}

// ─── Filter Tab Component ────────────────────────────────
function FilterTabBar({
    activeFilter,
    onSelect,
}: {
    activeFilter: FilterTab;
    onSelect: (f: FilterTab) => void;
}) {
    return (
        <View style={styles.filterRow}>
            {FILTER_TABS.map((tab) => {
                const isActive = tab === activeFilter;
                return (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.filterTab, isActive && styles.filterTabActive]}
                        onPress={() => onSelect(tab)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.filterTabText,
                                isActive && styles.filterTabTextActive,
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

// ─── Transaction Row Component ───────────────────────────
function TransactionRow({
    item,
    onPress,
}: {
    item: Transaction;
    onPress: () => void;
}) {
    const iconColor = getTypeColor(item.type);
    const statusColor = getStatusColor(item.status);

    return (
        <TouchableOpacity
            style={styles.txnCard}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.txnLeft}>
                <View style={[styles.txnIcon, { backgroundColor: `${iconColor}15` }]}>
                    <Text style={[styles.txnIconText, { color: iconColor }]}>
                        {getTypeIcon(item.type)}
                    </Text>
                </View>
                <View>
                    <Text style={styles.txnType}>{item.type}</Text>
                    <Text style={styles.txnDate}>{item.date}</Text>
                </View>
            </View>
            <View style={styles.txnRight}>
                <Text style={styles.txnAmount}>{item.amount}</Text>
                <View style={styles.txnStatusRow}>
                    <Text style={[styles.txnStatusIcon, { color: statusColor }]}>
                        {getStatusIcon(item.status)}
                    </Text>
                    <Text style={[styles.txnStatusText, { color: statusColor }]}>
                        {item.status}
                    </Text>
                </View>
            </View>
            <Text style={styles.txnArrow}>›</Text>
        </TouchableOpacity>
    );
}

// ─── Transaction Detail Modal ────────────────────────────
function TransactionDetailModal({
    visible,
    transaction,
    onClose,
}: {
    visible: boolean;
    transaction: Transaction | null;
    onClose: () => void;
}) {
    if (!transaction) return null;

    const iconColor = getTypeColor(transaction.type);
    const statusColor = getStatusColor(transaction.status);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Transaction Details</Text>
                        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                            <Text style={styles.modalCloseIcon}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Icon */}
                    <View style={styles.modalIconWrapper}>
                        <View
                            style={[
                                styles.modalIcon,
                                { backgroundColor: `${iconColor}15` },
                            ]}
                        >
                            <Text
                                style={[styles.modalIconText, { color: iconColor }]}
                            >
                                {getTypeIcon(transaction.type)}
                            </Text>
                        </View>
                    </View>

                    {/* Details card */}
                    <View style={styles.detailsCard}>
                        <DetailRow label="Order ID" value={transaction.id} />
                        <DetailRow label="Type" value={transaction.type} />
                        <DetailRow label="Amount" value={transaction.amount} bold />
                        <DetailRow
                            label="Status"
                            value={transaction.status}
                            valueColor={statusColor}
                            statusIcon={getStatusIcon(transaction.status)}
                        />
                        <DetailRow label="Date & Time" value={transaction.date} />
                    </View>

                    {/* Hash */}
                    <View style={styles.hashSection}>
                        <Text style={styles.hashLabel}>Transaction Hash</Text>
                        <View style={styles.hashBox}>
                            <Text style={styles.hashText} selectable>
                                {transaction.hash}
                            </Text>
                        </View>
                    </View>

                    {/* Close Button */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

function DetailRow({
    label,
    value,
    bold,
    valueColor,
    statusIcon,
}: {
    label: string;
    value: string;
    bold?: boolean;
    valueColor?: string;
    statusIcon?: string;
}) {
    return (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <View style={styles.detailValueRow}>
                {statusIcon && (
                    <Text style={[styles.detailStatusIcon, { color: valueColor }]}>
                        {statusIcon}
                    </Text>
                )}
                <Text
                    style={[
                        styles.detailValue,
                        bold && styles.detailValueBold,
                        valueColor ? { color: valueColor } : null,
                    ]}
                >
                    {value}
                </Text>
            </View>
        </View>
    );
}

// ─── Main Screen ─────────────────────────────────────────
export default function HistoryScreen() {
    const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
    const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const filtered = TRANSACTIONS.filter((txn) => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Deposits') return txn.type === 'Deposit';
        if (activeFilter === 'Exchange') return txn.type === 'Exchange';
        if (activeFilter === 'Withdraw') return txn.type === 'Withdraw';
        return true;
    });

    const openDetail = (txn: Transaction) => {
        setSelectedTxn(txn);
        setModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={styles.headerSection}>
                <Text style={styles.title}>Transaction History</Text>
                <Text style={styles.subtitle}>View all your transactions</Text>
            </View>

            {/* Filter Tabs */}
            <FilterTabBar activeFilter={activeFilter} onSelect={setActiveFilter} />

            {/* Transactions List */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TransactionRow item={item} onPress={() => openDetail(item)} />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📋</Text>
                        <Text style={styles.emptyTitle}>No Transactions</Text>
                        <Text style={styles.emptySubtitle}>
                            No {activeFilter === 'All' ? '' : activeFilter.toLowerCase() + ' '}
                            transactions found.
                        </Text>
                    </View>
                }
            />

            {/* Detail Modal */}
            <TransactionDetailModal
                visible={modalVisible}
                transaction={selectedTxn}
                onClose={() => setModalVisible(false)}
            />
        </SafeAreaView>
    );
}

// ─── Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: AppColors.backgroundPrimary,
    },

    // Header
    headerSection: {
        paddingHorizontal: 20,
        paddingTop: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: AppColors.textPrimary,
        letterSpacing: -0.3,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: AppColors.textSecondary,
        fontWeight: '400',
    },

    // Filter Tabs
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 16,
        gap: 8,
    },
    filterTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    filterTabActive: {
        backgroundColor: AppColors.gold,
    },
    filterTabText: {
        fontSize: 14,
        fontWeight: '500',
        color: AppColors.textSecondary,
    },
    filterTabTextActive: {
        color: '#000',
        fontWeight: '600',
    },

    // List
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 10,
    },

    // Transaction Card
    txnCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    txnLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    txnIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    txnIconText: {
        fontSize: 20,
        fontWeight: '700',
    },
    txnType: {
        fontSize: 15,
        fontWeight: '600',
        color: AppColors.textPrimary,
        marginBottom: 2,
    },
    txnDate: {
        fontSize: 12,
        color: AppColors.textMuted,
        fontWeight: '400',
    },
    txnRight: {
        alignItems: 'flex-end',
        marginRight: 8,
    },
    txnAmount: {
        fontSize: 15,
        fontWeight: '700',
        color: AppColors.textPrimary,
        marginBottom: 2,
    },
    txnStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    txnStatusIcon: {
        fontSize: 12,
        fontWeight: '700',
    },
    txnStatusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    txnArrow: {
        fontSize: 22,
        color: AppColors.textMuted,
        fontWeight: '300',
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: AppColors.textPrimary,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: AppColors.textSecondary,
        textAlign: 'center',
    },

    // ── Modal ────────────────────────
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: AppColors.backgroundSecondary,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 36,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: AppColors.textPrimary,
        letterSpacing: -0.3,
    },
    modalCloseIcon: {
        fontSize: 20,
        color: AppColors.textSecondary,
        fontWeight: '300',
    },
    modalIconWrapper: {
        alignItems: 'center',
        marginBottom: 24,
    },
    modalIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalIconText: {
        fontSize: 26,
        fontWeight: '700',
    },

    // Detail Card
    detailsCard: {
        backgroundColor: AppColors.backgroundPrimary,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        paddingHorizontal: 18,
        paddingVertical: 4,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.borderDefault,
    },
    detailLabel: {
        fontSize: 14,
        color: AppColors.textSecondary,
        fontWeight: '400',
    },
    detailValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailStatusIcon: {
        fontSize: 13,
        fontWeight: '700',
    },
    detailValue: {
        fontSize: 14,
        color: AppColors.textPrimary,
        fontWeight: '500',
    },
    detailValueBold: {
        fontWeight: '700',
    },

    // Hash
    hashSection: {
        marginBottom: 20,
    },
    hashLabel: {
        fontSize: 14,
        color: AppColors.textSecondary,
        fontWeight: '500',
        marginBottom: 8,
    },
    hashBox: {
        backgroundColor: AppColors.backgroundPrimary,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: AppColors.gold,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    hashText: {
        fontSize: 12,
        color: AppColors.textMuted,
        fontWeight: '400',
        lineHeight: 18,
    },

    // Close Button
    closeButton: {
        backgroundColor: AppColors.gold,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
});
