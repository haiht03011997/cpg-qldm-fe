import React, { useEffect, useState } from 'react';

import { Button, Col, Form, Input, Modal, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { exitUserByEmail, forgotPassword } from 'app/shared/reducers/user/user.reducer';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

export const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleLoginSubmit = values => {
    handleChangePassword(values);
  };

  const handleChangePassword = async values => {
    setIsValid(true);
    await dispatch(exitUserByEmail(values))
      .then(async response => {
        if (response.payload) {
          toast.success('Gửi mail thành công.', { position: toast.POSITION.TOP_LEFT });
          handleClose();
          await dispatch(forgotPassword(values));
        }
      })
      .finally(() => {
        setIsValid(false);
      });
  };

  const handleClose = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <Modal open={showModal} onCancel={handleClose} footer={null} maskClosable={false} width={500}>
      <Form size="large" form={form} onFinish={handleLoginSubmit} className="form-login" layout="vertical">
        <Title level={3}>Quên mật khẩu</Title>
        <Row>
          <Col md={24}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập email',
                },
              ]}
            >
              <Input type="email" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Row className="action-form" justify="end">
            <Col>
              <Button loading={isValid} type="primary" htmlType="submit">
                Gửi
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
    </Modal>
  );
};

export default ForgotPassword;
