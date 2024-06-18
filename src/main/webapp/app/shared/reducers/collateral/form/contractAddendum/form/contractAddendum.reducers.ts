import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IContractAddendum } from 'app/shared/model/collateral/form/contractAddendum/form/form.modal';

const initialState = {
  isLoading: true,
  isUpdating: true,
  updateSuccess: false,
  createSuccess: false,
  isDeleting: true,
  deleteSuccess: false,
  data: {} as IContractAddendum,
};

export type ContractAddendumFormState = Readonly<typeof initialState>;

// Actions

export const createContractAddendum = createAsyncThunk(
  'contractAddendum/create_contractAddendumForm',
  async (payload: IContractAddendum) => axios.post('api/contractAddendumCollateral/create', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateContractAddendum = createAsyncThunk(
  'contractAddendum/update_contractAddendumForm',
  async (payload: IContractAddendum) => axios.put('api/contractAddendumCollateral/update', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const getDetailContractAddendum = createAsyncThunk(
  'contractAddendum/get_detailContractAddendum',
  async (id: number | string) => axios.get<any>(`api/contractAddendumCollateral/${id}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteContractAddendum = createAsyncThunk(
  'contractAddendum/delete_contractAddendum',
  async (idParam: number | string) => axios.delete<IContractAddendum>(`api/contractAddendumCollateral/${idParam}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const ContractAddendumFormSlice = createSlice({
  name: 'ContractAddendumForm',
  initialState: initialState as ContractAddendumFormState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createContractAddendum.pending, () => initialState)
      .addCase(createContractAddendum.rejected, state => {
        state.isUpdating = false;
        state.createSuccess = false;
      })
      .addCase(createContractAddendum.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.createSuccess = true;
      })
      .addCase(updateContractAddendum.pending, () => initialState)
      .addCase(updateContractAddendum.rejected, state => {
        state.isUpdating = false;
        state.updateSuccess = false;
      })
      .addCase(updateContractAddendum.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updateSuccess = true;
      })
      .addCase(getDetailContractAddendum.pending, () => initialState)
      .addCase(getDetailContractAddendum.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getDetailContractAddendum.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
      })
      .addCase(deleteContractAddendum.pending, () => initialState)
      .addCase(deleteContractAddendum.rejected, state => {
        state.isDeleting = false;
        state.deleteSuccess = false;
      })
      .addCase(deleteContractAddendum.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.deleteSuccess = true;
      });
  },
});

export const { reset } = ContractAddendumFormSlice.actions;

// Reducer
export default ContractAddendumFormSlice.reducer;
