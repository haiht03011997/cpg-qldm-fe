import { Button, Col, Form, Input, Row, Select } from 'antd';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { createAccountOwner, getDetailAccountOwner, updateAccountOwner } from 'app/shared/reducers/accountOwner/form/accountOwner.reduces';
import { fetchMemberCompany } from 'app/shared/reducers/company/member/company.member.reducer';
import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import * as _ from 'lodash';
import './style.scss';

const AccountOwnerFormComponent = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { filter } = location.state || {};
  const { id } = useParams();
  const {
    data: memberCompany,
    page: currentPageMemberCompany,
    total: totalPagesMemberCompany,
  } = useAppSelector(state => state.memberCompany);
  const { data: detail } = useAppSelector(state => state.accountOwnerForm);

  useEffect(() => {
    innitData();
  }, []);

  useEffect(() => {
    if (detail && id) {
      form.setFieldsValue({
        ...detail,
        memberCompanyId: detail?.accountOwnerCompanies?.map(x => x.companyId),
      });
    }
  }, [detail]);

  const innitData = () => {
    // get detail
    if (id) {
      dispatch(getDetailAccountOwner(id));
    }
    // công ty sh
    dispatch(fetchMemberCompany(currentPageMemberCompany));
  };

  const handleSubmit = values => {
    const payload = {
      ...values,
      accountOwnerId: id,
    };
    if (values.memberCompanyId) {
      payload.accountOwnerCompanies = values.memberCompanyId.map(x => {
        const accountOwnerCompanyId = _.find(detail.accountOwnerCompanies, item => {
          return item.companyId === x;
        })?.accountOwnerCompanyId;
        return {
          companyId: x,
          accountOwnerCompanyId,
        };
      });
    }
    if (id) {
      dispatch(updateAccountOwner(payload)).then(result => {
        if (result.payload) {
          handleClose();
        }
      });
    } else {
      dispatch(createAccountOwner(payload)).then(result => {
        if (result.payload) {
          handleClose();
        }
      });
    }
  };

  const handleClose = () => {
    form.resetFields();
    navigate('/account-owner', {
      state: { filter },
    });
  };

  // Function to filter options based on the input value
  const filterOption = (inputValue, option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

  return (
    <Container>
      <Form className="multiple-form-horizontal-accountOwner" size="large" form={form} onFinish={handleSubmit} layout="vertical">
        <Title level={3}>{`${id ? 'Cập nhật' : 'Thêm mới'} thông tin chủ tài khoản`}</Title>

        <Form.Item label="Họ tên" rules={[{ required: true, message: 'Hãy nhập họ tên chủ quản' }]} name={'accountOwnerName'}>
          <Input size="large" className="w-100" placeholder="Nhập họ tên chủ quản" />
        </Form.Item>
        <Form.Item label="Số điện thoại" name={'accountOwnerPhone'}>
          <Input size="large" className="w-100" placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item label="Email" name={'accountOwnerEmail'}>
          <Input size="large" type="email" placeholder="Nhập email" />
        </Form.Item>
        <Form.Item label="Công ty" name={'memberCompanyId'} rules={[{ required: true, message: 'Hãy chọn công ty' }]}>
          <Select
            mode="multiple"
            showSearch
            allowClear
            filterOption={filterOption}
            size="large"
            options={memberCompany}
            placeholder="Chọn công ty"
          />
        </Form.Item>
        <Form.Item label="Vị trí" name={'position'}>
          <Input size="large" placeholder="Nhập vị trí" />
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
export default AccountOwnerFormComponent;
