import { TableColumnsType } from 'antd';
import { StatusRepresentativeType } from 'app/shared/enum/enum';
import { StatusRepresentativeTypeMapping } from 'app/shared/model/representative/form/capitalRepresentative/view/view.model';
import { convertDateTimeToDisplay } from 'app/shared/util/date-utils';
import { formatMoneyMillion, formatVND } from 'app/shared/util/money-utils';
import React from 'react';

export const columnsAppendixExpand: TableColumnsType<DataType> = [
  {
    title: 'Số QĐ',
    dataIndex: 'decisionNumber',
    key: 'decisionNumber',
  },
  {
    title: 'Đại diện tại công ty',
    key: 'companyName',
    dataIndex: 'companyName',
  },
  {
    title: (
      <div>
        <span>Số vốn đại diện</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    align: 'right',
    key: 'capitalAmount',
    dataIndex: 'capitalAmount',
    render: item => item && formatMoneyMillion(item, 2),
  },
  {
    title: (
      <div>
        <span>Tỷ lệ đại diện</span>
        <div className="unit-price">(%)</div>
      </div>
    ),
    align: 'right',
    key: 'percentage',
    dataIndex: 'percentage',
    render: item => item && formatVND(item),
  },
  {
    title: 'Ngày bắt đầu',
    dataIndex: 'effectDateFrom',
    key: 'effectDateFrom',
    align: 'center',
    render: item => convertDateTimeToDisplay(item),
  },
  {
    title: 'Ngày kết thúc',
    dataIndex: 'effectDateTo',
    key: 'effectDateTo',
    align: 'center',
    render: item => convertDateTimeToDisplay(item),
  },
  {
    title: 'Trạng thái',
    key: 'status',
    render: item => (
      <span className={`status-${item.status === StatusRepresentativeType.ACTIVE ? 'active' : item.status === StatusRepresentativeType.INACTIVE ? 'inactive' : 'replace'}`}>
        {!item.unInvestId && StatusRepresentativeTypeMapping[item.status]}
      </span>
    ),
  },
];

export const columnsAppendix: TableColumnsType<ExpandedDataType> = [
  {
    title: 'Đại diện tại công ty',
    key: 'capitalCompanyName',
    dataIndex: 'capitalCompanyName',
  },
  {
    title: (
      <div>
        <span>Tổng Số vốn đại diện</span>
        <div className="unit-price">(trđ)</div>
      </div>
    ),
    align: 'right',
    key: 'toTalCapitalAmount',
    dataIndex: 'toTalCapitalAmount',
    render: item => item && formatMoneyMillion(item, 2),
  },
  {
    title: (
      <div>
        <span>Tổng Tỷ lệ đại diện</span>
        <div className="unit-price">(%)</div>
      </div>
    ),
    align: 'right',
    key: 'totalPercentage',
    dataIndex: 'totalPercentage',
    render: item => item && formatVND(item),
  },
  {
    title: 'Ngày bắt đầu',
    dataIndex: 'effectDateFrom',
    key: 'capitalEffectDateFrom',
    align: 'center',
    render: item => convertDateTimeToDisplay(item),
  },
  {
    title: 'Ngày kết thúc',
    dataIndex: 'effectDateTo',
    key: 'capitalEffectDateTo',
    align: 'center',
    render: item => convertDateTimeToDisplay(item),
  },
];

interface DataType {
  key: React.Key;
}

interface ExpandedDataType {
  key: React.Key;
}
