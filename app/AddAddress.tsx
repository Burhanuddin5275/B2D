import Header from '@/components/Header';
import StatusModal from '@/components/success';
import { CityItem, Country, fetchCities, fetchCountries, fetchStates, StateItem } from '@/service/address';
import { useAppSelector } from '@/store/useAuth';
import { colors } from '@/theme/colors';
import { API_URL } from '@/url/Api_Url';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const AddAddress = () => {
    const router = useRouter();
    const auth = useAppSelector(s => s.auth);
    const reduxToken = auth.token;
    const { addressId, addressName, addressLine1, suite ,city: propCity, state: propState, postalCode, country: propCountry, isDefaults } = useLocalSearchParams<{
        addressId?: string;
        addressName?: string;
        suite?:string
        addressLine1?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
        isDefaults?: string;
    }>();
    const [fullName, setFullName] = useState(addressName || '');
    const [address, setAddress] = useState(addressLine1 || '');
    const [city, setCity] = useState(propCity || '');
    const [state, setState] = useState(propState || '');
    const [zipCode, setZipCode] = useState(postalCode || '');
    const [country, setCountry] = useState(propCountry || '');
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<StateItem[]>([]);
    const [cities, setCities] = useState<CityItem[]>([]);
    const [suiteNumber, setSuiteNumber] = useState(suite||'');
    const [isDefault, setIsDefault] = useState(isDefaults === 'true');
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState('');
    // Fetch countries only once
    useEffect(() => {
        if (!reduxToken) return;

        const loadCountries = async () => {
            try {
                const data = await fetchCountries(reduxToken);
                setCountries(data);

                // If we have a country from props, make sure it's selected
                if (propCountry && data.some(c => c.country === propCountry)) {
                    setCountry(propCountry);
                }
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        loadCountries();
    }, [reduxToken]);

    // Fetch states only if country changes
    useEffect(() => {
        if (!reduxToken || !country) return;

        const loadStates = async () => {
            try {
                const data = await fetchStates(reduxToken, country);
                const dataWithCountry = data.map(stateItem => ({ ...stateItem, country }));
                setStates(dataWithCountry);

                // If we have a state from props and it exists in the new states list, select it
                if (propState && dataWithCountry.some(s => s.state === propState)) {
                    setState(propState);
                    // If we have a city prop, set it immediately after state is set
                    if (propCity) {
                        setCity(propCity);
                    }
                } else {
                    setState('');
                    setCity('');
                }
                setCities([]);
            } catch (error) {
                console.error('Error fetching states:', error);
            }
        };

        loadStates();
    }, [country, reduxToken, propState, propCity]);

    useEffect(() => {
        if (!reduxToken || !state) {
            setCities([]);
            return;
        }

        const loadCities = async () => {
            try {
                const response = await fetchCities(reduxToken, state);
                if (response?.length > 0) {
                    const dataWithState = response.map((cityItem) => ({
                        ...cityItem,
                        state,
                        city: cityItem.city || 'No city found',
                        country: country
                    }));
                    setCities(dataWithState);

                    // If we have a city from props or state, and it exists in the new cities list, select it
                    const cityToSet = propCity || city;
                    if (cityToSet && dataWithState.some(c => c.city === cityToSet)) {
                        setCity(cityToSet);
                    } else if (city && !dataWithState.some(c => c.city === city)) {
                        // If current city is not in the list, clear it
                        setCity('');
                    }
                } else {
                    setCities([{
                        city: 'No city found',
                        state,
                    }]);
                    setCity('');
                }
            } catch (error) {
                console.error('Error fetching cities:', error);
                setCities([{
                    city: 'Error loading cities',
                    state,
                }]);
                setCity('');
            }
        };

        // Only fetch cities if we don't already have them for this state
        if (cities.length === 0 || cities[0]?.state !== state) {
            loadCities();
        } else if (city && !cities.some(c => c.city === city)) {
            // If we have cities but the current city isn't in the list, clear it
            setCity('');
        }
    }, [state, reduxToken, country, propCity]);

    const handleSaveAddress = async () => {
        if (!reduxToken) return;

        try {
            const payload = {
                address_name: fullName,
                suite:suiteNumber,
                address_line1: address,
                city: city,
                state: state,
                postal_code: zipCode,
                country: country,
                is_default: isDefault,
            };
            const url = addressId
                ? `${API_URL}customer-api/addresses/${addressId}`
                : `${API_URL}customer-api/addresses`;
            const response = await fetch(url, {
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
            setShowSuccess(true);
            setMessage(result.message)

        } catch (error) {
            console.error('Error saving address:', error);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusModal
                visible={showSuccess}
                type="success"
                title="Success!"
                message={message}
                onClose={() => {
                    setShowSuccess(false);
                    router.back();
                }}
                dismissAfter={2000}
                showButton={false}

            />
            <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
                <Header
                    title={addressId ? "Edit Address" : "Add Address"}
                    showDefaultIcons={false}
                />
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.formContainer}>
                        <View style={[styles.row, { marginBottom: 16 }]}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <Text style={styles.label}>Address name</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Name"
                                        value={fullName}
                                        onChangeText={setFullName}
                                        placeholderTextColor="#999"
                                    />
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Suite/Apt #</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Optional"
                                        value={suiteNumber}
                                        onChangeText={setSuiteNumber}
                                        placeholderTextColor="#999"
                                    />
                                </View>
                            </View>
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
                                    <Picker selectedValue={city}
                                        onValueChange={(itemValue) => setCity(itemValue)}
                                        style={styles.picker}
                                        enabled={cities.length > 0}
                                    >
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
                                        onValueChange={(itemValue) => setState(itemValue)}
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
                                        maxLength={5}
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
                                        onValueChange={(itemValue) => setCountry(itemValue)}
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
                    <Text style={styles.saveButtonText}>{addressId ? "Update Address" : "Save Address"}</Text>
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
