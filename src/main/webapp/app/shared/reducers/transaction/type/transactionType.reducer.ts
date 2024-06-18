import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { Base, IOptionProps } from 'app/shared/model/modal';

const initialState = {
  isFetching: true,
  data: [] as IOptionProps[],
};

export type TransactionTypeState = Readonly<typeof initialState>;

// Actions

export const fetchTransactionType = createAsyncThunk(
  'transaction/fetchTransaction_type',
  async () =>
    axios.get<Base<any>>('api/getTransactionType', {
      params: { page: 1, limit: 9999 },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const TransactionTypeSlice = createSlice({
  name: 'Transaction',
  initialState: initialState as TransactionTypeState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTransactionType.pending, () => initialState)
      .addCase(fetchTransactionType.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchTransactionType.fulfilled, (state, action) => {
        state.isFetching = false;
        state.data = action.payload?.data.data;
      });
  },
});

export const { reset } = TransactionTypeSlice.actions;

// Reducer
export default TransactionTypeSlice.reducer;
