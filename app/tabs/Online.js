import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Navbar from '../components/navbar';
const Online = React.memo(() => {
  return (
    <Navbar />
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Online;