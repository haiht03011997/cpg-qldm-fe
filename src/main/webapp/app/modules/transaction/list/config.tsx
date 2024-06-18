import { Tooltip } from 'antd';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { formatMoneyMillion, formatMoneyThousand, formatVND } from 'app/shared/util/money-utils';
import dayjs from 'dayjs';
import React from 'react';

export const columns = [
  {
    title: 'Tên tài khoản',
    key: 'accountNumber',
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
                <span>Công ty CK: </span>
                <span>{item.securitiesCompany}</span>
              </div>
              <div>
                <span>Công ty SH: </span>
                <span>{item.companyOwner}</span>
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
    title: 'Mã CP',
    dataIndex: 'stockSymbol',
    sorter: true,
    key: 'stockSymbol',
  },
  {
    title: 'Loại GD',
    dataIndex: 'transactionTypeName',
    key: 'transactionTypeName',
  },
  {
    title: (
      <div>
        <span> KL</span>
        <div className="unit-price">(cp)</div>
      </div>
    ),
    dataIndex: 'volume',
    key: 'volume',
    align: 'right',
    render: item => formatVND(item),
  },
  {
    title: (
      <div>
        <span>Giá</span>
        <div className="unit-price">(ngđ)</div>
      </div>
    ),
    align: 'right',
    dataIndex: 'marketPrice',
    key: 'marketPrice',
    render: item => formatMoneyThousand(item, 2),
  },
  {
    title: (
      <div>
        <span>Thuế</span>
        <div className="unit-price">(%)</div>
      </div>
    ),
    align: 'right',
    dataIndex: 'tax',
    key: 'tax',
  },
  {
    title: (
      <div>
        <span>Phí</span>
        <div className="unit-price">(%)</div>
      </div>
    ),
    align: 'right',
    dataIndex: 'fee',
    key: 'fee',
  },
  {
    title: (
      <div>
        <span>Tổng GT</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    align: 'right',
    dataIndex: 'totalPrice',
    key: 'totalPrice',
    render: item => formatMoneyMillion(item, 2),
  },
  {
    title: 'Ngày kết thúc HCCN',
    dataIndex: 'limitedTill',
    key: 'limitedTill',
    align: 'center',
    render: date => date && dayjs(date).format(APP_LOCAL_DATE_FORMAT),
  },
  {
    title: 'Ngày',
    dataIndex: 'date',
    sorter: true,
    key: 'date',
    render: date => dayjs(date).format(APP_DATE_FORMAT),
  },
];
