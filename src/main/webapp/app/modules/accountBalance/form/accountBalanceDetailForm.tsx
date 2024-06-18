import { Button, Col, DatePicker, Form, InputNumber, Row, Select, notification } from 'antd';
import Title from 'antd/es/typography/Title';
import { APP_LOCAL_DATE_FORMAT, DATE_FORMAT_PAYLOAD } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchAccountBySecuritiesCompany, fetchAccountCode } from 'app/shared/reducers/account/account.reducer';
import {
  createAccountBalance,
  getDetailAccountBalance,
  updateAccountBalance,
} from 'app/shared/reducers/accountBalance/form/accountBalance.reduces';
import { fetchAccountBalanceType } from 'app/shared/reducers/accountBalance/type/accountBalanceType.reduces';
import { fetchSecuritiesCompany } from 'app/shared/reducers/company/company.reducer';
import { formatVND, parseVND } from 'app/shared/util/money-utils';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import './style.scss';
import { IOptionProps } from 'app/shared/model/modal';

const AccountBalanceDetailFormComponent = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { filter } = location.state || {};
  const { id } = useParams();
  const { dataSecurities } = useAppSelector(state => state.company);
  const { data: detail } = useAppSelector(state => state.accountBalanceForm);
  const { data: dataAccountBalanceType } = useAppSelector(state => state.accountBalanceType);
  const [securitiesCompany, setSecuritiesCompany] = useState<IOptionProps[]>([]);

  useEffect(() => {
    innitData();
  }, []);

  useEffect(() => {
    if (detail && id) {
      if (detail.securitiesCompanyId) {
        fetchAccountSecurities(detail.securitiesCompanyId);
      }
      form.setFieldsValue({
        ...detail,
        transactionDate: dayjs(detail.date),
      });
    }
  }, [detail]);

  const innitData = () => {
    // get detail
    if (id) {
      dispatch(getDetailAccountBalance(id));
    }
    // công ty lưu ký
    dispatch(fetchSecuritiesCompany());
    // account balance type
    dispatch(fetchAccountBalanceType());
  };

  const handleSubmit = values => {
    const payload = {
      ...values,
      accountBalanceTransactionId: id,
      transactionDate: dayjs(values.transactionDate).format(DATE_FORMAT_PAYLOAD),
      isDelete: false,
    };
    if (id) {
      dispatch(updateAccountBalance(payload)).then(result => {
        if (result.payload) {
          handleClose();
        }
      });
    } else {
      dispatch(createAccountBalance(payload)).then(result => {
        if (result.payload) {
          handleClose();
        }
      });
    }
  };

  const handleChangeCTCK = (value: number) => {
    // tài khoản
    form.setFieldValue('stockAccountId', '');
    fetchAccountSecurities(value);
  };

  const handleClose = () => {
    form.resetFields();
    navigate('/account-balance', {
      state: { filter },
    });
  };

  // Function to filter options based on the input value
  const filterOption = (inputValue, option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

  const fetchAccountSecurities = async value => {
    const response = await dispatch(fetchAccountBySecuritiesCompany(value));
    if (response.payload) {
      const payload = response.payload as any;
      const result = payload.data.data?.map((item: any) => {
        return {
          value: item.accountId,
          label: item.accountBeautyName,
        };
      });
      setSecuritiesCompany(result);
    }
  };

  return (
    <Container>
      <Form className="multiple-form-horizontal-accountBalance" size="large" form={form} onFinish={handleSubmit} layout="vertical">
        <Title level={3}>{`${id ? 'Cập nhật' : 'Thêm mới'} giao dịch tiền`}</Title>
        <Form.Item label="Công ty lưu ký" name={'securitiesCompanyId'} rules={[{ required: true, message: 'Hãy chọn công ty lưu ký' }]}>
          <Select
            showSearch
            options={dataSecurities}
            onChange={handleChangeCTCK}
            filterOption={filterOption}
            placeholder="Chọn công ty lưu ký"
          />
        </Form.Item>
        <Form.Item label="Tài khoản" rules={[{ required: true, message: 'Hãy chọn tài khoản' }]} name={'stockAccountId'}>
          <Select size="large" options={securitiesCompany} placeholder="Chọn tài khoản" />
        </Form.Item>
        <Form.Item label="Ngày giao dịch" name={'transactionDate'}>
          <DatePicker className="w-100" format={APP_LOCAL_DATE_FORMAT} defaultValue={dayjs()} />
        </Form.Item>
        <Form.Item label="Loại giao dịch" rules={[{ required: true, message: 'Hãy chọn loại giao dịch' }]} name={'transactionTypeId'}>
          <Select size="large" options={dataAccountBalanceType} placeholder="Chọn loại giao dịch" />
        </Form.Item>
        <Form.Item label="Số tiền (đ)" name={'amount'} initialValue={1}>
          <InputNumber formatter={formatVND} parser={parseVND} min={1} className="w-100" placeholder="Nhập vào giá trị" />
        </Form.Item>

        <Form.Item>
          <Row className="action-form-horizontal" justify="end">
            <Col>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Col>
            <Col>
              <Button
                onClick={() => {
                  handleClose();
                }}
              >
                Hủy
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Container>
  );
};
export default AccountBalanceDetailFormComponent;
