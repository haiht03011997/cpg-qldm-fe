import { FilterTwoTone, PlusOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input, Space, Tooltip, notification } from 'antd';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import ModalConfirmComponent from 'app/shared/component/modal/confirm';
import TableComponent from 'app/shared/component/table/table';
import { fetchAccountBalance } from 'app/shared/reducers/accountBalance/view/accountBalance.reduces';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';
import { columns } from './config';
import FilterModal from './filter/filter';
import './style.scss';
import { deleteAccountBalance } from 'app/shared/reducers/accountBalance/form/accountBalance.reduces';
import { getActionRolesByPath } from 'app/shared/util/authentication';
import { OrderByType } from 'app/shared/enum/enum';
import { IPayLoad } from 'app/shared/model/modal';

const { Search } = Input;

const AccountBalanceListComponent = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { filter } = location.state || {};
  const { data, isFetching, page, limit, searchText, total } = useAppSelector(state => state.accountBalanceView);
  const account = useAppSelector(state => state.authentication.account);
  const roles = getActionRolesByPath(account.Roles, location.pathname);
  const [visibleFilter, setFilterModalVisible] = useState(false);
  const [visibleConfirmDelete, setVisibleConfirmDelete] = useState(false);
  const [idDeleteSelected, setIdDeleteSelected] = useState(null);
  const [filters, setFilters] = useState(filter);
  const [sort, setSort] = useState(null);
  const [freeSearch, setFreeSearch] = useState(searchText);

  const columnConfig = [
    ...columns,
    {
      title: 'Hành động',
      key: 'Action',
      fixed: 'right',
      width: 100,
      render: (item: any) => (
        <div className="action">
          {roles.update && item.accountBalanceTransactionId > 0 && (
            <span className="action-edit">
              <Tooltip title="Sửa">
                <Link state={{ filter: filters }} to={`/account-balance/${item.accountBalanceTransactionId}`}>
                  <FontAwesomeIcon icon="pencil-alt" />
                </Link>
              </Tooltip>
            </span>
          )}
          {roles.delete && item.accountBalanceTransactionId > 0 && (
            <span className="action-delete">
              <Tooltip title="Xóa">
                <FontAwesomeIcon
                  onClick={() => {
                    handleWarningDeleteItem(item.accountBalanceTransactionId);
                  }}
                  icon="trash"
                />
              </Tooltip>
            </span>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    handleFetchData({ page: 1, limit, searchText, filters, sort });
  }, []);

  const handleWarningDeleteItem = (id: number) => {
    setVisibleConfirmDelete(true);
    setIdDeleteSelected(id);
  };

  const handleFetchData = payload => {
    dispatch(fetchAccountBalance(payload));
  };

  const handleFreeTextSearchQuery = query => {
    setFreeSearch(query);
    const payload = {
      page: 1,
      limit,
      searchText: query,
      filters,
      sort,
    };
    handleFetchData(payload);
  };

  const handleChange = (pageNumber: number, pageSize: number, sorter: any) => {
    const sortMapper = {
      Property: sorter.columnKey.charAt(0).toUpperCase() + sorter.columnKey.slice(1),
      Order: OrderByType[sorter.order],
    };
    setSort(sortMapper);
    const payload: IPayLoad = {
      page: pageNumber,
      limit: pageSize,
      searchText: freeSearch,
      filters,
      sort: sortMapper,
    };
    dispatch(fetchAccountBalance(payload));
  };

  const handleFilterSearchQuery = query => {
    setFilters(query);
    const payload = {
      page,
      limit,
      searchText: freeSearch,
      filters: query,
      sort,
    };
    handleFetchData(payload);
  };

  const handleCreateAccountBalance = () => {
    navigate('create', {
      state: { filter: filters },
    });
  };

  const handleConfirmDelete = () => {
    if (idDeleteSelected) {
      dispatch(deleteAccountBalance(idDeleteSelected))
        .then(() => {
          handleFetchData({ page, limit, searchText, filters });
        })
        .finally(() => {
          setVisibleConfirmDelete(false);
        });
    }
  };

  return (
    <Container className="accountBalance-view">
      <Title level={3}>Biến động số dư tài khoản</Title>
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
          {roles.add && (
            <Space>
              <Button
                className="filter"
                type="primary"
                onClick={() => {
                  handleCreateAccountBalance();
                }}
                icon={<PlusOutlined />}
              >
                Thêm mới
              </Button>
            </Space>
          )}
        </div>
        <TableComponent
          data={data}
          total={total}
          isFetching={isFetching}
          columns={columnConfig}
          handlePageChange={(pageNumber: number, pageSize: number, search: any, sorter: any) => {
            handleChange(pageNumber, pageSize, sorter);
          }}
        />
      </div>
      {visibleFilter && (
        <FilterModal visible={visibleFilter} onCancel={() => setFilterModalVisible(false)} onFilter={handleFilterSearchQuery} />
      )}
      <ModalConfirmComponent
        visible={visibleConfirmDelete}
        onCancel={() => {
          setVisibleConfirmDelete(false);
        }}
        onConfirm={handleConfirmDelete}
        title="Bạn có muốn xóa sao kê tài khoản"
      />
    </Container>
  );
};

export default AccountBalanceListComponent;
