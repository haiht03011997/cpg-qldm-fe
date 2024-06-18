import { OrderByType } from '../enum/enum';

export interface IPayLoad {
  searchText?: string;
  filters?: any;
  sort?: any;
  page: number;
  limit: number;
  id?: number;
}

export interface IOptionProps {
  label: string;
  value: string;
}

export interface Base<T> {
  data: T[];
  success: boolean;
  total?: number;
}

export interface IRoles {
  add?: boolean;
  delete?: boolean;
  update?: boolean;
  viewDetail?: boolean;
}
