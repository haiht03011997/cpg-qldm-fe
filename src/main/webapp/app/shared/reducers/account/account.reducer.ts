import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { Base, IOptionProps } from 'app/shared/model/modal';

const initialState = {
  isFetching: true,
  data: [] as IOptionProps[],
  dataBySecuritiesCompany: [] as IOptionProps[],
};

export type AccountState = Readonly<typeof initialState>;

// Actions

export const fetchAccountCode = createAsyncThunk(
  'account/fetch_account_code',
  async () =>
    axios.get<Base<any>>('api/getStockAccount', {
      params: { page: 1, limit: 9999 },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const fetchAccountBySecuritiesCompany = createAsyncThunk(
  'account/fetch_account_by_securities_company',
  async (id: number) =>
    axios.get<Base<any>>('api/getStockAccountByOwnerCompanyAndSecuritiesCompany', {
      params: { SecuritiesCompanyId: id },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const fetchAccountByMemberCompany = createAsyncThunk(
  'account/fetch_account_by_securities_company',
  async (id: number) =>
    axios.get<Base<any>>('api/getStockAccountByOwnerCompanyAndSecuritiesCompany', {
      params: { OwnerCompanyId: id },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const AccountSlice = createSlice({
  name: 'Transaction',
  initialState: initialState as AccountState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAccountCode.pending, () => initialState)
      .addCase(fetchAccountCode.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchAccountCode.fulfilled, (state, action) => {
        state.isFetching = false;
        state.data = action.payload?.data.data;
      })
      .addCase(fetchAccountBySecuritiesCompany.pending, () => initialState)
      .addCase(fetchAccountBySecuritiesCompany.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchAccountBySecuritiesCompany.fulfilled, (state, action) => {
        state.isFetching = false;
        state.dataBySecuritiesCompany = action.payload?.data?.data;
      });
  },
});

export const { reset } = AccountSlice.actions;

// Reducer
export default AccountSlice.reducer;
