import type { AlertButton } from '@/context/AlertContext';

// Global alert handler - will be set by AlertProvider
let globalShowAlert: ((
  title: string,
  message?: string,
  buttons?: AlertButton[],
  cancelable?: boolean
) => void) | null = null;

export const setGlobalAlertHandler = (
  handler: (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    cancelable?: boolean
  ) => void
) => {
  globalShowAlert = handler;
};

// Custom Alert API that matches React Native's Alert.alert signature
export const Alert = {
  alert: (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: { cancelable?: boolean }
  ) => {
    if (!globalShowAlert) {
      console.warn('Alert handler not initialized. Make sure AlertProvider is mounted.');
      return;
    }

    globalShowAlert(title, message, buttons, options?.cancelable);
  },
};
