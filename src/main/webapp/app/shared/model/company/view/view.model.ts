export interface ICompany {
  companyName?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyAddress?: string;
  companyId?: number;
}

export const defaultValue: Readonly<ICompany> = {};
