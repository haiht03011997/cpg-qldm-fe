import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IAccountOwner, IAccountOwnerDetail } from 'app/shared/model/accountOwner/form/form.modal';

const initialState = {
  isLoading: true,
  isUpdating: true,
  updateSuccess: false,
  createSuccess: false,
  isDeleting: true,
  deleteSuccess: false,
  data: {} as IAccountOwner,
};

export type AccountOwnerFormState = Readonly<typeof initialState>;

// Actions

export const createAccountOwner = createAsyncThunk(
  'accountOwner/create_accountOwnerForm',
  async (payload: IAccountOwner) => axios.post('/api/accountOwner/create', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateAccountOwner = createAsyncThunk(
  'accountOwner/update_accountOwnerForm',
  async (payload: IAccountOwner[]) => axios.put('api/accountOwner/update', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const getDetailAccountOwner = createAsyncThunk(
  'accountOwner/get_detailAccountOwner',
  async (idParam: number | string) => axios.get<any>(`api/accountOwner/${idParam}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteAccountOwner = createAsyncThunk(
  'accountOwner/delete_accountOwner',
  async (idParam: number | string) => axios.delete<IAccountOwner>(`api/accountOwner/${idParam}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const AccountOwnerFormSlice = createSlice({
  name: 'AccountOwnerForm',
  initialState: initialState as AccountOwnerFormState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createAccountOwner.pending, () => initialState)
      .addCase(createAccountOwner.rejected, state => {
        state.isUpdating = false;
        state.createSuccess = false;
      })
      .addCase(createAccountOwner.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.createSuccess = true;
      })
      .addCase(updateAccountOwner.pending, () => initialState)
      .addCase(updateAccountOwner.rejected, state => {
        state.isUpdating = false;
        state.updateSuccess = false;
      })
      .addCase(updateAccountOwner.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updateSuccess = true;
      })
      .addCase(getDetailAccountOwner.pending, () => initialState)
      .addCase(getDetailAccountOwner.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getDetailAccountOwner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
      })
      .addCase(deleteAccountOwner.pending, () => initialState)
      .addCase(deleteAccountOwner.rejected, state => {
        state.isDeleting = false;
        state.deleteSuccess = false;
      })
      .addCase(deleteAccountOwner.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.deleteSuccess = true;
      });
  },
});

export const { reset } = AccountOwnerFormSlice.actions;

// Reducer
export default AccountOwnerFormSlice.reducer;
