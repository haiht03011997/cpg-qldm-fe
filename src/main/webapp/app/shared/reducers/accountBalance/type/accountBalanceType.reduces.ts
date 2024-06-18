import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { Base, IOptionProps } from 'app/shared/model/modal';

const initialState = {
  isFetching: true,
  data: [] as IOptionProps[],
};

export type AccountBalanceTypeState = Readonly<typeof initialState>;

// Actions

export const fetchAccountBalanceType = createAsyncThunk(
  'accountBalance/fetchAccountBalance_type',
  async () =>
    axios.get<Base<any>>('api/getAccountBalanceTransactionType', {
      params: { page: 1, limit: 9999 },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const AccountBalanceTypeSlice = createSlice({
  name: 'AccountBalance',
  initialState: initialState as AccountBalanceTypeState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAccountBalanceType.pending, () => initialState)
      .addCase(fetchAccountBalanceType.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchAccountBalanceType.fulfilled, (state, action) => {
        state.isFetching = false;
        state.data = action.payload?.data.data.map(item => {
          return {
            label: item.transactionName,
            value: item.transactionId,
          };
        });
      });
  },
});

export const { reset } = AccountBalanceTypeSlice.actions;

// Reducer
export default AccountBalanceTypeSlice.reducer;
