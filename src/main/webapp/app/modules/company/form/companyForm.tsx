import { Button, Col, Form, Input, Row, Select } from 'antd';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { createCompany, getDetailCompany, updateCompany } from 'app/shared/reducers/company/form/company.reduces';
import { fetchMemberCompany } from 'app/shared/reducers/company/member/company.member.reducer';
import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import * as _ from 'lodash';
import './style.scss';

const CompanyFormComponent = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { filter } = location.state || {};
  const { id } = useParams();
  const { data: detail } = useAppSelector(state => state.companyForm);

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
      dispatch(getDetailCompany(id));
    }
  };

  const handleSubmit = values => {
    const payload = {
      ...values,
      companyId: id,
    };
    if (id) {
      dispatch(updateCompany(payload)).then(result => {
        if (result.payload) {
          handleClose();
        }
      });
    } else {
      dispatch(createCompany(payload)).then(result => {
        if (result.payload) {
          handleClose();
        }
      });
    }
  };

  const handleClose = () => {
    form.resetFields();
    navigate('/company', {
      state: { filter },
    });
  };

  return (
    <Container>
      <Form className="multiple-form-horizontal-company" size="large" form={form} onFinish={handleSubmit} layout="vertical">
        <Title level={3}>{`${id ? 'Cập nhật' : 'Thêm mới'} đơn vị chủ quản`}</Title>

        <Form.Item label="Tên đơn vị" rules={[{ required: true, message: 'Hãy nhập tên đơn vị' }]} name={'companyName'}>
          <Input size="large" className="w-100" placeholder="Nhập tên đơn vị" />
        </Form.Item>
        <Form.Item label="Số điện thoại" name={'companyPhone'}>
          <Input size="large" className="w-100" placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item label="Email" name={'companyEmail'}>
          <Input size="large" type="email" placeholder="Nhập email" />
        </Form.Item>
        <Form.Item label="Địa chỉ" name={'companyAddress'}>
          <Input size="large" placeholder="Nhập địa chỉ" />
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
export default CompanyFormComponent;
