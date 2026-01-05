import { colors } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

type StatusType = 'success' | 'error' | 'info' | 'warning';

interface StatusModalProps {
  visible: boolean;
  type: StatusType;
  title: string;
  message: string;
  onClose: () => void;
  buttonText?: string;
  onButtonPress?: () => void;
  showButton?: boolean;
    autoDismiss?: boolean;
  dismissAfter?: number;
}

const StatusModal: React.FC<StatusModalProps> = ({
  visible,
  type,
  title,
  message,
  onClose,
  buttonText = 'OK',
  onButtonPress,
  showButton = true,
  autoDismiss = type === 'success',
  dismissAfter = 2000,
}) => {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (visible && autoDismiss) {
      timer = setTimeout(() => {
        onClose();
      }, dismissAfter);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, autoDismiss, dismissAfter, onClose]);
  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return colors.primaryDark;
      case 'error':
        return colors.primary;
      case 'warning':
        return colors.secondaryDark;
      case 'info':
      default:
        return colors.primary;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={[styles.iconContainer, { backgroundColor: `${getIconColor()}20` }]}>
            <MaterialIcons
              name={getIconName()}
              size={scale(40)}
              color={getIconColor()}
            />
          </View>
          
          {title && <Text style={styles.title}>{title}</Text>}
          <Text style={styles.message}>{message}</Text>
          
          {showButton && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: getIconColor() }]}
              onPress={onButtonPress || onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={scale(20)} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  container: {
    width: scale(250),
    backgroundColor: colors.white,
    borderRadius: scale(16),
    padding: scale(24),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(20),
    fontFamily: 'MontserratSemiBold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
  message: {
    fontSize: moderateScale(14),
    fontFamily: 'Montserrat',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  button: {
    width: '100%',
    paddingVertical: verticalScale(12),
    borderRadius: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontFamily: 'MontserratSemiBold',
  },
  closeButton: {
    position: 'absolute',
    top: scale(12),
    right: scale(12),
    padding: scale(8),
  },
});

export default StatusModal;