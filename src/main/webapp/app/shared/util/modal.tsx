import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import React from 'react';

type IConfirmModal = {
  title: string;
  content: string;
  handleConfirm: () => void;
};

export const showConfirmModal = (props: IConfirmModal) => {
  Modal.confirm({
    title: `${props.title}`,
    icon: <ExclamationCircleOutlined />,
    content: `${props.content}`,
    onOk: props.handleConfirm,
    okText: 'Đồng ý',
    cancelText: 'Hủy',
  });
};
