import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IPortfolioByStock } from 'app/shared/model/portfolio/byStock/view.model';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { Base, IPayLoad } from 'app/shared/model/modal';

const initialState = {
  isFetching: true,
  data: [] as IPortfolioByStock[],
  page: 1,
  total: 0,
  limit: ITEMS_PER_PAGE,
  searchText: null,
  filters: {},
};

export type TransactionState = Readonly<typeof initialState>;

// Actions

export const fetchTransaction = createAsyncThunk(
  'transaction/fetchTransaction',
  async ({ page, limit, searchText, filters, sort }: IPayLoad) =>
    axios.get<Base<any>>('api/getTransaction', {
      params: { page, limit, searchText, filters: filters && JSON.stringify(filters), sort: sort && JSON.stringify(sort) },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const TransactionSlice = createSlice({
  name: 'Transaction',
  initialState: initialState as TransactionState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setLimit(state, action) {
      state.page = action.payload;
    },
    setSearchText(state, action) {
      state.searchText = action.payload;
    },
    setFilters(state, action) {
      state.filters = action.payload;
    },
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTransaction.pending, () => initialState)
      .addCase(fetchTransaction.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchTransaction.fulfilled, (state, action) => {
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

export const { reset, setPage, setSearchText, setLimit, setFilters } = TransactionSlice.actions;

// Reducer
export default TransactionSlice.reducer;
