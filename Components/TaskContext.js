import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [userTasks, setUserTasks] = useState({});

  const loadTasks = async (userId) => {
    try {
      const tasks = await AsyncStorage.getItem(`tasks_${userId}`);
      if (tasks) {
        setUserTasks((prevTasks) => ({ ...prevTasks, [userId]: JSON.parse(tasks) }));
      }
    } catch (error) {
      console.error("Erro ao carregar as tarefas:", error);
    }
  };

  const addTask = async (userId, task) => {
    try {
      const updatedTasks = [...(userTasks[userId] || []), task];
      setUserTasks((prevTasks) => ({ ...prevTasks, [userId]: updatedTasks }));
      await AsyncStorage.setItem(`tasks_${userId}`, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Erro ao adicionar a tarefa:", error);
    }
  };

  const toggleTaskCompletion = async (userId, index) => {
    try {
      const updatedTasks = [...(userTasks[userId] || [])];
      updatedTasks[index].completed = !updatedTasks[index].completed;
      setUserTasks((prevTasks) => ({ ...prevTasks, [userId]: updatedTasks }));
      await AsyncStorage.setItem(`tasks_${userId}`, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Erro ao alternar o estado da tarefa:", error);
    }
  };

  const deleteTask = async (userId, index) => {
    try {
      const updatedTasks = [...(userTasks[userId] || [])];
      updatedTasks.splice(index, 1);
      setUserTasks((prevTasks) => ({ ...prevTasks, [userId]: updatedTasks }));
      await AsyncStorage.setItem(`tasks_${userId}`, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Erro ao excluir a tarefa:", error);
    }
  };

  const editTask = async (userId, index, newText) => {
    try {
      const updatedTasks = [...(userTasks[userId] || [])];
      updatedTasks[index].text = newText;
      setUserTasks((prevTasks) => ({ ...prevTasks, [userId]: updatedTasks }));
      await AsyncStorage.setItem(`tasks_${userId}`, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Erro ao editar a tarefa:", error);
    }
  };

  return (
    <TaskContext.Provider value={{ userTasks, addTask, toggleTaskCompletion, deleteTask, editTask, loadTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);