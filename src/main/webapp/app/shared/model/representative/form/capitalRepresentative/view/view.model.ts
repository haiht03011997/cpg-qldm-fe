import { StatusRepresentativeType } from 'app/shared/enum/enum';

export interface ICapitalRepresentative {
  capitalRepresentativeId?: number;
  unInvestId?: number;
  representativeId?: number;
  companyId?: number;
  representativeWorkId?: number;
  role?: number;
  decisionNumber?: string;
  companyName?: string;
  representCompanyName?: string;
  capitalAmount?: number;
  percentage?: number;
  effectDate?: Date | null;
  expireDate?: Date | null;
  status: StatusRepresentativeType;
  isDeleted: boolean;
}

export const defaultValue: Readonly<ICapitalRepresentative> = {
  status: StatusRepresentativeType.ACTIVE,
  isDeleted: false,
};

export const StatusRepresentativeTypeMapping = {
  [StatusRepresentativeType.ACTIVE]: 'Hiệu lực',
  [StatusRepresentativeType.INACTIVE]: 'Thôi ủy quyền',
  [StatusRepresentativeType.REPLACE]: 'Bị thay thế',
  [StatusRepresentativeType.EXPIRED]: 'Hết hiệu lực',
};
