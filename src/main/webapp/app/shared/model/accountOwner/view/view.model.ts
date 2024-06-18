export interface IAccountOwner {
  accountOwnerName?: string;
  companyName?: string;
  accountOwnerPhone?: string;
  accountOwnerEmail?: string;
  position?: string;
  accountOwnerId?: number;
}

export const defaultValue: Readonly<IAccountOwner> = {};
