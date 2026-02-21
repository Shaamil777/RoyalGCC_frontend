import { AppColors } from '@/constants/colors';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

interface TabIconProps {
    icon: string;
    label: string;
    focused: boolean;
}

function TabIcon({ icon, label, focused }: TabIconProps) {
    return (
        <View style={styles.tabIconContainer}>
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
                {icon}
            </Text>
            <Text
                style={[styles.tabLabel, focused && styles.tabLabelActive]}
                numberOfLines={1}
            >
                {label}
            </Text>
        </View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: false,
                tabBarActiveTintColor: AppColors.gold,
                tabBarInactiveTintColor: AppColors.textMuted,
                tabBarItemStyle: styles.tabBarItem,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="🏠" label="Home" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="🕐" label="History" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="referral"
                options={{
                    title: 'Referral',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="🎁" label="Referral" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="👤" label="Profile" focused={focused} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: AppColors.backgroundPrimary,
        borderTopColor: AppColors.borderDefault,
        borderTopWidth: 1,
        height: Platform.OS === 'ios' ? 88 : 70,
        paddingTop: 6,
        paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    },
    tabBarItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        gap: 3,
    },
    tabIcon: {
        fontSize: 22,
        opacity: 0.5,
        textAlign: 'center',
        lineHeight: 26,
    },
    tabIconActive: {
        opacity: 1,
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: AppColors.textMuted,
        textAlign: 'center',
    },
    tabLabelActive: {
        color: AppColors.gold,
        fontWeight: '600',
    },
});

