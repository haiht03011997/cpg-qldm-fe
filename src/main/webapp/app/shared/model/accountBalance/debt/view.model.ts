export interface IAccountBalanceDebt {
  accounntOwnerCompany?: string;
  securitiesCompany?: string;
  accountOwnerName?: string;
  accountNumber?: string;
  transactionName?: string;
  amount?: number;
  accountManagerName?: string;
  createdAt?: string;
  transactionDate?: string;
}

export const defaultValue: Readonly<IAccountBalanceDebt> = {};
