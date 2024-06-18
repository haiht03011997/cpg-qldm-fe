import { Button, Col, DatePicker, Form, Input, Modal, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ICapitalRepresentative } from 'app/shared/model/representative/form/capitalRepresentative/view/view.model';
import {
  createCapitalRepresentative,
  getDetailCapitalRepresentative,
  updateCapitalRepresentative,
} from 'app/shared/reducers/representative/form/capitalRepresentative/form/capitalRepresentative.reducers';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './style.scss';

type ICapitalModal = {
  isOpen: boolean;
  onCancel: (reloaded?: boolean) => void;
  dataSelected: ICapitalRepresentative;
};

const UnInvestFormComponent = (props: ICapitalModal) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { data: representativeForm } = useAppSelector(state => state.representativeForm);
  const { data: detail } = useAppSelector(state => state.capitalRepresentativeForm);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (detail && props.dataSelected?.unInvestId) {
      form.setFieldsValue({
        ...detail,
        representativeId: id,
        effectDateFrom: dayjs(detail.effectDateFrom),
        signedDate: dayjs(detail.signedDate),
      });
    } else {
      form.resetFields();
    }
  }, [detail, props.dataSelected]);

  useEffect(() => {
    if (props.dataSelected?.unInvestId) {
      dispatch(getDetailCapitalRepresentative(props.dataSelected.capitalRepresentativeId));
    }
  }, [props.dataSelected]);

  const handleSubmit = values => {
    const payload = {
      ...values,
      capitalRepresentativeId:
        props.dataSelected?.unInvestId && (props.dataSelected.capitalRepresentativeId || detail.capitalRepresentativeId),
      representativeId: id,
      companyId: props.dataSelected?.companyId,
      representativeWorkId: props.dataSelected?.representativeWorkId,
      unInvestId: props.dataSelected?.unInvestId || props.dataSelected.capitalRepresentativeId,
      effectDateFrom: dayjs(values.effectDateFrom),
    };
    if (!props.dataSelected.unInvestId) {
      dispatch(createCapitalRepresentative(payload)).then(result => {
        if (result.payload) {
          handleClose(true);
        }
      });
    } else {
      dispatch(updateCapitalRepresentative(payload)).then(result => {
        if (result.payload) {
          handleClose(true);
        }
      });
    }
  };

  const handleClose = (reloaded = false) => {
    form.resetFields();
    props.onCancel(reloaded);
  };

  return (
    <Modal
      maskClosable={false}
      width={800}
      onCancel={() => {
        handleClose();
      }}
      open={props.isOpen}
      footer={null}
    >
      <Form className="multiple-form-horizontal-representative" size="large" form={form} onFinish={handleSubmit} layout="vertical">
        <Title level={3}>{`${!props.dataSelected?.unInvestId ? 'Quyết' : 'Cập nhật quyết'} định thôi ủy quyền người đại diện vốn`}</Title>
        <Row>
          <Col md={11}>
            <Form.Item label="Số quyết định" rules={[{ required: true, message: 'Vui lòng nhập số quyết định' }]} name="decisionNumber">
              <Input maxLength={255} className="w-100" placeholder="Nhập só quyết định" />
            </Form.Item>
          </Col>
          <Col md={1} />
          <Col md={12}>
            <Form.Item label="Công ty cử đại diện">
              <Input disabled value={props.dataSelected?.representCompanyName} className="w-100" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={11}>
            <Form.Item label="Họ tên">
              <Input disabled value={representativeForm?.name} className="w-100" />
            </Form.Item>
          </Col>
          <Col md={1} />
          <Col md={12}>
            <Form.Item label="Chức vụ">
              <Input disabled value={props.dataSelected?.role} className="w-100" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={11}>
            <Form.Item label="Đại diện tại công ty">
              <Input disabled value={props.dataSelected?.companyName} className="w-100" />
            </Form.Item>
          </Col>
          <Col md={1} />
          <Col md={12}>
            <Form.Item label="Thôi làm đại diện vốn từ ngày" name={'effectDateFrom'}>
              <DatePicker format={APP_LOCAL_DATE_FORMAT} size="large" className="w-100" placeholder="Chọn ngày" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={11}>
            <Form.Item label="Người ký" rules={[{ required: true, message: 'Vui lòng nhập người ký' }]} name={'signedBy'}>
              <Input className="w-100" placeholder="Nhập vào người ký" />
            </Form.Item>
          </Col>
          <Col md={1}></Col>
          <Col md={12}>
            <Form.Item label="Ngày ký" rules={[{ required: true, message: 'Vui lòng chọn ngày ký' }]} name={'signedDate'}>
              <DatePicker format={APP_LOCAL_DATE_FORMAT} size="large" className="w-100" placeholder="Chọn ngày ký" />
            </Form.Item>
          </Col>
        </Row>
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
    </Modal>
  );
};

export default UnInvestFormComponent;
