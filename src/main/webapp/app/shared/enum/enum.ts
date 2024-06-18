export enum TransactionType {
  BUY = 1,
  SELL,
  DIVIDENDS,
}

export enum StatusCollateralType {
  ACTIVE = 1,
  EXPIRED = 5,
}

export enum StatusRepresentativeType {
  ACTIVE = 1,
  INACTIVE,
  REPLACE,
  EXPIRED = 5,
}

export enum GenderType {
  MALE = 1,
  FEMALE,
  OTHER,
}

export enum RepresentativeWorkType {
  MAIN = 1,
  Concurrently,
}

export enum StockAccountType {
  NORMAL = 'Thường',
  DEPOSIT = 'Ký quỹ',
}

export enum OrderByType {
  ascend = 'ASC',
  descend = 'DESC',
}
