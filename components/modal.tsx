import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface CancelOrderModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
  title?: string;
  subtitle?: string;
  cancelButtonText?: string;
  submitButtonText?: string;
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  title = 'Cancel Order',
  subtitle = 'Please tell us why you want to cancel this order',
  cancelButtonText = 'Go Back',
  submitButtonText = 'Submit',
}) => {
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
 
    try {
      setIsSubmitting(true);
      await onSubmit(cancelReason);
      setCancelReason('');
      onClose();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalSubtitle}>{subtitle}</Text>
          
          <TextInput
            style={styles.reasonInput}
            placeholder="Enter your reason here..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={cancelReason}
            onChangeText={setCancelReason}
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>{cancelButtonText}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.submitButton]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Submitting...' : submitButtonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    maxWidth: scale(300),
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'InterBold',
    marginBottom: 10,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'InterRegular',
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    fontFamily: 'InterRegular',
    fontSize: 14,
    color: colors.textPrimary,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(120),
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    color: colors.textPrimary,
    fontFamily: 'InterMedium',
    textAlign:'center'
  },
  submitButtonText: {
    color: 'white',
    fontFamily: 'InterSemiBold',
    textAlign:'center'
  },
});