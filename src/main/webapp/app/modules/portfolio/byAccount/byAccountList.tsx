import { FilterTwoTone, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, TableColumnType } from 'antd';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import TableComponent from 'app/shared/component/table/table';
import { fetchPortfolioByAccount } from 'app/shared/reducers/portfolio/byAccount/portfolioByAccount.reducer';
import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import { columns, columnsExpand } from './config';
import './style.scss';
import FilterModal from './filter/filter';
import { fetchPortfolioByAccountId } from 'app/shared/reducers/portfolio/portfolio.reducer';
import { ITEMS_PER_PAGE, PAGE_SIZE } from 'app/shared/util/pagination.constants';
import { FilterDropdownProps } from 'antd/es/table/interface';

const { Search } = Input;

const PortfolioByAccountListByComponent = () => {
  const dispatch = useAppDispatch();
  const { data, isFetching, searchText, page, limit, filters, total } = useAppSelector(state => state.portfolioByAccount);
  const {
    dataByAccount: dataExpand,
    isFetching: isFetchingDataExpand,
    page: pageDataExpand,
    limit: limitDataExpand,
    total: totalDataExpand,
  } = useAppSelector(state => state.portfolio);
  const [visibleFilter, setFilterModalVisible] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [accountIdSelected, setAccountIdSelected] = useState(null);
  const [searchTextExpand, setSearchTextExpand] = useState(null);

  const getColumnSearchProps = () => ({
    filterDropdown: ({ confirm }) => (
      <Search
        allowClear
        placeholder="Nhập mã cổ phiếu"
        onSearch={value => {
          handleFreeTextSearchExpandQuery(value, confirm);
        }}
        enterButton
      />
    ),
    filterIcon: () => <SearchOutlined style={{ color: searchTextExpand ? '#1677ff' : undefined }} />,
    render: text => text,
  });

  const columnsExpanded = [
    {
      title: 'Mã CP',
      dataIndex: 'stockSymbol',
      key: 'stockSymbol',
      ...getColumnSearchProps(),
    },
    ...columnsExpand,
  ];

  useEffect(() => {
    handleFetchData({ page, limit, searchText });
  }, []);

  const handleFetchData = payload => {
    dispatch(fetchPortfolioByAccount(payload));
  };

  const handleFetchDataExpand = payload => {
    dispatch(fetchPortfolioByAccountId(payload));
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

  const handleFreeTextSearchExpandQuery = (query: string, confirm: FilterDropdownProps['confirm']) => {
    setSearchTextExpand(query);
    const payload = {
      page: 1,
      limit,
      searchText: query,
      accountId: accountIdSelected,
    };
    confirm();
    handleFetchDataExpand(payload);
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

  const fetchDataExpanded = (id: number) => {
    const payload = {
      page: 1,
      limit: ITEMS_PER_PAGE,
      accountId: id,
    };
    handleFetchDataExpand(payload);
  };

  const handleChangePageDataExpandQuery = (pageNumber: number, pageSize: number, id: number) => {
    const payload = {
      page: pageNumber,
      limit: pageSize,
      accountId: id,
      searchText: searchTextExpand,
    };
    handleFetchDataExpand(payload);
  };

  const handleExpandedDate = (isExpand: boolean, record: any) => {
    if (isExpand) {
      setAccountIdSelected(record.accountId);
      fetchDataExpanded(record.accountId);
      setExpandedRowKeys([record.key]);
    } else {
      setExpandedRowKeys([]);
    }
  };

  const expandedRowRender = item => {
    return (
      <TableComponent
        columns={columnsExpanded}
        data={dataExpand}
        isFetching={isFetchingDataExpand}
        total={totalDataExpand}
        handlePageChange={(pageNumber: number, pageSize: number) => {
          handleChangePageDataExpandQuery(pageNumber, pageSize, item.accountOwnerId);
        }}
      />
    );
  };

  return (
    <Container className="by-account">
      <Title level={3}>Danh mục đầu tư theo tài khoản</Title>
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
          data={data.map((item, index) => {
            return {
              key: index.toString(),
              ...item,
            };
          })}
          total={total}
          isFetching={isFetching}
          expandedRowRender={expandedRowRender}
          columns={columns}
          handleExpand={(expanded: boolean, record: any) => {
            handleExpandedDate(expanded, record);
          }}
          expandedRowKeys={expandedRowKeys}
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

export default PortfolioByAccountListByComponent;
