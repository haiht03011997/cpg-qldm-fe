import dayjs from 'dayjs';

export interface IAccountBalance {
  accountBalanceTransactionId?: number;
  stockAccountId?: number;
  transactionDate?: string;
  transactionTypeId?: number;
  amount?: number;
  securitiesCompanyId?: number;
  isDelete: boolean;
}
export interface defaultValueForm {
  items: IAccountBalance[];
}

export interface IAccountBalanceDetail {
  data: IAccountBalance;
}
