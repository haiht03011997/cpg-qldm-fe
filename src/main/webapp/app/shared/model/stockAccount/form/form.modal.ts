export interface IStockAccount {
  accountId?: number;
  companyId: number;
  accountOwnerId: number;
  accountType: string;
  parentAccountId?: number;
  accountNumber?: string;
}

export interface IStockAccountDetail {
  data: IStockAccount;
}
