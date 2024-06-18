import { FilterTwoTone } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import TableComponent from 'app/shared/component/table/table';
import { fetchPortfolioByStock } from 'app/shared/reducers/portfolio/byStock/portfolioByStock.reducer';
import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import { columns } from './config';
import FilterModal from './filter/filter';
import './style.scss';

const { Search } = Input;

const PortfolioListComponent = () => {
  const dispatch = useAppDispatch();
  const { data, isFetching, searchText, page, limit, filters, total } = useAppSelector(state => state.portfolioByStock);
  const [visibleFilter, setFilterModalVisible] = useState(false);

  useEffect(() => {
    handleFetchData({ page, limit, searchText });
  }, []);

  const handleFetchData = payload => {
    dispatch(fetchPortfolioByStock(payload));
  };

  const handleChangePageQuery = (pageNumber: number, pageSize: number) => {
    const payload = {
      page: pageNumber,
      limit: pageSize,
      searchText,
      filters,
    };
    handleFetchData(payload);
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
    <Container className="by-stock">
      <Title level={3}>Danh mục đầu tư theo mã cổ phiếu</Title>
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
          isFetching={isFetching}
          columns={columns}
          total={total}
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

export default PortfolioListComponent;
