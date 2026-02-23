import { AppColors } from '@/constants/colors';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ProfileMenuItemProps {
    icon: string;
    label: string;
    subtitle?: string;
    subtitleColor?: string;
    badge?: string;
    badgeColor?: string;
    badgeBg?: string;
    showArrow?: boolean;
    onPress?: () => void;
}

function ProfileMenuItem({
    icon,
    label,
    subtitle,
    subtitleColor,
    badge,
    badgeColor,
    badgeBg,
    showArrow = true,
    onPress,
}: ProfileMenuItemProps) {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
                <Text style={styles.menuItemIcon}>{icon}</Text>
                <View>
                    <Text style={styles.menuItemLabel}>{label}</Text>
                    {subtitle && (
                        <Text
                            style={[
                                styles.menuItemSubtitle,
                                subtitleColor ? { color: subtitleColor } : null,
                            ]}
                        >
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>
            <View style={styles.menuItemRight}>
                {badge && (
                    <View
                        style={[
                            styles.badge,
                            badgeBg ? { backgroundColor: badgeBg } : null,
                        ]}
                    >
                        <Text
                            style={[
                                styles.badgeText,
                                badgeColor ? { color: badgeColor } : null,
                            ]}
                        >
                            {badge}
                        </Text>
                    </View>
                )}
                {showArrow && <Text style={styles.menuItemArrow}>›</Text>}
            </View>
        </TouchableOpacity>
    );
}

export default function ProfileScreen() {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleOpenPasswordModal = () => {
        setShowPasswordModal(true);
    };

    const handleClosePasswordModal = () => {
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
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
                        <Text style={styles.title}>Profile & Settings</Text>
                        <Text style={styles.subtitle}>Manage your account</Text>
                    </View>
                </View>

                {/* User Card */}
                <View style={styles.userCard}>
                    <View style={styles.userCardContent}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarIcon}>✦</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.userName}>User #12345</Text>
                            <Text style={styles.memberSince}>Member since Feb 2026</Text>
                        </View>
                    </View>
                    <View style={styles.kycBadge}>
                        <Text style={styles.kycBadgeText}>✓ KYC Verified</Text>
                    </View>
                </View>

                {/* Account Details Section */}
                <Text style={styles.sectionTitle}>Account Details</Text>
                <View style={styles.menuSection}>
                    <ProfileMenuItem
                        icon="📞"
                        label="Mobile Number"
                        subtitle="+91 98765 43210"
                        showArrow={false}
                    />
                    <ProfileMenuItem
                        icon="👤"
                        label="User ID"
                        subtitle="UID12345"
                        showArrow={false}
                    />
                    <ProfileMenuItem
                        icon="✓"
                        label="KYC Status"
                        subtitle="Verified"
                        subtitleColor="#22C55E"
                        showArrow={true}
                    />
                </View>

                {/* Security Section */}
                <Text style={styles.sectionTitle}>Security</Text>
                <View style={styles.menuSection}>
                    <ProfileMenuItem
                        icon="🔒"
                        label="Change Transaction Password"
                        showArrow={true}
                        onPress={handleOpenPasswordModal}
                    />
                </View>

                {/* Other Section */}
                <Text style={styles.sectionTitle}>Other</Text>
                <View style={styles.menuSection}>
                    <ProfileMenuItem
                        icon="🏦"
                        label="Manage Bank Accounts"
                        showArrow={true}
                        onPress={() => router.push('/(tabs)/bank' as any)}
                    />
                    <ProfileMenuItem
                        icon="🏛"
                        label="Referral Program"
                        badge="Earn 0.3%"
                        badgeColor={AppColors.gold}
                        badgeBg="rgba(184, 150, 12, 0.15)"
                        showArrow={true}
                        onPress={() => router.push('/referral' as any)}
                    />
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                {/* Spacer for bottom */}
                <View style={{ height: 24 }} />
            </ScrollView>

            {/* ==================== CHANGE PASSWORD MODAL ==================== */}
            <Modal
                visible={showPasswordModal}
                transparent
                animationType="fade"
                onRequestClose={handleClosePasswordModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.passwordModal}>
                        {/* Header */}
                        <View style={styles.passwordHeader}>
                            <Text style={styles.passwordTitle}>Change Password</Text>
                            <TouchableOpacity onPress={handleClosePasswordModal} activeOpacity={0.7}>
                                <Text style={styles.passwordClose}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Current Password */}
                        <Text style={styles.passwordLabel}>Current Password</Text>
                        <View style={styles.passwordInputCard}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Enter current password"
                                placeholderTextColor={AppColors.textMuted}
                                secureTextEntry
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                            />
                        </View>

                        {/* New Password */}
                        <Text style={styles.passwordLabel}>New Password</Text>
                        <View style={styles.passwordInputCard}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Enter new password"
                                placeholderTextColor={AppColors.textMuted}
                                secureTextEntry
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />
                        </View>

                        {/* Confirm New Password */}
                        <Text style={styles.passwordLabel}>Confirm New Password</Text>
                        <View style={styles.passwordInputCard}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Confirm new password"
                                placeholderTextColor={AppColors.textMuted}
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>

                        {/* Change Password Button */}
                        <TouchableOpacity
                            style={styles.changePasswordButton}
                            activeOpacity={0.8}
                            onPress={handleClosePasswordModal}
                        >
                            <Text style={styles.changePasswordButtonText}>Change Password</Text>
                        </TouchableOpacity>
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

    // User Card
    userCard: {
        backgroundColor: 'rgba(184, 150, 12, 0.12)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(184, 150, 12, 0.3)',
        padding: 20,
        marginBottom: 24,
    },
    userCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 14,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: AppColors.backgroundPrimary,
        borderWidth: 2,
        borderColor: AppColors.gold,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarIcon: {
        fontSize: 22,
        color: AppColors.gold,
    },
    userName: {
        fontSize: 19,
        fontWeight: '800',
        color: AppColors.textPrimary,
    },
    memberSince: {
        fontSize: 13,
        color: AppColors.textSecondary,
        marginTop: 2,
    },
    kycBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(34, 197, 94, 0.12)',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    kycBadgeText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#22C55E',
    },

    // Section Title
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.textSecondary,
        marginBottom: 10,
        marginTop: 4,
    },

    // Menu Section
    menuSection: {
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        overflow: 'hidden',
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.borderDefault,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        flex: 1,
    },
    menuItemIcon: {
        fontSize: 18,
    },
    menuItemLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: AppColors.textPrimary,
    },
    menuItemSubtitle: {
        fontSize: 14,
        color: AppColors.textPrimary,
        fontWeight: '700',
        marginTop: 2,
    },
    menuItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    menuItemArrow: {
        fontSize: 22,
        color: AppColors.textMuted,
        fontWeight: '300',
    },

    // Badge
    badge: {
        backgroundColor: 'rgba(184, 150, 12, 0.15)',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: AppColors.gold,
    },

    // Logout
    logoutButton: {
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
        borderRadius: 14,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#EF4444',
    },

    // =================== CHANGE PASSWORD MODAL ===================
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    passwordModal: {
        backgroundColor: AppColors.backgroundSecondary,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    passwordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    passwordTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: AppColors.textPrimary,
    },
    passwordClose: {
        fontSize: 20,
        color: AppColors.textSecondary,
        padding: 4,
    },
    passwordLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.textPrimary,
        marginBottom: 8,
        marginTop: 8,
    },
    passwordInputCard: {
        backgroundColor: AppColors.backgroundPrimary,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        paddingHorizontal: 16,
        paddingVertical: 4,
        marginBottom: 8,
    },
    passwordInput: {
        fontSize: 14,
        color: AppColors.textPrimary,
        paddingVertical: 14,
    },
    changePasswordButton: {
        backgroundColor: AppColors.gold,
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 16,
    },
    changePasswordButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
});
