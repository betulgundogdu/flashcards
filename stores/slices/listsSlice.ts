import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { List, getLists, createList, getListById, updateList, deleteList } from '../../services/ListService';

interface ListState {
  list: List;
  lists: List[];
  loading: boolean;
  error: string | null;
}

const initialState: ListState = {
  list: {
    id: '',
    name: '',
    desc: '',
    cardCount: 0,
  },
  lists: [],
  loading: false,
  error: null,
};

// Async thunk to fetch lists
export const fetchLists = createAsyncThunk<List[], void>(
  'lists/fetchLists',
  async () => {
    const lists = await getLists();
    return lists;
  }
);

// Async thunk to fetch a list by ID
export const getList = createAsyncThunk<List, string>(
  'lists/getListById',
  async (listId) => {
    const currentList = await getListById(listId);
    return currentList[0];
  }
);

// Async thunk to create a new list
export const createNewList = createAsyncThunk<string, { name: string; desc: string }>(
  'lists/createNewList',
  async ({ name, desc }) => {
    const newListId = await createList(name, desc);
    return newListId;
  }
);

export const updateListInfo = createAsyncThunk<void, {id: string, name: string, desc:string }>(
  'lists/updateList',
  async ({id, name, desc}) => {
    await updateList(id, name, desc);
  }
);

export const removeList = createAsyncThunk<List[], { id: string }>(
  'lists/deleteList',
  async ({ id }) => {
    const updatedLists = await deleteList(id);
    return updatedLists;
  }
);

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    updateList(state, action: PayloadAction<List>) {
      state.lists.push(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLists.fulfilled, (state, action: PayloadAction<List[]>) => {
        state.lists = action.payload;
        state.loading = false;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching lists';
      })
      .addCase(createNewList.fulfilled, (state, action) => {
        const { name, desc } = action.meta.arg;
        const newList: List = { id: Math.random().toString(), name, desc, cardCount: 0 };
        state.lists.push(newList);
      })
      .addCase(getList.fulfilled, (state, action: PayloadAction<List>) => {
        state.list = action.payload;
      })
      .addCase(removeList.fulfilled, (state, action) => {
        state.lists = action.payload;
      });
  },
});

export default listsSlice.reducer;
