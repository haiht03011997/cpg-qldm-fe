import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';

import { NavDropdown } from './menu-components';

const accountMenuItemsAuthenticated = () => (
  <>
    <MenuItem icon="lock" to="/user/change-password" data-cy="passwordItem">
      Đổi mật khẩu
    </MenuItem>
    <MenuItem icon="sign-out-alt" to="/logout" data-cy="logout">
      Đăng xuất
    </MenuItem>
  </>
);

const accountMenuItems = () => (
  <>
    <MenuItem id="login-item" icon="sign-in-alt" to="/login" data-cy="login">
      Đăng nhập
    </MenuItem>
  </>
);

type IAccountMenu = {
  isAuthenticated: boolean;
  accountName: string;
};

export const AccountMenu = (props: IAccountMenu) => (
  <NavDropdown icon="user" name={props.accountName} id="account-menu" data-cy="accountMenu">
    {props.isAuthenticated && accountMenuItemsAuthenticated()}
    {!props.isAuthenticated && accountMenuItems()}
  </NavDropdown>
);

export default AccountMenu;
