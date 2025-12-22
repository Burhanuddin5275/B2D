import Header from '@/components/Header';
import { colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface Address {
    id: string;
    name: string;
    address: string;
}

const ManageAddress = () => {
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const insets = useSafeAreaInsets();
    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: '1',
            name: 'Home',
            address: '123 Main St, Apt 4B\nNew York, Manhattan, NY 10001',
        },
        {
            id: '2',
            name: 'Work',
            address: '456 Business Ave, Floor 2\nNew York, Queens, NY 10010',
        },
    ]);

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../assets/images/background.png')}
                style={styles.background}
            >
                <Header title="Manage Address" showDefaultIcons={false} />
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                    {addresses.map((address) => (
                        <View key={address.id} style={styles.addressCard}>
                            <View style={styles.addressHeader}>
                                <View style={styles.addressTitleContainer}>
                                    <Text style={styles.addressName}>{address.name}</Text>
                                </View>
                            </View>
                            <View style={styles.addressRow}>
                                <Text style={styles.addressText}>{address.address}</Text>

                                <TouchableOpacity
                                    style={styles.menuButton}
                                    onPress={() => {
                                        setSelectedAddress(address);
                                        setIsModalVisible(true);
                                    }}
                                >
                                    <Ionicons name="ellipsis-vertical" size={25} color={'gray'} />
                                </TouchableOpacity>
                            </View>

                        </View>
                    ))}
                </ScrollView>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push('/AddAddress')}
                >
                    <Text style={styles.addButtonText}>Add New Address</Text>
                </TouchableOpacity>

                {/* Action Modal */}
                <Modal
                    visible={isModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setIsModalVisible(false)}
                >
                    <View style={[styles.modalOverlay, { paddingBottom: Math.max(insets.bottom, verticalScale(1)) }]}>
                        <TouchableOpacity
                            style={styles.modalBackground}
                            activeOpacity={1}
                            onPress={() => setIsModalVisible(false)}
                        />
                        <View style={styles.modalContainer}>
                            <View style={styles.actionSheet}>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => {
                                        if (selectedAddress) {
                                            router.push({
                                                pathname: '/AddAddress',
                                                params: { addressId: selectedAddress.id }
                                            });
                                        }
                                        setIsModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.actionButtonText}>Edit address</Text>
                                </TouchableOpacity>

                                <View style={styles.divider} />

                                <TouchableOpacity
                                    style={[styles.actionButton, styles.destructiveButton]}
                                    onPress={() => {
                                        if (selectedAddress) {
                                            setAddresses(addresses.filter(addr => addr.id !== selectedAddress.id));
                                        }
                                        setIsModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.destructiveButtonText}>Remove address</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default ManageAddress;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        backgroundColor:colors.white
    },
    scrollView: {
        flex: 1,
        paddingBottom: verticalScale(100),
    },
    scrollViewContent: {
        padding: 16,
        paddingBottom: 24,
    },
    addressCard: {
        backgroundColor: colors.secondaryLight,
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        borderColor: colors.primary,
        borderWidth: 2,
    },
    addressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressName: {
        fontFamily: 'Montserrat',
        fontSize: moderateScale(16),
        fontWeight: '600',
        marginRight: 8,
    },
addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
},

menuButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
},
addressText: {
    fontFamily: 'MontserratMedium',
    fontWeight: '500',
    fontSize: moderateScale(14),
},

    addButton: {
        height: verticalScale(68),
        flexDirection: 'row',
        backgroundColor: colors.primaryDark,
        borderRadius: 8,
        padding: 16,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        position: 'absolute',
        left: 0,
        right: 0,
    },
    addButtonText: {
        fontFamily: 'Montserrat',
        color: colors.white,
        fontSize: moderateScale(16),
        fontWeight: '600',
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalBackground: {
        flex: 1,
    },
    modalContainer: {
        padding: 8,
        paddingBottom: 34,
    },
    actionSheet: {
        backgroundColor: 'rgba(242, 242, 247, 0.8)',
        borderRadius: 13,
        overflow: 'hidden',
        marginBottom: 8,
        marginHorizontal: 8,
    },
    actionButton: {
        paddingVertical: 16,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    actionButtonText: {
        fontFamily: 'MontserratMedium',
        fontSize: moderateScale(14),
        color: '#007AFF',
        fontWeight: '400',
    },
    destructiveButton: {
        backgroundColor: 'white',
    },
    destructiveButtonText: {
        fontSize: moderateScale(14),
        color: '#FF3B30',
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: colors.secondaryLight,
        borderRadius: 13,
        paddingVertical: 16,
        alignItems: 'center',
        marginHorizontal: 8,
    },
    cancelButtonText: {
        fontSize: moderateScale(14),
        color: '#298ef9ff',
        fontWeight: '600',
    },
    divider: {
        height: 0.5,
        backgroundColor: 'rgba(60, 60, 67, 0.29)',
    },
});