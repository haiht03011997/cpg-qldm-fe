import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { IDecentralize } from 'app/shared/model/decentralize/form/form.modal';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  isLoading: true,
  isUpdating: true,
  updateSuccess: false,
  createSuccess: false,
  isDeleting: true,
  deleteSuccess: false,
  data: {} as IDecentralize,
};

export type DecentralizeFormState = Readonly<typeof initialState>;

// Actions

export const createDecentralize = createAsyncThunk(
  'decentralize/create_decentralizeForm',
  async (payload: IDecentralize[]) => axios.post('/api/permission/assignAction', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateDecentralize = createAsyncThunk(
  'decentralize/update_decentralizeForm',
  async (payload: IDecentralize[]) => axios.put('api/permission/update', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const getDetailDecentralize = createAsyncThunk(
  'decentralize/get_detailDecentralize',
  async (userLogin: number | string) => axios.get<any>(`api/permission?userLogin=${userLogin}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const DecentralizeFormSlice = createSlice({
  name: 'DecentralizeForm',
  initialState: initialState as DecentralizeFormState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createDecentralize.pending, () => initialState)
      .addCase(createDecentralize.rejected, state => {
        state.isUpdating = false;
        state.createSuccess = false;
      })
      .addCase(createDecentralize.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.createSuccess = true;
      })
      .addCase(updateDecentralize.pending, () => initialState)
      .addCase(updateDecentralize.rejected, state => {
        state.isUpdating = false;
        state.updateSuccess = false;
      })
      .addCase(updateDecentralize.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updateSuccess = true;
      })
      .addCase(getDetailDecentralize.pending, () => initialState)
      .addCase(getDetailDecentralize.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getDetailDecentralize.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
      });
  },
});

export const { reset } = DecentralizeFormSlice.actions;

// Reducer
export default DecentralizeFormSlice.reducer;
