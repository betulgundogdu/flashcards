// FlashCardService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId } from '@/utils/helper';

const FLASHCARDS_KEY = 'FLASHCARDS';

export interface Flashcard {
  id: string;
  listId: string; // ID of the list this flashcard belongs to
  question: string;
  answer: string;
}

// Get flashcards by list ID
export const getFlashcards = async (listId: string): Promise<Flashcard[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(FLASHCARDS_KEY);
    const allFlashcards: Flashcard[] = jsonValue ? JSON.parse(jsonValue) : [];
    return allFlashcards.filter(flashcard => flashcard.listId === listId);
  } catch (e) {
    console.error('Failed to load flashcards', e);
    return [];
  }
};

// Get list card count by list ID
export const getListCardCount = async (listId: string): Promise<number> => {
  try {
    const flashcards = await getFlashcards(listId);
    return flashcards.length;
  } catch (e) {
    console.error('Failed to count flashcards', e);
    return 0;
  }
};

// Create a new flashcard
export const createFlashcard = async (listId: string, question: string, answer: string): Promise<void> => {
  const newFlashcard: Flashcard = { id: generateId(), listId, question, answer };
  await addFlashcard(newFlashcard);
};

// Add a new flashcard
export const addFlashcard = async (flashcard: Flashcard): Promise<void> => {
  try {
    const allFlashcards = await getAllFlashcards();
    const updatedFlashcards = [...allFlashcards, flashcard];
    await AsyncStorage.setItem(FLASHCARDS_KEY, JSON.stringify(updatedFlashcards));
  } catch (e) {
    console.error('Failed to save flashcard', e);
  }
};

// Get all flashcards
export const getAllFlashcards = async (): Promise<Flashcard[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(FLASHCARDS_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load flashcards', e);
    return [];
  }
};

// Remove a specific card by listId and cardId
export const removeCard = async (listId: string, cardId: string): Promise<void> => {
  try {
    const allFlashcards = await getAllFlashcards();
    const updatedFlashcards = allFlashcards.filter(
      flashcard => !(flashcard.listId === listId && flashcard.id === cardId)
    );
    await AsyncStorage.setItem(FLASHCARDS_KEY, JSON.stringify(updatedFlashcards));
  } catch (e) {
    console.error('Failed to remove flashcard', e);
  }
};

export const updateCard = async (listId: string, cardId: string, question: string, answer: string) => {
  try {
    const allFlashcards = await getAllFlashcards();
    const updatedCard = allFlashcards.filter(
      flashcard => (flashcard.listId === listId && flashcard.id === cardId)
    )[0];
    updatedCard.question = question;
    updatedCard.answer = answer;
    await AsyncStorage.setItem(FLASHCARDS_KEY, JSON.stringify(allFlashcards));
  } catch (e) {
    console.error('Failed to remove flashcard', e);
  }
}