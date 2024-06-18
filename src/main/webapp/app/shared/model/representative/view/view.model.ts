export interface IRepresentative {
  representativeId?: number;
  name?: string;
  companyName?: string;
  representativeCompanyName?: string;
  identifiedCard?: string;
}

export const defaultValue: Readonly<IRepresentative> = {};
