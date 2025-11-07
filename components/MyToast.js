import { NativeModules } from 'react-native';

const { MyToast } = NativeModules;

export default {
  showToast(message) {
    if (!MyToast) {
      console.warn(
        '[MyToast] Native module not found. Use a dev build (`expo run:ios` or `expo run:android`).'
      );
      return;
    }
    MyToast.showToast(message);
  },
};
