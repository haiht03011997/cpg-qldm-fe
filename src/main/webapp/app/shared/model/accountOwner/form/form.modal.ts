export interface IAccountOwner {
  accountOwnerId?: number;
  accountOwnerName?: string;
  accountOwnerPhone?: string;
  accountOwnerEmail?: string;
  position?: string;
  accountOwnerCompanies?: number[];
}

export interface IAccountOwnerDetail {
  data: IAccountOwner;
}
