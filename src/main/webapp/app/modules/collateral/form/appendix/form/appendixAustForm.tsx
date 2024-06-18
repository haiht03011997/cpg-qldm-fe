import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import { APP_LOCAL_DATE_FORMAT, DATE_FORMAT_PAYLOAD, DATE_TIME_FORMAT_PAYLOAD } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import {
  createContractAddendum,
  getDetailContractAddendum,
  updateContractAddendum,
} from 'app/shared/reducers/collateral/form/contractAddendum/form/contractAddendum.reducers';
import { formatVND, parseFloatVND } from 'app/shared/util/money-utils';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './style.scss';

type IAppendixModal = {
  isOpen: boolean;
  onCancel: (reloaded?: boolean) => void;
  id?: number;
  adjustId?: number;
};

const AppendixAustFormComponent = (props: IAppendixModal) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { data: detail } = useAppSelector(state => state.contractAddendumCollateralForm);
  const { data: collateral } = useAppSelector(state => state.collateralForm);
  // watch data
  const loanAmountValue = Form.useWatch('loanAmount', form);
  const effectiveToValue = Form.useWatch('effectiveTo', form);
  const effectiveFromValue = Form.useWatch('effectiveFrom', form);
  const interestRealityValue = Form.useWatch('interestReality', form);

  useEffect(() => {
    if (detail && props.id && props.adjustId) {
      form.setFieldsValue({
        ...detail,
        collateralId: id,
        effectiveFrom: dayjs(detail.effectiveFrom),
        effectiveTo: dayjs(detail.effectiveTo),
      });
    } else {
      form.resetFields();
    }
  }, [detail]);

  useEffect(() => {
    if (props.id) {
      dispatch(getDetailContractAddendum(props.id));
    }
  }, [props.id]);

  useEffect(() => {
    let interestAmount = 0;
    if (effectiveToValue && effectiveFromValue) {
      const diffDays = dayjs(effectiveToValue).diff(dayjs(effectiveFromValue), 'days');
      if (diffDays) {
        interestAmount = parseFloat((loanAmountValue * (diffDays + 1) * (interestRealityValue / (100 * 365))).toFixed(0));
      }
    }
    const totalInterest = (interestAmount ?? 0) + (loanAmountValue ?? 0);
    form.setFieldsValue({
      interestAmount,
      totalInterest,
    });
  }, [loanAmountValue, effectiveToValue, effectiveFromValue, interestRealityValue]);

  const handleSubmit = values => {
    const parentContractAddendumCollateralId = props.adjustId || detail.contractAddendumCollateralId;
    const contractAddendumCollateralId = props.adjustId ? detail.contractAddendumCollateralId : undefined;
    const payload = {
      ...detail,
      ...values,
      collateralId: id,
      contractAddendumCollateralId,
      parentContractAddendumCollateralId,
      effectiveFrom: values.effectiveFrom.format(DATE_FORMAT_PAYLOAD),
      effectiveTo: values.effectiveTo && values.effectiveTo.format(DATE_FORMAT_PAYLOAD),
    };
    if (props.id && props.adjustId) {
      dispatch(updateContractAddendum(payload)).then(result => {
        if (result.payload) {
          handleClose(true);
        }
      });
    } else {
      dispatch(createContractAddendum(payload)).then(result => {
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
      <Form className="multiple-form-horizontal-collateral" size="large" form={form} onFinish={handleSubmit} layout="vertical">
        <Title level={3}>{`${props.id && props.adjustId ? 'Cập nhật' : 'Thêm mới'} phụ lục điều chỉnh`}</Title>
        <Row>
          <Col md={11}>
            <Form.Item label="Mã hợp đồng">
              <Input disabled value={collateral?.contractCode} className="w-100" />
            </Form.Item>
          </Col>
          <Col md={1} />
          <Col md={12}>
            <Form.Item label="Tên hợp đồng">
              <Input disabled value={collateral?.contractName} className="w-100" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={11}>
            <Form.Item label="Mã phụ lục" rules={[{ required: true, message: 'Vui lòng nhập mã phụ lục' }]} name={'addendumCode'}>
              <Input maxLength={255} className="w-100" placeholder="Nhập mã phụ lục" />
            </Form.Item>
          </Col>
          <Col md={1} />
          <Col md={12}>
            <Form.Item label="Tên phụ lục" rules={[{ required: true, message: 'Vui lòng nhập tên phụ lục' }]} name={'addendumName'}>
              <Input maxLength={255} className="w-100" placeholder="Nhập tên phụ lục" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={11}>
            <Form.Item
              initialValue={dayjs()}
              label="Hiệu lực từ ngày"
              rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
              name={'effectiveFrom'}
            >
              <DatePicker format={APP_LOCAL_DATE_FORMAT} size="large" className="w-100" placeholder="Chọn ngày bắt đầu" />
            </Form.Item>
          </Col>
          <Col md={1} />
          <Col md={12}>
            <Form.Item label="Hiệu lực đến ngày" name={'effectiveTo'}>
              <DatePicker
                disabledDate={current => {
                  return dayjs(effectiveFromValue).isAfter(current.subtract(1, 'days'));
                }}
                format={APP_LOCAL_DATE_FORMAT}
                size="large"
                className="w-100"
                placeholder="Chọn ngày kết thúc"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={11}>
            <Form.Item label="Số tiền vay (đ)" name={'loanAmount'} initialValue={detail?.loanAmount}>
              <InputNumber disabled formatter={formatVND} parser={parseFloatVND} className="w-100" placeholder="Nhập vào số tiền vay" />
            </Form.Item>
          </Col>
          <Col md={1}></Col>
          <Col md={12}>
            <Form.Item
              label={
                <div>
                  <span>Lãi suất danh nghĩa</span>
                  <span>(%/năm)</span>
                </div>
              }
              name={'interestNominal'}
              initialValue={0}
            >
              <InputNumber
                step={0.01}
                precision={2}
                formatter={formatVND}
                parser={parseFloatVND}
                className="w-100"
                placeholder="Nhập vào lãi suất danh nghĩa"
                min={0}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={11}>
            <Form.Item
              label={
                <div>
                  <span>Lãi suất thực tế</span>
                  <span>(%/năm)</span>
                </div>
              }
              name={'interestReality'}
              initialValue={0}
            >
              <InputNumber
                step={0.01}
                precision={2}
                formatter={formatVND}
                parser={parseFloatVND}
                className="w-100"
                placeholder="Nhập vào lãi suất thực tế"
                min={0}
              />
            </Form.Item>
          </Col>
          <Col md={1}></Col>
          <Col md={12}>
            <Form.Item label="Số tiền lãi (đ)" name={'interestAmount'} initialValue={0}>
              <InputNumber
                step={0.01}
                precision={2}
                formatter={formatVND}
                parser={parseFloatVND}
                className="w-100"
                placeholder="Nhập vào số tiền lãi"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={11}>
            <Form.Item
              label={
                <div>
                  <span>Tổng tiền gốc + lãi</span>
                  <span>(đ)</span>
                </div>
              }
              name={'totalInterest'}
              initialValue={0}
            >
              <InputNumber formatter={formatVND} parser={parseFloatVND} className="w-100" min={0} />
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

export default AppendixAustFormComponent;
