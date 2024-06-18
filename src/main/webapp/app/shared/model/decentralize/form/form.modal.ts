export interface IDecentralize {
  userLogin?: string;
  type: string;
  companyId?: string;
  permission: string;
  actions: string[];
}

export interface IDecentralizeDetail {
  data: IDecentralize;
}
