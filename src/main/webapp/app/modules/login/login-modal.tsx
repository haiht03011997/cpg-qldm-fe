import { Button, Checkbox, Col, Form, Input, Modal, Row, Spin } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import './style.scss';
import { useNavigate } from 'react-router';
import { useAppSelector } from 'app/config/store';

export interface ILoginModalProps {
  loginError: boolean;
  handleLogin: (values) => void;
}

const LoginModal = (props: ILoginModalProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
  const isLoading = useAppSelector(state => state.authentication.loading)
  useEffect(() => {
    setShowModal(true);
  }, []);

  const login = values => {
    props.handleLogin(values);
  };

  const handleLoginSubmit = values => {
    login(values);
  };

  const handleForgotPassWord = () => {
    navigate('/forgot-password');
    setShowModal(false);
  };

  return (
    <Spin spinning={isLoading} delay={300}>
      <Modal open={showModal} closable={false} footer={null} maskClosable={false} width={500}>
        <Form size="large" form={form} onFinish={handleLoginSubmit} className="form-login" layout="vertical">
          <Title level={3}>Đăng nhập</Title>
          <Row>
            <Col md={24}>
              <Form.Item rules={[{ required: true, message: 'Vui lòng nhập tài khoản' }]} label="Tên đăng nhập" name="username">
                <Input type="email" className="w-100" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={24}>
              <Form.Item rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]} label="Mật khẩu" name="password">
                <Input.Password className="w-100" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Item name="rememberMe" valuePropName="checked">
                <Checkbox>Ghi nhớ</Checkbox>
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item>
                <span
                  onClick={() => {
                    handleForgotPassWord();
                  }}
                  className="forgot"
                >
                  Quên mật khẩu?
                </span>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Row className="action-form" justify="end">
              <Col md={24}>
                <Button className="w-100" type="primary" htmlType="submit">
                  Đăng nhập
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  );
};

export default LoginModal;
