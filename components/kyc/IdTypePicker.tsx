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

const ID_TYPES = [
    'Aadhaar Card',
    'PAN Card',
    'Passport',
    'Driving License',
    'Voter ID',
];

interface IdTypePickerProps {
    selected: string;
    onSelect: (type: string) => void;
}

export function IdTypePicker({ selected, onSelect }: IdTypePickerProps) {
    const [modalVisible, setModalVisible] = useState(false);

    const handleSelect = (type: string) => {
        onSelect(type);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>ID Type</Text>
            <TouchableOpacity
                style={styles.picker}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
            >
                <Text style={styles.selectedText}>{selected}</Text>
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
                        <Text style={styles.modalTitle}>Select ID Type</Text>
                        <FlatList
                            data={ID_TYPES}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.option,
                                        item === selected && styles.optionSelected,
                                    ]}
                                    onPress={() => handleSelect(item)}
                                    activeOpacity={0.6}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            item === selected && styles.optionTextSelected,
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.textSecondary,
    },
    picker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: AppColors.backgroundSecondary,
        borderWidth: 1,
        borderColor: AppColors.borderDefault,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    selectedText: {
        fontSize: 15,
        fontWeight: '500',
        color: AppColors.textPrimary,
    },
    chevron: {
        fontSize: 14,
        color: AppColors.textSecondary,
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
        maxHeight: '50%',
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
    option: {
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    optionSelected: {
        backgroundColor: 'rgba(184, 150, 12, 0.15)',
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
        color: AppColors.textPrimary,
    },
    optionTextSelected: {
        color: AppColors.gold,
    },
});
