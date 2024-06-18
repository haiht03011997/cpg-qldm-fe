import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IDebt } from 'app/shared/model/debt/view/view.model';
import { Base, IPayLoad } from 'app/shared/model/modal';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import axios from 'axios';

const initialState = {
  isFetching: true,
  data: [] as IDebt[],
  page: 1,
  total: 0,
  limit: ITEMS_PER_PAGE,
  searchText: null,
  filters: {},
};

export type DebtState = Readonly<typeof initialState>;

// Actions

export const fetchDebt = createAsyncThunk(
  'debt/fetch_debt',
  async ({ page, limit, searchText, filters }: IPayLoad) =>
    axios.get<Base<IDebt>>('api/getDebtTransaction', {
      params: { page, limit, searchText, filters: JSON.stringify(filters) },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const DebtSlice = createSlice({
  name: 'Debt',
  initialState: initialState as DebtState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchDebt.pending, () => initialState)
      .addCase(fetchDebt.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchDebt.fulfilled, (state, action) => {
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

export const { reset } = DebtSlice.actions;

// Reducer
export default DebtSlice.reducer;
