import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { Base, IPayLoad } from 'app/shared/model/modal';
import { IPortfolioByCompanyDetails } from 'app/shared/model/portfolio/byCompany/view.model';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { IPortfolioByAccountDetails, IPortfolioByAccountId } from 'app/shared/model/portfolio/byAccount/view.model';

const initialState = {
  isFetching: true,
  dataByCompany: [] as IPortfolioByCompanyDetails[],
  dataByAccount: [] as IPortfolioByAccountDetails[],
  page: 1,
  total: 1,
  limit: ITEMS_PER_PAGE,
  searchText: null,
};

export type PortfolioState = Readonly<typeof initialState>;

// Actions

export const fetchPortfolioByCompanyId = createAsyncThunk(
  'portfolio/fetchPortfolio_byCompany_id',
  async ({ page, limit, id }: IPayLoad) =>
    axios.get<Base<IPortfolioByCompanyDetails>>('api/getPortfolioDetailForCompany', {
      params: { page, limit, id },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const fetchPortfolioByAccountId = createAsyncThunk(
  'portfolio/fetchPortfolio_byAccount_id',
  async ({ page, limit, accountId, accountOwnerId, searchText }: IPortfolioByAccountId) =>
    axios.get<Base<IPortfolioByAccountDetails>>('api/getPortfolioDetailForAccount', {
      params: { page, limit, accountId, accountOwnerId, searchText },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const PortfolioSlice = createSlice({
  name: 'Portfolio',
  initialState: initialState as PortfolioState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPortfolioByCompanyId.pending, () => initialState)
      .addCase(fetchPortfolioByCompanyId.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchPortfolioByCompanyId.fulfilled, (state, action) => {
        return {
          ...state,
          dataByCompany: action.payload.data?.data,
          total: action.payload.data?.total,
          page: action.meta.arg?.page,
          limit: action.meta.arg?.limit,
          isFetching: false,
        };
      })
      .addCase(fetchPortfolioByAccountId.pending, () => initialState)
      .addCase(fetchPortfolioByAccountId.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchPortfolioByAccountId.fulfilled, (state, action) => {
        return {
          ...state,
          dataByAccount: action.payload.data?.data,
          total: action.payload.data?.total,
          page: action.meta.arg?.page,
          limit: action.meta.arg?.limit,
          isFetching: false,
        };
      });
  },
});

export const { reset } = PortfolioSlice.actions;

// Reducer
export default PortfolioSlice.reducer;
