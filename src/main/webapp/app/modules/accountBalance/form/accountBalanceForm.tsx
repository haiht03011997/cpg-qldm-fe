import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, InputNumber, Row, Select, notification } from 'antd';
import Title from 'antd/es/typography/Title';
import { APP_LOCAL_DATE_FORMAT, DATE_FORMAT_PAYLOAD } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { createAccountBalance } from 'app/shared/reducers/accountBalance/form/accountBalance.reduces';
import { fetchSecuritiesCompany } from 'app/shared/reducers/company/company.reducer';
import { formatVND, parseVND } from 'app/shared/util/money-utils';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import './style.scss';
import { fetchAccountCode } from 'app/shared/reducers/account/account.reducer';
import { fetchAccountBalanceType } from 'app/shared/reducers/accountBalance/type/accountBalanceType.reduces';

const AccountBalanceFormComponent = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { dataSecurities } = useAppSelector(state => state.company);
  const { data: dataAccountBalanceType } = useAppSelector(state => state.accountBalanceType);
  const { data: dataAccount } = useAppSelector(state => state.account);

  useEffect(() => {
    innitData();
  }, []);

  const innitData = () => {
    dispatch(fetchAccountCode());
    // công ty lưu ký
    dispatch(fetchSecuritiesCompany());
    // account balance type
    dispatch(fetchAccountBalanceType());
  };

  const handleSubmit = values => {
    const payload = values.items?.map(item => {
      return {
        ...item,
        transactionDate: dayjs(item.transactionDate).format(DATE_FORMAT_PAYLOAD),
        isDelete: false,
      };
    });
    dispatch(createAccountBalance(payload))
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

  // Function to filter options based on the input value
  const filterOption = (inputValue, option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

  return (
    <Form
      size="large"
      className="multiple-form-horizontal-accountBalance"
      form={form}
      initialValues={{ items: [{}] }}
      onFinish={handleSubmit}
      layout="vertical"
    >
      <Title level={3}>Cập nhật sao kê tài khoản ký quỹ</Title>
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} className="form-horizontal">
                <Row className="w-100">
                  <Col md={4}>
                    <Form.Item
                      label="Công ty lưu ký"
                      name={[name, 'securitiesCompanyId']}
                      rules={[{ required: true, message: 'Hãy chọn công ty lưu ký' }]}
                    >
                      <Select showSearch options={dataSecurities} filterOption={filterOption} placeholder="Chọn công ty lưu ký" />
                    </Form.Item>
                  </Col>
                  <Col md={1} />
                  <Col md={4}>
                    <Form.Item
                      label="Tài khoản"
                      rules={[{ required: true, message: 'Hãy chọn tài khoản' }]}
                      name={[name, 'stockAccountId']}
                    >
                      <Select
                        size="large"
                        options={dataAccount.map((item: any) => {
                          return {
                            value: item.accountId,
                            label: `${item.accountName} - ${item.accountNumber}`,
                          };
                        })}
                        placeholder="Chọn tài khoản"
                      />
                    </Form.Item>
                  </Col>
                  <Col md={1} />
                  <Col md={4}>
                    <Form.Item label="Ngày giao dịch" name={[name, 'date']}>
                      <DatePicker className="w-100" format={APP_LOCAL_DATE_FORMAT} defaultValue={dayjs()} />
                    </Form.Item>
                  </Col>
                  <Col md={1} />
                  <Col md={4}>
                    <Form.Item
                      label="Loại giao dịch"
                      rules={[{ required: true, message: 'Hãy chọn loại giao dịch' }]}
                      name={[name, 'transactionTypeId']}
                    >
                      <Select size="large" options={dataAccountBalanceType} placeholder="Chọn loại giao dịch" />
                    </Form.Item>
                  </Col>
                  <Col md={1} />
                  <Col md={4}>
                    <Form.Item label="Số tiền" name={[name, 'amount']} initialValue={1}>
                      <InputNumber formatter={formatVND} parser={parseVND} min={1} className="w-100" placeholder="Nhập vào giá trị" />
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

export default AccountBalanceFormComponent;
