import { Button, Col, Collapse, CollapseProps, Form, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getDetailRepresentative } from 'app/shared/reducers/representative/form/representative.reducers';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import CapitalListComponent from './capital/list/capitalList';
import './style.scss';
import { convertDateTimeToDisplay } from 'app/shared/util/date-utils';
import { genderMapping } from 'app/shared/model/representative/form/form.modal';
import * as _ from 'lodash';
import { RepresentativeWorkType } from 'app/shared/enum/enum';

const RepresentativeFormDetailComponent = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { filter } = location.state || {};
  const { id } = useParams();
  const { data } = useAppSelector(state => state.representativeForm);

  useEffect(() => {
    innitData();
  }, []);

  useEffect(() => {
    if (data && id) {
      form.setFieldsValue({
        ...data,
        dob: dayjs(data.dob),
      });
    }
  }, [data]);

  const innitData = () => {
    // get detail
    dispatch(getDetailRepresentative(id));
  };

  const handleCancel = () => {
    navigate('/representative', {
      state: { filter },
    });
  };

  const renderModeView = () => {
    return (
      <div className="form-body">
        <Row>
          <Col md={12}>
            <Row className="items">
              <Col md={7} className="title">
                Họ tên:
              </Col>
              <Col md={16}>{data.name}</Col>
            </Row>
          </Col>
          <Col md={12}>
            <Row className="items">
              <Col md={7} className="title">
                Số điện thoại:
              </Col>
              <Col md={16}>{data.phoneNumber}</Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Row className="items">
              <Col md={7} className="title">
                Email:
              </Col>
              <Col md={16}>{data.email}</Col>
            </Row>
          </Col>
          <Col md={12}>
            <Row className="items">
              <Col md={7} className="title">
                Ngày sinh:
              </Col>
              <Col md={16}>{convertDateTimeToDisplay(data.dob)}</Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Row className="items">
              <Col md={7} className="title">
                CMND/ CCCD:
              </Col>
              <Col md={16}>{data.identifiedCard}</Col>
            </Row>
          </Col>
          <Col md={12}>
            <Row className="items">
              <Col md={7} className="title">
                Giới tính:
              </Col>
              <Col md={16}>{genderMapping[data.gender]}</Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md={24}>
            <Row className="items">
              <Col md={4} className="title">
                Công ty - Chức vụ:
              </Col>
              <Col md={20}>
                {_.orderBy(
                  data.works,
                  value => {
                    return value.type;
                  },
                  'asc',
                )?.map(item => {
                  return (
                    <Row key={item.companyId}>
                      <Col>
                        <span
                          className={`${item.type === RepresentativeWorkType.MAIN ? 'representative-main' : ''}`}
                        >{`${item.companyName} - ${item.role}`}</span>
                      </Col>
                    </Row>
                  );
                })}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  };

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: <span className="title">Thông tin chung</span>,
      children: renderModeView(),
    },
  ];

  return (
    <Container className="form-mode-view-represent">
      <Title level={3}>Xem danh sách đại diện vốn</Title>
      <Row className="w-100">
        <Collapse defaultActiveKey={'1'} className="w-100" items={items}></Collapse>
      </Row>
      <Row className="w-100">
        <Col md={24}>
          <CapitalListComponent />
        </Col>
      </Row>
      <Row className="action-form-horizontal" justify="end">
        <Col>
          <Button
            onClick={() => {
              handleCancel();
            }}
          >
            Đóng
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default RepresentativeFormDetailComponent;
