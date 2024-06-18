import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchCompany } from 'app/shared/reducers/company/company.reducer';
import React, { useEffect } from 'react';
import './style.scss';
import { statusCollateralTypeArray } from '../config';

type IFilterProps = {
  visible: boolean;
  onCancel: () => void;
  onFilter: (value: any) => void;
};

const FilterModal = ({ visible, onCancel, onFilter }: IFilterProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { data: dataCompany } = useAppSelector(state => state.company);
  const filters = useAppSelector(state => state.collateralView.filters);

  useEffect(() => {
    innitData();
  }, []);

  useEffect(() => {
    if (filters) {
      form.setFieldsValue(filters);
    }
  }, [filters]);

  const innitData = () => {
    // công ty sở hữu
    dispatch(fetchCompany());
  };

  const handleFilter = () => {
    form.validateFields().then(values => {
      onFilter(values);
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
        <Form.Item label="Mã hợp đồng" name="ContractCode">
          <Input size="large" placeholder="Nhập mã hợp đồng" />
        </Form.Item>
        <Form.Item label="Đơn vị vay" name="BorrowCompanyId">
          <Select
            allowClear
            showSearch
            size="large"
            filterOption={filterOption}
            options={dataCompany.map((item: any) => {
              return {
                value: item.companyId,
                label: item.companyName,
              };
            })}
            placeholder="Chọn đơn vị vay"
          />
        </Form.Item>
        <Form.Item label="Đơn vị cho vay" name="CollateralCompanyId">
          <Select
            allowClear
            showSearch
            size="large"
            filterOption={filterOption}
            options={dataCompany.map((item: any) => {
              return {
                value: item.companyId,
                label: item.companyName,
              };
            })}
            placeholder="Chọn đơn vị cho vay"
          />
        </Form.Item>
        <Form.Item label="Trạng thái" name="Status">
          <Select allowClear size="large" options={statusCollateralTypeArray} placeholder="Chọn trạng thái" />
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
