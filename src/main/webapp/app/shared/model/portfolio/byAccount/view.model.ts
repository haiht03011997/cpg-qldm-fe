import { IPayLoad } from '../../modal';

export interface IPortfolioByAccount {
  accountOwnerName?: string;
  currentVolume?: number;
  memberCompany?: string;
  totalInvestment?: number;
  marketValue?: number;
  profitPercentage?: number;
  cash?: number;
  totalValue?: number;
  limitedVolume?: number;
  collateralVolume?: number;
  accountOwnerId?: number;
}

export interface IPortfolioByAccountDetails {
  stockSymbol?: string;
  currentVolume?: number;
  avgPrice?: number;
  marketValue?: number;
  totalInvestment?: number;
  marketPrice?: number;
  limitedVolume?: number;
  collateralVolume?: number;
  sharesOutstanding?: number;
  owningPercentage?: number;
  diffPercentage?: number;
}

export interface IPortfolioByAccountId extends IPayLoad {
  accountId?: number;
  accountOwnerId?: number;
}

export const defaultValue: Readonly<IPortfolioByAccount> = {};
