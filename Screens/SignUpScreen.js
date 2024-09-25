import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../utils/colors';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTasks } from '../Components/TaskContext';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState(''); // Adicione esta linha
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { loadTasks } = useTasks();
  const [secureEntery, setSecureEntery] = useState(true);


  const handleSignUp = async () => {
    if (name === '' || email === '' || password === '' || confirmPassword === '') {
      setError('Preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não parecem iguais');
      return;
    }

    try {
      // Salva o nome, senha e o email do usuário no AsyncStorage
      await AsyncStorage.setItem(`userName_${email}`, name); // Salva o nome
      await AsyncStorage.setItem(`userPassword_${email}`, password);
      await AsyncStorage.setItem(`userId_${email}`, email);

      // Salva um array vazio de tarefas associadas ao email do novo usuário
      await AsyncStorage.setItem(`userTasks_${email}`, JSON.stringify([]));

      // Carrega as tarefas do novo usuário
      await loadTasks(email);

      setError('');
      navigation.navigate('LOGIN'); // Navegar para Login após registro
    } catch (e) {
      setError('Erro ao salvar dados');
      console.error('Error saving data:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor={colors.secondary}
            value={name}
            keyboardType="email-address"
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name={"mail-outline"} size={30} color={colors.secondary} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            placeholderTextColor={colors.secondary}
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

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => {
              setSecureEntery((prev) => !prev);
              }}>
              <SimpleLineIcons name={"eye"} size={25} color={colors.secondary} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Confirmar Senha"
            value={confirmPassword}
            placeholderTextColor={colors.secondary}
            onChangeText={setConfirmPassword}
            secureTextEntry={secureEntery}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.signupButton}
        onPress={handleSignUp}
      >
        <Text style={styles.signupButtonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('LOGIN')}>
        <Text style={styles.loginText}>Já tem uma conta? Faça Login</Text>
      </TouchableOpacity>
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.primary,
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
  input: {
      flex: 1,
      paddingHorizontal: 10,
      fontWeight: "regular",
      fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  form: {
    marginTop: 30,
    width: '100%',
  },
  signupButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },  
  signupButton: {
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
  loginText: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
  },
});
