import { StockAccountType } from 'app/shared/enum/enum';

export interface IStockAccount {
  accountOwnerCompanyName?: string;
  companyName?: string;
  accountName?: string;
  accountNumber?: string;
  accountType?: StockAccountType;
  accountId?: number;
  parentAccountId?: number;
}

export const defaultValue: Readonly<IStockAccount> = {};

export const stockAccountTypeMapping = {
  [StockAccountType.NORMAL]: 'Thường',
  [StockAccountType.DEPOSIT]: 'Ký quỹ',
};
