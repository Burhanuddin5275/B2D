import Header from '@/components/Header';
import { colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale } from 'react-native-size-matters';

interface Address {
    id: string;
    name: string;
    address: string;
}

const ManageAddress = () => {
    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: '1',
            name: 'Home',
            address: '123 Main St, Apt 4B, New York, NY 10001',
        },
        {
            id: '2',
            name: 'Work',
            address: '456 Business Ave, Floor 2, New York, NY 10010',
        },
    ]);

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../assets/images/background2.png')}
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
                           <View style={{flexDirection: 'row', width:scale(250)}}>
                        <Text style={styles.addressText}>{address.address}</Text>
                                    <TouchableOpacity 
                                    style={styles.menuButton}
                                    onPress={() => {
                                        // Handle menu press (edit/delete)
                                        // You can implement an action sheet or modal here
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
                    <Ionicons name="add" size={24} color="#fff" />
                    <Text style={styles.addButtonText}>Add New Address</Text>
                </TouchableOpacity>
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
    },
    scrollView: {
        flex: 1,
        paddingBottom: 100, // To make space for the add button
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
        marginBottom: 12,
    },
    addressTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginRight: 8,
    },
    menuButton: {
    marginLeft: scale(15)
    },
    addressText: {
        fontSize: 14,
        color: '#666',
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
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});