import { Button, Col, Form, Input, Row, Select } from 'antd';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { StockAccountType } from 'app/shared/enum/enum';
import { IOptionProps } from 'app/shared/model/modal';
import { getAllAccountOwner } from 'app/shared/reducers/accountOwner/view/accountOwner.reduces';
import { fetchSecuritiesCompany } from 'app/shared/reducers/company/company.reducer';
import { createStockAccount, getDetailStockAccount, updateStockAccount } from 'app/shared/reducers/stockAccount/form/stockAccount.reduces';
import { fetchStockAccountNormal } from 'app/shared/reducers/stockAccount/view/stockAccount.reduces';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import { stockAccountTypeArray } from '../list/config';
import * as _ from 'lodash';
import './style.scss';

const StockAccountFormComponent = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { filter } = location.state || {};
  const { id } = useParams();
  const { dataSecurities } = useAppSelector(state => state.company);
  const { data: detail } = useAppSelector(state => state.stockAccountForm);
  const [accountMember, setAccountMember] = useState<IOptionProps[]>([]);
  const [accountNormal, setAccountNormal] = useState<IOptionProps[]>([]);

  const accountTypeValue = Form.useWatch('accountType', form);

  useEffect(() => {
    innitData();
  }, []);

  useEffect(() => {
    if (detail && id) {
      form.setFieldsValue(detail);
    }
  }, [detail]);

  const innitData = () => {
    // get detail
    if (id) {
      dispatch(getDetailStockAccount(id));
    }
    fetchAllNormalStockAccounts();
    // công ty ck
    dispatch(fetchSecuritiesCompany());
    fetchAccountMemberCompany();
  };

  const handleSubmit = values => {
    if (values.accountType === StockAccountType.NORMAL) {
      delete values.parentAccountId;
    }
    const payload = {
      ...values,
      accountId: id,
    };
    if (id) {
      dispatch(updateStockAccount(payload)).then(result => {
        if (result.payload) {
          handleClose();
        }
      });
    } else {
      dispatch(createStockAccount(payload)).then(result => {
        if (result.payload) {
          handleClose();
        }
      });
    }
  };

  const handleClose = () => {
    form.resetFields();
    navigate('/stock-account', {
      state: { filter },
    });
  };

  const fetchAllNormalStockAccounts = async () => {
    const response = await dispatch(fetchStockAccountNormal());
    if (response && response.payload) {
      const result = response.payload as any;
      const array = _.filter(result.data, item => {
        return item.value.toString() !== id;
      });
      setAccountNormal(array);
    }
  };

  // Function to filter options based on the input value
  const filterOption = (inputValue, option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

  const fetchAccountMemberCompany = async () => {
    const response = await dispatch(getAllAccountOwner());
    if (response.payload) {
      const payload = response.payload as any;
      setAccountMember(payload.data);
    }
  };

  return (
    <Container>
      <Form className="multiple-form-horizontal-stockAccount" size="large" form={form} onFinish={handleSubmit} layout="vertical">
        <Title level={3}>{`${id ? 'Cập nhật' : 'Thêm mới'} tài khoản chứng khoán`}</Title>
        <Form.Item label="Tên chủ khoản" rules={[{ required: true, message: 'Hãy chọn chủ khoản' }]} name={'accountOwnerCompanyId'}>
          <Select showSearch allowClear filterOption={filterOption} size="large" options={accountMember} placeholder="Chọn chủ khoản" />
        </Form.Item>
        <Form.Item label="Số tài khoản" rules={[{ required: true, message: 'Hãy nhập số tài khoản' }]} name={'accountNumber'}>
          <Input className="w-100" placeholder="Nhập số tài khoản" />
        </Form.Item>
        <Form.Item
          initialValue={StockAccountType.NORMAL}
          label="Loại tài khoản"
          rules={[{ required: true, message: 'Hãy chọn loại tài khoản' }]}
          name={'accountType'}
        >
          <Select size="large" options={stockAccountTypeArray} placeholder="Chọn loại tài khoản" />
        </Form.Item>
        {accountTypeValue !== StockAccountType.NORMAL && (
          <Form.Item label="Tài khoản nguồn" name={'parentAccountId'} rules={[{ required: true, message: 'Hãy chọn tài khoản nguồn' }]}>
            <Select showSearch allowClear options={accountNormal} filterOption={filterOption} placeholder="Chọn tài khoản nguồn" />
          </Form.Item>
        )}
        <Form.Item label="Công ty chứng khoán" name={'companyId'} rules={[{ required: true, message: 'Hãy chọn công ty chứng khoán' }]}>
          <Select showSearch allowClear options={dataSecurities} filterOption={filterOption} placeholder="Chọn công ty chứng khoán" />
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
export default StockAccountFormComponent;
