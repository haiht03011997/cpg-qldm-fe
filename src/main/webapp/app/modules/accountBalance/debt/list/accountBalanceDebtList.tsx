import { FilterTwoTone } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import TableComponent from 'app/shared/component/table/table';
import { fetchAccountBalanceDebt } from 'app/shared/reducers/accountBalance/debt/view.reducer';
import { fetchAccountBalance } from 'app/shared/reducers/accountBalance/view/accountBalance.reduces';
import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import { columns } from './config';
import FilterModal from './filter/filter';
import './style.scss';

const { Search } = Input;

const AccountBalanceDebtListComponent = () => {
  const dispatch = useAppDispatch();
  const { data, isFetching, page, limit, searchText, filters, total } = useAppSelector(state => state.accountBalanceDebt);
  const [visibleFilter, setFilterModalVisible] = useState(false);

  useEffect(() => {
    handleFetchData({ page, limit, searchText, filters });
  }, []);

  const handleFetchData = payload => {
    dispatch(fetchAccountBalanceDebt(payload));
  };

  const handleFreeTextSearchQuery = query => {
    const payload = {
      page: 1,
      limit,
      searchText: query,
      filters,
    };
    handleFetchData(payload);
  };

  const handleChangePageQuery = (pageNumber: number, pageSize: number) => {
    const payload = {
      page: pageNumber,
      limit: pageSize,
      searchText,
      filters,
    };
    dispatch(fetchAccountBalance(payload));
  };

  const handleFilterSearchQuery = query => {
    const payload = {
      page,
      limit,
      searchText,
      filters: query,
    };
    handleFetchData(payload);
  };

  return (
    <Container className="accountBalance-view">
      <Title level={3}>Theo dõi số dư tài khoản</Title>
      <div className="table">
        <div className="header">
          <Space className="search">
            <Search allowClear placeholder="Nhập giá trị tìm kiếm" onSearch={handleFreeTextSearchQuery} enterButton />
            <Button
              className="filter"
              type="primary"
              onClick={() => {
                setFilterModalVisible(true);
              }}
              icon={<FilterTwoTone />}
            >
              Bộ lọc
            </Button>
          </Space>
        </div>
        <TableComponent
          data={data}
          total={total}
          isFetching={isFetching}
          columns={columns}
          handlePageChange={(pageNumber: number, pageSize: number) => {
            handleChangePageQuery(pageNumber, pageSize);
          }}
        />
      </div>
      {visibleFilter && (
        <FilterModal visible={visibleFilter} onCancel={() => setFilterModalVisible(false)} onFilter={handleFilterSearchQuery} />
      )}
    </Container>
  );
};

export default AccountBalanceDebtListComponent;
