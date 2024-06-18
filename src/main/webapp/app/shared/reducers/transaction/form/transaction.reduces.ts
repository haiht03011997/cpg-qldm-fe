import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { ITransaction } from 'app/shared/model/transaction/form/form.modal';

const initialState = {
  isLoading: true,
  isUpdating: true,
  updateSuccess: false,
  createSuccess: false,
  isDeleting: true,
  deleteSuccess: false,
  isUpLoadSuccess: true,
  data: {} as ITransaction,
};

export type TransactionFormState = Readonly<typeof initialState>;

// Actions

export const createBulkTransaction = createAsyncThunk(
  'transaction/create_TransactionForm',
  async (payload: ITransaction[]) => axios.post('api/createBulkTransaction', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const createTransaction = createAsyncThunk(
  'transaction/create_TransactionForm',
  async (payload: ITransaction) => axios.post('api/createTransaction', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateTransaction = createAsyncThunk(
  'transaction/update_TransactionForm',
  async (payload: ITransaction[]) => axios.put('api/updateStockTransaction', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const getDetailTransaction = createAsyncThunk(
  'transaction/getDetailTransaction',
  async (idParam: number | string) =>
    axios.get<ITransaction>('api/getTransactionDetail', {
      params: { id: idParam },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteTransaction = createAsyncThunk(
  'transaction/delete-transaction',
  async (idParam: number | string) => axios.put<ITransaction>(`api/deleteStockTransaction?StockTransactionId=${idParam}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const uploadTransaction = createAsyncThunk(
  'transaction/upload_transaction',
  async (formData: FormData) =>
    axios.post('api/stockTransaction/upload', formData, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const TransactionFormSlice = createSlice({
  name: 'TransactionForm',
  initialState: initialState as TransactionFormState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(uploadTransaction.pending, () => initialState)
      .addCase(uploadTransaction.rejected, state => {
        state.isUpLoadSuccess = false;
      })
      .addCase(uploadTransaction.fulfilled, (state, action) => {
        state.isUpLoadSuccess = false;
      })
      .addCase(createTransaction.pending, () => initialState)
      .addCase(createTransaction.rejected, state => {
        state.isUpdating = false;
        state.createSuccess = false;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.createSuccess = true;
      })
      .addCase(updateTransaction.pending, () => initialState)
      .addCase(updateTransaction.rejected, state => {
        state.isUpdating = false;
        state.updateSuccess = false;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updateSuccess = true;
      })
      .addCase(getDetailTransaction.pending, () => initialState)
      .addCase(getDetailTransaction.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getDetailTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data ? action.payload.data[0] : null;
      })
      .addCase(deleteTransaction.pending, () => initialState)
      .addCase(deleteTransaction.rejected, state => {
        state.isDeleting = false;
        state.deleteSuccess = false;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.deleteSuccess = true;
      });
  },
});

export const { reset } = TransactionFormSlice.actions;

// Reducer
export default TransactionFormSlice.reducer;
