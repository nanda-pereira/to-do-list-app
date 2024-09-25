import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import * as Notifications from 'expo-notifications';
import { colors } from '../utils/colors';
import { useTasks } from '../Components/TaskContext';

export default function LoginScreen({ navigation }) {
  const [secureEntery, setSecureEntery] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loadTasks } = useTasks();

  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    }
    requestPermissions();
  }, []);

  const handleLogin = async () => {
    if (email === '' || password === '') {
      setError('Preencha todos os campos');
      return;
    }

    try {
      const storedPassword = await AsyncStorage.getItem(`userPassword_${email}`);
      if (password === storedPassword) {
        await AsyncStorage.setItem('loggedUserEmail', email);
        await loadTasks(email); // Carrega as tarefas do usuário
        navigation.navigate('HOME', { userId: email }); // Passa o email como userId
      } else {
        setError('Usuário ou senha incorretos');
      }
    } catch (e) {
      setError('Erro ao acessar dados');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name={"mail-outline"} size={30} color={colors.secondary} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.secondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => {
            setSecureEntery((prev) => !prev);
            }}>
            <SimpleLineIcons name={"eye"} size={25} color={colors.secondary} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor={colors.secondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureEntery}
          />
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SIGNUP')}>
        <Text style={styles.signupText}>Não tem uma conta? Crie uma!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#F4F1EB',
  },
  form: {
    marginTop: 20,
    width: '90%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.primary,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontWeight: 'regular',
    fontSize: 16,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  signupText: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
  },
  loginButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
    width: 160,
    borderRadius: 45,
    backgroundColor: 'rgba(295, 295, 295, 0.2)', 
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, 
    shadowRadius: 3.5,
    elevation: 5,
  },
});
