import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IPortfolioByAccount } from 'app/shared/model/portfolio/byAccount/view.model';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { Base, IPayLoad } from 'app/shared/model/modal';

const initialState = {
  isFetching: true,
  data: [] as IPortfolioByAccount[],
  page: 1,
  total: 0,
  limit: ITEMS_PER_PAGE,
  searchText: null,
};

export type PortfolioByAccountState = Readonly<typeof initialState>;

// Actions

export const fetchPortfolioByAccount = createAsyncThunk(
  'portfolio/fetchPortfolio_byAccount',
  async ({ page, limit, searchText, filters }: IPayLoad) =>
    axios.get<Base<IPortfolioByAccount>>('api/getPortfolioByAccount', {
      params: { page, limit, searchText, filters: JSON.stringify(filters) },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const PortfolioByAccountSlice = createSlice({
  name: 'PortfolioByAccount',
  initialState: initialState as PortfolioByAccountState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPortfolioByAccount.pending, () => initialState)
      .addCase(fetchPortfolioByAccount.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchPortfolioByAccount.fulfilled, (state, action) => {
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

export const { reset } = PortfolioByAccountSlice.actions;

// Reducer
export default PortfolioByAccountSlice.reducer;
