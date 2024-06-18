import { Button, Col, Form, Modal, Row, Select } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchAccountCode } from 'app/shared/reducers/account/account.reducer';
import { fetchCompany, fetchSecuritiesCompany } from 'app/shared/reducers/company/company.reducer';
import React, { useEffect } from 'react';
import './style.scss';
import { fetchUser } from 'app/shared/reducers/user/user.reducer';

type IFilterProps = {
  visible: boolean;
  onCancel: () => void;
  onFilter: (value: any) => void;
};

const FilterModal = ({ visible, onCancel, onFilter }: IFilterProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { data: dataAccount } = useAppSelector(state => state.account);
  const { data: dataCompany, dataSecurities } = useAppSelector(state => state.company);
  const { data: user } = useAppSelector(state => state.user);
  const filters = useAppSelector(state => state.portfolioByAccount.filters);

  useEffect(() => {
    innitData();
  }, []);

  useEffect(() => {
    if (filters) {
      form.setFieldsValue(filters);
    }
  }, [filters]);

  const innitData = () => {
    // người thực hiện
    dispatch(fetchUser());
    // công ty sở hữu
    dispatch(fetchCompany());
    // công ty lưu ký
    dispatch(fetchSecuritiesCompany());
    // mã tài khoản
    dispatch(fetchAccountCode());
  };

  const handleFilter = (values?: any) => {
    onFilter(values);
    handleClose();
  };

  const handleClose = () => {
    onCancel();
  };

  const handleReset = () => {
    form.resetFields();
    handleFilter();
  };
  // Function to filter options based on the input value
  const filterOption = (inputValue, option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

  return (
    <Modal
      width={300}
      className="modal-filter-custom"
      open={visible}
      maskClosable={false}
      footer={null}
      title="Bộ lọc tìm kiếm"
      onCancel={handleClose}
    >
      <Form size="large" form={form} onFinish={handleFilter} layout="vertical">
        <Form.Item label="Tài khoản" name="AccountId">
          <Select
            showSearch
            allowClear
            size="large"
            options={dataAccount.map((item: any) => {
              return {
                value: item.accountId,
                label: `${item.companyName}-${item.accountOwnerName}-${item.accountNumber}`,
              };
            })}
            placeholder="Tài khoản"
          />
        </Form.Item>
        <Form.Item label="Người quản lý" name="UserId">
          <Select showSearch allowClear size="large" options={user} placeholder="Chọn người quản lý" />
        </Form.Item>
        <Form.Item label="Công ty sở hữu" name="MemberCompanyId">
          <Select
            showSearch
            allowClear
            size="large"
            filterOption={filterOption}
            options={dataCompany.map((item: any) => {
              return {
                value: item.companyId,
                label: item.companyName,
              };
            })}
            placeholder="Chọn công ty sở hữu"
          />
        </Form.Item>
        {/* <Form.Item label="Công ty lưu ký" name="SecuritiesCompanyId">
          <Select showSearch filterOption={filterOption} size="large" options={dataSecurities} placeholder="Chọn công ty lưu ký" />
        </Form.Item> */}
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
