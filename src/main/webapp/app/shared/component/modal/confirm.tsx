import { Modal } from 'antd';
import React from 'react';

type IModalConfirmProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  content?: string;
  title: string;
};

const ModalConfirmComponent = (props: IModalConfirmProps) => {
  return (
    <Modal
      width={300}
      title={props.title}
      open={props.visible}
      onOk={props.onConfirm}
      okType="danger"
      onCancel={props.onCancel}
      okText="Đồng ý"
      cancelText="Hủy"
    >
      <p>{props.content}</p>
    </Modal>
  );
};

export default ModalConfirmComponent;
