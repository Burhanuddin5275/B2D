import Header from '@/components/Header';
import { fetchCustomerPolicy } from '@/service/policy';
import { colors } from '@/theme/colors';
import { useWindowDimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import RenderHTML from 'react-native-render-html';

const Privacy = () => {
    const insets = useSafeAreaInsets();
    const [policy, setPolicy] = useState<{description: string} | null>(null);
    const [loading, setLoading] = useState(true);
    const { width } = useWindowDimensions();

    useEffect(() => {
        const getPrivacy = async () => {
            try {
                const response = await fetchCustomerPolicy('Privacy Policy');
                setPolicy(response.data);
            } catch (error) {
                console.error('Error fetching privacy policy:', error);
            } finally {
                setLoading(false);
            }
        };
        getPrivacy();
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
                <Header title="Privacy Policy" showDefaultIcons={false} />
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.descriptionContainer}>
                        {policy?.description ? (
                            <RenderHTML
                                contentWidth={width - scale(50)} 
                                source={{ html: policy.description }}
                                baseStyle={styles.descriptionText}
                            />
                        ) : (
                            null
                        )}
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        backgroundColor: colors.white
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: scale(20),
        paddingBottom: verticalScale(20),
    },
    descriptionContainer: {
        borderRadius: 12,
        padding: scale(16),
        marginTop: verticalScale(10),
    },
    descriptionText: {
        fontSize: moderateScale(14),
        color: colors.textPrimary,
        fontFamily: 'PoppinsRegular',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },

});

export default Privacy;