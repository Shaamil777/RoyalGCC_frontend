import { AppColors } from '@/constants/colors';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ProfileItemProps {
    icon: string;
    label: string;
    onPress?: () => void;
}

function ProfileItem({ icon, label, onPress }: ProfileItemProps) {
    return (
        <TouchableOpacity style={styles.profileItem} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.profileItemLeft}>
                <Text style={styles.profileItemIcon}>{icon}</Text>
                <Text style={styles.profileItemLabel}>{label}</Text>
            </View>
            <Text style={styles.profileItemArrow}>›</Text>
        </TouchableOpacity>
    );
}

export default function ProfileScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="light" />
            <View style={styles.container}>
                <Text style={styles.title}>Profile</Text>

                {/* Avatar & Name */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>U</Text>
                    </View>
                    <Text style={styles.profileName}>User #12345</Text>
                    <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>✓ KYC Verified</Text>
                    </View>
                </View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    <ProfileItem icon="🔒" label="Security Settings" />
                    <ProfileItem icon="🏦" label="Bank Accounts" />
                    <ProfileItem icon="📄" label="KYC Documents" />
                    <ProfileItem icon="🔔" label="Notifications" />
                    <ProfileItem icon="❓" label="Help & Support" />
                    <ProfileItem icon="📋" label="Terms & Conditions" />
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
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
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: AppColors.backgroundSecondary,
        borderWidth: 2,
        borderColor: AppColors.gold,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 28,
        fontWeight: '800',
        color: AppColors.gold,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '700',
        color: AppColors.textPrimary,
        marginBottom: 8,
    },
    verifiedBadge: {
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    verifiedText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#22C55E',
    },
    menuSection: {
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        overflow: 'hidden',
        marginBottom: 24,
    },
    profileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.borderDefault,
    },
    profileItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    profileItemIcon: {
        fontSize: 18,
    },
    profileItemLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: AppColors.textPrimary,
    },
    profileItemArrow: {
        fontSize: 22,
        color: AppColors.textMuted,
        fontWeight: '300',
    },
    logoutButton: {
        borderWidth: 1,
        borderColor: '#EF4444',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EF4444',
    },
});
