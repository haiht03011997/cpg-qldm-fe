export interface IContractAddendum {
  contractAddendumCollateralId?: number;
  collateralId?: number;
  addendumCode?: string;
  addendumName?: string;
  parentContractAddendumCollateralId?: number;
  effectiveFrom?: string;
  effectiveTo?: string;
  interestAmount?: number;
  interestNominal?: number;
  interestReality?: number;
  totalInterest?: number;
  LoanAmount?: number;
}

export const defaultValue: Readonly<IContractAddendum> = {};
