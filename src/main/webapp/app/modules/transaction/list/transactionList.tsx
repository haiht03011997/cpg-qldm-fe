import { FilterTwoTone, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input, Space, Tooltip } from 'antd';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import ModalConfirmComponent from 'app/shared/component/modal/confirm';
import TableComponent from 'app/shared/component/table/table';
import { OrderByType } from 'app/shared/enum/enum';
import { IPayLoad } from 'app/shared/model/modal';
import { deleteTransaction } from 'app/shared/reducers/transaction/form/transaction.reduces';
import { fetchTransaction } from 'app/shared/reducers/transaction/view/transaction.reduces';
import { getActionRolesByPath } from 'app/shared/util/authentication';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';
import { columns } from './config';
import FilterModal from './filter/filter';
import UploadFile from './modal/import';
import './style.scss';

const TransactionListComponent = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { filter } = location.state || {};
  const { data, isFetching, page, limit, searchText, total } = useAppSelector(state => state.transactionView);
  const [visibleFilter, setFilterModalVisible] = useState(false);
  const [visibleConfirmDelete, setVisibleConfirmDelete] = useState(false);
  const [idDeleteSelected, setIdDeleteSelected] = useState(null);
  const [filters, setFilters] = useState(filter);
  const [sort, setSort] = useState(null);
  const [freeSearch, setFreeSearch] = useState(searchText);
  const account = useAppSelector(state => state.authentication.account);
  const [OpenUploadFile, setOpenUploadFile] = useState(false);

  const roles = getActionRolesByPath(account.Roles, location.pathname);

  const columnConfig = [
    ...columns,
    {
      title: 'Hành động',
      key: 'Action',
      fixed: 'right',
      width: 80,
      render: (item: any) => (
        <div className="action">
          {roles.viewDetail && (
            <span className="action-edit">
              <Tooltip title="Sửa">
                <Link state={{ filter: filters }} to={`/transaction/${item.stockTransactionId}`}>
                  <FontAwesomeIcon icon="pencil-alt" />
                </Link>
              </Tooltip>
            </span>
          )}
          {roles.delete && (
            <span className="action-delete">
              <Tooltip title="Xóa">
                <FontAwesomeIcon
                  onClick={() => {
                    handleWarningDeleteItem(item.stockTransactionId);
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
    dispatch(fetchTransaction(payload));
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
    dispatch(fetchTransaction(payload));
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

  const handleCreateTransaction = () => {
    navigate('create', {
      state: { filter: filters },
    });
  };

  const handleConfirmDelete = () => {
    if (idDeleteSelected) {
      dispatch(deleteTransaction(idDeleteSelected))
        .then(() => {
          handleFetchData({ page, limit, searchText, filters });
        })
        .finally(() => {
          setVisibleConfirmDelete(false);
        });
    }
  };

  const handleUploadFile = () => {
    setOpenUploadFile(true);
  };

  const handleCloseUploadFile = (isReload: boolean) => {
    if (isReload) {
      handleFetchData({ page, limit, searchText, filters });
    }
    setOpenUploadFile(false);
  };

  return (
    <Container className="transaction-view">
      <Title level={3}>Danh sách giao dịch hàng ngày</Title>
      <div className="table">
        <div className="header">
          <Space className="search">
            <Input.Search allowClear placeholder="Nhập giá trị tìm kiếm" onSearch={handleFreeTextSearchQuery} enterButton />
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
          <Space>
            <Button
              onClick={() => {
                handleUploadFile();
              }}
              icon={<UploadOutlined />}
            >
              Tải file
            </Button>
            {roles.add && (
              <Space>
                <Button
                  className="filter"
                  type="primary"
                  onClick={() => {
                    handleCreateTransaction();
                  }}
                  icon={<PlusOutlined />}
                >
                  Thêm mới
                </Button>
              </Space>
            )}
          </Space>
        </div>
        <TableComponent
          data={data}
          isFetching={isFetching}
          total={total}
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
        title="Bạn có muốn xóa giao dịch này"
      />
      <UploadFile onCancel={handleCloseUploadFile} visible={OpenUploadFile} />
    </Container>
  );
};

export default TransactionListComponent;
