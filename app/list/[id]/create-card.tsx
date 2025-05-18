import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createFlashcard } from '../../../services/FlashCardService';
import { Text, Button } from 'react-native-paper';

const CreateCardScreen = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const handleSave = async () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert('Error', 'Question and answer cannot be empty.');
      return;
    }
    try {
      await createFlashcard(id as string, question, answer);
      router.push(`/list/${id}`);
    } catch (error) {
      console.error('Error creating card:', error);
      Alert.alert('Error', 'Failed to create the flashcard. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Question:</Text>
      <TextInput
        style={styles.input}
        value={question}
        onChangeText={setQuestion}
        placeholder="Enter the question"
      />
      <Text style={styles.text}>Answer:</Text>
      <TextInput
        style={styles.input}
        value={answer}
        onChangeText={setAnswer}
        placeholder="Enter the answer"
      />
      <Button onPress={handleSave} mode="contained" style={styles.saveButton} >
        Save
      </Button>
    </View>
  );
};

export default CreateCardScreen;

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
    width: '50%',
    maxWidth: 400,
    backgroundColor: '#283537',
    paddingVertical: 10,
    borderRadius: 8,
  },
});
