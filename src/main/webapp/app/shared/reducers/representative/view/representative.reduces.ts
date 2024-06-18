import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IRepresentative } from 'app/shared/model/representative/view/view.model';
import { Base, IPayLoad } from 'app/shared/model/modal';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import axios from 'axios';

const initialState = {
  isFetching: true,
  data: [] as IRepresentative[],
  page: 1,
  total: 0,
  limit: ITEMS_PER_PAGE,
  searchText: null,
  filters: {},
};

export type RepresentativeState = Readonly<typeof initialState>;

// Actions

export const fetchRepresentative = createAsyncThunk(
  'representative/fetch_representative',
  async ({ page, limit, searchText, filters }: IPayLoad) =>
    axios.get<Base<IRepresentative>>('api/representative/all/pagination', {
      params: { page, limit, searchText, filters: filters && JSON.stringify(filters) },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const RepresentativeSlice = createSlice({
  name: 'Representative',
  initialState: initialState as RepresentativeState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchRepresentative.pending, () => initialState)
      .addCase(fetchRepresentative.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchRepresentative.fulfilled, (state, action) => {
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

export const { reset } = RepresentativeSlice.actions;

// Reducer
export default RepresentativeSlice.reducer;
