import { Dimensions } from 'react-native';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
export const Layout = {
  window: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  isSmallDevice: SCREEN_WIDTH < 375,
};
