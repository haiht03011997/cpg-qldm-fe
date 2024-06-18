import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ICapitalRepresentative } from 'app/shared/model/representative/form/capitalRepresentative/view/view.model';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';

const initialState = {
  isFetching: true,
  data: [] as ICapitalRepresentative[],
};

export type CapitalRepresentativeReplaceState = Readonly<typeof initialState>;

// Actions

export const fetchCapitalRepresentativeReplace = createAsyncThunk(
  'capitalRepresentativeReplace/fetch_capitalRepresentative_replace',
  async (payload: any) =>
    axios.get<ICapitalRepresentative[]>(
      `api/capitalRepresentative/all/replace?representativeId=${payload.id}&companyId=${payload.companyId}`,
    ),
  {
    serializeError: serializeAxiosError,
  },
);

export const fetchCapitalRepresentativeReplaceByReplaceId = createAsyncThunk(
  'capitalRepresentativeReplace/fetch_capitalRepresentative_replace_by_replace_id',
  async (payload: any) =>
    axios.get<ICapitalRepresentative[]>(`api/capitalRepresentative/all/replace/capitalRepresentativeReplaceIds?ids=${payload}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const CapitalRepresentativeReplaceSlice = createSlice({
  name: 'CapitalRepresentativeReplace',
  initialState: initialState as CapitalRepresentativeReplaceState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCapitalRepresentativeReplace.pending, () => initialState)
      .addCase(fetchCapitalRepresentativeReplace.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchCapitalRepresentativeReplace.fulfilled, (state, action) => {
        return {
          ...state,
          data: action.payload.data,
          isFetching: false,
        };
      });
  },
});

export const { reset } = CapitalRepresentativeReplaceSlice.actions;

// Reducer
export default CapitalRepresentativeReplaceSlice.reducer;
