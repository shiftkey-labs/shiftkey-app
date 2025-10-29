import React from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import tw from '@/app/styles/tailwind';
import type { AlertButton } from '@/context/AlertContext';

type AlertDialogProps = {
  title?: string;
  message: string;
  buttons: AlertButton[];
  cancelable?: boolean;
  onDismiss: () => void;
};

const AlertDialog: React.FC<AlertDialogProps> = ({
  title,
  message,
  buttons,
  cancelable = true,
  onDismiss,
}) => {
  const { isDarkMode, colors } = useTheme();

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    onDismiss();
  };

  const handleBackdropPress = () => {
    if (cancelable) {
      onDismiss();
    }
  };

  // Sort buttons to ensure cancel button is on the left
  const sortedButtons = [...buttons].sort((a, b) => {
    if (a.style === 'cancel') return -1;
    if (b.style === 'cancel') return 1;
    return 0;
  });

  const getButtonColor = (buttonStyle?: string) => {
    switch (buttonStyle) {
      case 'destructive':
        return colors.error;
      case 'cancel':
        return colors.gray;
      default:
        return colors.primary;
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={handleBackdropPress}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={tw`flex-1 justify-center items-center bg-black/50 px-6`}>
          <TouchableWithoutFeedback>
            <View
              style={[
                tw`w-full max-w-sm rounded-2xl p-6 shadow-lg`,
                { backgroundColor: isDarkMode ? colors.lightGray : colors.white },
              ]}
            >
              {/* Title */}
              {title && (
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginBottom: 12,
                    textAlign: 'center',
                  }}
                >
                  {title}
                </Text>
              )}

              {/* Message */}
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  lineHeight: 24,
                  textAlign: 'center',
                  marginBottom: 24,
                }}
              >
                {message}
              </Text>

              {/* Buttons */}
              <View style={tw`flex-row ${buttons.length > 1 ? 'gap-3' : ''}`}>
                {sortedButtons.map((button, index) => {
                  const buttonColor = getButtonColor(button.style);
                  const isCancel = button.style === 'cancel';

                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleButtonPress(button)}
                      style={[
                        tw`flex-1 py-3 rounded-lg`,
                        isCancel
                          ? [
                              tw`border`,
                              {
                                borderColor: colors.gray,
                                backgroundColor: 'transparent',
                              },
                            ]
                          : { backgroundColor: buttonColor },
                      ]}
                    >
                      <Text
                        style={{
                          color: isCancel ? colors.gray : colors.white,
                          fontSize: 16,
                          fontWeight: isCancel ? '500' : '600',
                          textAlign: 'center',
                        }}
                      >
                        {button.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AlertDialog;
