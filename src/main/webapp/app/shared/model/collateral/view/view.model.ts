import { StatusCollateralType } from 'app/shared/enum/enum';

export interface ICollateral {
  id?: number;
  contractName?: string;
  borrowCompanyName?: string;
  collateralCompanyName?: string;
  maximumLoan?: string;
  loanAmount?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  createdByName?: string;
  status?: StatusCollateralType;
}

export const defaultValue: Readonly<ICollateral> = {};

export const statusCollateralMapping = {
  [StatusCollateralType.ACTIVE]: 'Còn hiệu lực',
  [StatusCollateralType.EXPIRED]: 'Hết hiệu lục',
};
