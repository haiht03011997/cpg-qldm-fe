import { PlusOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input, Space, Tooltip } from 'antd';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import ModalConfirmComponent from 'app/shared/component/modal/confirm';
import TableComponent from 'app/shared/component/table/table';
import { deleteCompany } from 'app/shared/reducers/company/form/company.reduces';
import { fetchCompany } from 'app/shared/reducers/company/view/company.reduces';
import { getActionRolesByPath } from 'app/shared/util/authentication';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';
import { columns } from './config';
import FilterModal from './filter/filter';
import './style.scss';

const { Search } = Input;

const CompanyListComponent = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { filter } = location.state || {};
  const { data, isFetching, page, limit, searchText, total } = useAppSelector(state => state.companyView);
  const account = useAppSelector(state => state.authentication.account);
  const roles = getActionRolesByPath(account.Roles, location.pathname);
  const [visibleFilter, setFilterModalVisible] = useState(false);
  const [visibleConfirmDelete, setVisibleConfirmDelete] = useState(false);
  const [idDeleteSelected, setIdDeleteSelected] = useState(null);
  const [filters, setFilters] = useState(filter);

  const columnConfig = [
    ...columns,
    {
      title: 'Hành động',
      key: 'Action',
      fixed: 'right',
      width: 100,
      render: (item: any) => (
        <div className="action">
          {roles.update && (
            <span className="action-edit">
              <Tooltip title="Sửa">
                <Link state={{ filter: filters }} to={`/company/${item.companyId}`}>
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
                    handleWarningDeleteItem(item.companyId);
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
    handleFetchData({ page: 1, limit, searchText, filters });
  }, []);

  const handleWarningDeleteItem = (id: number) => {
    setVisibleConfirmDelete(true);
    setIdDeleteSelected(id);
  };

  const handleFetchData = payload => {
    dispatch(fetchCompany(payload));
  };

  const handleFreeTextSearchQuery = query => {
    const payload = {
      page,
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
    dispatch(fetchCompany(payload));
  };

  const handleFilterSearchQuery = query => {
    setFilters(query);
    const payload = {
      page,
      limit,
      searchText,
      filters: query,
    };
    handleFetchData(payload);
  };

  const handleCreateCompany = () => {
    navigate('create', {
      state: { filter: filters },
    });
  };

  const handleConfirmDelete = () => {
    if (idDeleteSelected) {
      dispatch(deleteCompany(idDeleteSelected))
        .then(() => {
          handleFetchData({ page, limit, searchText, filters });
        })
        .finally(() => {
          setVisibleConfirmDelete(false);
        });
    }
  };

  return (
    <Container className="company-view">
      <Title level={3}>Danh sách đơn vị chủ quản</Title>
      <div className="table">
        <div className="header">
          <Space className="search">
            <Search allowClear placeholder="Nhập giá trị tìm kiếm" onSearch={handleFreeTextSearchQuery} enterButton />
          </Space>
          {roles.add && (
            <Space>
              <Button
                className="filter"
                type="primary"
                onClick={() => {
                  handleCreateCompany();
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
          handlePageChange={(pageNumber: number, pageSize: number) => {
            handleChangePageQuery(pageNumber, pageSize);
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
        title="Bạn có muốn xóa đơn vị chủ quản"
      />
    </Container>
  );
};

export default CompanyListComponent;
