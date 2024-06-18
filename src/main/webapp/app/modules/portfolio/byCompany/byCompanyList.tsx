import { Input, Space } from 'antd';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import TableComponent from 'app/shared/component/table/table';
import { fetchPortfolioByCompany } from 'app/shared/reducers/portfolio/byCompany/portfolioByCompany.reducer';
import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import { columns, columnsExpand } from './config';
import './style.scss';
import { fetchPortfolioByCompanyId } from 'app/shared/reducers/portfolio/portfolio.reducer';

const { Search } = Input;

const PortfolioByCompanyListComponent = () => {
  const dispatch = useAppDispatch();
  const { data, isFetching, searchText, page, limit, filters, total } = useAppSelector(state => state.portfolioByCompany);
  const {
    dataByCompany: dataExpand,
    isFetching: isFetchingDataExpand,
    page: pageDataExpand,
    limit: limitDataExpand,
    total: totalDataExpand,
  } = useAppSelector(state => state.portfolio);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  useEffect(() => {
    handleFetchData({ page, limit, searchText });
  }, []);

  const handleFetchData = payload => {
    dispatch(fetchPortfolioByCompany(payload));
  };

  const handleFetchDataExpand = payload => {
    dispatch(fetchPortfolioByCompanyId(payload));
  };

  const handleChangePageQuery = (pageNumber: number, pageSize: number) => {
    const payload = {
      page: pageNumber,
      limit: pageSize,
      searchText,
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

  const fetchDataExpanded = (id: number) => {
    const payload = {
      page: 1,
      limit: limitDataExpand,
      id,
    };
    handleFetchDataExpand(payload);
  };

  const handleChangePageDataExpandQuery = (pageNumber: number, pageSize: number, id: number) => {
    const payload = {
      page: pageNumber,
      limit: pageSize,
      id,
    };
    handleFetchDataExpand(payload);
  };

  const handleExpandedDate = (isExpand: boolean, record: any) => {
    if (isExpand) {
      fetchDataExpanded(record.memberCompanyId);
      setExpandedRowKeys([record.key]);
    } else {
      setExpandedRowKeys([]);
    }
  };

  const expandedRowRender = item => {
    return (
      <TableComponent
        columns={columnsExpand}
        data={dataExpand}
        total={totalDataExpand}
        isFetching={isFetchingDataExpand}
        handlePageChange={(pageNumber: number, pageSize: number) => {
          handleChangePageDataExpandQuery(pageNumber, pageSize, item.memberCompanyId);
        }}
      />
    );
  };

  return (
    <Container className="by-company">
      <Title level={3}>Danh mục đầu tư theo công ty sở hữu</Title>
      <div className="table">
        <div className="header">
          <Space className="search">
            <Search allowClear placeholder="Nhập giá trị tìm kiếm" onSearch={handleFreeTextSearchQuery} enterButton />
          </Space>
        </div>
        <TableComponent
          data={data.map((item, index) => {
            return {
              key: index.toString(),
              ...item,
            };
          })}
          total={total}
          isFetching={isFetching}
          columns={columns}
          expandedRowKeys={expandedRowKeys}
          expandedRowRender={expandedRowRender}
          handleExpand={(expanded: boolean, record: any) => {
            handleExpandedDate(expanded, record);
          }}
          handlePageChange={(pageNumber: number, pageSize: number) => {
            handleChangePageQuery(pageNumber, pageSize);
          }}
        />
      </div>
    </Container>
  );
};

export default PortfolioByCompanyListComponent;
