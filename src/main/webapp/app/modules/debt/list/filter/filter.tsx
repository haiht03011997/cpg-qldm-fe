import { Button, Col, DatePicker, Form, Modal, Row, Select } from 'antd';
import { DATE_FORMAT_PAYLOAD } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchAccountCode } from 'app/shared/reducers/account/account.reducer';
import { fetchCompany, fetchSecuritiesCompany } from 'app/shared/reducers/company/company.reducer';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import './style.scss';
const { RangePicker } = DatePicker;

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
  const filters = useAppSelector(state => state.debtView.filters);

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
    // công ty lưu ký
    dispatch(fetchSecuritiesCompany());
    // mã tài khoản
    dispatch(fetchAccountCode());
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
        <Form.Item label="Công ty lưu ký" name="SecuritiesCompanyId">
          <Select
            showSearch
            allowClear
            size="large"
            filterOption={filterOption}
            options={dataSecurities}
            placeholder="Chọn công ty lưu ký"
          />
        </Form.Item>
        <Form.Item label="Tài khoản" name="AccountId">
          <Select
            size="large"
            allowClear
            options={dataAccount.map((item: any) => {
              return {
                value: item.accountId,
                label: `${item.companyName}-${item.accountOwnerName}-${item.accountNumber}`,
              };
            })}
            placeholder="Chọn tài khoản"
          />
        </Form.Item>
        <Form.Item label="Ngày" name="DateRanges">
          <RangePicker placeholder={['Ngày bắt đầu', 'Ngày kết thúc']} />
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
