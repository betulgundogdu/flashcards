import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Flashcard, getFlashcards, createFlashcard, removeCard, updateCard } from '../../services/FlashCardService';

interface FlashcardState {
  flashcards: Flashcard[];
  loading: boolean;
  error: string | null;
}

const initialState: FlashcardState = {
  flashcards: [],
  loading: false,
  error: null,
};

// Async thunk to fetch flashcards
export const fetchFlashcardsByListId = createAsyncThunk(
  'flashcards/fetchFlashcards',
  async (listId: string) => {
    const flashcards = await getFlashcards(listId);
    return flashcards;
  }
);

// Async thunk to add a new flashcard
export const addNewFlashcard = createAsyncThunk(
  'flashcards/addFlashcard',
  async ({ listId, question, answer }: { listId: string; question: string; answer: string }) => {
    await createFlashcard(listId, question, answer);
    const flashcards = await getFlashcards(listId);
    return flashcards;
  }
);

export const updateFlashcard = createAsyncThunk(
  'lists/updateFlashcard',
  async ({listId, cardId, question, answer}: {listId: string, cardId: string, question: string, answer:string}) => {
    await updateCard(listId, cardId, question, answer);
    const flashcards = await getFlashcards(listId);
    return flashcards;
  }
);

// Async thunk to remove a flashcard
export const deleteFlashcard = createAsyncThunk(
  'flashcards/deleteFlashcard',
  async ({ listId, cardId }: { listId: string; cardId: string }) => {
    await removeCard(listId, cardId);
    const flashcards = await getFlashcards(listId);
    return flashcards;
  }
);
const flashcardsSlice = createSlice({
  name: 'flashcards',
  initialState,
  reducers: {
    addFlashcardToList(state, action: PayloadAction<Flashcard>) {
      state.flashcards.push(action.payload);
    },
    moveLastFlashcardToEnd(state) {
      const lastFlashcard = state.flashcards.shift();
      if (lastFlashcard) {
        state.flashcards.push(lastFlashcard);
      }
    },
    removeLastFlashcardFromList(state) {
      state.flashcards.shift();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlashcardsByListId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlashcardsByListId.fulfilled, (state, action: PayloadAction<Flashcard[]>) => {
        state.flashcards = action.payload;
        state.loading = false;
      })
      .addCase(fetchFlashcardsByListId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching flashcards';
      })
      .addCase(addNewFlashcard.fulfilled, (state, action: PayloadAction<Flashcard[]>) => {
        state.flashcards = action.payload;
        state.loading = false;
      })
      .addCase(deleteFlashcard.fulfilled, (state, action: PayloadAction<Flashcard[]>) => {
        state.flashcards = action.payload;
        state.loading = false;
      });
  },
});
export const { addFlashcardToList, moveLastFlashcardToEnd, removeLastFlashcardFromList } = flashcardsSlice.actions;

export default flashcardsSlice.reducer;
