import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/colors';

const TaskList = ({ tasks, onToggleTaskCompletion, onDeleteTask, onEditTask }) => {
  const renderItem = ({ item, index }) => (
    <View style={styles.taskContainer}>
      <Pressable
        style={[
          styles.checkbox,
          { borderColor: item.color },
          item.completed && { backgroundColor: item.color },
        ]}
        onPress={() => onToggleTaskCompletion(index)}
      >
        {item.completed && <Ionicons name="checkmark" size={24} color="white" />}
      </Pressable>
      <View style={styles.taskTextContainer}>
        <Text style={[styles.taskText, item.completed && styles.completedTask]}>
          {item.text}
        </Text>
        {item.tag && (
          <Text style={[styles.tagText, { color: item.color }]}>
            {item.tag}
          </Text>
        )}
        {item.location && item.location.latitude && item.location.longitude && (
          <Text style={styles.locationText}>
            {`Localização: Lat: ${item.location.latitude}, Long: ${item.location.longitude}`}
          </Text>
        )}
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => onEditTask(item, index)}>
          <Ionicons name="pencil" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDeleteTask(index)} style={styles.deleteIcon}>
          <Ionicons name="close" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={tasks}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      style={styles.taskList}
    />
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  taskText: {
    fontSize: 16,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  tagText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  locationText: {
    marginTop: 3,
    fontSize: 12,
    color: 'gray',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteIcon: {
    marginLeft: 15,
  },
});

export default TaskList;
