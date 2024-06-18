import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, InputNumber, Row, Select, notification } from 'antd';
import Title from 'antd/es/typography/Title';
import { APP_LOCAL_DATE_FORMAT, DATE_FORMAT_PAYLOAD } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IOptionProps } from 'app/shared/model/modal';
import { fetchAccountBySecuritiesCompany } from 'app/shared/reducers/account/account.reducer';
import { fetchSecuritiesCompany } from 'app/shared/reducers/company/company.reducer';
import { createDebt } from 'app/shared/reducers/debt/form/debt.reducers';
import { formatVND, parseVND } from 'app/shared/util/money-utils';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import './style.scss';
import { useNavigate } from 'react-router';

const DebtFormComponent = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { dataSecurities } = useAppSelector(state => state.company);
  const { createSuccess } = useAppSelector(state => state.debtForm);
  const [arrayDebtType, setArrayDebtType] = useState<IOptionProps[][]>([]);

  useEffect(() => {
    innitData();
  }, []);

  const innitData = () => {
    // công ty chứng khoán
    dispatch(fetchSecuritiesCompany());
  };

  const handleSubmit = values => {
    const payload = values.items?.map(item => {
      return {
        ...item,
        openingDebt: item.openingDebt ?? 0,
        increaseAmount: item.increaseAmount ?? 0,
        closingDebt: item.closingDebt ?? 0,
        interest: item.interest ?? 0,
        date: dayjs(item.date).format(DATE_FORMAT_PAYLOAD),
      };
    });
    dispatch(createDebt(payload))
      .then(() => {
        notification.success({
          message: 'Tạo mới thành công',
        });
      })
      .finally(() => {
        handleClose();
      });
  };

  const handleClose = () => {
    form.resetFields();
    navigate(-1);
  };

  const handleChangeCTCK = async (id: number, name: number) => {
    // tài khoản
    const response = await dispatch(fetchAccountBySecuritiesCompany(id));
    if (response && response.payload) {
      const result = response.payload as any;
      const data = [...arrayDebtType];
      (data[name] = result.data?.data?.map((item: any) => {
        return {
          label: item.accountNumber,
          value: item.accountId,
        };
      })),
        setArrayDebtType(data);
    }
  };

  const onValuesChange = (_, values) => {
    const updatedItems = values.items.map(item => {
      if (item) {
        const autoClosingDebt = (item.openingDebt ?? 0) + (item.increaseAmount ?? 0) - (item.decreaseAmount ?? 0);
        const sumInterest = (item.paidInterestAmount ?? 0) + (item.unpaidInterestAmount ?? 0);
        return {
          ...item,
          interest: sumInterest,
          closingDebt: autoClosingDebt,
        };
      }
    });

    form.setFieldsValue({ items: updatedItems });
  };

  // Function to filter options based on the input value
  const filterOption = (inputValue, option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

  return (
    <Form
      size="large"
      className="multiple-form-horizontal-debt"
      form={form}
      initialValues={{ items: [{}] }}
      onFinish={handleSubmit}
      layout="vertical"
      onValuesChange={onValuesChange}
    >
      <Title level={3}>Cập nhật sao kê tài khoản ký quỹ</Title>
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} className="form-horizontal">
                <Row>
                  <Col md={4}>
                    <Form.Item label="Ngày" name={[name, 'date']}>
                      <DatePicker className="w-100" format={APP_LOCAL_DATE_FORMAT} defaultValue={dayjs()} />
                    </Form.Item>
                  </Col>
                  <Col md={3}>
                    <Form.Item
                      label="CTCK"
                      name={[name, 'securitiesCompanyId']}
                      rules={[{ required: true, message: 'Hãy chọn công ty chứng khoán' }]}
                    >
                      <Select
                        onChange={e => {
                          handleChangeCTCK(e, name);
                        }}
                        showSearch
                        filterOption={filterOption}
                        options={dataSecurities}
                        placeholder="Chọn công ty chứng khoán"
                      />
                    </Form.Item>
                  </Col>
                  <Col md={2}>
                    <Form.Item label="Tài khoản" rules={[{ required: true, message: 'Hãy chọn tài khoản' }]} name={[name, 'accountId']}>
                      <Select size="large" options={arrayDebtType[name]} placeholder="Chọn tài khoản" />
                    </Form.Item>
                  </Col>
                  <Col md={2}>
                    <Form.Item
                      label={
                        <div>
                          <span>Đầu kỳ</span>
                          <span>(đ)</span>
                        </div>
                      }
                      name={[name, 'openingDebt']}
                    >
                      <InputNumber
                        formatter={formatVND}
                        parser={parseVND}
                        className="w-100"
                        placeholder="Nhập vào giá trị"
                        defaultValue={0}
                      />
                    </Form.Item>
                  </Col>
                  <Col md={2}>
                    <Form.Item
                      label={
                        <div>
                          <span>Phát sinh tăng</span>
                          <span>(đ)</span>
                        </div>
                      }
                      name={[name, 'increaseAmount']}
                    >
                      <InputNumber
                        formatter={formatVND}
                        parser={parseVND}
                        className="w-100"
                        placeholder="Nhập vào giá"
                        defaultValue={0}
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                  <Col md={2}>
                    <Form.Item
                      label={
                        <div>
                          <span>Phát sinh giảm</span>
                          <span>(đ)</span>
                        </div>
                      }
                      name={[name, 'decreaseAmount']}
                    >
                      <InputNumber
                        className="w-100"
                        formatter={formatVND}
                        parser={parseVND}
                        placeholder="Nhập vào giá trị"
                        defaultValue={0}
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                  <Col md={2}>
                    <Form.Item
                      label={
                        <div>
                          <span>Cuối kỳ</span>
                          <span>(đ)</span>
                        </div>
                      }
                      name={[name, 'closingDebt']}
                    >
                      <InputNumber className="w-100" formatter={formatVND} parser={parseVND} readOnly defaultValue={0} min={0} />
                    </Form.Item>
                  </Col>
                  <Col md={2}>
                    <Form.Item
                      label={
                        <div>
                          <span>Lãi đã trả</span>
                          <span>(đ)</span>
                        </div>
                      }
                      name={[name, 'paidInterestAmount']}
                    >
                      <InputNumber
                        formatter={formatVND}
                        parser={parseVND}
                        placeholder="Nhập vào giá trị"
                        defaultValue={0}
                        min={0}
                        className="w-100"
                      />
                    </Form.Item>
                  </Col>
                  <Col md={2}>
                    <Form.Item
                      label={
                        <div>
                          <span>Lãi chưa trả</span>
                          <span>(đ)</span>
                        </div>
                      }
                      name={[name, 'unpaidInterestAmount']}
                    >
                      <InputNumber
                        formatter={formatVND}
                        placeholder="Nhập vào giá trị"
                        defaultValue={0}
                        min={0}
                        parser={parseVND}
                        className="w-100"
                      />
                    </Form.Item>
                  </Col>
                  <Col md={2}>
                    <Form.Item
                      label={
                        <div>
                          <span>Tổng lãi</span>
                          <span>(đ)</span>
                        </div>
                      }
                      name={[name, 'interest']}
                    >
                      <InputNumber formatter={formatVND} parser={parseVND} className="w-100" defaultValue={0} readOnly />
                    </Form.Item>
                  </Col>
                </Row>
                {name > 0 && (
                  <MinusCircleOutlined
                    className="minus-circle-outlined"
                    onClick={() => {
                      remove(name);
                    }}
                  />
                )}
              </div>
            ))}
            <Form.Item>
              <PlusCircleOutlined
                className="plus-circle-outlined"
                onClick={() => {
                  add();
                }}
              />
            </Form.Item>
          </>
        )}
      </Form.List>

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
                navigate(-1);
              }}
            >
              Hủy
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
};

export default DebtFormComponent;
