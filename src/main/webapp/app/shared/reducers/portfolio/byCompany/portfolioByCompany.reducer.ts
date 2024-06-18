import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IPortfolioByCompany } from 'app/shared/model/portfolio/byCompany/view.model';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { Base, IPayLoad } from 'app/shared/model/modal';

const initialState = {
  isFetching: true,
  data: [] as IPortfolioByCompany[],
  page: 1,
  total: 0,
  limit: ITEMS_PER_PAGE,
  searchText: null,
};

export type PortfolioByCompanyState = Readonly<typeof initialState>;

// Actions

export const fetchPortfolioByCompany = createAsyncThunk(
  'portfolio/fetchPortfolio_byCompany',
  async ({ page, limit, searchText, filters }: IPayLoad) =>
    axios.get<Base<IPortfolioByCompany>>('api/getPortfolioByCompany', {
      params: { page, limit, searchText, filters: JSON.stringify(filters) },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const PortfolioByCompanySlice = createSlice({
  name: 'PortfolioByCompany',
  initialState: initialState as PortfolioByCompanyState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPortfolioByCompany.pending, () => initialState)
      .addCase(fetchPortfolioByCompany.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchPortfolioByCompany.fulfilled, (state, action) => {
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

export const { reset } = PortfolioByCompanySlice.actions;

// Reducer
export default PortfolioByCompanySlice.reducer;
