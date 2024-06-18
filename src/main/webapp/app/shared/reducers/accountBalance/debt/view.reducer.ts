import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IAccountBalanceDebt } from 'app/shared/model/accountBalance/debt/view.model';
import { Base, IPayLoad } from 'app/shared/model/modal';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import axios from 'axios';

const initialState = {
  isFetching: true,
  data: [] as IAccountBalanceDebt[],
  page: 1,
  total: 0,
  limit: ITEMS_PER_PAGE,
  searchText: null,
  filters: {},
};

export type AccountBalanceDebtState = Readonly<typeof initialState>;

// Actions

export const fetchAccountBalanceDebt = createAsyncThunk(
  'accountBalanceDebt/fetch_accountBalance_debt',
  async ({ page, limit, searchText, filters }: IPayLoad) =>
    axios.get<Base<IAccountBalanceDebt>>('api/accountBalanceDebtTransaction', {
      params: { page, limit, searchText, filters: JSON.stringify(filters) },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const AccountBalanceDebtSlice = createSlice({
  name: 'AccountBalanceDebt',
  initialState: initialState as AccountBalanceDebtState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAccountBalanceDebt.pending, () => initialState)
      .addCase(fetchAccountBalanceDebt.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchAccountBalanceDebt.fulfilled, (state, action) => {
        return {
          ...state,
          data: action.payload.data?.data,
          total: action.payload.data?.total,
          filters: action.meta.arg?.filters,
          page: action.meta.arg?.page,
          limit: action.meta.arg?.limit,
          isFetching: false,
        };
      });
  },
});

export const { reset } = AccountBalanceDebtSlice.actions;

// Reducer
export default AccountBalanceDebtSlice.reducer;
