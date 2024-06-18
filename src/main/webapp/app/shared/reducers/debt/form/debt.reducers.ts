import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IDebt, IDebtDetail } from 'app/shared/model/debt/form/form.modal';

const initialState = {
  isLoading: true,
  isUpdating: true,
  updateSuccess: false,
  createSuccess: false,
  isDeleting: true,
  deleteSuccess: false,
  data: {} as IDebt,
};

export type DebtFormState = Readonly<typeof initialState>;

// Actions

export const createDebt = createAsyncThunk(
  'debt/create_debtForm',
  async (payload: IDebt) => axios.post('api/createDebtTransaction', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateDebt = createAsyncThunk(
  'debt/update_debtForm',
  async (payload: IDebt) => axios.put('api/updateDebtTransaction', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const getDetailDebt = createAsyncThunk(
  'debt/get_detailDebt',
  async (idParam: number | string) =>
    axios.get<IDebtDetail>('api/getDetailDebtTransaction', {
      params: { debtTransactionId: idParam },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteDebt = createAsyncThunk(
  'debt/delete_debt',
  async (idParam: number | string) => axios.delete<IDebt>(`api/DeleteDebtTransaction?DebtTransactionId=${idParam}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const DebtFormSlice = createSlice({
  name: 'DebtForm',
  initialState: initialState as DebtFormState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createDebt.pending, () => initialState)
      .addCase(createDebt.rejected, state => {
        state.isUpdating = false;
        state.createSuccess = false;
      })
      .addCase(createDebt.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.createSuccess = true;
      })
      .addCase(updateDebt.pending, () => initialState)
      .addCase(updateDebt.rejected, state => {
        state.isUpdating = false;
        state.updateSuccess = false;
      })
      .addCase(updateDebt.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updateSuccess = true;
      })
      .addCase(getDetailDebt.pending, () => initialState)
      .addCase(getDetailDebt.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getDetailDebt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data.data;
      })
      .addCase(deleteDebt.pending, () => initialState)
      .addCase(deleteDebt.rejected, state => {
        state.isDeleting = false;
        state.deleteSuccess = false;
      })
      .addCase(deleteDebt.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.deleteSuccess = true;
      });
  },
});

export const { reset } = DebtFormSlice.actions;

// Reducer
export default DebtFormSlice.reducer;
