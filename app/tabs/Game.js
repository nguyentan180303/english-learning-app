import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GoBackButton from '../components/goback';
import {playSound} from'../sound/opensound';

const Game = () => {
    const navigation = useNavigation();

    const handlePress = (route) => {
        playSound(require('../soundassets/opensound.mp3'));
        navigation.navigate(route);
    };

    return (
        <View style={styles.container}>
            <GoBackButton />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/** Game Buttons Rows */}
                {gameData.map((row, index) => (
                    <View key={index} style={styles.row}>
                        {row.map((game, idx) => (
                            <TouchableOpacity 
                                key={idx}
                                style={styles.button} 
                                onPress={() => handlePress(game.route)}
                            >
                                {game.image ? (
                                    <ImageBackground 
                                        source={game.image} 
                                        resizeMode="center"
                                        style={styles.imageBackground}
                                    >
                                        <Text style={styles.buttonText}>{game.label}</Text>
                                    </ImageBackground>
                                ) : (
                                    <Text style={styles.buttonText}>{game.label}</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

// Game Button Data
const gameData = [
    [
        { label: 'Sentence Building', route: 'SentenceBuildingGame', image: require('../assets/game1.png') },
        { label: 'Grammar Practice', route: 'MultipleChoiceGame', image: require('../assets/game2.png') }
    ],
    [
        { label: 'Matching Translation', route: 'MemoryFlipGame', image: require('../assets/game3.png') },
        { label: 'Find the number', route: 'SchulteTable', image: require('../assets/game4.png') }
    ],
    [
        { label: 'True or False', route: 'TrueOrFalseGame', image: require('../assets/game5.png')},
        { label: 'Forming Words', route: 'UnscrambleWordsGame', image: require('../assets/game6.png') }
    ],
    // [
    //     { label: 'Listening Game', route: 'ListeningGame', image: require('../assets/game7.png') },
    //     { label: 'Memory Game', route: 'ListeningGame', image: require('../assets/game8.png') }
    // ]
];

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 100, // Adjust padding to prevent content cutoff on smaller screens
    },
    scrollContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20, // Add some space at the bottom
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Ensure buttons are evenly spaced
        marginBottom: 20,
    },
    button: {
        width: width * 0.45,
        height: height * 0.35,
        margin: 10,
        backgroundColor: 'white',
        justifyContent: 'flex-start', // Align text to the top
        alignItems: 'center',
        borderRadius: 20,
        overflow: 'hidden', // Prevent image overflow in buttons
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5, // For Android shadow support
    },
    imageBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start', // Align text to the top
        alignItems: 'center',
    },
    buttonText: {
        width: '100%',
        height: '30%',
        textAlign: 'center',
        // color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        // backgroundColor: 'rgba(0, 0, 0, 0.4)', 
        paddingTop: 10,
    },
});

export default Game;
