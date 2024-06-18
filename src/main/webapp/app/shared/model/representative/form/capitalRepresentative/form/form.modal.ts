import { StatusRepresentativeType } from 'app/shared/enum/enum';

export interface ICapitalRepresentative {
  capitalRepresentativeId?: number;
  representativeId?: number;
  unadjustedId?: number;
  decisionNumber?: string;
  companyId?: number;
  capitalAmount?: number;
  percentage?: number;
  effectDate?: Date | null;
  expireDate?: Date | null;
  signedBy?: string | null;
  signedDate?: Date | null;
  status: StatusRepresentativeType;
  isDeleted: boolean;
}
