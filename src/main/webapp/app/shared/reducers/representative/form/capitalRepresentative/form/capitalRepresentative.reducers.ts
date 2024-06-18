import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { ICapitalRepresentative } from 'app/shared/model/representative/form/capitalRepresentative/form/form.modal';

const initialState = {
  isLoading: true,
  isUpdating: true,
  updateSuccess: false,
  createSuccess: false,
  isDeleting: true,
  deleteSuccess: false,
  data: {} as ICapitalRepresentative,
};

export type CapitalRepresentativeFormState = Readonly<typeof initialState>;

// Actions

export const createCapitalRepresentative = createAsyncThunk(
  'capitalRepresentative/create_capitalRepresentativeForm',
  async (payload: ICapitalRepresentative) => axios.post('api/capitalRepresentative/create', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateCapitalRepresentative = createAsyncThunk(
  'capitalRepresentative/update_capitalRepresentativeForm',
  async (payload: ICapitalRepresentative) => axios.put('api/capitalRepresentative/update', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const getDetailCapitalRepresentative = createAsyncThunk(
  'capitalRepresentative/get_detailCapitalRepresentative',
  async (id: number | string) => axios.get<any>(`api/capitalRepresentative/${id}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteCapitalRepresentative = createAsyncThunk(
  'capitalRepresentative/delete_capitalRepresentative',
  async (idParam: number | string) => axios.delete<ICapitalRepresentative>(`api/capitalRepresentative/${idParam}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const CapitalRepresentativeFormSlice = createSlice({
  name: 'CapitalRepresentativeForm',
  initialState: initialState as CapitalRepresentativeFormState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createCapitalRepresentative.pending, () => initialState)
      .addCase(createCapitalRepresentative.rejected, state => {
        state.isUpdating = false;
        state.createSuccess = false;
      })
      .addCase(createCapitalRepresentative.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.createSuccess = true;
      })
      .addCase(updateCapitalRepresentative.pending, () => initialState)
      .addCase(updateCapitalRepresentative.rejected, state => {
        state.isUpdating = false;
        state.updateSuccess = false;
      })
      .addCase(updateCapitalRepresentative.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updateSuccess = true;
      })
      .addCase(getDetailCapitalRepresentative.pending, () => initialState)
      .addCase(getDetailCapitalRepresentative.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getDetailCapitalRepresentative.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
      })
      .addCase(deleteCapitalRepresentative.pending, () => initialState)
      .addCase(deleteCapitalRepresentative.rejected, state => {
        state.isDeleting = false;
        state.deleteSuccess = false;
      })
      .addCase(deleteCapitalRepresentative.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.deleteSuccess = true;
      });
  },
});

export const { reset } = CapitalRepresentativeFormSlice.actions;

// Reducer
export default CapitalRepresentativeFormSlice.reducer;
