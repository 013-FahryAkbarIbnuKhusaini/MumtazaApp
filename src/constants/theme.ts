export const colors = {
  primary: '#785928',
  primaryDark: '#5E4212',
  primaryLight: '#FDD296',
  textPrimary: '#1A1C1C',
  textSecondary: '#5E5E5E',
  textPlaceholder: '#CCCCCC',
  border: '#E0E0E0',
  surface: '#F3F3F3',
  surfaceAlt: '#F8F8F8',
  background: '#FFFFFF',
  black: '#0D0D0D',
  white: '#FFFFFF',
  success: '#2E7D32',
  successBg: '#E8F5E9',
  danger: '#BA1A1A',
  dangerBg: '#FFECEB',
  warning: '#4A3512',
  warningBg: '#FFE3B3',
};
export const typography = {
  fontFamily: {
    heading: 'Poppins_700Bold',
    headingExtraBold: 'Poppins_800ExtraBold',
    headingSemiBold: 'Poppins_600SemiBold',
    body: 'Inter_400Regular',
    bodyMedium: 'Inter_500Medium',
    bodySemiBold: 'Inter_600SemiBold',
  }
};
export const spacing = { screenPadding: 20 };
export const radius = { sm: 12, md: 16, lg: 24, full: 999 };
export const layout = { buttonHeight: 52, inputHeight: 52, tabBarHeight: 64 };
export const theme = { colors, typography, spacing, radius, layout };
export default theme;
