import Header from '@/components/Header';
import { colors } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { verticalScale } from 'react-native-size-matters';

const AddAddress = () => {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('');
    const [isDefault, setIsDefault] = useState(false);

    const handleSaveAddress = () => {
        // Handle save address logic here
        console.log('Saving address:', { fullName, phoneNumber, address, city, state, zipCode, country, isDefault });
        // You can add navigation or API call here
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../assets/images/background2.png')} style={styles.background}>
                <Header title="Add Address" />
                
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Save this address as</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Name"
                                value={fullName}
                                onChangeText={setFullName}
                                placeholderTextColor="#999"
                            />
                        </View>
                        <Text style={styles.label}>Address</Text>
                        <View style={[styles.inputContainer, styles.addressInputContainer]}>
                            <TextInput
                                style={[styles.input, styles.addressInput]}
                                placeholder="Enter your address"
                                value={address}
                                onChangeText={setAddress}
                                multiline
                                numberOfLines={4}
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.column, { marginRight: 10 }]}>
                                <Text style={styles.label}>City</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="City"
                                        value={city}
                                        onChangeText={setCity}
                                        placeholderTextColor="#999"
                                    />
                                </View>
                            </View>
                            <View style={[styles.column, { marginLeft: 10 }]}>
                                <Text style={styles.label}>State</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="State"
                                        value={state}
                                        onChangeText={setState}
                                        placeholderTextColor="#999"
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.column, { marginRight: 10 }]}>
                                <Text style={styles.label}>ZIP Code</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="ZIP Code"
                                        value={zipCode}
                                        onChangeText={setZipCode}
                                        keyboardType="numeric"
                                        placeholderTextColor="#999"
                                    />
                                </View>
                            </View>
                            <View style={[styles.column, { marginLeft: 10 }]}>
                                <Text style={styles.label}>Country</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Country"
                                        value={country}
                                        onChangeText={setCountry}
                                        placeholderTextColor="#999"
                                    />
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={styles.defaultContainer}
                            onPress={() => setIsDefault(!isDefault)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.checkbox, isDefault && styles.checkboxChecked]}>
                                {isDefault && (
                                    <MaterialIcons name="check" size={18} color="white" />
                                )}
                            </View>
                            <Text style={styles.defaultText}>Set as default address</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
                    <Text style={styles.saveButtonText}>Save Address</Text>
                </TouchableOpacity>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default AddAddress;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    formContainer: {
        borderRadius: 10,
        padding: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333',
    },
    inputContainer: {
       borderWidth: 1,
       borderColor: colors.primary,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: colors.secondaryLight,
    },
    input: {
        padding: 15,
        fontSize: 16,
        color: '#333',
    },
    addressInputContainer: {
        height: 120,
    },
    addressInput: {
        textAlignVertical: 'top',
    },
    defaultContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        paddingVertical: 8,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: colors.primaryDark,
        borderColor: colors.primaryDark,
    },
    defaultText: {
        fontSize: 16,
        color: '#333',
    },
    saveButton: {
        backgroundColor: colors.primaryDark,
        height: verticalScale(58),
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    column: {
        flex: 1,
    },
});