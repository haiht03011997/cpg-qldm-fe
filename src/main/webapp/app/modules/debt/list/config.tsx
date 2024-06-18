import { Tooltip } from 'antd';
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { formatMoneyMillion } from 'app/shared/util/money-utils';
import dayjs from 'dayjs';
import React from 'react';

export const columns = [
  {
    title: 'Ngày sao kê',
    dataIndex: 'date',
    key: 'date',
    render: date => dayjs(date).format(APP_LOCAL_DATE_FORMAT),
  },
  {
    title: 'Tên tài khoản',
    key: 'accountOwnerName',
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
                <span>Công ty CK: </span>
                <span>{item.securitiesCompanyName}</span>
              </div>
              <div>
                <span>Công ty SH: </span>
                <span>{item.memberCompanyName}</span>
              </div>
              <div>
                <span>Người thực hiện: </span>
                <span>{item.lastUpdatedByName}</span>
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
    title: (
      <div>
        <span>Đầu kỳ</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    dataIndex: 'openingDebt',
    key: 'openingDebt',
    align: 'right',
    render: item => formatMoneyMillion(item, 3),
  },
  {
    title: (
      <div>
        <span>Phát sinh tăng</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    dataIndex: 'increaseAmount',
    align: 'right',
    key: 'increaseAmount',
    render: item => formatMoneyMillion(item, 3),
  },
  {
    title: (
      <div>
        <span>Phát sinh giảm</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    dataIndex: 'decreaseAmount',
    align: 'right',
    key: 'decreaseAmount',
    render: item => formatMoneyMillion(item, 3),
  },
  {
    title: (
      <div>
        <span>Cuối kỳ</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    dataIndex: 'closingDebt',
    align: 'right',
    key: 'closingDebt',
    render: item => formatMoneyMillion(item, 3),
  },
  // {
  //   title: (
  //     <div>
  //       <span>Số nợ</span>
  //       <div className="unit-price">(trđ)</div>
  //     </div>
  //   ),
  //   dataIndex: 'debtAmount',
  //   align: 'right',
  //   key: 'debtAmount',
  //   render: item => formatMoneyMillion(item, 3),
  // },
  {
    title: (
      <div>
        <span>Lãi đã trả</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    dataIndex: 'paidInterest',
    align: 'right',
    key: 'paidInterest',
    render: item => formatMoneyMillion(item, 3),
  },
  {
    title: (
      <div>
        <span>Lãi chưa trả</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    dataIndex: 'unpaidInterest',
    align: 'right',
    key: 'unpaidInterest',
    render: item => formatMoneyMillion(item, 3),
  },
  {
    title: (
      <div>
        <span>Tổng lãi</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    dataIndex: 'interest',
    align: 'right',
    key: 'interest',
    render: item => formatMoneyMillion(item, 3),
  },
];
