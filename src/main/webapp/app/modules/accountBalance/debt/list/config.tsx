import { Tooltip } from 'antd';
import { formatMoneyMillion, formatVND } from 'app/shared/util/money-utils';
import React from 'react';

export const columns = [
  {
    title: 'Tên TK',
    key: 'accountOwnerName',
    render: item => (
      <div className="account-number">
        <Tooltip
          title={
            <div>
              <div>
                <span>Công ty SH: </span>
                <span>{item.accounntOwnerCompany}</span>
              </div>
              <div>
                <span>Công ty LK: </span>
                <span>{item.securitiesCompany}</span>
              </div>
              <div>
                <span>Mã TK: </span>
                <span>{item.accountNumber}</span>
              </div>
            </div>
          }
        >
          <img className="icon" src="content/images/icons/circle-info-solid.svg" />
        </Tooltip>
      </div>
    ),
  },
  {
    title: (
      <div>
        <span>Số dư tiền mặt</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    key: 'amount',
    align: 'right',
    // render: item => (
    //   <span className={`profit-percentage-${item.accountBalanceTransactionType ? 'increase' : 'decrease'}`}>
    //     {item.accountBalanceTransactionType ? '+' : '-'}
    //     {formatMoneyMillion(item.amount, 3)}
    //   </span>
    // ),
  },
  {
    title: (
      <div>
        <span>Giá trị tài sản</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    key: 'amount',
    align: 'right',
    // render: item => (
    //   <span className={`profit-percentage-${item.accountBalanceTransactionType ? 'increase' : 'decrease'}`}>
    //     {item.accountBalanceTransactionType ? '+' : '-'}
    //     {formatMoneyMillion(item.amount, 3)}
    //   </span>
    // ),
  },
  {
    title: (
      <div>
        <span>Phát sinh giảm</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    key: 'amount',
    align: 'right',
    // render: item => (
    //   <span className={`profit-percentage-${item.accountBalanceTransactionType ? 'increase' : 'decrease'}`}>
    //     {item.accountBalanceTransactionType ? '+' : '-'}
    //     {formatMoneyMillion(item.amount, 3)}
    //   </span>
    // ),
  },
  {
    title: (
      <div>
        <span>Số dư cuối ngày</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    key: 'amount',
    align: 'right',
    // render: item => (
    //   <span className={`profit-percentage-${item.accountBalanceTransactionType ? 'increase' : 'decrease'}`}>
    //     {item.accountBalanceTransactionType ? '+' : '-'}
    //     {formatMoneyMillion(item.amount, 3)}
    //   </span>
    // ),
  },
];
