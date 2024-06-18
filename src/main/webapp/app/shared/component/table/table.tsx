import { Table } from 'antd';
import { ITEMS_PER_PAGE, PAGE_SIZE } from 'app/shared/util/pagination.constants';
import React from 'react';

type ITableProps = {
  data: any[];
  columns: any[];
  handlePageChange?: (page: number, limit: number, filters?: any, sorter?: any) => void;
  isFetching: boolean;
  total?: number;
  expandedRowRender?: any;
  handleExpand?: (expanded: boolean, record: any) => void;
  noPagination?: boolean;
  noBordered?: boolean;
  expandedRowKeys?: any;
  rowExpandable?(any: any): boolean;
};

const TableComponent = (props: ITableProps) => {
  return (
    <Table
      loading={props.isFetching}
      bordered={!props.noBordered}
      columns={props.columns}
      dataSource={props.data}
      expandable={
        props.expandedRowRender && {
          expandedRowKeys: props.expandedRowKeys,
          expandedRowRender: props.expandedRowRender,
          onExpand: props.handleExpand,
          rowExpandable: props.rowExpandable,
        }
      }
      pagination={
        !props.noPagination && {
          defaultPageSize: ITEMS_PER_PAGE, // Set the number of items per page
          showSizeChanger: true, // Allow the user to change the page size
          pageSizeOptions: PAGE_SIZE, // Define the available page sizes
          total: props.total,
        }
      }
      onChange={(pagination, filters, sorter) => {
        props.handlePageChange(pagination.current, pagination.pageSize, filters, sorter);
      }}
    />
  );
};

export default TableComponent;
