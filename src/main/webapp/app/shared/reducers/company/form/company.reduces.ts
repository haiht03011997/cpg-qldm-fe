import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { ICompany } from 'app/shared/model/company/form/form.modal';

const initialState = {
  isLoading: true,
  isUpdating: true,
  updateSuccess: false,
  createSuccess: false,
  isDeleting: true,
  deleteSuccess: false,
  data: {} as ICompany,
};

export type CompanyFormState = Readonly<typeof initialState>;

// Actions

export const createCompany = createAsyncThunk(
  'company/create_companyForm',
  async (payload: ICompany) => axios.post('/api/company/create', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateCompany = createAsyncThunk(
  'company/update_companyForm',
  async (payload: ICompany[]) => axios.put('api/company/update', payload),
  {
    serializeError: serializeAxiosError,
  },
);

export const getDetailCompany = createAsyncThunk(
  'company/get_detailCompany',
  async (idParam: number | string) => axios.get<ICompany>(`api/company/${idParam}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteCompany = createAsyncThunk(
  'company/delete_company',
  async (idParam: number | string) => axios.delete<ICompany>(`api/company/${idParam}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const CompanyFormSlice = createSlice({
  name: 'CompanyForm',
  initialState: initialState as CompanyFormState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createCompany.pending, () => initialState)
      .addCase(createCompany.rejected, state => {
        state.isUpdating = false;
        state.createSuccess = false;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.createSuccess = true;
      })
      .addCase(updateCompany.pending, () => initialState)
      .addCase(updateCompany.rejected, state => {
        state.isUpdating = false;
        state.updateSuccess = false;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updateSuccess = true;
      })
      .addCase(getDetailCompany.pending, () => initialState)
      .addCase(getDetailCompany.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getDetailCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
      })
      .addCase(deleteCompany.pending, () => initialState)
      .addCase(deleteCompany.rejected, state => {
        state.isDeleting = false;
        state.deleteSuccess = false;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.deleteSuccess = true;
      });
  },
});

export const { reset } = CompanyFormSlice.actions;

// Reducer
export default CompanyFormSlice.reducer;
