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

export type StockState = Readonly<typeof initialState>;

// Actions
type IQueryStock = {
  searchText?: string;
  pageSize?: number;
};

type IAvailableStock = {
  stockSymbol: string;
  stockAccountId: number;
};

export const fetchStock = createAsyncThunk(
  'stock/fetch_stock',
  async ({ pageSize, searchText }: IQueryStock) =>
    axios.get<Base<any>>('api/getStock', {
      params: { stockSymbol: searchText, page: pageSize, limit: 20 },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const fetchAvailableVolumeStock = createAsyncThunk(
  'stock/get_available_stock',
  async ({ stockSymbol, stockAccountId }: IAvailableStock) =>
    axios.get<any>('api/getAvailableVolume', {
      params: { stockSymbol, stockAccountId },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const StockSlice = createSlice({
  name: 'Transaction',
  initialState: initialState as StockState,
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
      .addCase(fetchStock.pending, () => initialState)
      .addCase(fetchStock.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchStock.fulfilled, (state, action) => {
        state.isFetching = false;
        state.data = action.payload?.data?.data?.map((item: any) => {
          return {
            value: item.stockSymbol,
            label: item.stockSymbol,
          };
        });
        state.total = action.payload?.data?.total;
      });
  },
});

export const { reset, setPage } = StockSlice.actions;

// Reducer
export default StockSlice.reducer;
