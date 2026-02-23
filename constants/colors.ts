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
    goldBg: 'rgba(184, 150, 12, 0.15)',
    goldBorder: 'rgba(184, 150, 12, 0.35)',
    goldBgSubtle: 'rgba(184, 150, 12, 0.12)',
    goldBorderSubtle: 'rgba(184, 150, 12, 0.3)',

    // Text
    textPrimary: '#FFFFFF',
    textSecondary: '#8A8F98',
    textMuted: '#5A5F68',
    textLink: '#B8960C',
    textDark: '#000000',

    // Status
    success: '#22C55E',
    successBg: 'rgba(34, 197, 94, 0.12)',
    danger: '#EF4444',
    dangerBg: 'rgba(239, 68, 68, 0.08)',
    dangerBorder: 'rgba(239, 68, 68, 0.3)',

    // Utility
    transparent: 'transparent',
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayDark: 'rgba(0, 0, 0, 0.7)',
    inactiveBg: 'rgba(138, 143, 152, 0.12)',
} as const;

export type AppColorKey = keyof typeof AppColors;
