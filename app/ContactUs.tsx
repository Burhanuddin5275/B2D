import Header from '@/components/Header';
import { colors } from '@/theme/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const ContactUs = () => {
    const navigation = useNavigation();
    const [message, setMessage] = useState('');

    const handleSend = () => {
        // TODO: hook up with backend endpoint or support email integration
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ImageBackground
                source={require('../assets/images/background2.png')}
                style={styles.background}
            >
                <Header title="Contact Us" showDefaultIcons={false} />
                <Text style={styles.subtitle}>
                    Hello! If you're facing any difficulties using the app or have any
                    suggestions, please send us a message.
                </Text>

                <View style={styles.messageCard}>
                    <TextInput
                        multiline
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Type your message here..."
                        placeholderTextColor="#B49C63"
                        style={styles.messageInput}
                        textAlignVertical="top"
                    />
                </View>

                <View style={styles.supportCard}>
                    <Text style={styles.supportText}>
                        If you require assistance, please reach out to our support team at
                    </Text>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <Ionicons name="mail" size={18} color="#E9B10F" />
                        </View>
                        <Text style={styles.infoValue}>support@buzz2door.com</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <Ionicons name="call" size={18} color="#E9B10F" />
                        </View>
                        <Text style={styles.infoValue}>1-800-123-4567</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.primaryButton} onPress={handleSend}>
                        <Text style={styles.buttonLabel}>Send message</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default ContactUs;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    background: {
        flex: 1,
    },

    subtitle: {
        fontFamily: 'PoppinsMedium',
        fontSize: moderateScale(14),
        fontWeight:500,
        textAlign: 'center',
        marginTop: verticalScale(10),
        paddingHorizontal: scale(58),
    },
    messageCard: {
        marginTop: 24,
        borderRadius: 18,
        marginHorizontal: scale(20),
        backgroundColor: 'rgba(255, 211, 122, 0.25)',
        padding: 16,
        height: verticalScale(250),
        borderWidth: 1,
        borderColor: 'rgba(254, 189, 47, 0.35)',
    },
    messageInput: {
        fontFamily: 'MontserratMedium',
        fontWeight:500,
        fontSize: 14,
        color: colors.primaryDark,
    },
    supportCard: {
       marginBottom: verticalScale(20),
        borderRadius: 18,
        padding: 20,
    },
    supportText: {
        fontFamily: 'MontserratMedium',
        fontWeight:500,
        fontSize: moderateScale(14),
        marginHorizontal: scale(20),
        textAlign: 'center',
        marginBottom: verticalScale(10),
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoIcon: {
        width: scale(30),
        height: verticalScale(20),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    infoValue: {
        fontFamily: 'Montserrat',
        fontWeight:700,
        fontSize: moderateScale(14),
        color: colors.primaryDark,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    primaryButton: {
        height: verticalScale(68),
        backgroundColor: colors.primaryDark,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primaryDark,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 4,
    },
    buttonLabel: {
        fontFamily: 'Montserrat',
        fontWeight:600,
        fontSize: moderateScale(16),
        color: colors.white,
    },
});