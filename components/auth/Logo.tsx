import { AppColors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface LogoProps {
    size?: number;
}

// 3x3 golden grid logo with diamond gap
export function Logo({ size = 64 }: LogoProps) {
    const cellSize = size / 4;
    const gap = cellSize * 0.25;
    const borderRadius = cellSize * 0.2;

    // Define which cells are visible (1 = filled, 0 = empty)
    // Creates the diamond/hashtag pattern from the design
    const grid = [
        [0, 1, 1, 0],
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [0, 1, 1, 0],
    ];

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            {grid.map((row, rowIndex) => (
                <View key={rowIndex} style={[styles.row, { gap }]}>
                    {row.map((cell, colIndex) => (
                        <View
                            key={colIndex}
                            style={[
                                {
                                    width: cellSize - gap,
                                    height: cellSize - gap,
                                    borderRadius,
                                },
                                cell
                                    ? { backgroundColor: AppColors.gold }
                                    : { backgroundColor: AppColors.transparent },
                            ]}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A1C22',
        borderRadius: 12,
        padding: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
