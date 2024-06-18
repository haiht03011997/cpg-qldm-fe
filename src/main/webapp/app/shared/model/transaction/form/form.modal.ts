export interface ITransaction {
  stockTransactionId: number;
  date: Date;
  stockSymbol: string;
  volume: number;
  marketPrice: number;
  fee: number;
  tax: number;
  transactionTypeId: number;
  totalPrice: number;
  stockAccountId: number;
  isLimited: boolean;
  limitedTill: string;
  userId: number;
  isDelete: boolean;
}
