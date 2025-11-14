import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Dimensions } from 'react-native';
import { colors } from '@/theme/colors';
const { width } = Dimensions.get('window');
export const ProductStyle = StyleSheet.create({

    backgroundImage: {
        flex: 1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: width,
    },
    productsSection: {
        marginTop: verticalScale(20),
        flexDirection: 'row'
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: verticalScale(80)
    },
    productCard: {
        width: scale(175),
        borderRightWidth: 1,
        borderColor: '#E0E0E0',
        position: 'relative',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 0,
        borderTopWidth: 1,
    },
    productImage: {
        width: scale(150),
        height: verticalScale(140),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    productEmoji: {
        fontSize: 60,
    },
    productPic: {
        width: scale(120),
        height: verticalScale(120), 
    },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    favoriteButtonActive: {
        backgroundColor: 'rgba(163, 161, 161, 0.1)',
    },

    productInfo: {
        paddingHorizontal: 4,
    },
    productName: {
        fontFamily:'PoppinsSemi',
        fontSize: moderateScale(12),
        fontWeight: '600',
        lineHeight: 18,
    },
    productSubtitle: {
        fontFamily:'PoppinsMedium',
        fontWeight: '500',
        color: colors.textPrimary,
        fontSize: moderateScale(12),
        marginTop: 2,
    },
    buttonContainer: {
        marginTop: 8,
        width: '100%',
    },
    priceText: {
        fontFamily:'PoppinsSemi',
        fontSize: moderateScale(14),
        fontWeight: '600',
    },
    addButton: {
        fontFamily:' Montserrat', 
        borderColor: '#f5a607ff',
        borderWidth: 1,
        paddingVertical: 8,
        borderRadius: 8,

    },
    addButtonText: {
        color: '#F4A300',
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 14,
    },
    qtyControl: {
        backgroundColor: '#F4A300',
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 0,
        height: 36,
    },
    qtySideButton: {
        paddingHorizontal: 12,
        height: '100%',
        justifyContent: 'center',
    },
    qtySideButtonText: {
        color: '#fff',
        fontSize: moderateScale(16),
        fontWeight: '600', 
        lineHeight: 22,
    },
    qtyPill: {
        minWidth: 36,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyText: {
        fontFamily:' Montserrat',  
        fontSize: moderateScale(14),
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center'
    },
    qtySideButtonFilled: {
        width: 28,
        height: 28,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F4A300',
    },
    qtySideButtonFilledText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
})