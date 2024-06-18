import { AUTHORITIES } from 'app/config/constants';
import React from 'react';

export const subMenu = [
  {
    title: 'Danh mục đầu tư',
    icon: <img src="content/images/icons/danh-muc-dau-tu.svg" />,
    key: 'portfolio',
    actions: true,
    items: [
      {
        title: 'Theo công ty',
        key: 'portfolioByCompany',
        linkTo: '/portfolio/by-company',
      },
      {
        title: 'Theo tài khoản',
        key: 'portfolioByAccount',
        linkTo: '/portfolio/by-account',
      },
      {
        title: 'Theo cổ phiếu',
        key: 'portfolioByStock',
        linkTo: '/portfolio/by-stock',
      },
    ],
  },
  {
    title: 'Quản lý danh mục',
    icon: <img src="content/images/icons/danh-muc-quan-ly.svg" />,
    key: 'transaction,debt,accountBalance',
    items: [
      {
        title: 'Giao dịch hàng ngày',
        key: 'transaction',
        linkTo: '/transaction',
      },
      {
        title: 'Dư nợ margin',
        key: 'debt',
        linkTo: '/debt',
      },
      {
        title: 'Biến động số dư',
        key: 'accountBalance',
        linkTo: '/account-balance',
      },
    ],
  },
  // {
  //   title: 'Giao dịch hàng ngày',
  //   icon: <img src="content/images/icons/giao-dich-mua-ban.svg" />,
  //   linkTo: '/transaction',
  //   key: 'transaction',
  //   role: AUTHORITIES.TRADE,
  // },
  // {
  //   title: 'Dư nợ margin',
  //   key: 'debt',
  //   icon: <img src="content/images/icons/margin.svg" />,
  //   linkTo: '/debt',
  // },
  // {
  //   title: 'Biến động số dư',
  //   icon: <img src="content/images/icons/so-du-tai-khoan.svg" />,
  //   key: 'accountBalance',
  //   linkTo: '/account-balance',
  // },
  {
    title: 'Cầm cố',
    icon: <img src="content/images/icons/cam-co.svg" />,
    linkTo: '/collateral',
    key: 'collateral',
  },
  {
    title: 'Người đại diện',
    icon: <img src="content/images/icons/user.svg" />,
    linkTo: '/representative',
    key: 'representative',
  },
  {
    icon: <img src="content/images/icons/gia-thi-truong.svg" />,
    title: 'Giá thị trường',
    key: 'marketPrices',
    items: [
      {
        title: 'Cập nhật',
        key: 'update',
      },
      {
        title: 'Lịch sử giá thị trường',
        key: 'history',
        linkTo: '/dailyprice',
      },
    ],
  },
  {
    title: 'Danh mục dùng chung',
    icon: <img src="content/images/icons/danh-muc-quan-ly.svg" />,
    key: 'stockAccount,accountOwner,company',
    items: [
      {
        title: 'Đơn vị chủ quản',
        key: 'company',
        linkTo: '/company',
      },
      {
        title: 'Thông tin chủ tài khoản',
        key: 'accountOwner',
        linkTo: '/account-owner',
      },
      {
        title: 'Tài khoản chứng khoán',
        key: 'stockAccount',
        linkTo: '/stock-account',
      },
    ],
  },
  {
    icon: <img src="content/images/icons/setting.svg" />,
    title: 'Cài đặt',
    key: 'decentralize',
    items: [
      {
        title: 'Phân quyền',
        key: 'decentralize',
        linkTo: '/decentralize',
      },
    ],
  },
];
