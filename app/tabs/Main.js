import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SettingsButton from '../components/settingsButton';

const { width, height } = Dimensions.get('window');

const Main = ({ navigation }) => { 
  if (!navigation) {
    console.error("Navigation is undefined!");
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red' }}>Navigation is undefined!</Text>
      </View>
    );
  } 
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.mode_selection, { backgroundColor: 'dodgerblue', width: width * 0.75 }]} 
          onPress={() => navigation.navigate('Game')}
        >
          <View style={styles.iconTextContainer}>
            <Icon name="play" size={30} color="white" style={styles.icon} />
            <Text style={styles.mode_name}>Start</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.mode_selection, { backgroundColor: '#fa2a55', width: width * 0.5, right: width * 0.12 }]} 
          onPress={() => navigation.navigate('Online')}
        >
          <View style={styles.iconTextContainer}>
            <Icon name='account-multiple-outline' size={30} color="white" style={styles.icon} />
            <Text style={styles.mode_name}>Online Mode</Text>
          </View>
        </TouchableOpacity>
        <SettingsButton onPress={() => navigation.navigate('Settings')} />
      </View>
    </View>
  );
};

export default Main;  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: height * 0.28,
  },
  mode_selection: {
    width: width * 0.8,
    height: height * 0.08,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  mode_name: {
    fontSize: 25,
    color: 'white',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 0,
  },
});