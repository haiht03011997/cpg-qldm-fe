import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Base } from 'app/shared/model/modal';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';

const initialState = {
  isFetching: true,
  data: [],
};

export type ConfigState = Readonly<typeof initialState>;

// Actions

export const fetchConfigTransactionType = createAsyncThunk(
  'config/fetch_config_transaction_type',
  async (type: number) =>
    axios.get<Base<any>>('api/config/transaction-type', {
      params: { transactionEnumType: type },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const ConfigSlice = createSlice({
  name: 'Transaction',
  initialState: initialState as ConfigState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchConfigTransactionType.pending, () => initialState)
      .addCase(fetchConfigTransactionType.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchConfigTransactionType.fulfilled, (state, action) => {
        state.isFetching = false;
        state.data = action.payload?.data?.data;
      });
  },
});

export const { reset } = ConfigSlice.actions;

// Reducer
export default ConfigSlice.reducer;
