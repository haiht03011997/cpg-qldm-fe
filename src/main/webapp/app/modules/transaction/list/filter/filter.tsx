import { Button, Col, DatePicker, Form, Modal, Row, Select } from 'antd';
import { APP_LOCAL_DATE_FORMAT, DATE_FORMAT_PAYLOAD } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchAccountCode } from 'app/shared/reducers/account/account.reducer';
import { fetchMemberCompany, setPage as setPageCompanyMember } from 'app/shared/reducers/company/member/company.member.reducer';
import { fetchStock, setPage as setPageStock } from 'app/shared/reducers/stock/stock.reducer';
import { fetchTransactionType } from 'app/shared/reducers/transaction/type/transactionType.reducer';
import { fetchUser } from 'app/shared/reducers/user/user.reducer';
import { handlePopupScroll } from 'app/shared/util/select-utils';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import './style.scss';
import { IOptionProps } from 'app/shared/model/modal';
const { RangePicker } = DatePicker;

type IFilterProps = {
  visible: boolean;
  onCancel: () => void;
  onFilter: (value: any) => void;
};

const FilterModal = ({ visible, onCancel, onFilter }: IFilterProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { data: user } = useAppSelector(state => state.user);
  const { data: transactionType } = useAppSelector(state => state.transactionType);
  const { data: accountCode } = useAppSelector(state => state.account);
  const {
    data: memberCompany,
    page: currentPageMemberCompany,
    total: totalPagesMemberCompany,
  } = useAppSelector(state => state.memberCompany);
  const { data: stock, page, total: totalPagesStock } = useAppSelector(state => state.stock);
  const filters = useAppSelector(state => state.transactionView.filters);
  const [currentPageStock, setCurrentPageStock] = useState(page);
  const [arrayStock, setArrayStock] = useState<IOptionProps[]>([]);

  useEffect(() => {
    innitData();
  }, []);

  useEffect(() => {
    if (filters) {
      if (filters.StartDate && filters.EndDate) {
        form.setFieldValue('DateRanges', [dayjs(filters.StartDate), dayjs(filters.EndDate)]);
      }
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
    // người thực hiện
    dispatch(fetchUser());
    // cổ phiếu
    dispatch(fetchStock({ pageSize: currentPageStock }));
    // đơn vị quản lý
    dispatch(fetchMemberCompany(currentPageMemberCompany));
    // mã tài khoản
    dispatch(fetchAccountCode());
    // loại giao dịch
    dispatch(fetchTransactionType());
  };

  const handleFilter = () => {
    form.validateFields().then(values => {
      const { DateRanges } = values;
      let payload = { ...values };

      // Loại bỏ trường DateRanges
      delete payload.DateRanges;

      if (values.DateRanges) {
        let [startDate, endDate] = DateRanges;
        startDate = dayjs(startDate).format(DATE_FORMAT_PAYLOAD);
        endDate = dayjs(endDate).format(DATE_FORMAT_PAYLOAD);
        payload = {
          ...payload,
          StartDate: startDate,
          EndDate: endDate,
        };
      }
      onFilter(payload);
      handleClose();
    });
  };

  const handleClose = () => {
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

  // Function to filter options based on the input value
  const filterOption = (inputValue, option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

  return (
    <Modal
      width={300}
      className="modal-filter-custom"
      open={visible}
      title="Bộ lọc tìm kiếm"
      maskClosable={false}
      footer={null}
      onCancel={handleClose}
    >
      <Form size="large" form={form} onFinish={handleFilter} layout="vertical">
        <Form.Item label="Người thực hiện" name="UserId">
          <Select allowClear size="large" options={user} placeholder="Chọn người thực hiện" />
        </Form.Item>
        <Form.Item label="Mã cổ phiếu" name="StockSymbol">
          <Select
            showSearch
            allowClear
            onSearch={fetchDataOnSearch}
            size="large"
            onPopupScroll={handlePopupScrollStock}
            options={arrayStock}
            placeholder="Chọn mã cổ phiếu"
          />
        </Form.Item>
        <Form.Item label="ĐVQL" name="MemberCompanyId">
          <Select
            showSearch
            size="large"
            allowClear
            filterOption={filterOption}
            onPopupScroll={handlePopupScrollMemberCompany}
            options={memberCompany}
            placeholder="Chọn đơn vị quản lý"
          />
        </Form.Item>
        <Form.Item label="Tài khoản" name="AccountId">
          <Select
            showSearch
            size="large"
            allowClear
            filterOption={filterOption}
            options={accountCode.map(item => {
              return {
                label: `${item.companyName}-${item.accountOwnerName}-${item.accountNumber}`,
                value: item.accountId,
              };
            })}
            placeholder="Chọn mã tài khoản"
          />
        </Form.Item>
        <Form.Item label="Loại giao dịch" name="TransactionTypeId">
          <Select
            size="large"
            allowClear
            options={transactionType.map(item => {
              return {
                label: item.transactionTypeName,
                value: item.transactionTypeId,
              };
            })}
            placeholder="Chọn loại giao dịch"
          />
        </Form.Item>
        <Form.Item label="Ngày" name="DateRanges">
          <RangePicker format={APP_LOCAL_DATE_FORMAT} placeholder={['Ngày bắt đầu', 'Ngày kết thúc']} />
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
