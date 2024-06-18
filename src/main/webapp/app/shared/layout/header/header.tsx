import './header.scss';

import React from 'react';

import LoadingBar from 'react-redux-loading-bar';
import { Nav, Navbar } from 'reactstrap';

import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import { Button } from 'antd';
import { AccountMenu } from '../menus';
import { useAppSelector } from 'app/config/store';

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isOpenAPIEnabled: boolean;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Header = (props: IHeaderProps) => {
  const account = useAppSelector(state => state.authentication.account);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  return (
    <div id="app-header">
      <LoadingBar className="loading-bar" />
      <Navbar data-cy="navbar" dark expand="md" fixed="top" className="jh-navbar">
        <img className="logo" src="/content/images/Capella-Group-logo.png"></img>
        {isAuthenticated && (
          <Button
            type="text"
            icon={props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => props.setCollapsed(!props.collapsed)}
            className="button-collapsed"
          />
        )}
        <Nav id="header-tabs" className="ms-auto" navbar>
          <AccountMenu isAuthenticated={props.isAuthenticated} accountName={account.UserName} />
        </Nav>
      </Navbar>
    </div>
  );
};

export default Header;
