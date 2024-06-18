import { FilterTwoTone, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input, Space, Tooltip, notification } from 'antd';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import ModalConfirmComponent from 'app/shared/component/modal/confirm';
import TableComponent from 'app/shared/component/table/table';
import { deleteCollateral } from 'app/shared/reducers/collateral/form/collateral.reducers';
import { fetchCollateral } from 'app/shared/reducers/collateral/view/collateral.reduces';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';
import { columns } from './config';
import FilterModal from './filter/filter';
import './style.scss';
import { getActionRolesByPath } from 'app/shared/util/authentication';

const { Search } = Input;

const CollateralListComponent = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { filter } = location.state || {};
  const { data, isFetching, page, limit, searchText, total } = useAppSelector(state => state.collateralView);
  const [visibleFilter, setFilterModalVisible] = useState(false);
  const [visibleConfirmDelete, setVisibleConfirmDelete] = useState(false);
  const [idDeleteSelected, setIdDeleteSelected] = useState(null);
  const account = useAppSelector(state => state.authentication.account);
  const roles = getActionRolesByPath(account.Roles, location.pathname);
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
          {roles.viewDetail && (
            <span className="action-edit">
              <Tooltip title="Xem danh sách phụ lục hợp đồng">
                <Link state={{ filter: filters }} to={`/collateral/${item.id}`}>
                  <EyeOutlined />
                </Link>
              </Tooltip>
            </span>
          )}
          {roles.update && (
            <span className="action-edit">
              <Tooltip title="Sửa">
                <Link state={{ filter: filters }} to={`/collateral/${item.id}/edit`}>
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
                    handleWarningDeleteItem(item.id);
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
    dispatch(fetchCollateral(payload));
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
    dispatch(fetchCollateral(payload));
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

  const handleCreateCollateral = () => {
    navigate('create', {
      state: { filter: filters },
    });
  };

  const handleConfirmDelete = () => {
    if (idDeleteSelected) {
      dispatch(deleteCollateral(idDeleteSelected))
        .then(() => {
          handleFetchData({ page, limit, searchText, filters });
        })
        .finally(() => {
          setVisibleConfirmDelete(false);
        });
    }
  };

  return (
    <Container className="collateral-view">
      <Title level={3}>Danh sách hợp đồng cầm cố</Title>
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
                  handleCreateCollateral();
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
          isFetching={isFetching}
          columns={columnConfig}
          total={total}
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
        title="Bạn có muốn xóa hợp đồng cầm cố"
      />
    </Container>
  );
};

export default CollateralListComponent;
