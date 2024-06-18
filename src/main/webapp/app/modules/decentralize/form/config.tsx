import { ACTION } from 'app/config/constants';

export const configFunctions = [
  {
    title: 'Danh mục đầu tư',
    key: `portfolio/${ACTION.ALL}`,
    items: [
      {
        title: 'Theo công ty',
        key: 'portfolio/ByCompany',
      },
      {
        title: 'Theo tài khoản',
        key: 'portfolio/ByAccount',
      },
      {
        title: 'Theo cổ phiếu',
        key: 'portfolio/ByStock',
      },
    ],
  },
  {
    title: 'Quản lý danh mục',
    items: [
      {
        title: 'Giao dịch hàng ngày',
        key: `transaction/${ACTION.ALL}`,
        items: [
          {
            title: 'Xem danh sách',
            key: `transaction/${ACTION.GET}`,
          },
          {
            title: 'Thêm',
            key: `transaction/${ACTION.ADD}`,
          },
          {
            title: 'Sửa',
            key: `transaction/${ACTION.UPDATE}`,
          },
          {
            title: 'Xóa',
            key: `transaction/${ACTION.DELETE}`,
          },
        ],
      },
      {
        title: 'Dư nợ margin',
        key: `debt/${ACTION.ALL}`,
        items: [
          {
            title: 'Xem danh sách',
            key: `debt/${ACTION.GET}`,
          },
          {
            title: 'Thêm',
            key: `debt/${ACTION.ADD}`,
          },
          {
            title: 'Sửa',
            key: `debt/${ACTION.UPDATE}`,
          },
          {
            title: 'Xóa',
            key: `debt/${ACTION.DELETE}`,
          },
        ],
      },
      {
        title: 'Biến động số dư',
        key: `accountBalance/${ACTION.ALL}`,
        items: [
          {
            title: 'Xem danh sách',
            key: `accountBalance/${ACTION.GET}`,
          },
          {
            title: 'Thêm',
            key: `accountBalance/${ACTION.ADD}`,
          },
          {
            title: 'Sửa',
            key: `accountBalance/${ACTION.UPDATE}`,
          },
          {
            title: 'Xóa',
            key: `accountBalance/${ACTION.DELETE}`,
          },
        ],
      },
    ],
  },
  {
    title: 'Cầm cố',
    key: `collateral/${ACTION.ALL}`,
    items: [
      {
        title: 'Xem danh sách',
        key: `collateral/${ACTION.GET}`,
      },
      {
        title: 'Thêm',
        key: `collateral/${ACTION.ADD}`,
      },
      {
        title: 'Sửa',
        key: `collateral/${ACTION.UPDATE}`,
      },
      {
        title: 'Xóa',
        key: `collateral/${ACTION.DELETE}`,
      },
      {
        title: 'Xem chi tiết',
        key: `collateral/${ACTION.DETAIL}`,
      },
    ],
  },
  {
    title: 'Người đại diện',
    key: `representative/${ACTION.ALL}`,
    items: [
      {
        title: 'Xem danh sách',
        key: `representative/${ACTION.GET}`,
      },
      {
        title: 'Thêm',
        key: `representative/${ACTION.ADD}`,
      },
      {
        title: 'Sửa',
        key: `representative/${ACTION.UPDATE}`,
      },
      {
        title: 'Xóa',
        key: `representative/${ACTION.DELETE}`,
      },
      {
        title: 'Xem chi tiết',
        key: `representative/${ACTION.DETAIL}`,
      },
    ],
  },
  {
    title: 'Danh mục dùng chung',
    items: [
      {
        title: 'Đơn vị chủ quản',
        key: `company/${ACTION.ALL}`,
        items: [
          {
            title: 'Xem danh sách',
            key: `company/${ACTION.GET}`,
          },
          {
            title: 'Thêm',
            key: `company/${ACTION.ADD}`,
          },
          {
            title: 'Sửa',
            key: `company/${ACTION.UPDATE}`,
          },
          {
            title: 'Xóa',
            key: `company/${ACTION.DELETE}`,
          },
        ],
      },
      {
        title: 'Thông tin chủ tài khoản',
        key: `accountOwner/${ACTION.ALL}`,
        items: [
          {
            title: 'Xem danh sách',
            key: `accountOwner/${ACTION.GET}`,
          },
          {
            title: 'Thêm',
            key: `accountOwner/${ACTION.ADD}`,
          },
          {
            title: 'Sửa',
            key: `accountOwner/${ACTION.UPDATE}`,
          },
          {
            title: 'Xóa',
            key: `accountOwner/${ACTION.DELETE}`,
          },
        ],
      },
      {
        title: 'Tài khoản chứng khoán',
        key: `stockAccount/${ACTION.ALL}`,
        items: [
          {
            title: 'Xem danh sách',
            key: `stockAccount/${ACTION.GET}`,
          },
          {
            title: 'Thêm',
            key: `stockAccount/${ACTION.ADD}`,
          },
          {
            title: 'Sửa',
            key: `stockAccount/${ACTION.UPDATE}`,
          },
          {
            title: 'Xóa',
            key: `stockAccount/${ACTION.DELETE}`,
          },
        ],
      },
    ],
  },
];
