// ListService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId } from '@/utils/helper';

const LIST_KEY = 'LISTS';

export interface List {
  id: string; // Unique ID for the list
  name: string;
  cardCount: number; // Number of cards in the list
  desc: string;
}

export const getLists = async (): Promise<List[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(LIST_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load lists', e);
    return [];
  }
};

export const createList = async (name: string, desc: string): Promise<string> => {
  try {
    const lists = await getLists();
    const listId = generateId();
    const newList: List = { id: listId, name, cardCount: 0, desc }; // Generate a unique id
    const updatedLists = [...lists, newList];
    const jsonValue = JSON.stringify(updatedLists);
    await AsyncStorage.setItem(LIST_KEY, jsonValue);
    return listId;
  } catch (e) {
    console.error('Failed to save list', e);
    return '';
  }
};

export const getListById = async (listId: string): Promise<List[]> => {
  try {
    const lists = await getLists();
    return lists.filter(list => list.id === listId);
  } catch (e) {
    console.error('Failed to load list', e);
    return [];
  }
};

export const updateList = async (listId: string, name: string, desc: string) => {
  try {
    const lists = await getLists();
    const updatedList = lists.filter(
      list => (list.id === listId)
    )[0];
    updatedList.name = name;
    updatedList.desc = desc;
    await AsyncStorage.setItem(LIST_KEY, JSON.stringify(lists));
  } catch (e) {
    console.error('Failed to save list', e);
    return '';
  }
};

export const deleteList = async (listId: string): Promise<any[]> => {
  const lists = await getLists();
  const updatedLists = lists.filter((l) => l.id !== listId);
  await AsyncStorage.setItem(LIST_KEY, JSON.stringify(updatedLists));
  return updatedLists;
};