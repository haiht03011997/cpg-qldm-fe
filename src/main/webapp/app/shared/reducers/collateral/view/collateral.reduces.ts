import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ICollateral } from 'app/shared/model/collateral/view/view.model';
import { Base, IPayLoad } from 'app/shared/model/modal';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import axios from 'axios';

const initialState = {
  isFetching: true,
  data: [] as ICollateral[],
  page: 1,
  total: 0,
  limit: ITEMS_PER_PAGE,
  searchText: null,
  filters: {},
};

export type CollateralState = Readonly<typeof initialState>;

// Actions

export const fetchCollateral = createAsyncThunk(
  'collateral/fetch_collateral',
  async ({ page, limit, searchText, filters }: IPayLoad) =>
    axios.get<Base<ICollateral>>('api/collateral/all/pagination', {
      params: { page, limit, searchText, filters: filters && JSON.stringify(filters) },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const CollateralSlice = createSlice({
  name: 'Collateral',
  initialState: initialState as CollateralState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCollateral.pending, () => initialState)
      .addCase(fetchCollateral.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchCollateral.fulfilled, (state, action) => {
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

export const { reset } = CollateralSlice.actions;

// Reducer
export default CollateralSlice.reducer;
