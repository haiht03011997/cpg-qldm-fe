import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { Base, IOptionProps } from 'app/shared/model/modal';

const initialState = {
  isFetching: true,
  data: [] as IOptionProps[],
  page: 1,
  total: 1,
};

export type MemberCompanyState = Readonly<typeof initialState>;

// Actions

export const fetchMemberCompany = createAsyncThunk(
  'company/fetch_member',
  async (pageSize: number) =>
    axios.get<Base<any>>('api/getMemberCompany', {
      params: { page: pageSize, limit: 9999 },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const MemberCompanySlice = createSlice({
  name: 'Transaction',
  initialState: initialState as MemberCompanyState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMemberCompany.pending, () => initialState)
      .addCase(fetchMemberCompany.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchMemberCompany.fulfilled, (state, action) => {
        state.isFetching = false;
        state.data = action.payload?.data?.data.map((item: any) => {
          return {
            value: item.companyId,
            label: item.companyName,
          };
        });
        state.total = action.payload?.data?.total;
      });
  },
});

export const { reset, setPage } = MemberCompanySlice.actions;

// Reducer
export default MemberCompanySlice.reducer;
