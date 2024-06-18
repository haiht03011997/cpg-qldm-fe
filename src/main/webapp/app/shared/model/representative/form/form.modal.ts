import { GenderType } from 'app/shared/enum/enum';
import { ICapitalRepresentative } from './capitalRepresentative/form/form.modal';

export interface IRepresentative {
  representativeId?: number;
  name?: string;
  phoneNumber?: string;
  email: string;
  dob?: Date;
  identifiedCard?: string;
  gender?: GenderType;
  isDeleted: boolean;
  works: IRepresentativeWork[];
  capitalRepresentatives: ICapitalRepresentative[];
}

export interface IRepresentativeWork {
  Id?: number;
  representativeId?: number;
  companyId?: number;
  companyName?: string;
  role?: string;
  isDeleted: boolean;
}

export const genderMapping = {
  [GenderType.MALE]: 'Nam',
  [GenderType.FEMALE]: 'Nữ',
  [GenderType.OTHER]: 'Khác',
};
