export interface IDebt {
  debtId?: number;
  transactionDate?: string;
  memberCompanyName?: string;
  securitiesCompanyName?: string;
  accountOwnerName?: string;
  accountNumber?: string;
  openingDebt?: number;
  increaseAmount?: number;
  decreaseAmount?: number;
  closingDebt?: number;
  paidInterest?: number;
  unpaidInterest?: number;
  interestAmount?: number;
}

export const defaultValue: Readonly<IDebt> = {};
