import { Button, Col, DatePicker, Form, InputNumber, Row, Select, notification } from 'antd';
import Title from 'antd/es/typography/Title';
import { APP_LOCAL_DATE_FORMAT, DATE_FORMAT_PAYLOAD } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchAccountBySecuritiesCompany } from 'app/shared/reducers/account/account.reducer';
import { fetchSecuritiesCompany } from 'app/shared/reducers/company/company.reducer';
import { createDebt, getDetailDebt, updateDebt } from 'app/shared/reducers/debt/form/debt.reducers';
import { formatVND, parseVND } from 'app/shared/util/money-utils';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import './style.scss';
import { IOptionProps } from 'app/shared/model/modal';

const DebtDetailFormComponent = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { filter } = location.state || {};
  const { dataSecurities } = useAppSelector(state => state.company);
  const { data: detail } = useAppSelector(state => state.debtForm);
  const [securitiesCompany, setSecuritiesCompany] = useState<IOptionProps[]>([]);

  // watch data
  // const openingDebtValue = Form.useWatch('openingDebt', form);
  // const increaseAmountValue = Form.useWatch('increaseAmount', form);
  // const decreaseAmountValue = Form.useWatch('decreaseAmount', form);
  const paidInterestValue = Form.useWatch('paidInterest', form);
  const unpaidInterestValue = Form.useWatch('unpaidInterest', form);

  useEffect(() => {
    innitData();
  }, []);

  useEffect(() => {
    if (detail) {
      if (detail.securitiesCompanyId) {
        fetchAccountSecurities(detail.securitiesCompanyId);
      }
      form.setFieldsValue({
        ...detail,
        date: dayjs(detail.date),
      });
    }
  }, [detail]);

  useEffect(() => {
    let interest = 0;
    interest = paidInterestValue + unpaidInterestValue;
    form.setFieldValue('interest', interest.toFixed(2));
  }, [paidInterestValue, unpaidInterestValue]);

  const innitData = () => {
    // get detail
    if (id) {
      dispatch(getDetailDebt(id));
    }
    // công ty chứng khoán
    dispatch(fetchSecuritiesCompany());
  };

  const handleSubmit = values => {
    const payload = {
      ...values,
      debtId: id,
      openingDebt: values.openingDebt ?? 0,
      increaseAmount: values.increaseAmount ?? 0,
      closingDebt: values.closingDebt ?? 0,
      interest: values.interest ?? 0,
      date: dayjs(values.date).format(DATE_FORMAT_PAYLOAD),
    };
    if (id) {
      dispatch(updateDebt(payload)).then(result => {
        if (result.payload) {
          handleClose();
        }
      });
    } else {
      dispatch(createDebt(payload)).then(result => {
        if (result.payload) {
          handleClose();
        }
      });
    }
  };

  const handleClose = () => {
    form.resetFields();
    navigate('/debt', {
      state: filter,
    });
  };

  const handleChangeCTCK = (value: number) => {
    // tài khoản
    form.setFieldValue('stockAccountId', '');
    fetchAccountSecurities(value);
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
      <Form className="multiple-form-horizontal-debt" size="large" form={form} onFinish={handleSubmit} layout="vertical">
        <Title level={3}>{`${id ? 'Cập nhật' : 'Thêm mới'} thông tin sao kê tài khoản ký quỹ`}</Title>
        <Row>
          <Col md={11}>
            <Form.Item label="CTCK" rules={[{ required: true, message: 'Hãy chọn công ty chứng khoán' }]} name={'securitiesCompanyId'}>
              <Select
                className="w-100"
                onChange={handleChangeCTCK}
                showSearch
                filterOption={filterOption}
                options={dataSecurities}
                placeholder="Chọn công ty chứng khoán"
              />
            </Form.Item>
          </Col>
          <Col md={1}></Col>
          <Col md={12}>
            <Form.Item label="Tài khoản" rules={[{ required: true, message: 'Hãy chọn tài khoản' }]} name={'accountId'}>
              <Select className="w-100" size="large" options={securitiesCompany} placeholder="Chọn tài khoản" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={5}>
            <Form.Item
              label={
                <div>
                  <span>Đầu kỳ</span>
                  <span>(đ)</span>
                </div>
              }
              name={'openingDebt'}
              initialValue={0}
            >
              <InputNumber formatter={formatVND} parser={parseVND} className="w-100" placeholder="Nhập vào giá trị" />
            </Form.Item>
          </Col>
          <Col md={1}></Col>
          <Col md={5}>
            <Form.Item
              label={
                <div>
                  <span>Phát sinh tăng</span>
                  <span>(đ)</span>
                </div>
              }
              name={'increaseAmount'}
              initialValue={0}
            >
              <InputNumber formatter={formatVND} parser={parseVND} className="w-100" placeholder="Nhập vào giá" min={0} />
            </Form.Item>
          </Col>
          <Col md={1}></Col>
          <Col md={5}>
            <Form.Item
              label={
                <div>
                  <span>Phát sinh giảm</span>
                  <span>(đ)</span>
                </div>
              }
              name={'decreaseAmount'}
              initialValue={0}
            >
              <InputNumber className="w-100" formatter={formatVND} parser={parseVND} placeholder="Nhập vào giá trị" min={0} />
            </Form.Item>
          </Col>
          <Col md={1}></Col>
          <Col md={6}>
            <Form.Item
              label={
                <div>
                  <span>Cuối kỳ</span>
                  <span>(đ)</span>
                </div>
              }
              name={'closingDebt'}
              initialValue={0}
            >
              <InputNumber className="w-100" formatter={formatVND} parser={parseVND} min={0} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={5}>
            <Form.Item
              label={
                <div>
                  <span>Lãi đã trả</span>
                  <span>(đ)</span>
                </div>
              }
              name={'paidInterest'}
              initialValue={0}
            >
              <InputNumber formatter={formatVND} parser={parseVND} placeholder="Nhập vào giá trị" min={0} className="w-100" />
            </Form.Item>
          </Col>
          <Col md={1}></Col>
          <Col md={5}>
            <Form.Item
              label={
                <div>
                  <span>Lãi chưa trả</span>
                  <span>(đ)</span>
                </div>
              }
              name={'unpaidInterest'}
              initialValue={0}
            >
              <InputNumber formatter={formatVND} placeholder="Nhập vào giá trị" min={0} parser={parseVND} className="w-100" />
            </Form.Item>
          </Col>
          <Col md={1}></Col>
          <Col md={5}>
            <Form.Item
              label={
                <div>
                  <span>Tổng lãi</span>
                  <span>(đ)</span>
                </div>
              }
              name={'interest'}
              initialValue={0}
            >
              <InputNumber formatter={formatVND} parser={parseVND} className="w-100" readOnly />
            </Form.Item>
          </Col>
          <Col md={1}></Col>
          <Col md={6}>
            <Form.Item label="Ngày" name={'date'} initialValue={dayjs()}>
              <DatePicker className="w-100" format={APP_LOCAL_DATE_FORMAT} />
            </Form.Item>
          </Col>
        </Row>

        {/* <Row>
          <Col md={5}>
            <Form.Item
              label={
                <div>
                  <span>Số nợ</span>
                  <span>(đ)</span>
                </div>
              }
              name={'debtAmount'}
              initialValue={0}
            >
              <InputNumber formatter={formatVND} parser={parseVND} placeholder="Nhập vào giá trị" min={0} className="w-100" />
            </Form.Item>
          </Col>
        </Row> */}

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

export default DebtDetailFormComponent;
