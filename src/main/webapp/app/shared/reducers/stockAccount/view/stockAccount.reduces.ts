import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IStockAccount } from 'app/shared/model/stockAccount/view/view.model';
import { Base, IPayLoad } from 'app/shared/model/modal';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import axios from 'axios';

const initialState = {
  isFetching: true,
  data: [] as IStockAccount[],
  page: 1,
  total: 0,
  limit: ITEMS_PER_PAGE,
  searchText: null,
  filters: {},
};

export type StockAccountState = Readonly<typeof initialState>;

// Actions

export const fetchStockAccount = createAsyncThunk(
  'stockAccount/fetch_stockAccount',
  async ({ page, limit, searchText, filters }: IPayLoad) =>
    axios.get<Base<IStockAccount>>('api/stockAccount/all/pagination', {
      params: { page, limit, searchText, filters: JSON.stringify(filters) },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const fetchStockAccountNormal = createAsyncThunk(
  'stockAccount/fetch_stockAccount_normal',
  async () => axios.get<Base<IStockAccount>>(`api/stockAccount/normal/all`),
  {
    serializeError: serializeAxiosError,
  },
);

export const StockAccountSlice = createSlice({
  name: 'StockAccount',
  initialState: initialState as StockAccountState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchStockAccount.pending, () => initialState)
      .addCase(fetchStockAccount.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchStockAccount.fulfilled, (state, action) => {
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

export const { reset } = StockAccountSlice.actions;

// Reducer
export default StockAccountSlice.reducer;
