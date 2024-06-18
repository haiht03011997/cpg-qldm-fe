import { Button, Col, Form, Modal, Row, Select } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IOptionProps } from 'app/shared/model/modal';
import { fetchAccountCode } from 'app/shared/reducers/account/account.reducer';
import { fetchMemberCompany, setPage as setPageCompanyMember } from 'app/shared/reducers/company/member/company.member.reducer';
import { fetchStock } from 'app/shared/reducers/stock/stock.reducer';
import { handlePopupScroll } from 'app/shared/util/select-utils';
import React, { useEffect, useState } from 'react';
import './style.scss';

type IFilterProps = {
  visible: boolean;
  onCancel: () => void;
  onFilter: (value: any) => void;
};

const FilterModal = ({ visible, onCancel, onFilter }: IFilterProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { data: accountCode } = useAppSelector(state => state.account);
  const {
    data: memberCompany,
    page: currentPageMemberCompany,
    total: totalPagesMemberCompany,
  } = useAppSelector(state => state.memberCompany);
  const { data: stock, page, total: totalPagesStock } = useAppSelector(state => state.stock);
  const filters = useAppSelector(state => state.portfolioByStock.filters);
  const [currentPageStock, setCurrentPageStock] = useState(page);
  const [arrayStock, setArrayStock] = useState<IOptionProps[]>([]);

  useEffect(() => {
    innitData();
  }, []);

  useEffect(() => {
    if (filters) {
      form.setFieldsValue(filters);
    }
  }, [filters]);

  useEffect(() => {
    if (stock.length > 0) {
      let newStocks = currentPageStock > 1 ? [...arrayStock] : [];
      newStocks = newStocks.concat(stock);
      setArrayStock(newStocks);
    }
  }, [stock]);

  const innitData = () => {
    // cổ phiếu
    dispatch(fetchStock({ pageSize: currentPageStock }));
    // đơn vị quản lý
    dispatch(fetchMemberCompany(currentPageMemberCompany));
    // mã tài khoản
    dispatch(fetchAccountCode());
  };

  const handleFilter = (values = null) => {
    onFilter(values);
    onCancel();
  };

  const handleReset = () => {
    form.resetFields();
    handleFilter();
  };

  const handlePopupScrollMemberCompany = e => {
    const currentPage = handlePopupScroll({ e, currentPage: currentPageMemberCompany, totalPages: totalPagesMemberCompany });
    setPageCompanyMember(currentPage);
  };

  const handlePopupScrollStock = e => {
    const currentPage = handlePopupScroll({ e, currentPage: currentPageStock, totalPages: totalPagesStock });
    if (currentPage) {
      setCurrentPageStock(currentPage);
      dispatch(fetchStock({ pageSize: currentPage }));
    }
  };

  const fetchDataOnSearch = (value: string) => {
    dispatch(fetchStock({ searchText: value, pageSize: 1 }));
  };

  return (
    <Modal
      width={300}
      className="modal-filter-custom"
      open={visible}
      maskClosable={false}
      footer={null}
      title="Bộ lọc tìm kiếm"
      onCancel={onCancel}
    >
      <Form size="large" form={form} onFinish={handleFilter} layout="vertical">
        <Form.Item label="Mã cổ phiếu" name="StockSymbol">
          <Select
            onSearch={fetchDataOnSearch}
            showSearch
            allowClear
            size="large"
            onPopupScroll={handlePopupScrollStock}
            options={arrayStock}
            placeholder="Chọn mã cổ phiếu"
          />
        </Form.Item>
        <Form.Item label="ĐVQL" name="MemberCompanyId">
          <Select
            showSearch
            allowClear
            size="large"
            onPopupScroll={handlePopupScrollMemberCompany}
            options={memberCompany}
            placeholder="Chọn đơn vị quản lý"
          />
        </Form.Item>
        <Form.Item label="Tài khoản" name="AccountId">
          <Select
            size="large"
            allowClear
            options={accountCode.map(item => {
              return {
                label: `${item.companyName}-${item.accountOwnerName}-${item.accountNumber}`,
                value: item.accountId,
              };
            })}
            placeholder="Chọn mã tài khoản"
          />
        </Form.Item>
        <Form.Item>
          <Row className="action" justify="end">
            <Col>
              <Button
                onClick={() => {
                  handleReset();
                }}
              >
                Bỏ lọc
              </Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                Tìm kiếm
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FilterModal;
