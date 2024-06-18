import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchMemberCompany } from 'app/shared/reducers/company/member/company.member.reducer';
import React, { useEffect } from 'react';
import './style.scss';

type IFilterProps = {
  visible: boolean;
  onCancel: () => void;
  onFilter: (value: any) => void;
};

const FilterModal = ({ visible, onCancel, onFilter }: IFilterProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { data: memberCompany, page: currentPageMemberCompany } = useAppSelector(state => state.memberCompany);
  const filters = useAppSelector(state => state.representativeView.filters);

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
    dispatch(fetchMemberCompany(currentPageMemberCompany));
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
        <Form.Item label="Họ tên" name="Name">
          <Input size="large" placeholder="Nhập họ tên" />
        </Form.Item>
        <Form.Item label="Công ty làm việc chính" name="CompanyId">
          <Select
            allowClear
            showSearch
            size="large"
            filterOption={filterOption}
            options={memberCompany}
            placeholder="Chọn công ty làm việc chính"
          />
        </Form.Item>
        <Form.Item label="Công ty đại diện vốn" name="RepresentativeCompanyId">
          <Select
            allowClear
            showSearch
            size="large"
            filterOption={filterOption}
            options={memberCompany}
            placeholder="Chọn công ty đại diện vốn"
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
