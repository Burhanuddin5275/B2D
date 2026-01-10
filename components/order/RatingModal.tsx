import React from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

interface Props {
  visible: boolean;
  item: any;
  userRating: number;
  userComment: string;
  setUserRating: (val: number) => void;
  setUserComment: (val: string) => void;
  onClose: () => void;
  onSubmit: () => void;
 renderStars: React.ReactNode;
}

const RatingModal: React.FC<Props> = ({ visible, item, userRating, userComment, setUserRating, setUserComment, onClose, onSubmit, renderStars }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <View style={styles.ratingModal}>
        <View style={styles.ratingModalHeader}>
          <Text style={styles.ratingModalTitle}>Rate product</Text>
          <TouchableOpacity onPress={onClose}><Text style={styles.modalClose}>✕</Text></TouchableOpacity>
        </View>
        {item && (
          <>
            <View style={styles.ratingItemRow}>
              <Image source={item.image} style={styles.ratingItemImage} />
              <View style={styles.ratingItemInfo}>
                <Text style={styles.ratingItemName} numberOfLines={2}>{item.name}</Text>
                {item.variant && <Text style={[styles.itemName, { color: colors.textPrimary, fontSize: moderateScale(12) }]}>{item.variant}</Text>}
                <Text style={styles.ratingItemPrice}>${item.price.toFixed(2)} ({item.qty})</Text>
              </View>
            </View>
            <View style={styles.ratingContainer}>
              <View style={styles.starRow}>{renderStars}</View>
              <Text style={styles.ratingText}>{userRating > 0 ? `${userRating}` : '0'}</Text>
            </View>
            <TextInput style={styles.commentInput} placeholder="Write your feedback..." placeholderTextColor="#A7A7A7" multiline value={userComment} onChangeText={setUserComment} />
            <TouchableOpacity style={styles.submitRatingButton} onPress={onSubmit}>
              <Text style={styles.submitRatingButtonText}>Submit review</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  </Modal>
);

export default RatingModal;

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  ratingModal: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: scale(18), paddingVertical: verticalScale(18) },
  ratingModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingModalTitle: { fontFamily: 'Montserrat', fontSize: moderateScale(15), color: '#1E1E1E' },
  modalClose: { fontSize: moderateScale(18), color: '#7C7754' },
  ratingItemRow: { flexDirection: 'row', marginTop: verticalScale(16), marginBottom: verticalScale(12) },
  ratingItemImage: { width: scale(56), height: scale(56), borderRadius: 12, backgroundColor: '#FFF8EC', marginRight: scale(12) },
  ratingItemInfo: { flex: 1, justifyContent: 'center' },
  ratingItemName: { fontFamily: 'Montserrat', fontSize: moderateScale(14) },
  ratingItemPrice: { fontFamily: 'InterRegular', fontSize: moderateScale(12), color: colors.textPrimary, marginTop: verticalScale(4) },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(10) },
  starRow: { flexDirection: 'row', gap: scale(10), marginBottom: verticalScale(12) },
  ratingText: { fontFamily: 'Montserrat', fontSize: moderateScale(16), marginLeft: scale(12) },
  commentInput: { borderWidth: 1, borderColor: '#E4DEC6', borderRadius: 12, paddingHorizontal: scale(12), paddingVertical: verticalScale(10), minHeight: verticalScale(90), textAlignVertical: 'top', fontFamily: 'Montserrat', fontSize: moderateScale(13) },
  submitRatingButton: { marginTop: verticalScale(14), backgroundColor: colors.primaryDark, borderRadius: 14, paddingVertical: verticalScale(14), alignItems: 'center' },
  submitRatingButtonText: { fontFamily: 'PoppinsSemi', fontSize: moderateScale(14), color: colors.white },
  itemName: { fontFamily: 'Montserrat', fontSize: moderateScale(14) },
});
