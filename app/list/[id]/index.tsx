// src/app/list/[id]/index.tsx (ListDetailScreen)
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Text as RNText } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/stores';
import {
  fetchFlashcardsByListId,
  removeLastFlashcardFromList,
  moveLastFlashcardToEnd,
} from '../../../stores/slices/flashcardsSlice';
import { getList } from '../../../stores/slices/listsSlice';
import Swiper from '@/components/Swiper';

const ListDetailScreen: React.FC = () => {
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [completedCards, setCompletedCards] = useState<number>(0);
  const [showCongrats, setShowCongrats] = useState<boolean>(false);
  const progress = useState(new Animated.Value(0))[0];
  const congratsScale = useState(new Animated.Value(0))[0];

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useLocalSearchParams();
  const listId = params.id as string;

  const { flashcards } = useSelector((state: RootState) => state.flashcards);
  const list = useSelector((state: RootState) => state.lists.list);

  const totalCards = flashcards.length + completedCards;
  const progressPercentage = totalCards > 0 ? completedCards / totalCards : 0;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: progressPercentage,
      duration: 500,
      useNativeDriver: false,
    }).start();

    if (progressPercentage === 1) {
      setShowCongrats(true);
      Animated.spring(congratsScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }
  }, [completedCards, flashcards]);

  const handleSwipeLeft = (index: number) => {
    setShowAnswer(false);
    setCompletedCards((prev) => prev + 1);
    dispatch(removeLastFlashcardFromList());
  };

  const handleSwipeRight = (index: number) => {
    setShowAnswer(false);
    dispatch(moveLastFlashcardToEnd());
  };

  const completeCards = () => {
    router.push('/');
  }

  useEffect(() => {
    if (listId) {
      dispatch(getList(listId));
      dispatch(fetchFlashcardsByListId(listId));
    }
  }, [dispatch]);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.heroContainer}>
        {list && (
          <View style={styles.heroWrapper}>
            <Text style={styles.heroTitle}>{list.name}</Text>
            <Text style={styles.heroSubTitle}>
              {list.desc}
            </Text>
            <Text style={styles.heroSubTitle}>
              {flashcards.length > 0 ? `${totalCards} Cards ` : ''}
            </Text>
          </View>
        )}
      </View>

      {/* Modern Progress Bar Section */}
      {!showCongrats && totalCards > 0 && (
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBarBackground,
              { width: `${progressPercentage * 100}%` },
            ]}
          />
          <View style={styles.progressBarForeground} />
        </View>
      )}

      {/* Congrats Message */}
      {showCongrats && (
        <Animated.View style={[styles.congratsContainer, { transform: [{ scale: congratsScale }] }]}>
          <Text style={styles.congratsText}>Congratulations! 🎉</Text>
          <Button
            mode="contained"
            style={styles.backToListButton}
            onPress={() => completeCards()}
          >
            Go Back to Lists
          </Button>
        </Animated.View>
      )}

      {/* Card Swiper Section */}
      {!showCongrats && (
        <View style={styles.mainContainer}>
          {flashcards.length > 0 ? (
            <View style={styles.wrapper}>
              <View style={styles.cardContainer}>
                <Swiper onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight}>
                  {flashcards.map((card) => (
                    <View key={card.id} style={styles.cardContent}>
                      <Text style={styles.text}>{showAnswer ? card.answer : card.question}</Text>
                    </View>
                  ))}
                </Swiper>
              </View>
              <View style={styles.actionContainer}>
                <Button
                  style={styles.darkBtn}
                  onPress={() => setShowAnswer(!showAnswer)}
                >
                  <Text style={styles.btnText}>{showAnswer ? 'Show Question' : 'Show Answer'}</Text>
                </Button>
              </View>
            </View>
          ) : (
            <Text style={styles.infoText}>There is no card.</Text>
          )}
        </View>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eceae4',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Quicksand_500Medium',
  },
  text: {
    fontSize: 18,
    color: '#eceae4',
  },
  heroContainer: {
    height: '10%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    marginTop: 30,
  },
  heroWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    color: '#283537',
    fontSize: 28,
  },
  heroSubTitle: {
    fontSize: 16,
  },
  progressBarContainer: {
    width: '80%',
    marginVertical: 8,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#rgba(40, 53, 55, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  progressBarBackground: {
    height: '100%',
    backgroundColor: '#283537',
    borderRadius: 5,
  },
  progressBarForeground: {
    height: '100%',
    backgroundColor: 'rgba(40, 53, 55, 0.5)',
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: 5,
  },
  progressText: {
    fontSize: 16,
    color: '#283537',
    textAlign: 'center',
    marginTop: 5,
  },
  mainContainer: {
    width: '100%',
    height: '50%',
  },
  cardContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    marginTop: 0,
    paddingLeft: '10%'
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContainer: {
    width: '100%',
    height: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap-reverse',
    marginTop: 10,
  },
  darkBtn: {
    backgroundColor: '#283537',
    height: 50,
    width: 160,
    margin: 10,
    borderRadius: 12
  },
  lightBtn: {
    backgroundColor: 'transparent',
    height: 50,
    width: 160,
    margin: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#283537',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    padding: 6,
  },
  lightBtnText: {
    color: '#283537',
    fontSize: 16,
    padding: 6,
  },
  congratsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  congratsText: {
    fontSize: 24,
    color: '#283537',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  backToListButton: {
    backgroundColor: '#283537',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  wrapper: {
    height: '100%',
    width: '100%'
  },
  infoText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
  }
});

export default ListDetailScreen;
