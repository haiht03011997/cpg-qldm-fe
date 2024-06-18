import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ICompany } from 'app/shared/model/company/view/view.model';
import { Base, IPayLoad } from 'app/shared/model/modal';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import axios from 'axios';

const initialState = {
  isFetching: true,
  data: [] as ICompany[],
  page: 1,
  total: 0,
  limit: ITEMS_PER_PAGE,
  searchText: null,
  filters: {},
};

export type CompanyState = Readonly<typeof initialState>;

// Actions

export const fetchCompany = createAsyncThunk(
  'company/fetch_company',
  async ({ page, limit, searchText, filters }: IPayLoad) =>
    axios.get<Base<ICompany>>('api/company/all/pagination', {
      params: { page, limit, searchText, filters: JSON.stringify(filters) },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const CompanySlice = createSlice({
  name: 'Company',
  initialState: initialState as CompanyState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCompany.pending, () => initialState)
      .addCase(fetchCompany.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
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

export const { reset } = CompanySlice.actions;

// Reducer
export default CompanySlice.reducer;
