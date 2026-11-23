import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Vibrant fresh green system matching modern grocery/food app UI
    primary: '#489347',
    primaryLight: '#5CA95B',
    primaryDark: '#2D6B2C',
    headerGradient: '#489347',
    accent: '#7BC676',

    // Backgrounds
    background: '#F3F7F2',
    backgroundElement: '#E9F2E7',
    backgroundSelected: '#489347',
    card: '#FFFFFF',
    cardBorder: '#D7E7D4',

    // Text
    text: '#1B331B',
    textSecondary: '#667D66',
    slate: '#667D66',

    // Status badges & Accents
    badgeGreenBg: '#E9F5E8',
    badgeGreenText: '#2B702B',
    warningBg: '#FFF8E1',
    warningText: '#F57F17',
    errorBg: '#FEE2E2',
    errorText: '#DC2626',
    orangeHot: '#FF6E1A',

    // Legacy compat
    mercury: '#F3F7F2',
  },
  dark: {
    primary: '#5CA95B',
    primaryLight: '#7BC676',
    primaryDark: '#2D6B2C',
    headerGradient: '#254E25',
    accent: '#7BC676',

    background: '#131D13',
    backgroundElement: '#1D2E1D',
    backgroundSelected: '#5CA95B',
    card: '#1A291A',
    cardBorder: '#2A442A',

    text: '#FFFFFF',
    textSecondary: '#A3BFA3',
    slate: '#A3BFA3',

    badgeGreenBg: '#1D2E1D',
    badgeGreenText: '#7BC676',
    warningBg: '#3E2F13',
    warningText: '#FBBF24',
    errorBg: '#3F1818',
    errorText: '#F87171',
    orangeHot: '#FF6E1A',

    mercury: '#131D13',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
