import Header from '@/components/Header';
import { Country, StateItem, CityItem, fetchCountries, fetchStates, fetchCities } from '@/service/address';
import { useAppSelector } from '@/store/useAuth';
import { colors } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const AddAddress = () => {
    const router = useRouter();
    const auth = useAppSelector(s => s.auth);
    const reduxToken = auth.token;

    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('');
    const [countries, setCountries] = useState<Country[]>([]); 
    const [states, setStates] = useState<StateItem[]>([]);
    const [cities, setCities] = useState<CityItem[]>([]);
    const [isDefault, setIsDefault] = useState(false);

    // Fetch countries on load
    useEffect(() => {
        if (!reduxToken) return;

        const loadCountries = async () => {
            const data = await fetchCountries(reduxToken);
            setCountries(data);
        };

        loadCountries();
    }, [reduxToken]);

    // Fetch states when country changes
    useEffect(() => {
        if (!reduxToken || !country) return;

        const loadStates = async () => {
            const data = await fetchStates(reduxToken, country);
            setStates(data);
            setState(''); // reset selected state
        };

        loadStates();
    }, [country, reduxToken]);

    // Load cities when state changes
    useEffect(() => {
        if (!reduxToken || !state) return;
        const loadCities = async () => {
            const data = await fetchCities(reduxToken, state);
            setCities(data);
            setCity('');
        };
        loadCities();
    }, [state, reduxToken]);

const handleSaveAddress = async () => {
    if (!reduxToken) return;

    try {
        const payload = {
            address_name: fullName,
            address_line1: address,
            city: city,
            state: state,
            postal_code: zipCode,
            country: country,
            is_default: isDefault,
        };

        const response = await fetch('https://mart2door.com/customer-api/addresses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `token ${reduxToken}`,
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Failed to save address:', result);
            return;
        }

        console.log('Address saved successfully:', result);

        // Optional: go back after success
        router.back();

    } catch (error) {
        console.error('Error saving address:', error);
    }
};


    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
                <Header title="Add Address" showDefaultIcons={false} />

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
                                    <Picker selectedValue={city} onValueChange={setCity} style={styles.picker} enabled={cities.length > 0}>
                                        <Picker.Item label="Select City" value="" />
                                        {cities.map((item, index) => (
                                            <Picker.Item key={index} label={item.city} value={item.city} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                            <View style={[styles.column, { marginLeft: 10 }]}>
                                <Text style={styles.label}>State</Text>
                                <View style={styles.inputContainer}>
                                    <Picker
                                        selectedValue={state}
                                        onValueChange={setState}
                                        style={styles.picker}
                                        enabled={states.length > 0}
                                    >
                                        <Picker.Item label="Select State" value="" />
                                        {states.map((item, index) => (
                                            <Picker.Item key={index} label={item.state} value={item.state} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.column, { marginLeft: 0 }]}>
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
                                    <Picker
                                        selectedValue={country}
                                        onValueChange={setCountry}
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="Select Country" value="" />
                                        {countries.map((item, index) => (
                                            <Picker.Item key={index} label={item.country} value={item.country} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.defaultContainer}
                            onPress={() => setIsDefault(!isDefault)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.checkbox, isDefault && styles.checkboxChecked]}>
                                {isDefault && <MaterialIcons name="check" size={18} color="white" />}
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
    container: { flex: 1 },
    background: { flex: 1, backgroundColor: colors.white },
    scrollView: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 100 },
    formContainer: { borderRadius: 10, padding: 10 },
    label: { fontFamily: 'MontserratMedium', fontSize: moderateScale(14), fontWeight: '500', marginBottom: 8 },
    inputContainer: { borderWidth: 1, borderColor: colors.primary, borderRadius: 10, marginBottom: 20, backgroundColor: colors.secondaryLight },
    input: { padding: 15, fontSize: moderateScale(14) },
    addressInputContainer: { height: 120 },
    addressInput: { textAlignVertical: 'top' },
    picker: { height: 52, width: scale(180), color: '#000' },
    defaultContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingVertical: 8 },
    checkbox: { width: 24, height: 24, borderRadius: 4, borderWidth: 1, borderColor: '#D9D9D9', marginRight: 12, justifyContent: 'center', alignItems: 'center' },
    checkboxChecked: { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark },
    defaultText: { fontSize: 16, color: '#333' },
    saveButton: { backgroundColor: colors.primaryDark, height: verticalScale(58), padding: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 0, left: 0, right: 0 },
    saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    row: { flexDirection: 'row', marginBottom: 15 },
    column: { flex: 1 },
});
