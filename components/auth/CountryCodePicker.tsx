import { AppColors } from '@/constants/colors';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export interface CountryCode {
    code: string;
    dialCode: string;
    flag: string;
}

const COUNTRY_CODES: CountryCode[] = [
    { code: 'IN', dialCode: '+91', flag: '🇮🇳' },
    { code: 'US', dialCode: '+1', flag: '🇺🇸' },
    { code: 'GB', dialCode: '+44', flag: '🇬🇧' },
    { code: 'AE', dialCode: '+971', flag: '🇦🇪' },
    { code: 'SG', dialCode: '+65', flag: '🇸🇬' },
    { code: 'AU', dialCode: '+61', flag: '🇦🇺' },
    { code: 'CA', dialCode: '+1', flag: '🇨🇦' },
    { code: 'DE', dialCode: '+49', flag: '🇩🇪' },
];

interface CountryCodePickerProps {
    selected: CountryCode;
    onSelect: (country: CountryCode) => void;
}

export function CountryCodePicker({ selected, onSelect }: CountryCodePickerProps) {
    const [modalVisible, setModalVisible] = useState(false);

    const handleSelect = (country: CountryCode) => {
        onSelect(country);
        setModalVisible(false);
    };

    return (
        <>
            <TouchableOpacity
                style={styles.picker}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
            >
                <Text style={styles.countryCode}>{selected.code}</Text>
                <Text style={styles.dialCode}>{selected.dialCode}</Text>
                <Text style={styles.chevron}>▾</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Country</Text>
                        <FlatList
                            data={COUNTRY_CODES}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.countryItem,
                                        item.code === selected.code && styles.countryItemSelected,
                                    ]}
                                    onPress={() => handleSelect(item)}
                                    activeOpacity={0.6}
                                >
                                    <Text style={styles.flag}>{item.flag}</Text>
                                    <Text style={styles.countryName}>{item.code}</Text>
                                    <Text style={styles.countryDial}>{item.dialCode}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    picker: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppColors.backgroundSecondary,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 16,
        gap: 6,
        minWidth: 110,
    },
    countryCode: {
        color: AppColors.textPrimary,
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    dialCode: {
        color: AppColors.textPrimary,
        fontSize: 15,
        fontWeight: '500',
    },
    chevron: {
        color: AppColors.textSecondary,
        fontSize: 14,
        marginLeft: 2,
    },
    overlay: {
        flex: 1,
        backgroundColor: AppColors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 16,
        width: '80%',
        maxHeight: '60%',
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
    },
    modalTitle: {
        color: AppColors.textPrimary,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center',
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 10,
        gap: 12,
    },
    countryItemSelected: {
        backgroundColor: 'rgba(184, 150, 12, 0.15)',
    },
    flag: {
        fontSize: 22,
    },
    countryName: {
        color: AppColors.textPrimary,
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    countryDial: {
        color: AppColors.textSecondary,
        fontSize: 15,
    },
});
