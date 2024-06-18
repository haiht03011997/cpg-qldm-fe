import { InboxOutlined } from '@ant-design/icons';
import { Modal, Space, Upload } from 'antd';
import { useAppDispatch } from 'app/config/store';
import { uploadTransaction } from 'app/shared/reducers/transaction/form/transaction.reduces';
import { checkFileExtension } from 'app/shared/util/help';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import './style.scss';
const { Dragger } = Upload;

type IFilterProps = {
  visible: boolean;
  onCancel: (reload?: boolean) => void;
};

const UploadFile = ({ visible, onCancel }: IFilterProps) => {
  const [fileSelected, setFileSelected] = useState(null);
  const [resultFile, setResultFile] = useState(null);
  const dispatch = useAppDispatch();

  const handleUploadTransaction = () => {
    const formData = new FormData();
    formData.append('file', fileSelected);
    dispatch(uploadTransaction(formData)).then(response => {
      if (response.payload) {
        const result = response.payload as any;
        if (result.data.byteLength <= 0) {
          toast.success('Thêm mới thành công', { position: 'top-left' });
          handleClose(true);
        } else {
          toast.error('Tải lên tệp tin thất bại', { position: 'top-left' });
          setResultFile(result.data);
        }
      }
    });
  };

  const handleCustomRequest = value => {
    setFileSelected(value.file);
  };

  const handleBeforeUploadFile = file => {
    setResultFile(null);
    return checkFileExtension(file);
  };

  const handleClose = (isReload?: boolean) => {
    onCancel(isReload);
    setFileSelected(null);
    setResultFile(null);
  };

  const handleDownLoadFile = () => {
    saveAs(new Blob([resultFile], { type: 'aapplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'Kết Quả.xlsx');
  };

  return (
    <Modal
      width={500}
      open={visible}
      title="Tải lên giao dịch hàng ngày"
      maskClosable={false}
      onCancel={() => {
        handleClose();
      }}
      className="file-upload-modal"
      onOk={handleUploadTransaction}
      cancelText="Hủy"
      okText="Tải lên"
    >
      <Dragger
        className="upload-drag-file"
        customRequest={handleCustomRequest}
        showUploadList={false}
        beforeUpload={handleBeforeUploadFile}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        {!fileSelected && <p className="ant-upload-text">Chọn hoặc kéo thả tệp tin vào đây</p>}
        {fileSelected && (
          <div className="custom-file-list-item">
            <p>{fileSelected.name}</p>
          </div>
        )}
      </Dragger>
      {resultFile && (
        <Space className="result-item">
          <span
            onClick={() => {
              handleDownLoadFile();
            }}
          >
            Xem kết quả tải tệp tin tại đây
            <img src="content/images/icons/pointer.svg"></img>
          </span>
        </Space>
      )}
    </Modal>
  );
};

export default UploadFile;
