import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
} from 'react-native';
import { useTasks } from '../Components/TaskContext';
import { colors } from '../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Notifications from 'expo-notifications';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const colorOptions = ['#B84D33', '#79AF5E', '#3067AB', '#CBB945', '#773DB9'];

export default function AddTaskScreen({ navigation, route }) {
  const { userId } = route.params;
  const [task, setTask] = useState('');
  const [tag, setTag] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [location, setLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const { addTask } = useTasks();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        alert('Permissão de localização não concedida.');
      }
    })();
  }, []);

  const handleSave = async () => {
    if (task.trim() && tag.trim()) {
      await addTask(userId, { text: task, tag, color: selectedColor, completed: false, location });
      await schedulePushNotification(task);
      setTask('');
      setTag('');
      setLocation(null);
      navigation.navigate('ALLTASKS', { userId });
    } else {
      alert('Por favor, preencha todos os campos!');
    }
  };

  const schedulePushNotification = async (taskText) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Nova Tarefa Adicionada!",
        body: `Você adicionou a tarefa: "${taskText}"`,
      },
      trigger: null, // Envia a notificação imediatamente
    });
  };

  const handleGoBack = () => {
    navigation.navigate('HOME');
  };

  const handleMapPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    setLocation(coordinate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
          <Ionicons name={'arrow-back-outline'} color={colors.primary} size={25} />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Tarefa"
        value={task}
        onChangeText={setTask}
      />

      <View style={styles.tagContainer}>
        <TextInput
          style={styles.tagInput}
          placeholder="Tag"
          value={tag}
          onChangeText={setTag}
        />
        <TouchableOpacity
          style={[styles.colorCircle, { backgroundColor: selectedColor }]}
          onPress={() => setShowColorPicker(true)}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => setShowMapModal(true)}
        >
          <Text style={styles.mapButtonText}>Selecionar Localização</Text>
        </TouchableOpacity>
      </View>

      {location && (
        <TextInput
          style={styles.input}
          placeholder="Localização"
          value={`Lat: ${location.latitude}, Lon: ${location.longitude}`}
          editable={false}
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar Tarefa</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showColorPicker} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.colorPickerContainer}>
            <View style={styles.colorOptionsContainer}>
              {colorOptions.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorCircle, { backgroundColor: color }]}
                  onPress={() => {
                    setSelectedColor(color);
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </View>
            <TouchableOpacity onPress={() => setShowColorPicker(false)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showMapModal} animationType="slide">
        <MapView
          style={styles.map}
          onPress={handleMapPress}
          initialRegion={{
            latitude: userLocation ? userLocation.latitude : 0,
            longitude: userLocation ? userLocation.longitude : 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {location && (
            <Marker coordinate={location} title="Localização Selecionada" />
          )}
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => setShowMapModal(false)}
          >
            <Text style={styles.saveButtonText}>Fechar Mapa</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: '10%',
  },
  backButtonWrapper: {
    padding: '10%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  saveButton: {
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
    marginVertical: 10,
  },
  saveButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  colorPickerContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  closeButtonText: {
    textAlign: 'center',
    color: colors.primary,
  },
  map: {
    flex: 1,
  },
  mapButton: {
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
    marginVertical: 10,
  },
  mapButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

