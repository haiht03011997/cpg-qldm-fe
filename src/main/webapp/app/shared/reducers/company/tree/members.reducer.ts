import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  isFetching: true,
  data: [],
};

export type BuildTreeMemberCompanyState = Readonly<typeof initialState>;

// Actions

export const buildTreeMemberCompanies = createAsyncThunk(
  'company/build_tree_member_company',
  async () => axios.get<any>('api/company/member/tree'),
  {
    serializeError: serializeAxiosError,
  },
);

export const BuildTreeMemberCompanySlice = createSlice({
  name: 'Company',
  initialState: initialState as BuildTreeMemberCompanyState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(buildTreeMemberCompanies.pending, () => initialState)
      .addCase(buildTreeMemberCompanies.rejected, state => {
        state.isFetching = false;
      })
      .addCase(buildTreeMemberCompanies.fulfilled, (state, action) => {
        state.isFetching = false;
        state.data = action.payload?.data;
      });
  },
});

export const { reset } = BuildTreeMemberCompanySlice.actions;

// Reducer
export default BuildTreeMemberCompanySlice.reducer;
