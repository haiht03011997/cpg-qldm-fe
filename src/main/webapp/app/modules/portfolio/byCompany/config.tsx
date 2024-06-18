import { TableColumnsType, Tooltip } from 'antd';
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { convertDateTimeToDisplay } from 'app/shared/util/date-utils';
import { formatMoneyMillion, formatMoneyThousand, formatVND } from 'app/shared/util/money-utils';
import dayjs from 'dayjs';
import React from 'react';

export const columns: TableColumnsType<DataType> = [
  {
    title: 'ĐVQL',
    dataIndex: 'memberCompanyName',
    key: 'memberCompanyName',
  },
  // {
  //   title: (
  //     <div>
  //       <span> KL</span>
  //       <div className="unit-price">(cp)</div>
  //     </div>
  //   ),
  //   dataIndex: 'currentVolume',
  //   key: 'currentVolume',
  //   align: 'right',
  //   render: item => formatVND(item),
  // },
  {
    title: (
      <div>
        <span>Tổng GTĐT</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    key: 'totalInvestment',
    dataIndex: 'totalInvestment',
    align: 'right',
    render: item => formatMoneyMillion(item, 0),
  },
  {
    title: (
      <div>
        <span>Tổng GTTT</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    key: 'marketValue',
    align: 'right',
    render: item => (
      <span
        className={`${
          dayjs(dayjs(), APP_LOCAL_DATE_FORMAT).isAfter(dayjs(dayjs(item.effectiveDate), APP_LOCAL_DATE_FORMAT)) ? 'out-of-date' : ''
        }`}
      >
        <Tooltip title={`Tổng GTTT được tính ngày ${convertDateTimeToDisplay(item.effectiveDate)}`}>
          {formatMoneyMillion(item.marketValue, 0)}
        </Tooltip>
      </span>
    ),
  },
  {
    title: (
      <div>
        <span>OnPort Profit</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    dataIndex: 'onPortProfit',
    key: 'onPortProfit',
    align: 'right',
    render: item => (
      <span className={`profit-percentage-${item !== 0 ? (item > 0 ? 'increase' : 'decrease') : ''}`}>
        {item > 0 ? '+' : ''}
        {formatMoneyMillion(item, 2)}
      </span>
    ),
  },
  {
    title: (
      <div>
        <span>Trading Profit</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    dataIndex: 'finishedProfit',
    key: 'finishedProfit',
    align: 'right',
    render: item => (
      <span className={`profit-percentage-${item !== 0 ? (item > 0 ? 'increase' : 'decrease') : ''}`}>
        {item > 0 ? '+' : ''}
        {formatMoneyMillion(item, 2)}
      </span>
    ),
  },
  {
    title: (
      <div>
        <span> KL HCCN</span>
        <div className="unit-price">(cp)</div>
      </div>
    ),
    key: 'limitedVolume',
    dataIndex: 'limitedVolume',
    align: 'right',
    render: item => item && formatVND(item),
  },
  {
    title: (
      <div>
        <span> KL cầm cố</span>
        <div className="unit-price">(cp)</div>
      </div>
    ),
    dataIndex: 'collateralVolume',
    key: 'collateralVolume',
    align: 'right',
    render: item => item && formatVND(item),
  },
  // {
  //   title: (
  //     <div>
  //       <span> KL khả dụng</span>
  //       <div className="unit-price">(cp)</div>
  //     </div>
  //   ),
  //   dataIndex: 'availableVolume',
  //   key: 'availableVolume',
  //   align: 'right',
  //   render: item => item && formatVND(item),
  // },
  {
    title: (
      <div>
        <span>Tiền mặt</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    dataIndex: 'cash',
    key: 'cash',
    align: 'right',
    render: item => formatMoneyMillion(item, 2),
  },
  {
    title: (
      <div>
        <span>Tổng tài sản</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    dataIndex: 'totalValue',
    key: 'totalValue',
    align: 'right',
    render: item => formatMoneyMillion(item, 0),
  },
];

export const columnsExpand: TableColumnsType<ExpandedDataType> = [
  {
    title: 'Mã CP',
    key: 'stockSymbol',
    render: item => (
      <div className="account-number">
        <Tooltip
          title={
            <div>
              <div>
                <span>Tên tài khoản: </span>
                <span>{item.accountOwnerName}</span>
              </div>
              <div>
                <span>Mã tài khoản: </span>
                <span>{item.accountNumber}</span>
              </div>
            </div>
          }
        >
          <img className="icon" src="content/images/icons/circle-info-solid.svg" />
        </Tooltip>
        <span>{item.stockSymbol}</span>
      </div>
    ),
  },
  {
    title: (
      <div>
        <span> KL</span>
        <div className="unit-price">(cp)</div>
      </div>
    ),
    dataIndex: 'currentVolume',
    key: 'currentVolume',
    align: 'right',
    render: item => formatVND(item),
  },
  {
    title: (
      <div>
        <span>Giá TB</span>
        <div className="unit-price">(ngđ)</div>
      </div>
    ),
    dataIndex: 'avgPrice',
    key: 'avgPrice',
    align: 'right',
    render: item => formatMoneyThousand(item, 2),
  },
  {
    title: (
      <div>
        <span>Tổng GTĐT</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    key: 'totalInvestment',
    dataIndex: 'totalInvestment',
    align: 'right',
    render: item => formatMoneyMillion(item, 0),
  },
  {
    title: (
      <div>
        <span>Giá thị trường</span>
        <div className="unit-price">(ngđ)</div>
      </div>
    ),
    key: 'marketPrice',
    align: 'right',
    render: item => (
      <span
        className={`${
          dayjs(dayjs(), APP_LOCAL_DATE_FORMAT).isAfter(dayjs(dayjs(item.effectiveDate), APP_LOCAL_DATE_FORMAT)) ? 'out-of-date' : ''
        }`}
      >
        <Tooltip title={`Giá thị trường được tính ngày ${convertDateTimeToDisplay(item.effectiveDate)}`}>
          {formatMoneyThousand(item.marketPrice, 2)}
        </Tooltip>
      </span>
    ),
  },
  {
    title: (
      <div>
        <span>Tổng GTTT</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    key: 'marketValue',
    align: 'right',
    render: item => (
      <span
        className={`${
          dayjs(dayjs(), APP_LOCAL_DATE_FORMAT).isAfter(dayjs(dayjs(item.effectiveDate), APP_LOCAL_DATE_FORMAT)) ? 'out-of-date' : ''
        }`}
      >
        <Tooltip title={`Tổng GTTT được tính ngày ${convertDateTimeToDisplay(item.effectiveDate)}`}>
          {formatMoneyMillion(item.marketValue, 0)}
        </Tooltip>
      </span>
    ),
  },
  {
    title: (
      <div>
        <span>Tỷ lệ SH</span>
        <div className="unit-price">(%)</div>
      </div>
    ),
    dataIndex: 'owningPercentage',
    key: 'owningPercentage',
    align: 'right',
    render: item => (
      <span
        className={`owning-percentage-over${
          parseInt(item, 10) > 50 ? '-50' : parseInt(item, 10) > 35 ? '-35' : parseInt(item, 10) > 5 ? '-5' : ''
        }`}
      >
        {formatVND(item.toFixed(2))}
      </span>
    ),
  },
  {
    title: (
      <div>
        <span>OnPort Profit</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    dataIndex: 'onPortProfit',
    key: 'onPortProfit',
    align: 'right',
    render: item => (
      <span className={`profit-percentage-${item !== 0 ? (item > 0 ? 'increase' : 'decrease') : ''}`}>
        {item > 0 ? '+' : ''}
        {formatMoneyMillion(item, 2)}
      </span>
    ),
  },
  {
    title: (
      <div>
        <span>Trading Profit</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    dataIndex: 'finishedProfit',
    key: 'finishedProfit',
    align: 'right',
    render: item => (
      <span className={`profit-percentage-${item !== 0 ? (item > 0 ? 'increase' : 'decrease') : ''}`}>
        {item > 0 ? '+' : ''}
        {formatMoneyMillion(item, 2)}
      </span>
    ),
  },
  {
    title: (
      <div>
        <span> KL HCCN</span>
        <div className="unit-price">(cp)</div>
      </div>
    ),
    dataIndex: 'limitedVolume',
    key: 'limitedVolume',
    align: 'right',
    render: item => item && formatVND(item),
  },
  {
    title: (
      <div>
        <span> KL cầm cố</span>
        <div className="unit-price">(cp)</div>
      </div>
    ),
    dataIndex: 'collateralVolume',
    key: 'collateralVolume',
    align: 'right',
    render: item => item && formatVND(item),
  },
  {
    title: (
      <div>
        <span> KL khả dụng</span>
        <div className="unit-price">(cp)</div>
      </div>
    ),
    dataIndex: 'availableVolume',
    key: 'availableVolume',
    align: 'right',
    render: item => item && formatVND(item),
  },
];

interface DataType {
  key: React.Key;
}

interface ExpandedDataType {
  key: React.Key;
}
