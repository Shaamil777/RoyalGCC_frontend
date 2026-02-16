import { AppColors } from '@/constants/colors';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Animated loading dots indicator.
 */
function LoadingDots() {
    const dot1 = useRef(new Animated.Value(0.3)).current;
    const dot2 = useRef(new Animated.Value(0.3)).current;
    const dot3 = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animateDot = (dot: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, {
                        toValue: 1,
                        duration: 400,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot, {
                        toValue: 0.3,
                        duration: 400,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                ]),
            );
        };

        const anim1 = animateDot(dot1, 0);
        const anim2 = animateDot(dot2, 200);
        const anim3 = animateDot(dot3, 400);

        anim1.start();
        anim2.start();
        anim3.start();

        return () => {
            anim1.stop();
            anim2.stop();
            anim3.stop();
        };
    }, [dot1, dot2, dot3]);

    return (
        <View style={styles.dotsContainer}>
            {[dot1, dot2, dot3].map((dot, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.dot,
                        { opacity: dot },
                    ]}
                />
            ))}
        </View>
    );
}

export default function VerificationPendingScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="light" />
            <View style={styles.container}>
                {/* Clock Icon */}
                <View style={styles.iconCircle}>
                    <Text style={styles.clockIcon}>🕐</Text>
                </View>

                {/* Title */}
                <Text style={styles.title}>Verification Pending</Text>

                {/* Subtitle */}
                <Text style={styles.subtitle}>
                    Your documents are being reviewed. This usually{'\n'}takes 24-48 hours.
                </Text>

                {/* Loading Dots */}
                <LoadingDots />
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(184, 150, 12, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    clockIcon: {
        fontSize: 36,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: AppColors.textPrimary,
        letterSpacing: -0.3,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 15,
        color: AppColors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    dotsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: AppColors.gold,
    },
});
