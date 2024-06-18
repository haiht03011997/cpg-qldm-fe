import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IAccountOwner } from 'app/shared/model/accountOwner/view/view.model';
import { Base, IPayLoad } from 'app/shared/model/modal';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import axios from 'axios';

const initialState = {
  isFetching: true,
  data: [] as IAccountOwner[],
  page: 1,
  total: 0,
  limit: ITEMS_PER_PAGE,
  searchText: null,
  filters: {},
};

export type AccountOwnerState = Readonly<typeof initialState>;

// Actions

export const fetchAccountOwner = createAsyncThunk(
  'accountOwner/fetch_accountOwner',
  async ({ page, limit, searchText, filters }: IPayLoad) =>
    axios.get<Base<IAccountOwner>>('api/accountOwner/all/pagination', {
      params: { page, limit, searchText, filters: JSON.stringify(filters) },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const getAllAccountOwner = createAsyncThunk(
  'accountOwner/fetch_accountOwner_by_company_id',
  async () => axios.get<Base<IAccountOwner>>(`api/accountOwner/all`),
  {
    serializeError: serializeAxiosError,
  },
);

export const AccountOwnerSlice = createSlice({
  name: 'AccountOwner',
  initialState: initialState as AccountOwnerState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAccountOwner.pending, () => initialState)
      .addCase(fetchAccountOwner.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchAccountOwner.fulfilled, (state, action) => {
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

export const { reset } = AccountOwnerSlice.actions;

// Reducer
export default AccountOwnerSlice.reducer;
