import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IStockAccount, IStockAccountDetail } from 'app/shared/model/stockAccount/form/form.modal';

const initialState = {
  isLoading: true,
  isUpdating: true,
  updateSuccess: false,
  createSuccess: false,
  isDeleting: true,
  deleteSuccess: false,
  data: {} as IStockAccount,
};

export type StockAccountFormState = Readonly<typeof initialState>;

// Actions

export const createStockAccount = createAsyncThunk(
  'stockAccount/create_stockAccountForm',
  async (payload: IStockAccount) => axios.post('/api/stockAccount/create', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateStockAccount = createAsyncThunk(
  'stockAccount/update_stockAccountForm',
  async (payload: IStockAccount[]) => axios.put('api/stockAccount/update', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const getDetailStockAccount = createAsyncThunk(
  'stockAccount/get_detailStockAccount',
  async (idParam: number | string) => axios.get<any>(`api/stockAccount/${idParam}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteStockAccount = createAsyncThunk(
  'stockAccount/delete_stockAccount',
  async (idParam: number | string) => axios.delete<IStockAccount>(`api/stockAccount/${idParam}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const StockAccountFormSlice = createSlice({
  name: 'StockAccountForm',
  initialState: initialState as StockAccountFormState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createStockAccount.pending, () => initialState)
      .addCase(createStockAccount.rejected, state => {
        state.isUpdating = false;
        state.createSuccess = false;
      })
      .addCase(createStockAccount.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.createSuccess = true;
      })
      .addCase(updateStockAccount.pending, () => initialState)
      .addCase(updateStockAccount.rejected, state => {
        state.isUpdating = false;
        state.updateSuccess = false;
      })
      .addCase(updateStockAccount.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updateSuccess = true;
      })
      .addCase(getDetailStockAccount.pending, () => initialState)
      .addCase(getDetailStockAccount.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getDetailStockAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
      })
      .addCase(deleteStockAccount.pending, () => initialState)
      .addCase(deleteStockAccount.rejected, state => {
        state.isDeleting = false;
        state.deleteSuccess = false;
      })
      .addCase(deleteStockAccount.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.deleteSuccess = true;
      });
  },
});

export const { reset } = StockAccountFormSlice.actions;

// Reducer
export default StockAccountFormSlice.reducer;
