import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import Title from 'antd/es/typography/Title';
import { APP_LOCAL_DATE_FORMAT, DATE_FORMAT_PAYLOAD, numberRegex } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { GenderType, RepresentativeWorkType } from 'app/shared/enum/enum';
import { fetchAccountCode } from 'app/shared/reducers/account/account.reducer';
import { fetchCompany } from 'app/shared/reducers/company/company.reducer';
import {
  createRepresentative,
  getDetailRepresentative,
  updateRepresentative,
} from 'app/shared/reducers/representative/form/representative.reducers';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import { genderArray } from '../list/config';
import './style.scss';

const RepresentativeFormComponent = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { filter } = location.state || {};
  const { id } = useParams();
  const { data: dataCompany } = useAppSelector(state => state.company);
  const { data: detail } = useAppSelector(state => state.representativeForm);
  const [arrayBorrow, setArrayBorrow] = useState([]);
  const worksValue = Form.useWatch('works', form);

  useEffect(() => {
    innitData();
  }, []);

  useEffect(() => {
    if (detail && id) {
      form.setFieldsValue({
        ...detail,
        dob: dayjs(detail.dob),
      });
    }
  }, [detail]);

  useEffect(() => {
    if (dataCompany) {
      const lents = dataCompany
        .filter(x => x.isMember)
        ?.map((item: any) => {
          return {
            value: item.companyId,
            label: item.companyName,
          };
        });
      setArrayBorrow(lents);
    }
  }, [dataCompany]);

  const innitData = () => {
    // get detail
    if (id) {
      dispatch(getDetailRepresentative(id));
    } else {
      form.resetFields();
    }
    dispatch(fetchAccountCode());
    dispatch(fetchCompany());
  };

  const handleSubmit = values => {
    const payload = {
      ...values,
      dob: dayjs(values.dob).format(DATE_FORMAT_PAYLOAD),
      representativeId: id,
    };
    if (id) {
      dispatch(updateRepresentative(payload)).then(result => {
        if (result.payload) {
          handleClose();
        }
      });
    } else {
      dispatch(createRepresentative(payload)).then(result => {
        if (result.payload) {
          handleClose();
        }
      });
    }
  };

  const handleClose = () => {
    form.resetFields();
    navigate('/representative', {
      state: { filter },
    });
  };

  // Function to filter options based on the input value
  const filterOption = (inputValue, option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

  const handleRemoveArray = index => {
    if (worksValue && worksValue.length > 0) {
      if (worksValue[index].id) {
        worksValue[index].isDeleted = true;
      }
    }
    form.setFieldValue('works', worksValue);
  };

  return (
    <Container>
      <Form
        initialValues={{ works: [{ type: RepresentativeWorkType.MAIN }] }}
        className="multiple-form-horizontal-representative"
        size="large"
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Title level={3}>{`${id ? 'Cập nhật' : 'Thêm mới'} người đại diện`}</Title>
        <Row>
          <Col md={11}>
            <Form.Item label="Họ tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]} name={'name'}>
              <Input maxLength={255} className="w-100" placeholder="Nhập họ tên" />
            </Form.Item>
          </Col>
          <Col md={1} />
          <Col md={12}>
            <Form.Item
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                {
                  pattern: numberRegex,
                  message: 'Số điện thoại không hợp lệ',
                },
              ]}
              name={'phoneNumber'}
            >
              <Input maxLength={10} className="w-100" placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={11}>
            <Form.Item label="Email" name={'email'}>
              <Input type="email" maxLength={255} className="w-100" placeholder="Nhập người ký" />
            </Form.Item>
          </Col>
          <Col md={1} />
          <Col md={12}>
            <Form.Item label="Ngày sinh" name={'dob'}>
              <DatePicker
                disabledDate={current => {
                  return dayjs().diff(current, 'years') < 18;
                }}
                format={APP_LOCAL_DATE_FORMAT}
                size="large"
                className="w-100"
                placeholder="Chọn ngày sinh"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={11}>
            <Form.Item
              label="CMND/CCCD"
              rules={[
                {
                  pattern: numberRegex,
                  message: 'Số CMND/CCCD không hợp lệ',
                },
              ]}
              name={'identifiedCard'}
            >
              <Input maxLength={12} className="w-100" placeholder="Nhập CMND/CCCD" />
            </Form.Item>
          </Col>
          <Col md={1} />
          <Col md={12}>
            <Form.Item initialValue={GenderType.MALE} label="Giới tính" name="gender">
              <Select size="large" options={genderArray} placeholder="Chọn giới tính" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={24}>
            <Form.List name="works">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(
                    ({ key, name, ...restField }) =>
                      worksValue &&
                      worksValue.length > 0 &&
                      !worksValue[name].isDeleted && (
                        <div key={key} className="form-horizontal-representative">
                          <Row>
                            <Col md={11}>
                              <Form.Item
                                rules={[{ required: true, message: 'Vui lòng chọn công ty' }]}
                                label={name > 0 ? 'Công ty kiêm nhiệm' : 'Công ty làm việc chính'}
                                name={[name, 'companyId']}
                              >
                                <Select
                                  className="w-100"
                                  size="large"
                                  filterOption={filterOption}
                                  options={arrayBorrow}
                                  placeholder="Chọn chọn công ty"
                                />
                              </Form.Item>
                            </Col>

                            <Col md={1} />
                            <Col md={12}>
                              <Form.Item
                                label="Chức vụ"
                                rules={[{ required: true, message: 'Vui lòng nhập chức vụ' }]}
                                name={[name, 'role']}
                              >
                                <Input className="w-100" size="large" placeholder="nhập chức vụ" />
                              </Form.Item>
                            </Col>
                          </Row>
                          {name > 0 && (
                            <MinusCircleOutlined
                              className="minus-circle-outlined"
                              onClick={() => {
                                worksValue && worksValue[name].id ? handleRemoveArray(name) : remove(name);
                              }}
                            />
                          )}
                        </div>
                      ),
                  )}
                  <Form.Item>
                    <PlusCircleOutlined
                      className="plus-circle-outlined"
                      onClick={() => {
                        add({
                          type: RepresentativeWorkType.Concurrently,
                        });
                      }}
                    />{' '}
                    Thêm kiêm nhiệm
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
        </Row>

        <Form.Item>
          <Row className="action-form-horizontal" justify="end">
            <Col>
              {
                <Button type="primary" htmlType="submit">
                  Lưu
                </Button>
              }
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

export default RepresentativeFormComponent;
