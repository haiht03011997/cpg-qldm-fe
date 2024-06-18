import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IAccountBalance } from 'app/shared/model/accountBalance/view/view.model';
import { Base, IPayLoad } from 'app/shared/model/modal';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import axios from 'axios';

const initialState = {
  isFetching: true,
  data: [] as IAccountBalance[],
  page: 1,
  total: 0,
  limit: ITEMS_PER_PAGE,
  searchText: null,
  filters: {},
};

export type AccountBalanceState = Readonly<typeof initialState>;

// Actions

export const fetchAccountBalance = createAsyncThunk(
  'accountBalance/fetch_accountBalance',
  async ({ page, limit, searchText, filters, sort }: IPayLoad) =>
    axios.get<Base<IAccountBalance>>('api/listAccountBalanceTransaction', {
      params: { page, limit, searchText, filters: filters && JSON.stringify(filters), sort: sort && JSON.stringify(sort) },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const AccountBalanceSlice = createSlice({
  name: 'AccountBalance',
  initialState: initialState as AccountBalanceState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAccountBalance.pending, () => initialState)
      .addCase(fetchAccountBalance.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchAccountBalance.fulfilled, (state, action) => {
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

export const { reset } = AccountBalanceSlice.actions;

// Reducer
export default AccountBalanceSlice.reducer;
