import Header from '@/components/Header';
import { fetchCustomerPolicy } from '@/service/policy';
import { colors } from '@/theme/colors';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const Terms = () => {
    const insets = useSafeAreaInsets();
    const [terms, setTerms] = useState<{ description: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const { width } = useWindowDimensions();
    useEffect(() => {
        const getTerms = async () => {
            try {
                const response = await fetchCustomerPolicy('Terms and Conditions');
                setTerms(response.data);
            } catch (error) {
                console.error('Error fetching Terms and Conditions:', error);
            } finally {
                setLoading(false);
            }
        };
        getTerms();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primaryDark} />
            </View>
        );
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
                source={require('../assets/images/background.png')}
                style={styles.backgroundImage}
            >
                <Header title="Terms & Conditions" showDefaultIcons={false} />
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.descriptionContainer}>
                        {terms?.description ? (
                            <RenderHTML
                                contentWidth={width - scale(50)}
                                source={{ html: terms.description }}
                                baseStyle={styles.descriptionText}
                            />
                        ) : (
                            null
                        )}
                    </View>
                </ScrollView>

            </ImageBackground>
        </SafeAreaView>
    )
}

export default Terms

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollContent: {
        flexGrow: 1,
        paddingTop: verticalScale(20),
        paddingHorizontal: scale(25),
    },

    descriptionContainer: {
        borderRadius: 12,
    },
    descriptionText: {
        fontSize: moderateScale(14),
        fontFamily: 'InterRegular',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
})