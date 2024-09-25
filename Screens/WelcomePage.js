import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Image } from 'react-native';
import { colors } from '../utils/colors';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleStart = () => {
    navigation.navigate('LOGIN');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Olá!</Text>
        <Text style={styles.subtitle}>Seja bem vindo ao{'\n'}To Do</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStart}
          >
            <Text style={styles.startButtonText}>Começar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F1EB',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 40,
    paddingHorizontal: 20,
    textAlign: 'center',
    color: colors.primary,
    marginTop: 200,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 22,
    textAlign: 'center',
    color: colors.secondary,
    paddingTop: 55,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 79,
  },
  startButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
    width: 160,
    borderRadius: 98,
    backgroundColor: 'rgba(295, 295, 295, 0.2)', // Cor semi-translúcida para efeito de vidro
    borderWidth: 1, // Borda fina para o efeito de vidro
    borderColor: 'rgba(255, 255, 255, 0.5)', // Cor da borda semi-translúcida
    shadowOffset: { width: 0, height: 2 }, // Offset da sombra
    shadowOpacity: 0.3, // Opacidade da sombra
    shadowRadius: 3.5, // Radius da sombra
    elevation: 5, // Para Android
  },
  startButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
