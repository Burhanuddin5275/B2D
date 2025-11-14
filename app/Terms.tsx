import Header from '@/components/Header';
import React from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const Terms = () => {
    const insets = useSafeAreaInsets();
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
                source={require('../assets/images/background2.png')}
                style={styles.backgroundImage}
            >
                <Header title="Terms & Conditions" showDefaultIcons={false} />
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionText}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type scrambled it make a type specimen book.
                            It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                            It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.
                            ichard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.
                        </Text>
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
    },
    scrollContent: {
        flexGrow: 1,
        paddingTop: verticalScale(20),
        paddingHorizontal: scale(25),
    },

    descriptionContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    descriptionText: {
        fontSize: moderateScale(14),
        lineHeight: moderateScale(22),
        color: '#333',
        fontFamily: 'InterRegular',
    },
})