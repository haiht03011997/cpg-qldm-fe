import { Layout, Menu } from 'antd';
import { useAppSelector } from 'app/config/store';
import { checkPermissionUser } from 'app/shared/util/authentication';
import React from 'react';
import { Link } from 'react-router-dom';
import { subMenu } from './config';
import './sidebar.scss';
const { Sider } = Layout;

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isOpenAPIEnabled: boolean;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SideBar = (props: IHeaderProps) => {
  const account = useAppSelector(state => state.authentication.account);

  const renderSubMenu = sub => {
    const hasViewSubMenu = checkPermissionUser(account.Roles, sub.key);

    if (!hasViewSubMenu) {
      return null;
    }

    if (sub.linkTo) {
      return (
        <Menu.Item icon={sub.icon} key={`${sub.key}`}>
          <Link className="item-router" to={sub.linkTo}>
            {sub.title}
          </Link>
        </Menu.Item>
      );
    }

    return (
      <Menu.SubMenu icon={sub.icon} key={sub.key} title={sub.title}>
        {sub.items?.map(subItem => {
          const hasViewItem = checkPermissionUser(account.Roles, subItem.key, sub.actions);
          if (!hasViewItem) {
            return null;
          }
          return (
            <Menu.Item key={`${sub.key}_${subItem.key}`}>
              <Link className="item-router" to={subItem.linkTo}>
                {subItem.title}
              </Link>
            </Menu.Item>
          );
        })}
      </Menu.SubMenu>
    );
  };
  return (
    <Layout className="sidebar">
      <Sider width={250} className="menu" trigger={null} collapsible collapsed={props.collapsed}>
        <Menu theme="dark" mode="inline">
          {subMenu.map(sub => renderSubMenu(sub))}
        </Menu>
      </Sider>
    </Layout>
  );
};

export default SideBar;
