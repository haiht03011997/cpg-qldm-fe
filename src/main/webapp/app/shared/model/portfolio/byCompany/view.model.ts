export interface IPortfolioByCompany {
  accountOwnerName?: string;
  cash?: number;
  collateralVolume?: number;
  currentVolume?: number;
  limitedVolume?: number;
  marketValue?: number;
  memberCompany?: string;
  profitPercentage?: number;
  totalInvestment?: number;
  totalValue?: number;
  accountOwnerId?: number;
}

export interface IPortfolioByCompanyDetails {
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

export const defaultValue: Readonly<IPortfolioByCompany> = {};
