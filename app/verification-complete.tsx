import { AppColors } from '@/constants/colors';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerificationCompleteScreen() {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const buttonSlide = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        // Checkmark icon pop-in
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 60,
            friction: 8,
            useNativeDriver: true,
        }).start();

        // Text + button fade in
        Animated.sequence([
            Animated.delay(300),
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(buttonSlide, {
                    toValue: 0,
                    duration: 500,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, [scaleAnim, fadeAnim, buttonSlide]);

    const handleContinue = () => {
        // Navigate to the main app / home
        router.replace('/');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="light" />
            <View style={styles.container}>
                {/* Checkmark Icon */}
                <Animated.View
                    style={[
                        styles.iconCircle,
                        { transform: [{ scale: scaleAnim }] },
                    ]}
                >
                    <View style={styles.checkmarkContainer}>
                        <Text style={styles.checkIcon}>✓</Text>
                    </View>
                </Animated.View>

                {/* Title */}
                <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
                    Verification Complete
                </Animated.Text>

                {/* Subtitle */}
                <Animated.Text
                    style={[styles.subtitle, { opacity: fadeAnim }]}
                >
                    Your KYC has been approved. You can now{'\n'}access all
                    features.
                </Animated.Text>

                {/* Continue Button */}
                <Animated.View
                    style={[
                        styles.buttonContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: buttonSlide }],
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={handleContinue}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.continueButtonText}>
                            Continue to App
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
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
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 28,
    },
    checkmarkContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(34, 197, 94, 0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkIcon: {
        fontSize: 28,
        color: '#22C55E',
        fontWeight: '700',
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
        marginBottom: 40,
    },
    buttonContainer: {
        width: '100%',
    },
    continueButton: {
        backgroundColor: AppColors.gold,
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    continueButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});
