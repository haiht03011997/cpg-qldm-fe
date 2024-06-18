import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  isFetching: true,
  data: [],
};

export type BuildTreeSecurityCompanyState = Readonly<typeof initialState>;

// Actions

export const buildTreeSecurityCompanies = createAsyncThunk(
  'company/build_tree_security_company',
  async () => axios.get<any>('api/company/securities/tree'),
  {
    serializeError: serializeAxiosError,
  },
);

export const BuildTreeSecurityCompanySlice = createSlice({
  name: 'Company',
  initialState: initialState as BuildTreeSecurityCompanyState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(buildTreeSecurityCompanies.pending, () => initialState)
      .addCase(buildTreeSecurityCompanies.rejected, state => {
        state.isFetching = false;
      })
      .addCase(buildTreeSecurityCompanies.fulfilled, (state, action) => {
        state.isFetching = false;
        state.data = action.payload?.data;
      });
  },
});

export const { reset } = BuildTreeSecurityCompanySlice.actions;

// Reducer
export default BuildTreeSecurityCompanySlice.reducer;
