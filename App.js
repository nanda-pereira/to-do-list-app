import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import WelcomePage from './Screens/WelcomePage';
import HomeScreen from './Screens/HomeScreen';
import AllTasksScreen from './Screens/AllTasksScreen';
import AddTaskScreen from './Screens/AddTaskScreen';
import LoginScreen from './Screens/LoginScreen';
import SignUpScreen from './Screens/SignUpScreen';
import { TaskProvider } from './Components/TaskContext';
import { useEffect, useRef, useState } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { colors } from './utils/colors';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

//app de Fernanda Pereira e Giovanna Ferreira

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="WELCOME" component={WelcomePage} />
    <Stack.Screen name="LOGIN" component={LoginScreen} />
    <Stack.Screen name="SIGNUP" component={SignUpScreen} />
  </Stack.Navigator>
);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const DrawerContent = ({ navigation }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('currentUserId');
    navigation.reset({
      index: 0,
      routes: [{ name: 'AUTH' }],
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Text style={styles.textMenu}>Menu</Text>
      <TouchableOpacity>
        <Text style={styles.textMenu}>Minhas Tarefas</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.textMenu}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [location, setLocation] = useState(null);
  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } else {
        alert('Permissão para acessar a localização foi negada!');
      }
    })();
  }, []);

  return (
    <NavigationContainer>
      <TaskProvider>
        <Drawer.Navigator
          drawerContent={props => <DrawerContent {...props} />}
          screenOptions={{
            drawerStyle: {
              backgroundColor: colors.background,
              width: 240,
            },
            headerShown: false,
          }}
        >
          <Drawer.Screen name="AUTH" component={AuthStack} />
          <Drawer.Screen name="HOME" component={HomeScreen} />
          <Drawer.Screen name="ADDTASK" component={AddTaskScreen} />
          <Drawer.Screen name="ALLTASKS" component={AllTasksScreen} />
        </Drawer.Navigator>
      </TaskProvider>
    </NavigationContainer>
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Falha ao conseguir token para notificação push!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Use um dispositivo físico para as notificações push');
  }

  return token;
}

const styles = StyleSheet.create({
  textMenu: {
    marginTop: '30%', 
    fontSize: 18, 
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'justify',
    paddingHorizontal: 10, 
  },
});
