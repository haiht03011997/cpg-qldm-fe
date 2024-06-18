import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IRepresentative } from 'app/shared/model/representative/form/form.modal';

const initialState = {
  isLoading: true,
  isUpdating: true,
  updateSuccess: false,
  createSuccess: false,
  isDeleting: true,
  deleteSuccess: false,
  data: {} as IRepresentative,
};

export type RepresentativeFormState = Readonly<typeof initialState>;

// Actions

export const createRepresentative = createAsyncThunk(
  'representative/create_representativeForm',
  async (payload: IRepresentative) => axios.post('api/representative/create', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateRepresentative = createAsyncThunk(
  'representative/update_representativeForm',
  async (payload: IRepresentative) => axios.put('api/representative/update', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const getDetailRepresentative = createAsyncThunk(
  'representative/get_detailRepresentative',
  async (id: number | string) => axios.get<any>(`api/representative/${id}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteRepresentative = createAsyncThunk(
  'representative/delete_representative',
  async (idParam: number | string) => axios.delete<IRepresentative>(`api/representative/${idParam}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const RepresentativeFormSlice = createSlice({
  name: 'RepresentativeForm',
  initialState: initialState as RepresentativeFormState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createRepresentative.pending, () => initialState)
      .addCase(createRepresentative.rejected, state => {
        state.isUpdating = false;
        state.createSuccess = false;
      })
      .addCase(createRepresentative.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.createSuccess = true;
      })
      .addCase(updateRepresentative.pending, () => initialState)
      .addCase(updateRepresentative.rejected, state => {
        state.isUpdating = false;
        state.updateSuccess = false;
      })
      .addCase(updateRepresentative.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updateSuccess = true;
      })
      .addCase(getDetailRepresentative.pending, () => initialState)
      .addCase(getDetailRepresentative.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getDetailRepresentative.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
      })
      .addCase(deleteRepresentative.pending, () => initialState)
      .addCase(deleteRepresentative.rejected, state => {
        state.isDeleting = false;
        state.deleteSuccess = false;
      })
      .addCase(deleteRepresentative.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.deleteSuccess = true;
      });
  },
});

export const { reset } = RepresentativeFormSlice.actions;

// Reducer
export default RepresentativeFormSlice.reducer;
