import { useAppSelector } from 'app/config/store';
import './home.scss';

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const Home = () => {
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const pageLocation = useLocation();
  if (isAuthenticated) {
    return (
      <div className="home">
        <img className="logo" src="/content/images/Capella-Group-logo.png"></img>
        <p className="_title">Chào mừng bạn đến với phần mềm quản lý danh mục</p>
      </div>
    );
  }

  return (
    <Navigate
      to={{
        pathname: '/login',
        search: pageLocation.search,
      }}
      replace
      state={{ from: pageLocation }}
    />
  );
};

export default Home;
