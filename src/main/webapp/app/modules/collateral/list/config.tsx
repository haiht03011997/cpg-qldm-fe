import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { StatusCollateralType } from 'app/shared/enum/enum';
import { statusCollateralMapping } from 'app/shared/model/collateral/view/view.model';
import { formatMoneyMillion } from 'app/shared/util/money-utils';
import dayjs from 'dayjs';
import React from 'react';

export const columns = [
  {
    title: 'Mã hợp đồng',
    dataIndex: 'contractCode',
    key: 'contractCode',
  },
  {
    title: 'ĐV vay',
    key: 'borrowCompanyName',
    dataIndex: 'borrowCompanyName',
  },
  {
    title: 'ĐV cho vay',
    key: 'collateralCompanyName',
    dataIndex: 'collateralCompanyName',
  },
  {
    title: (
      <div>
        <span>Giá trị TSBĐ</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    dataIndex: 'sumAssetValue',
    key: 'sumAssetValue',
    align: 'right',
    render: item => formatMoneyMillion(item, 2),
  },
  {
    title: (
      <div>
        <span>Hạn mức</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    dataIndex: 'maximumLoan',
    key: 'maximumLoan',
    align: 'right',
    render: item => formatMoneyMillion(item, 2),
  },
  {
    title: (
      <div>
        <span>Số tiền vay</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    dataIndex: 'loanAmount',
    key: 'loanAmount',
    align: 'right',
    render: item => formatMoneyMillion(item, 2),
  },
  {
    title: 'Hiệu lực từ',
    dataIndex: 'effectiveFrom',
    key: 'closingDebt',
    render: item => item && dayjs(item).format(APP_LOCAL_DATE_FORMAT),
  },
  {
    title: 'Hiệu lực đến',
    dataIndex: 'effectiveTo',
    key: 'effectiveTo',
    render: item => item && dayjs(item).format(APP_LOCAL_DATE_FORMAT),
  },
  {
    title: 'Người quản lý',
    dataIndex: 'lastUpdatedByName',
    key: 'lastUpdatedByName',
    align: 'right',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: item => (
      <span className={`status-${item === StatusCollateralType.ACTIVE ? 'active' : 'inactive'}`}>{statusCollateralMapping[item]}</span>
    ),
  },
];

export const statusCollateralTypeArray = Object.keys(StatusCollateralType)
  .filter(key => !isNaN(Number(StatusCollateralType[key])))
  .map(key => ({
    key: StatusCollateralType[key],
    label: statusCollateralMapping[StatusCollateralType[key]],
  }));
