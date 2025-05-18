// app/index.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Text, Button, Icon, IconButton, Dialog, Portal } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../stores';
import { fetchLists, removeList } from '../stores/slices/listsSlice';

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const { lists, error } = useSelector((state: RootState) => state.lists);
  useEffect(() => {
    dispatch(fetchLists());
  }, [dispatch]);

  const router = useRouter();

  type ItemProps = {
    id: string;
    title: string;
    desc: string;
    cards: number;
  };

  const handleListPress = (listId: string) => {
    try {
      router.push(`/list/${listId}`);
    } catch (error) {
      console.error('Error in handleListPress:', error);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedListId) {
      dispatch(removeList({ id: selectedListId }));
      setIsDeleteDialogVisible(false);
      dispatch(fetchLists());
    }
  };

  const Item = ({ id, title, cards, desc }: ItemProps) => (
    <View style={styles.listContainer}>
      <TouchableOpacity onPress={() => handleListPress(id)} style={styles.list}>
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.detailText}>{cards} cards</Text>
            <Text style={styles.detailText}>{desc}</Text>
          </View>
      </TouchableOpacity>
      <View style={styles.listAction}>
        <Button style={styles.darkBtn}
          onPress={() => {
            router.push(`/list/${id}/edit`)
          }}>
            <Icon source="pencil" size={20} />
        </Button>
        <IconButton size={20} iconColor="#283537" icon="delete" 
          onPress={() => {
              setSelectedListId(id); setIsDeleteDialogVisible(true);
          }} 
        />
        <Portal>
            <Dialog visible={isDeleteDialogVisible} onDismiss={() => setIsDeleteDialogVisible(false)}>
              <Dialog.Title>Delete List</Dialog.Title>
              <Dialog.Content>
                <Text>Are you sure you want to delete this list?</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setIsDeleteDialogVisible(false)}>Cancel</Button>
                <Button onPress={handleConfirmDelete}>Delete</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
      </View>
    </View>

  );

  return (
    <View style={styles.container}>
      <Text style={styles.highlightedText}>Your Lists ({ lists.length })</Text>
      <View style={styles.contentContainer}>
        {lists.length > 0 ? (
          <SafeAreaView style={styles.sav}>
            <FlatList
              data={lists}
              renderItem={({ item }) => (
                <Item
                  id={item.id}
                  title={item.name}
                  desc={item.desc}
                  cards={item.cardCount || 0}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          </SafeAreaView>
        ) : (
          <Text style={styles.highlightedText}>No lists available</Text>
        )}
      </View>
      <View style={styles.iconButton}>
        <Button style={styles.button} mode="contained" onPress={() => router.push('/create-list')}>
          <Text style={styles.buttonText}>
            Create New List
          </Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  heroTitle: {
    color: '#283537',
    fontSize: 28,
  },
  heroSubTitle: {
    fontSize: 16,
  },
  contentContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  iconButton: {
    height: '10%',
    width: '100%',
    backgroundColor: 'rgba(236, 234, 228, .9)',
    margin: 4,
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#283537',
    fontSize: 20,
    width: 160,
    height: 50, 
    borderRadius: 10,
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#eceae4',
    fontSize: 16,
  },
  highlightedText: {
    color: '#283537',
    fontWeight: '900',
    letterSpacing: 2,
    fontSize: 22,
    padding: 24,
  },
  text: {
    color: '#000',
    fontSize: 16, 
  },
  listContainer: {
    width: '90%',
    justifyContent: 'center',
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 4,
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 8,
    borderColor: '#283537',
    borderWidth: 1,
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'row'
  },
  list: {
    width: '60%',
    padding: 0,
    margin: 0,
  },
  textContainer: {
    width: '100%',
    height: '100%',
  },
  listAction: {
    width: '30%',
    height: '80%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  icon: {
    height: 50,
    width: 50,
    margin: 10,
    marginRight: 20,
  },
  detailText: {
    fontSize: 16,
    color: '#555',
  },
  titleText: {
    fontSize: 20,
    color: '#222'
  },
  sav: {
    width: '100%',
    padding: 0,
  },
  darkBtn: {
    backgroundColor: 'transparent',
    height: 40,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'rgba(40, 53, 55)',
    margin: 4
  },
  darkBtnText: {
    color: 'rgba(40, 53, 55)',
    fontSize: 16,
  },
  outlinedButton: {
    borderColor: '#B82132',
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderRadius: 8,
    width: 70,
    height: 40,
  },
});

export default HomeScreen;
