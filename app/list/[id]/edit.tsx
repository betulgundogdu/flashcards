import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, FlatList } from 'react-native';
import { Text, Button, IconButton, Icon, Dialog, Portal } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlashcardsByListId, updateFlashcard, deleteFlashcard } from '@/stores/slices/flashcardsSlice';
import { updateListInfo, getList } from '../../../stores/slices/listsSlice';
import { AppDispatch, RootState } from '../../../stores';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const EditList: React.FC = () => {
  const [list, setList] = useState<{ id: string; name: string; desc: string } | null>(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [tempQuestion, setTempQuestion] = useState('');
  const [tempAnswer, setTempAnswer] = useState('');
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocalSearchParams();
  const listId = params.id as string;
  const { flashcards } = useSelector((state: RootState) => state.flashcards);

  useEffect(() => {
    const fetchList = async () => {
      try {
        if (!listId) {
          console.error("List ID is undefined");
          return;
        }
        const result = await dispatch(getList(listId)).unwrap();
        if (result) {
          setList(result);
          setName(result.name);
          setDesc(result.desc);
        } else {
          console.error("List not found");
        }
      } catch (error) {
        console.error("Fetch list error:", error);
      }
    };

    fetchList();
    dispatch(fetchFlashcardsByListId(listId));
  }, [dispatch, listId]);

  const handleSaveName = async () => {
    if (list) {
      await dispatch(updateListInfo({ id: list.id, name, desc }));
      const updatedList = await dispatch(getList(listId)).unwrap();
      if (updatedList) {
        setList(updatedList);
        setName(updatedList.name);
        setDesc(updatedList.desc);
      }
      setIsEditingName(false);
    }
  };

  const handleSaveDesc = async () => {
    if (list) {
      await dispatch(updateListInfo({ id: list.id, name, desc }));
      const updatedList = await dispatch(getList(listId)).unwrap();
      if (updatedList) {
        setList(updatedList);
        setName(updatedList.name);
        setDesc(updatedList.desc);
      }
      setIsEditingDesc(false);
    }
  };

  const handleEditCard = (cardId: string, question: string, answer: string) => {
    setEditingCardId(cardId);
    setTempQuestion(question);
    setTempAnswer(answer);
  };

  const handleSaveCard = async () => {
    if (editingCardId) {
      await dispatch(updateFlashcard({ listId: listId, cardId: editingCardId, question: tempQuestion, answer: tempAnswer }));
      await dispatch(fetchFlashcardsByListId(listId));
      setEditingCardId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCardId(null);
    setTempQuestion('');
    setTempAnswer('');
  };

  const handleAddCard = () => {
    router.push(`/list/${listId}/create-card`);
  };

  const handleConfirmDelete = () => {
    if (selectedCardId) {
      dispatch(deleteFlashcard({ listId, cardId: selectedCardId }));
      setIsDeleteDialogVisible(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      extraHeight={50}
      enableOnAndroid={true}
    >
      <View style={styles.container}>
        {list ? (
          <>
            <View style={styles.listDetails}>
            <Text style={styles.text}>Name:</Text>
            <View style={styles.editableField}>
              {isEditingName ? (
                <TextInput style={styles.input} value={name} onChangeText={setName} />
              ) : (
                <Text style={styles.displayText}>{name}</Text>
              )}
              <IconButton size={20} icon={isEditingName ? 'check' : 'pencil'} onPress={isEditingName ? handleSaveName : () => setIsEditingName(true)} />
            </View>

            <Text style={styles.text}>Description:</Text>
            <View style={styles.editableField}>
              {isEditingDesc ? (
                <TextInput style={styles.input} value={desc} onChangeText={setDesc} />
              ) : (
                <Text style={styles.displayText}>{desc}</Text>
              )}
              <IconButton size={20} icon={isEditingDesc ? 'check' : 'pencil'} onPress={isEditingDesc ? handleSaveDesc : () => setIsEditingDesc(true)} />
            </View>
          </View>
    
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>Cards ({flashcards.length})</Text>
            {/* Add Card Button */}
            <View style={styles.cardHeaderButtons}>
              <Button mode="contained" onPress={handleAddCard} style={styles.cardButton}>
                New
              </Button>
              <Button mode="contained" onPress={handleAddCard} style={styles.cardButton}>
                Import
              </Button>
            </View>
          </View>
          {/* Card List */}
          <FlatList
            data={flashcards}
            keyExtractor={(item) => item.id}
            style={styles.cards}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.card}>
                {editingCardId === item.id ? (
                  <>
                    <TextInput
                      style={styles.cardInput}
                      value={tempQuestion}
                      onChangeText={setTempQuestion}
                      placeholder="Edit question"
                    />
                    <TextInput
                      style={styles.cardInput}
                      value={tempAnswer}
                      onChangeText={setTempAnswer}
                      placeholder="Edit answer"
                    />
                    <View style={styles.cardButtons}>
                      <Button mode="contained" onPress={handleSaveCard} style={styles.button}>
                        <Icon source="check" size={20} />
                      </Button>
                      <Button mode="contained" onPress={handleCancelEdit} style={styles.outlinedButton}>
                        <Icon source="cancel" size={20} color="#B82132" />
                      </Button>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.cardQuestion}>Q: {item.question}</Text>
                    <Text style={styles.cardAnswer}>A: {item.answer}</Text>
                    <View style={styles.cardButtons}>
                      <Button
                        mode="contained"
                        onPress={() => handleEditCard(item.id, item.question, item.answer)}
                        style={styles.button}
                      >
                        <Icon source="pencil" size={20} />
                      </Button>
                      <IconButton icon="delete" size={20} iconColor="#283537" onPress={() => {
                        setSelectedCardId(item.id); setIsDeleteDialogVisible(true);
                      }}/>
                    </View>
                  </>
                )}
              </View>
            )}
            ListEmptyComponent={<Text style={styles.noCardsText}>No cards found.</Text>}/>

          <Portal>
            <Dialog visible={isDeleteDialogVisible} onDismiss={() => setIsDeleteDialogVisible(false)}>
              <Dialog.Title>Delete Card</Dialog.Title>
              <Dialog.Content>
                <Text>Are you sure you want to delete this card?</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setIsDeleteDialogVisible(false)}>Cancel</Button>
                <Button onPress={handleConfirmDelete}>Delete</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
  },
  listDetails: {
    marginBottom: 2,
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
    color: '#283537',
    margin: 0,
  },
  input: {
    width: '90%',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    borderColor: '#283537',
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: 'rgba(255,255,255,.9)'
  },
  button: {
    margin: 4,
    width: 70,
    height: 40,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'rgb(40, 53, 55)'
  },
  outlinedButton: {
    margin: 4,
    borderColor: '#B82132',
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderRadius: 8,
    width: 70,
    height: 40,
  },
  redText: {
    color: '#B82132'
  },
  darkText: {
    color: '#283537',
  },
  card: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,.4)',
    borderColor: '#283537',
    borderWidth: 1,
    borderStyle: 'solid',

  },
  cardQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardAnswer: {
    fontSize: 16,
    marginBottom: 8,
  },
  cardInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#283537',
    marginBottom: 4,
    paddingBottom: 4,
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 0,
  },
  noCardsText: {
    textAlign: 'center',
    color: '#283537',
    marginTop: 20,
    fontSize: 16,
  },
  editableField: { 
    flexDirection: 'row',
    alignItems: 'center'
  },
  displayText: { 
    fontSize: 16, 
    flex: 1, 
    margin: 0 
  },
  cards: {
    marginTop: 20,
  },
  cardHeader: {
    width: '100%',
    height: 50,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  cardHeaderText: {
    width: '100%',
    fontSize: 18,
    fontWeight: '700',
    color: '#283537',
    margin: 0,
  },
  cardHeaderButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cardButton: {
    width: 90,
    height: 40,
    borderRadius: 8,
    marginLeft: 6,
    backgroundColor: '#283537'
  }
});

export default EditList;