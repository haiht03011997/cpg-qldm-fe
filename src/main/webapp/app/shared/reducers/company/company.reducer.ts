import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { Base, IOptionProps } from 'app/shared/model/modal';

const initialState = {
  isFetching: true,
  data: [] as IOptionProps[],
  dataSecurities: [] as IOptionProps[],
  page: 1,
};

export type CompanyState = Readonly<typeof initialState>;

// Actions

export const fetchCompany = createAsyncThunk(
  'company/fetch_company',
  async () =>
    axios.get<Base<any>>('api/getCompany', {
      params: { page: 1, limit: 9999 },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const fetchSecuritiesCompany = createAsyncThunk(
  'company/fetch_securities_company',
  async () =>
    axios.get<Base<any>>('api/getSecuritiesCompany', {
      params: { page: 1, limit: 9999 },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const CompanySlice = createSlice({
  name: 'Transaction',
  initialState: initialState as CompanyState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCompany.pending, () => initialState)
      .addCase(fetchCompany.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.isFetching = false;
        state.data = action.payload?.data?.data;
      })
      .addCase(fetchSecuritiesCompany.pending, () => initialState)
      .addCase(fetchSecuritiesCompany.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchSecuritiesCompany.fulfilled, (state, action) => {
        state.isFetching = false;
        state.dataSecurities = action.payload?.data?.data.map((item: any) => {
          return {
            label: item.companyName,
            value: item.companyId,
          };
        });
      });
  },
});

export const { reset } = CompanySlice.actions;

// Reducer
export default CompanySlice.reducer;
