import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ICapitalRepresentative } from 'app/shared/model/representative/form/capitalRepresentative/view/view.model';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';

const initialState = {
  isFetching: true,
  data: [] as ICapitalRepresentative[],
};

export type CapitalRepresentativeState = Readonly<typeof initialState>;

// Actions

export const fetchCapitalRepresentative = createAsyncThunk(
  'capitalRepresentative/fetch_capitalRepresentative',
  async (id: number | string) => axios.get<ICapitalRepresentative[]>(`api/capitalRepresentative/all?representativeId=${id}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const CapitalRepresentativeSlice = createSlice({
  name: 'CapitalRepresentative',
  initialState: initialState as CapitalRepresentativeState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCapitalRepresentative.pending, () => initialState)
      .addCase(fetchCapitalRepresentative.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchCapitalRepresentative.fulfilled, (state, action) => {
        return {
          ...state,
          data: action.payload.data,
          isFetching: false,
        };
      });
  },
});

export const { reset } = CapitalRepresentativeSlice.actions;

// Reducer
export default CapitalRepresentativeSlice.reducer;
