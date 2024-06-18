export interface IContractAddendum {
  contractAddendumCollateralId?: number;
  collateralId?: number | string;
  addendumCode?: string;
  addendumName?: string;
  parentContractAddendumCollateralId?: number;
  effectiveFrom?: string;
  effectiveTo?: string;
  interestNominal?: number;
  interestReality?: number;
  loanAmount?: number;
  interestAmount?: number;
  totalInterest?: number;
}
