import { stockAccountTypeMapping } from 'app/shared/model/stockAccount/view/view.model';

export const columns = [
  {
    title: 'Tên tài khoản',
    key: 'accountName',
    dataIndex: 'accountName',
  },
  {
    title: 'Số tài khoản',
    dataIndex: 'accountNumber',
    key: 'accountNumber',
  },
  {
    title: 'Loại tài khoản',
    dataIndex: 'accountType',
    key: 'accountType',
  },
  {
    title: 'Công ty SH',
    dataIndex: 'accountOwnerCompanyName',
    key: 'accountOwnerCompanyName',
  },
  {
    title: 'Công Ty CK',
    dataIndex: 'companyName',
    key: 'companyName',
  },
];
export const stockAccountTypeArray = Object.entries(stockAccountTypeMapping).map(([key, value]) => ({
  value: key,
  label: value,
}));
