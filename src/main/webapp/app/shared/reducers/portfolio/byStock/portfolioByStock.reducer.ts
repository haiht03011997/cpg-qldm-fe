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
  filters: null,
};

export type PortfolioByStockState = Readonly<typeof initialState>;

// Actions

export const fetchPortfolioByStock = createAsyncThunk(
  'portfolio/fetchPortfolio_byStock',
  async ({ page, limit, searchText, filters }: IPayLoad) =>
    axios.get<Base<IPortfolioByStock>>('api/getPortfolioByStock', {
      params: { page, limit, searchText, filters: JSON.stringify(filters) },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const PortfolioByStockSlice = createSlice({
  name: 'Portfolio',
  initialState: initialState as PortfolioByStockState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPortfolioByStock.pending, () => initialState)
      .addCase(fetchPortfolioByStock.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchPortfolioByStock.fulfilled, (state, action) => {
        return {
          ...state,
          data: action.payload.data?.data,
          total: action.payload.data?.total,
          page: action.meta.arg?.page,
          limit: action.meta.arg?.limit,
          isFetching: false,
        };
      });
  },
});

export const { reset } = PortfolioByStockSlice.actions;

// Reducer
export default PortfolioByStockSlice.reducer;
