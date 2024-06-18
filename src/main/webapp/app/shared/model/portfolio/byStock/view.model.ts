export interface IPortfolioByStock {
  stockSymbol: string;
  avgPrice?: number;
  currentVolume?: number;
  limitedVolume?: number;
  marketPrice?: number;
  marketValue?: number;
  totalInvestment?: number;
  diffNumber?: number;
}

export const defaultValue: Readonly<IPortfolioByStock> = {
  stockSymbol: '',
};
