import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { Base, IOptionProps, IPayLoad } from 'app/shared/model/modal';
import CryptoJS from 'crypto-js';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

const initialState = {
  isFetching: true,
  data: [] as IOptionProps[],
  view: [],
  updateSuccess: false,
  page: 1,
  total: 0,
  limit: ITEMS_PER_PAGE,
  searchText: null,
  filters: {},
};

export type UserState = Readonly<typeof initialState>;

// Actions

export const fetchUser = createAsyncThunk(
  'user/fetchUser_type',
  async () =>
    axios.get<Base<IOptionProps[]>>('api/getUserList', {
      params: { page: 1, limit: 9999 },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const getUsers = createAsyncThunk('user/get_user_by_id', async (id: string | number) => axios.get<any>(`api/users/${id}`), {
  serializeError: serializeAxiosError,
});

export const fetchUserPagination = createAsyncThunk(
  'user/fetch_all_user',
  async ({ page = 1, limit = ITEMS_PER_PAGE, searchText = undefined }: IPayLoad) =>
    axios.get<Base<IOptionProps[]>>('api/getUserList', {
      params: { page, limit, searchText },
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const changePassword = createAsyncThunk(
  'password/change_password',
  // eslint-disable-next-line @typescript-eslint/require-await
  async (data: { currentPassword: string; newPassword: string }) => {
    const payLoad = {
      currentPassword: CryptoJS.MD5(data.currentPassword).toString(),
      newPassword: CryptoJS.MD5(data.newPassword).toString(),
    };
    return axios.put('api/user/change-password', payLoad);
  },
  { serializeError: serializeAxiosError },
);

export const resetPassword = createAsyncThunk(
  'password/reset_password',
  // eslint-disable-next-line @typescript-eslint/require-await
  async (data: { token: string; newPassword: string }) => {
    const payLoad = {
      newPassword: CryptoJS.MD5(data.newPassword).toString(),
    };
    return axios.put('api/user/reset-password', payLoad, {
      headers: {
        Authorization: 'Bearer ' + data.token,
      },
    });
  },
  { serializeError: serializeAxiosError },
);

export const forgotPassword = createAsyncThunk(
  'password/forgot_password',
  // eslint-disable-next-line @typescript-eslint/require-await
  async (payload: any) => {
    return axios.get('api/forgot-password', {
      params: { ...payload },
    });
  },
  { serializeError: serializeAxiosError },
);

export const exitUserByEmail = createAsyncThunk(
  'user/exit_by_email',
  // eslint-disable-next-line @typescript-eslint/require-await
  async (payload: any) => {
    return axios.get('api/verify-user', {
      params: { ...payload },
    });
  },
  { serializeError: serializeAxiosError },
);

export const UserSlice = createSlice({
  name: 'User',
  initialState: initialState as UserState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUserPagination.pending, () => initialState)
      .addCase(fetchUserPagination.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchUserPagination.fulfilled, (state, action) => {
        return {
          ...state,
          view: action.payload.data?.data,
          total: action.payload.data?.total,
          page: action.meta.arg?.page,
          limit: action.meta.arg?.limit,
          isFetching: false,
        };
      })
      .addCase(fetchUser.pending, () => initialState)
      .addCase(fetchUser.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isFetching = false;
        state.data = action.payload?.data?.data.map((item: any) => {
          return {
            value: item.userId,
            label: item.userName,
          };
        });
      })
      .addCase(changePassword.pending, () => initialState)
      .addCase(changePassword.rejected, state => {
        state.updateSuccess = false;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.updateSuccess = true;
      })
      .addCase(resetPassword.pending, () => initialState)
      .addCase(resetPassword.rejected, state => {
        state.updateSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.updateSuccess = true;
      })
      .addCase(forgotPassword.pending, () => initialState)
      .addCase(forgotPassword.rejected, state => {
        state.updateSuccess = false;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.updateSuccess = true;
      });
  },
});

export const { reset } = UserSlice.actions;

// Reducer
export default UserSlice.reducer;
