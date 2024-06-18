import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IContractAddendum } from 'app/shared/model/collateral/form/contractAddendum/view/view.model';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';

const initialState = {
  isFetching: true,
  data: [] as IContractAddendum[],
};

export type ContractAddendumState = Readonly<typeof initialState>;

// Actions

export const fetchContractAddendum = createAsyncThunk(
  'contractAddendum/fetch_contractAddendum',
  async (id: number | string) => axios.get<IContractAddendum[]>(`api/contractAddendumCollateral/all?collateralId=${id}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const ContractAddendumSlice = createSlice({
  name: 'ContractAddendum',
  initialState: initialState as ContractAddendumState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchContractAddendum.pending, () => initialState)
      .addCase(fetchContractAddendum.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchContractAddendum.fulfilled, (state, action) => {
        return {
          ...state,
          data: action.payload.data,
          isFetching: false,
        };
      });
  },
});

export const { reset } = ContractAddendumSlice.actions;

// Reducer
export default ContractAddendumSlice.reducer;
