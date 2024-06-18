import React, { useLayoutEffect } from 'react';

import { useAppDispatch } from 'app/config/store';
import { logout } from 'app/shared/reducers/authentication';
import Login from './login';

export const Logout = () => {
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    dispatch(logout());
    window.location.href = '/login';
  });

  return (
    <div className="p-5">
      <Login />
    </div>
  );
};

export default Logout;
