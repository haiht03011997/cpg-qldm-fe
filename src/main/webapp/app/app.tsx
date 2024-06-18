import 'app/config/dayjs';
import 'react-toastify/dist/ReactToastify.css';
import './app.scss';

import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Card, Col, Row } from 'reactstrap';

import { AUTHORITIES } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import AppRoutes from 'app/routes';
import ErrorBoundary from 'app/shared/error/error-boundary';
import Header from 'app/shared/layout/header/header';
import SideBar from './shared/layout/sidebar/sidebar';
import { getSession } from './shared/reducers/authentication';
import { checkPermissionUser } from './shared/util/authentication';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

export const App = () => {
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    dispatch(getSession());
  }, []);

  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const isAdmin = useAppSelector(state => checkPermissionUser(state.authentication.account.Roles, AUTHORITIES.ADMIN));
  const ribbonEnv = useAppSelector(state => state.applicationProfile.ribbonEnv);
  const isInProduction = useAppSelector(state => state.applicationProfile.inProduction);
  const isOpenAPIEnabled = useAppSelector(state => state.applicationProfile.isOpenAPIEnabled);

  const paddingTop = '60px';
  return (
    <BrowserRouter basename={baseHref}>
      <div className="app-container" style={{ paddingTop }}>
        <ToastContainer position={toast.POSITION.TOP_LEFT} className="toastify-container" toastClassName="toastify-toast" />
        <ErrorBoundary>
          <Header
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            ribbonEnv={ribbonEnv}
            isInProduction={isInProduction}
            isOpenAPIEnabled={isOpenAPIEnabled}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        </ErrorBoundary>
        <div className="container-fluid view-container" id="app-view-container">
          <div className="content">
            {isAuthenticated && (
              <Row>
                <Col>
                  <ErrorBoundary>
                    <SideBar
                      isAuthenticated={isAuthenticated}
                      isAdmin={isAdmin}
                      ribbonEnv={ribbonEnv}
                      isInProduction={isInProduction}
                      isOpenAPIEnabled={isOpenAPIEnabled}
                      collapsed={collapsed}
                      setCollapsed={setCollapsed}
                    />
                  </ErrorBoundary>
                </Col>
              </Row>
            )}
            <Row className={`${collapsed ? 'w-100' : 'body'} m-0`}>
              <Col>
                <Card className="jh-card border-0">
                  <ErrorBoundary>
                    <AppRoutes />
                  </ErrorBoundary>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
