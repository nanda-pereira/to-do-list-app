import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { useTasks } from '../Components/TaskContext';
import { colors } from '../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TaskList from '../Components/TaskList';

export default function AllTasksScreen({ navigation, route }) {
  const { userId } = route.params;
  const { userTasks, toggleTaskCompletion, deleteTask, editTask, loadTasks } = useTasks();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTaskText, setNewTaskText] = useState('');

  const tasks = userTasks[userId] || [];
  const filter = route.params?.filter;

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // Para 'all'
  });

  useEffect(() => {
    const fetchTasks = async () => {
      await loadTasks(userId);
    };
    if (userId) {
      fetchTasks();
    }
  }, [userId, loadTasks]);

  const handleEdit = async () => {
    if (selectedTask !== null && newTaskText.trim()) {
      await editTask(userId, selectedTask.index, newTaskText);
      setModalVisible(false);
      setNewTaskText('');
    }
  };

  const handleDelete = async (index) => {
    await deleteTask(userId, index);
  };

  const handleGoBack = () => {
    navigation.navigate('HOME');
  };

  const handleTaskSelect = (task, index) => {
    setSelectedTask({ ...task, index });
    setNewTaskText(task.text);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
          <Ionicons name={'arrow-back-outline'} color={colors.primary} size={25} />
        </TouchableOpacity>
      </View>
      {filteredTasks.length === 0 ? (
        <Text style={styles.noTasksText}>Nenhuma tarefa encontrada!</Text>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onToggleTaskCompletion={toggleTaskCompletion.bind(null, userId)}
          onDeleteTask={handleDelete}
          onEditTask={handleTaskSelect}
        />
      )}

      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Novo texto da tarefa"
            value={newTaskText}
            onChangeText={setNewTaskText}
          />
          <TouchableOpacity onPress={handleEdit} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
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
  noTasksText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'red',
  },
});