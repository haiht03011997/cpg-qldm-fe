import { Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import Title from 'antd/es/typography/Title';
import { APP_LOCAL_DATE_FORMAT, DATE_TIME_FORMAT_PAYLOAD } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchMemberCompany } from 'app/shared/reducers/company/member/company.member.reducer';
import {
  createCapitalRepresentative,
  getDetailCapitalRepresentative,
  updateCapitalRepresentative,
} from 'app/shared/reducers/representative/form/capitalRepresentative/form/capitalRepresentative.reducers';
import { formatVND, parseFloatVND } from 'app/shared/util/money-utils';
import dayjs from 'dayjs';
import * as _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './style.scss';
import {
  fetchCapitalRepresentativeReplace,
  fetchCapitalRepresentativeReplaceByReplaceId,
} from 'app/shared/reducers/representative/form/capitalRepresentative/view/replace/capitalRepresentativeReplace.reduces';
import { StatusRepresentativeType } from 'app/shared/enum/enum';

type ICapitalModal = {
  isOpen: boolean;
  onCancel: (reloaded?: boolean) => void;
  id?: number;
};

const CapitalFormComponent = (props: ICapitalModal) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [isDisabled, setIsDisabled] = useState(false);
  const [representativeReplaces, setRepresentativeReplaces] = useState([]);
  const [replaces, setReplace] = useState([]);
  const [role, setRole] = useState(null);
  const { data: detail } = useAppSelector(state => state.capitalRepresentativeForm);
  const { data: memberCompany, page: currentPageMemberCompany } = useAppSelector(state => state.memberCompany);
  const { data: dataReplace } = useAppSelector(state => state.capitalRepresentativeReplaceView);
  const { data: representativeForm } = useAppSelector(state => state.representativeForm);
  const { data: representativeList } = useAppSelector(state => state.capitalRepresentativeView);

  // watch data
  const effectDateFromValue = Form.useWatch('effectDateFrom', form);
  const representativeWorkIdValue = Form.useWatch('representativeWorkId', form);

  useEffect(() => {
    if (detail && props.id) {
      const check = _.some(representativeList, x => {
        return x.unInvestId;
      });
      setIsDisabled(check);
      if (detail.replaceId !== null && detail.replaceId !== '' && detail.replaceId !== undefined) {
        fetchCapitalRepresentativeByReplaceId(detail.replaceId);
      }
      if (detail.companyId) {
        dispatch(fetchCapitalRepresentativeReplace({ id, companyId: detail.companyId }));
      }
      form.setFieldsValue({
        ...detail,
        representativeId: id,
        effectDateFrom: dayjs(detail.effectDateFrom),
        effectDateTo: detail.effectDateTo && dayjs(detail.effectDateTo),
        signedDate: detail.signedDate && dayjs(detail.signedDate),
      });
    } else {
      form.resetFields();
    }
  }, [detail]);

  useEffect(() => {
    if (props.id) {
      dispatch(getDetailCapitalRepresentative(props.id));
    }
    dispatch(fetchMemberCompany(currentPageMemberCompany));
  }, [props.id]);

  useEffect(() => {
    const capitalRepresentativeReplace = _.filter(dataReplace, item => {
      return item.capitalRepresentativeId !== props.id;
    });
    setReplace(_.concat(representativeReplaces, capitalRepresentativeReplace));
  }, [dataReplace, representativeReplaces]);

  useEffect(() => {
    if (representativeWorkIdValue) {
      setRole(
        _.find(representativeForm.works, x => {
          return x.id === representativeWorkIdValue;
        })?.role,
      );
    }
  }, [representativeWorkIdValue]);

  const handleSubmit = values => {
    const payload = {
      ...values,
      capitalRepresentativeId: props.id && detail.capitalRepresentativeId,
      representativeId: id,
      effectDateFrom: dayjs(values.effectDateFrom.format(DATE_TIME_FORMAT_PAYLOAD)),
      effectDateTo: values.effectDateTo && dayjs(values.effectDateTo.format(DATE_TIME_FORMAT_PAYLOAD)),
      signedDate: values.signedDate && dayjs(values.signedDate.format(DATE_TIME_FORMAT_PAYLOAD)),
      status: dayjs(values.effectDateTo.format(DATE_TIME_FORMAT_PAYLOAD)).isBefore(dayjs(dayjs().format(DATE_TIME_FORMAT_PAYLOAD)))
        ? StatusRepresentativeType.EXPIRED
        : values.status,
    };
    if (props.id) {
      dispatch(updateCapitalRepresentative(payload)).then(result => {
        if (result.payload) {
          handleClose(true);
        }
      });
    } else {
      dispatch(createCapitalRepresentative(payload)).then(result => {
        if (result.payload) {
          handleClose(true);
        }
      });
    }
  };

  const handleClose = (reloaded = false) => {
    form.resetFields();
    props.onCancel(reloaded);
    setIsDisabled(false);
    setRepresentativeReplaces([]);
  };

  // Function to filter options based on the input value
  const filterOption = (inputValue, option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

  const handleChangeMemberCompany = value => {
    if (value && !props.id) {
      dispatch(fetchCapitalRepresentativeReplace({ id, companyId: value }));
    }
  };

  const fetchCapitalRepresentativeByReplaceId = async (ids: string) => {
    const response = await dispatch(fetchCapitalRepresentativeReplaceByReplaceId(ids));
    if (response) {
      const result = response.payload as any;
      if (result.data) {
        setRepresentativeReplaces(result.data);
      }
    }
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
        <Title level={3}>{`${props.id ? 'Cập nhật' : 'Thêm mới'} quyết định ủy quyền người đại diện`}</Title>
        <Row>
          <Col md={11}>
            <Form.Item label="Số quyết định" rules={[{ required: true, message: 'Vui lòng nhập số quyết định' }]} name="decisionNumber">
              <Input maxLength={255} className="w-100" placeholder="Nhập só quyết định" />
            </Form.Item>
          </Col>
          <Col md={1} />
          <Col md={12}>
            <Form.Item label="Công ty cử đại diện" name={'representativeWorkId'}>
              <Select
                showSearch
                disabled={isDisabled}
                size="large"
                filterOption={filterOption}
                options={representativeForm?.works?.map(x => {
                  return {
                    label: x.companyName,
                    value: x.id,
                  };
                })}
                placeholder="Chọn công ty"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={11}>
            <Form.Item label="Họ tên">
              <Input disabled value={representativeForm.name} className="w-100" />
            </Form.Item>
          </Col>
          <Col md={1} />
          <Col md={12}>
            <Form.Item label="Chức vụ">
              <Input disabled value={role} className="w-100" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={24}>
            <Form.Item label="Đại diện tại công ty" name={'companyId'}>
              <Select
                showSearch
                disabled={isDisabled}
                size="large"
                filterOption={filterOption}
                options={memberCompany}
                placeholder="Chọn đại diện tại công ty"
                onChange={value => {
                  handleChangeMemberCompany(value);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={11}>
            <Form.Item label="Số vốn đại diện (đ)" name={'capitalAmount'} initialValue={0}>
              <InputNumber formatter={formatVND} parser={parseFloatVND} className="w-100" min={0} placeholder="Nhập số vốn đại diện" />
            </Form.Item>
          </Col>
          <Col md={1} />
          <Col md={12}>
            <Form.Item label="Tỷ lệ đại diện (%)" name={'percentage'}>
              <InputNumber
                step={0.01}
                precision={2}
                formatter={formatVND}
                parser={parseFloatVND}
                className="w-100"
                placeholder="Nhập tỷ lệ đại diện"
                min={0}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={11}>
            <Form.Item
              initialValue={dayjs()}
              label="Hiệu lực từ ngày"
              rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
              name={'effectDateFrom'}
            >
              <DatePicker format={APP_LOCAL_DATE_FORMAT} size="large" className="w-100" placeholder="Chọn ngày bắt đầu" />
            </Form.Item>
          </Col>
          <Col md={1} />
          <Col md={12}>
            <Form.Item label="Hiệu lực đến ngày" name={'effectDateTo'}>
              <DatePicker
                disabledDate={currentDate => {
                  return dayjs(effectDateFromValue).isAfter(currentDate.subtract(1, 'days'));
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
        <Row>
          <Col>
            <Form.Item name="capitalRepresentativeReplaces" label="Quyết định này thay thế cho QĐ số">
              <Checkbox.Group>
                <Row>
                  {replaces.map(item => {
                    return (
                      <Checkbox key={item} value={item.capitalRepresentativeId}>
                        {item.decisionNumber}
                      </Checkbox>
                    );
                  })}
                </Row>
              </Checkbox.Group>
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

export default CapitalFormComponent;
