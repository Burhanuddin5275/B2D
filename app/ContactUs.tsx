import Header from '@/components/Header';
import StatusModal from '@/components/success';
import { contactUsApi } from '@/service/contactus';
import { useAppSelector } from '@/store/useAuth';
import { colors } from '@/theme/colors';
import { API_URL } from '@/url/Api_Url';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator, Alert, ImageBackground, StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const ContactUs = () => {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const auth = useAppSelector(s => s.auth);
    const token = auth.token;
    const [showSuccess, setShowSuccess] = useState(false);
    const [status, setstatus] = useState('');
    const handleSend = async () => {
        if (!message.trim()) {
            Alert.alert('Error', 'Please enter your message');
            return;
        }

        setIsLoading(true);
        try {
            const response = await contactUsApi(token || '', message);
            setShowSuccess(true);
           setstatus(response.message)
            setMessage('');
        } catch (error: any) {
            console.error('Error sending message:', error);
            Alert.alert('Error', error.message || 'Failed to send message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusModal
                visible={showSuccess}
                type="success"
                title="Success!"
                message={status}
                onClose={() => {
                    setShowSuccess(false);
                }}
                dismissAfter={2000}
                showButton={false}

            />
            <ImageBackground
                source={require('../assets/images/background.png')}
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
                        placeholderTextColor={colors.primaryDark}
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
                            <Ionicons name="mail" size={18} color={colors.primaryDark} />
                        </View>
                        <Text style={styles.infoValue}>support@mart2door.com</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <Ionicons name="call" size={18} color={colors.primaryDark} />
                        </View>
                        <Text style={styles.infoValue}>1-800-123-4567</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.primaryButton, isLoading && styles.disabledButton]}
                        onPress={handleSend}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonLabel}>Send message</Text>
                        )}
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
        backgroundColor: colors.white,
    },

    subtitle: {
        fontFamily: 'PoppinsMedium',
        fontSize: moderateScale(14),
        fontWeight: 500,
        textAlign: 'center',
        marginTop: verticalScale(10),
        paddingHorizontal: scale(58),
    },
    messageCard: {
        marginTop: 24,
        borderRadius: 18,
        marginHorizontal: scale(20),
        backgroundColor: 'rgba(122, 255, 131, 0.25)',
        padding: 16,
        height: verticalScale(250),
        borderWidth: 1,
        borderColor: 'rgba(47, 254, 64, 0.35)',
    },
    messageInput: {
        fontFamily: 'MontserratMedium',
        fontWeight: 500,
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
        fontWeight: 500,
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
        fontWeight: 700,
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
        fontWeight: 600,
        fontSize: moderateScale(16),
        color: colors.white,
    },
    disabledButton: {
        opacity: 0.7,
    },
});