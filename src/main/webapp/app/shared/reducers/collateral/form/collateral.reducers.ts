import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { ICollateral, ICollateralDetail } from 'app/shared/model/collateral/form/form.modal';

const initialState = {
  isLoading: true,
  isUpdating: true,
  updateSuccess: false,
  createSuccess: false,
  isDeleting: true,
  deleteSuccess: false,
  data: {} as ICollateral,
};

export type CollateralFormState = Readonly<typeof initialState>;

// Actions

export const createCollateral = createAsyncThunk(
  'collateral/create_collateralForm',
  async (payload: ICollateral) => axios.post('api/collateral/create', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateCollateral = createAsyncThunk(
  'collateral/update_collateralForm',
  async (payload: ICollateral) => axios.put('api/collateral/update', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const getDetailCollateral = createAsyncThunk(
  'collateral/get_detailCollateral',
  async (id: number | string) => axios.get<any>(`api/collateral/${id}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteCollateral = createAsyncThunk(
  'collateral/delete_collateral',
  async (idParam: number | string) => axios.delete<ICollateral>(`api/collateral/${idParam}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const CollateralFormSlice = createSlice({
  name: 'CollateralForm',
  initialState: initialState as CollateralFormState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createCollateral.pending, () => initialState)
      .addCase(createCollateral.rejected, state => {
        state.isUpdating = false;
        state.createSuccess = false;
      })
      .addCase(createCollateral.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.createSuccess = true;
      })
      .addCase(updateCollateral.pending, () => initialState)
      .addCase(updateCollateral.rejected, state => {
        state.isUpdating = false;
        state.updateSuccess = false;
      })
      .addCase(updateCollateral.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updateSuccess = true;
      })
      .addCase(getDetailCollateral.pending, () => initialState)
      .addCase(getDetailCollateral.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getDetailCollateral.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
      })
      .addCase(deleteCollateral.pending, () => initialState)
      .addCase(deleteCollateral.rejected, state => {
        state.isDeleting = false;
        state.deleteSuccess = false;
      })
      .addCase(deleteCollateral.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.deleteSuccess = true;
      });
  },
});

export const { reset } = CollateralFormSlice.actions;

// Reducer
export default CollateralFormSlice.reducer;
