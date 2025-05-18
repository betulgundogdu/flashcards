// create-list.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { createNewList } from '../stores/slices/listsSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../stores';

const ListDetailScreen: React.FC = () => {
  const [name, setName] = useState<string>();
  const [desc, setDesc] = useState<string>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSave = async () => {
    if (name && desc) {
      try {
        const newListId = await dispatch(createNewList({ name, desc })).unwrap();
  
        router.push({
          pathname: `/list/${newListId}/edit`,
        });
      } catch (error) {
        console.error('List not created:', error);
      }
    } else {
      console.error('Please fill name and desc fields.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>List Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a list name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#aaa"
      />
      <Text style={styles.text}>Description:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a description"
        value={desc}
        onChangeText={setDesc}
        placeholderTextColor="#aaa"
      />
      <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
        Save
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#eceae4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  toggleButton: {
    backgroundColor: '#6200ea',
    marginRight: 10,
    borderRadius: 8,
  },
  nextButton: {
    backgroundColor: '#03dac6',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  input: {
    width: 250,
    padding: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  saveButton: {
    marginTop: 20,
    width: '30%',
    maxWidth: 400,
    backgroundColor: '#283537',
    paddingVertical: 10,
    borderRadius: 8,
  },
});

export default ListDetailScreen;
