import { Tooltip } from 'antd';
import { APP_LOCAL_DATE_FORMAT, DATE_TIME_FORMAT_PAYLOAD } from 'app/config/constants';
import { convertDateTimeToDisplay } from 'app/shared/util/date-utils';
import { formatMoneyMillion, formatMoneyThousand, formatVND } from 'app/shared/util/money-utils';
import dayjs from 'dayjs';
import React from 'react';

export const columns = [
  {
    title: 'Mã CP',
    dataIndex: 'stockSymbol',
    key: 'stockSymbol',
    render: text => <span>{text}</span>,
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
        <span>Giá trị ĐT</span>
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
        <span>Thị giá</span>
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
        <Tooltip title={`Thị giá được tính ngày ${convertDateTimeToDisplay(item.effectiveDate)}`}>
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
  // {
  //   title: 'KL CP lưu hành',
  //   key: 'sharesOutstanding',
  //   align: 'right',
  //   dataIndex: 'sharesOutstanding',
  //   render: item => formatVND(item),
  // },
  {
    title: (
      <div>
        <span>Tỷ lệ SH</span>
        <div className="unit-price">(%)</div>
      </div>
    ),
    key: 'owningPercentage',
    align: 'right',
    dataIndex: 'owningPercentage',
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
        <span> KL thế chấp</span>
        <div className="unit-price">(cp)</div>
      </div>
    ),
    key: 'collateralVolume',
    align: 'right',
    dataIndex: 'collateralVolume',
    render: item => formatVND(item),
  },
  {
    title: (
      <div>
        <span> KL khả dụng</span>
        <div className="unit-price">(cp)</div>
      </div>
    ),
    key: 'availableVolume',
    align: 'right',
    dataIndex: 'availableVolume',
    render: item => formatVND(item),
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
    render: item => formatVND(item),
  },
];
