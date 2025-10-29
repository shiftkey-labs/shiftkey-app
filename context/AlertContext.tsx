import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setGlobalAlertHandler } from '@/utils/alert';

export type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type AlertConfig = {
  title?: string;
  message: string;
  buttons?: AlertButton[];
  cancelable?: boolean;
};

type AlertContextType = {
  showAlert: (title: string, message?: string, buttons?: AlertButton[], cancelable?: boolean) => void;
  hideAlert: () => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);

  const showAlert = (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    cancelable: boolean = true
  ) => {
    // Handle both patterns:
    // Pattern 1: Alert.alert("Title", "Message", buttons)
    // Pattern 2: Alert.alert("Message only") - no title

    const config: AlertConfig = {
      title: message ? title : undefined,
      message: message || title,
      buttons: buttons || [{ text: 'OK', style: 'default' }],
      cancelable,
    };

    setAlertConfig(config);
  };

  const hideAlert = () => {
    setAlertConfig(null);
  };

  // Register global alert handler on mount
  useEffect(() => {
    setGlobalAlertHandler(showAlert);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alertConfig && (
        <AlertDialog
          title={alertConfig.title}
          message={alertConfig.message}
          buttons={alertConfig.buttons || []}
          cancelable={alertConfig.cancelable}
          onDismiss={hideAlert}
        />
      )}
    </AlertContext.Provider>
  );
};

// Import the AlertDialog component
import AlertDialog from '@/components/common/AlertDialog';
