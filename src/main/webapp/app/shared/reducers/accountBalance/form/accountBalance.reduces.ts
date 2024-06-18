import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IAccountBalance, IAccountBalanceDetail } from 'app/shared/model/accountBalance/form/form.modal';

const initialState = {
  isLoading: true,
  isUpdating: true,
  updateSuccess: false,
  createSuccess: false,
  isDeleting: true,
  deleteSuccess: false,
  data: {} as IAccountBalance,
};

export type AccountBalanceFormState = Readonly<typeof initialState>;

// Actions

export const createBulkAccountBalance = createAsyncThunk(
  'accountBalance/create_accountBalanceForm',
  async (payload: IAccountBalance[]) => axios.post('/api/createBulkAccountBalanceTransaction', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const createAccountBalance = createAsyncThunk(
  'accountBalance/create_accountBalanceForm',
  async (payload: IAccountBalance) => axios.post('/api/createAccountBalanceTransaction', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateAccountBalance = createAsyncThunk(
  'accountBalance/update_accountBalanceForm',
  async (payload: IAccountBalance[]) => axios.put('api/UpdateAccountBalanceTransaction', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const getDetailAccountBalance = createAsyncThunk(
  'accountBalance/get_detailAccountBalance',
  async (idParam: number | string) =>
    axios.get<IAccountBalanceDetail>('api/getDetailAccountBalanceTransaction', {
      params: { TransactionId: idParam },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteAccountBalance = createAsyncThunk(
  'accountBalance/delete_accountBalance',
  async (idParam: number | string) =>
    axios.put<IAccountBalance>(`api/DeleteAccountBalanceTransaction?AccountBalanceTransactionId=${idParam}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const AccountBalanceFormSlice = createSlice({
  name: 'AccountBalanceForm',
  initialState: initialState as AccountBalanceFormState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createAccountBalance.pending, () => initialState)
      .addCase(createAccountBalance.rejected, state => {
        state.isUpdating = false;
        state.createSuccess = false;
      })
      .addCase(createAccountBalance.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.createSuccess = true;
      })
      .addCase(updateAccountBalance.pending, () => initialState)
      .addCase(updateAccountBalance.rejected, state => {
        state.isUpdating = false;
        state.updateSuccess = false;
      })
      .addCase(updateAccountBalance.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updateSuccess = true;
      })
      .addCase(getDetailAccountBalance.pending, () => initialState)
      .addCase(getDetailAccountBalance.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getDetailAccountBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data.data;
      })
      .addCase(deleteAccountBalance.pending, () => initialState)
      .addCase(deleteAccountBalance.rejected, state => {
        state.isDeleting = false;
        state.deleteSuccess = false;
      })
      .addCase(deleteAccountBalance.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.deleteSuccess = true;
      });
  },
});

export const { reset } = AccountBalanceFormSlice.actions;

// Reducer
export default AccountBalanceFormSlice.reducer;
