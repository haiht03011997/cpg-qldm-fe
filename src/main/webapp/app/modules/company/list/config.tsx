export const columns = [
  {
    title: 'Tên đơn vị chủ quản',
    key: 'companyName',
    dataIndex: 'companyName',
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'companyPhone',
    key: 'companyPhone',
  },
  {
    title: 'Email',
    dataIndex: 'companyEmail',
    key: 'companyEmail',
  },
  {
    title: 'Địa chỉ',
    with: 100,
    ellipsis: true,
    dataIndex: 'companyAddress',
    key: 'companyAddress',
  },
];
