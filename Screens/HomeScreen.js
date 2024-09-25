import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useTasks } from '../Components/TaskContext';
import { colors } from '../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation, route }) {
  const { userId } = route.params || {};
  const { loadTasks } = useTasks();
  const [userName, setUserName] = useState(''); 

  useEffect(() => {
    const getUserName = async () => {
      if (userId) {
        const name = await AsyncStorage.getItem(`userName_${userId}`);
        if (name) {
          setUserName(name);
        }
        loadTasks(userId);
      }
    };

    getUserName();
  }, [userId, loadTasks]);

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={30} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Olá, {userName}!</Text>
        <Text style={styles.subtitle}>Estas são suas tarefas para hoje</Text>

        <View style={styles.cardsContainer}>
          <View style={styles.cardWrapper}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('ALLTASKS', { filter: 'completed', userId })}
            >
              <View style={styles.cardIconContainer}>
                <Image source={require('../Assets/check.png')} style={styles.customIcon} />
              </View>
              <Text style={styles.cardText}>Concluídas</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardWrapper}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('ALLTASKS', { filter: 'pending', userId })}
            >
              <View style={styles.cardIconContainer}>
                <Image source={require('../Assets/clock.png')} style={styles.customIcon} />
              </View>
              <Text style={styles.cardText}>Pendentes</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('ADDTASK', { userId, reloadTasks: loadTasks })}
          >
            <Ionicons name="add" size={30} color="gray" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  menuContainer: {
    marginTop: '15%',
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    margin: '2%',
    marginLeft: '4%',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    marginTop: '8%',
  },
  subtitle: {
    paddingTop: '4%',
    fontSize: 17,
    color: '#333',
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardWrapper: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  card: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(189, 134, 92, 0.2)',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardIconContainer: {
    backgroundColor: '#E7C0A3',
    width: 50,
    height: 46,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  addButton: {
    borderRadius: 30,
    padding: 15,
    backgroundColor: '#E7C0A3',
  },
  customIcon: {
    width: 42,
    height: 39,
    marginTop: 5,
  },
});
