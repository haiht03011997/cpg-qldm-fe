import { Tooltip } from 'antd';
import { GenderType } from 'app/shared/enum/enum';
import { genderMapping } from 'app/shared/model/representative/form/form.modal';
import React from 'react';

export const columns = [
  {
    title: 'Họ tên',
    key: 'name',
    render: item => (
      <div className="account-number">
        <Tooltip
          title={
            <div>
              <span>CMND/CCCD: </span>
              <span>{item.identifiedCard}</span>
            </div>
          }
        >
          <img className="icon" src="content/images/icons/circle-info-solid.svg" />
        </Tooltip>
        <span>{item.name}</span>
      </div>
    ),
  },
  {
    title: 'Công ty làm việc chính',
    key: 'companyName',
    dataIndex: 'companyName',
  },
  {
    title: 'Công ty đại diện',
    key: 'representativeCompanyName',
    dataIndex: 'representativeCompanyName',
  },
];

export const genderArray = Object.entries(genderMapping).map(([key, value]) => ({ value: parseInt(key, 10), label: value }));
