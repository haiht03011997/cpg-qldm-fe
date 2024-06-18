import { Tooltip } from 'antd';
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { formatMoneyMillion, formatVND } from 'app/shared/util/money-utils';
import dayjs from 'dayjs';
import React from 'react';

export const columns = [
  {
    title: 'Tên tài khoản',
    key: 'accountOwnerName',
    sorter: true,
    render: item => (
      <div className="account-number">
        <Tooltip
          title={
            <div>
              <div>
                <span>Mã tài khoản: </span>
                <span>{item.accountNumber}</span>
              </div>
              <div>
                <span>Công ty SH: </span>
                <span>{item.accounntOwnerCompany}</span>
              </div>
              <div>
                <span>Công Ty CK: </span>
                <span>{item.securitiesCompany}</span>
              </div>
            </div>
          }
        >
          <img className="icon" src="content/images/icons/circle-info-solid.svg" />
        </Tooltip>
        <span>{item.accountOwnerName}</span>
      </div>
    ),
  },
  {
    title: 'Loại giao dịch',
    dataIndex: 'transactionName',
    key: 'transactionName',
  },
  {
    title: (
      <div>
        <span>Số tiền</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    key: 'amount',
    align: 'right',
    render: item => (
      <span className={`profit-percentage-${item.accountBalanceTransactionType ? 'increase' : 'decrease'}`}>
        {item.accountBalanceTransactionType ? '+' : '-'}
        {formatMoneyMillion(item.amount, 3)}
      </span>
    ),
  },
  {
    title: 'Ngày phát sinh',
    dataIndex: 'transactionDate',
    key: 'transactionDate',
    render: date => dayjs(date).format(APP_LOCAL_DATE_FORMAT),
  },
  {
    title: 'Ngày nhập liệu/ Chỉnh sửa',
    dataIndex: 'createdDate',
    key: 'createdDate',
    sorter: true,
    render: date => dayjs(date).format(APP_LOCAL_DATE_FORMAT),
  },
  {
    title: 'Người quản lý',
    dataIndex: 'lastUpdatedByName',
    key: 'lastUpdatedByName',
  },
];
