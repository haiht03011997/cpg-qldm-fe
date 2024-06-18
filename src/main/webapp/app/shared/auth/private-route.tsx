import React from 'react';
import { Navigate, PathRouteProps, useLocation } from 'react-router-dom';

import { useAppSelector } from 'app/config/store';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { checkAuthorize } from '../util/authentication';

interface IOwnProps extends PathRouteProps {
  hasAnyAuthorities?: string[];
  children: React.ReactNode;
}

export const PrivateRoute = ({ children, hasAnyAuthorities = [], ...rest }: IOwnProps) => {
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const account = useAppSelector(state => state.authentication.account);
  const pageLocation = useLocation();
  const isAuthorized = checkAuthorize(account.Roles, pageLocation.pathname);

  if (!children) {
    throw new Error(`A component needs to be specified for private route for path ${(rest as any).path}`);
  }

  if (isAuthenticated) {
    if (isAuthorized) {
      return <ErrorBoundary>{children}</ErrorBoundary>;
    }

    return (
      <div className="insufficient-authority">
        <div className="alert alert-danger">Bạn không có quyền truy cập vào trang này.</div>
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

/**
 * Checks authentication before showing the children and redirects to the
 * login page if the user is not authenticated.
 * If hasAnyAuthorities is provided the authorization status is also
 * checked and an error message is shown if the user is not authorized.
 */
export default PrivateRoute;
