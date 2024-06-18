export interface IDebt {
  debtId?: number;
  accountId: number;
  date: string;
  openingDebt: number;
  increaseAmount: number;
  decreaseAmount: number;
  closingDebt: number;
  paidInterest: number;
  unpaidInterest: number;
  isDelete: boolean;
}

export interface IDebtDetail {
  data: IDebt;
}
