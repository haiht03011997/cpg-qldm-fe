import { StatusCollateralType } from 'app/shared/enum/enum';

export interface ICollateral {
  collateralId?: number;
  collateralCompanyId: number;
  contractCode: string;
  contractName: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  borrowCompanyId: number;
  loanAmount?: number;
  maximumLoan?: number;
  signedBy?: string;
  position?: string;
  status: StatusCollateralType;
  assetCollaterals: IAssetCollaterals[];
}

export interface IAssetCollaterals {
  assetCollateralId?: number;
  collateralId?: number;
  accountId?: number;
  stockSymbol?: string;
  stockVolume: number;
  assetValue?: number;
}

export interface ICollateralDetail {
  data: ICollateral;
}
