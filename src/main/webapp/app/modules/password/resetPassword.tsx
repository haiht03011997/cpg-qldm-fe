import React, { useEffect, useState } from 'react';

import { Button, Col, Form, Input, Modal, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import { passwordRegex } from 'app/config/constants';
import { useAppDispatch } from 'app/config/store';
import { resetPassword } from 'app/shared/reducers/user/user.reducer';
import { useLocation, useNavigate, useParams } from 'react-router';
import PasswordStrengthBar from './strengthBar/password-strength-bar';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ResetPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState<string>(null);

  const newPasswordValue = Form.useWatch('newPassword', form);
  const confirmNewPasswordValue = Form.useWatch('confirmNewPassword', form);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    setToken(tokenParam);
  }, [location.search]);

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleLoginSubmit = values => {
    handleChangePassword(values);
  };

  const handleChangePassword = async values => {
    const payload = {
      newPassword: values.newPassword,
      token,
    };
    const response = await dispatch(resetPassword(payload));
    if (response.payload) {
      handleClose();
    } else {
      toast.error('Liên kết đã hết thời gian khả dụng.', { position: toast.POSITION.TOP_LEFT });
    }
  };

  const handleClose = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <Modal open={showModal} onCancel={handleClose} footer={null} maskClosable={false} width={500}>
      <Form size="large" form={form} onFinish={handleLoginSubmit} className="form-login" layout="vertical">
        <Title level={3}>Thay đổi mật khẩu</Title>
        <Row>
          <Col md={24}>
            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu mới',
                },
                {
                  pattern: passwordRegex,
                  message: 'Mật khẩu phải chứa ít nhất 1 ý tự đặc biệt, 1 chữ hoa, 1 số và có ít nhất 8 ký tự',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <PasswordStrengthBar password={newPasswordValue ?? ''} />
          </Col>
        </Row>
        <Row>
          <Col md={24}>
            <Form.Item
              label="Xác nhận mật khẩu mới"
              name="confirmNewPassword"
              dependencies={['newPassword']}
              hasFeedback
              rules={[
                { required: true, message: 'Vui lòng nhập xác nhận mật khẩu mới' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Không trùng khớp với mật khẩu mới'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <PasswordStrengthBar password={confirmNewPasswordValue ?? ''} />
          </Col>
        </Row>
        <Form.Item>
          <Row className="action-form" justify="end">
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
    </Modal>
  );
};

export default ResetPassword;
