/**
 * App-wide color tokens
 * Derived from the RoyalGCC dark theme design system.
 */

export const AppColors = {
    // Backgrounds
    backgroundPrimary: '#0D0F14',
    backgroundSecondary: '#1A1C22',
    backgroundInput: '#1A1C22',

    // Borders
    borderDefault: '#2A2D35',
    borderFocused: '#B8960C',

    // Brand / Accent
    gold: '#B8960C',
    goldLight: '#D4AF37',
    goldDark: '#8B7209',

    // Text
    textPrimary: '#FFFFFF',
    textSecondary: '#8A8F98',
    textMuted: '#5A5F68',
    textLink: '#B8960C',

    // Utility
    transparent: 'transparent',
    overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

export type AppColorKey = keyof typeof AppColors;
