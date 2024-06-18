import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input, Space, Tooltip } from 'antd';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import TableComponent from 'app/shared/component/table/table';
import { fetchUserPagination } from 'app/shared/reducers/user/user.reducer';
import { getActionRolesByPath } from 'app/shared/util/authentication';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container } from 'reactstrap';
import { columns } from './config';
import * as _ from 'lodash';
import './style.scss';

const { Search } = Input;

const DecentralizeListComponent = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { filter } = location.state || {};
  const { view: data, page, searchText, limit, isFetching, total } = useAppSelector(state => state.user);
  const account = useAppSelector(state => state.authentication.account);
  const roles = getActionRolesByPath(account.Roles, location.pathname);
  const [filters, setFilters] = useState(filter);
  const [users, setUser] = useState([]);

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
                <Link to={`/decentralize/${item.userId}`}>
                  <FontAwesomeIcon icon="pencil-alt" />
                </Link>
              </Tooltip>
            </span>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    handleFetchData({ page, limit, searchText, filters });
  }, []);

  useEffect(() => {
    const arrayUser = _.filter(data, user => {
      return user.userId.toString() !== account.UserId;
    });
    setUser(arrayUser);
  }, [data]);

  const handleFetchData = payload => {
    dispatch(fetchUserPagination(payload));
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
    handleFetchData(payload);
  };

  return (
    <Container className="decentralize-view">
      <Title level={3}>Danh sách tài khoản</Title>
      <div className="table">
        <div className="header">
          <Space className="search">
            <Search allowClear placeholder="Nhập giá trị tìm kiếm" onSearch={handleFreeTextSearchQuery} enterButton />
          </Space>
        </div>
        <TableComponent
          data={users}
          total={total}
          isFetching={isFetching}
          columns={columnConfig}
          handlePageChange={(pageNumber: number, pageSize: number) => {
            handleChangePageQuery(pageNumber, pageSize);
          }}
        />
      </div>
    </Container>
  );
};

export default DecentralizeListComponent;
