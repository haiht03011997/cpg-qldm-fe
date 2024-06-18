import { Tooltip } from 'antd';
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { formatMoneyMillion } from 'app/shared/util/money-utils';
import dayjs from 'dayjs';
import React from 'react';

export const columnsAppendix = [
  {
    title: 'Mã phụ lục',
    dataIndex: 'addendumCode',
    key: 'addendumCode',
  },
  {
    title: 'Tên phụ lục',
    key: 'addendumName',
    dataIndex: 'addendumName',
  },
  {
    title: 'Thời gian hiệu lực',
    key: 'timeEffect',
    render: item =>
      `${dayjs(item.effectiveFrom).format(APP_LOCAL_DATE_FORMAT)} ${
        item.effectiveTo ? `- ${dayjs(item.effectiveTo).format(APP_LOCAL_DATE_FORMAT)} ` : ''
      }`,
  },
  {
    title: (
      <div>
        <span>LS danh nghĩa</span>
        <div className="unit-price">(%)</div>
      </div>
    ),
    align: 'right',
    key: 'interestNominal',
    dataIndex: 'interestNominal',
  },
  {
    title: (
      <div>
        <span>LS thực tế</span>
        <div className="unit-price">(%)</div>
      </div>
    ),
    align: 'right',
    key: 'interestReality',
    dataIndex: 'interestReality',
  },
  {
    title: (
      <div>
        <span>Số tiền gốc</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    dataIndex: 'loanAmount',
    key: 'loanAmount',
    align: 'right',
    render: item => formatMoneyMillion(item, 2),
  },
  {
    title: (
      <div>
        <span>Lãi</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    dataIndex: 'interestAmount',
    key: 'interestAmount',
    align: 'right',
    render: item => formatMoneyMillion(item, 2),
  },
  {
    title: (
      <div>
        <span>Tổng gốc + lãi</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    dataIndex: 'totalInterest',
    key: 'totalInterest',
    align: 'right',
    render: item => formatMoneyMillion(item, 2),
  },
  // {
  //   title: 'Loại HĐ',
  //   key: 'totalInterest',
  //   render: item => (item.parentContractAddendumCollateralId ? 'Điều chỉnh' : 'Giải ngân'),
  // },
];
