// stores/index.ts
import { configureStore } from '@reduxjs/toolkit';
import listsReducer from './slices/listsSlice';
import flashcardsReducer from './slices/flashcardsSlice';

const store = configureStore({
  reducer: {
    lists: listsReducer,
    flashcards: flashcardsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
