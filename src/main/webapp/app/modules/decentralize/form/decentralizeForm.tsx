import { Button, Col, Collapse, CollapseProps, Form, Row, Tooltip, Tree } from 'antd';
import Title from 'antd/es/typography/Title';
import { useAppDispatch } from 'app/config/store';
import { IDecentralize } from 'app/shared/model/decentralize/form/form.modal';
import { IUser } from 'app/shared/model/user.model';
import { buildTreeSecurityCompanies } from 'app/shared/reducers/company/tree/securities.reducer';
import { getDetailDecentralize, updateDecentralize } from 'app/shared/reducers/decentralize/form/decentralize.reduces';
import { getUsers } from 'app/shared/reducers/user/user.reducer';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import './style.scss';
import DecentralizeFuncForm from './functions/decentralizeFuncForm';
import DecentralizeSecurityCompanyForm from './records/security/decentralizeSecurityForm';
import DecentralizeMemberCompanyForm from './records/member/decentralizeMemberForm';
import { buildTreeMemberCompanies } from 'app/shared/reducers/company/tree/members.reducer';

const DecentralizeFormComponent = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [account, setAccount] = useState<IUser>();
  const [payloadSecurity, setPayloadSecurity] = useState<IDecentralize[]>([]);
  const [payloadMember, setPayloadMember] = useState<IDecentralize[]>([]);
  const [payloadFunc, setPayloadFunc] = useState<IDecentralize[]>([]);

  useEffect(() => {
    innitData();
  }, []);

  useEffect(() => {
    if (account) {
      dispatch(getDetailDecentralize(account.userLogin));
    }
  }, [account]);

  const innitData = () => {
    dispatch(buildTreeSecurityCompanies());
    dispatch(buildTreeMemberCompanies());
    // get detail
    if (id) {
      handleGetInfoUser();
    }
  };

  const handleGetInfoUser = async () => {
    const response: any = await dispatch(getUsers(id));
    if (response && response.payload) {
      setAccount(response.payload.data);
    }
  };

  const handleSubmit = () => {
    if (payloadFunc.length > 0 || payloadMember.length > 0 || payloadSecurity.length > 0) {
      const payload = payloadFunc.concat(payloadMember).concat(payloadSecurity);
      dispatch(updateDecentralize(payload)).then(result => {
        if (result.payload) {
          handleClose();
        }
      });
    }
  };

  const handleClose = () => {
    navigate('/decentralize');
  };

  const handlePayloadFunc = (value: IDecentralize[]) => {
    setPayloadFunc(value);
  };

  const handlePayloadSecurity = (value: IDecentralize[]) => {
    setPayloadSecurity(value);
  };

  const handlePayloadMember = (value: IDecentralize[]) => {
    setPayloadMember(value);
  };

  const itemCollapse: CollapseProps['items'] = [
    {
      key: '1',
      label: <span className="title">Chức năng</span>,
      children: <DecentralizeFuncForm handlePayload={handlePayloadFunc} userLogin={account?.userLogin} />,
    },
    {
      key: '2',
      label: (
        <span className="title">
          Danh sách công ty chứng khoán{' '}
          <Tooltip
            title={
              <span className="title">{`Hãy chọn những tài khoản chứng khoán mà ${account?.userName}
                        được phép tương tác ở chức năng Danh mục đầu tư và Quản lý danh mục`}</span>
            }
          >
            <img className="icon" src="content/images/icons/circle-info-solid.svg" />
          </Tooltip>
        </span>
      ),
      children: <DecentralizeSecurityCompanyForm handlePayload={handlePayloadSecurity} userLogin={account?.userLogin} />,
    },
    {
      key: '3',

      label: (
        <span className="title">
          Danh sách công ty sở hữu{' '}
          <Tooltip
            title={
              <span className="title">{`Hãy chọn công ty sở hữu mà ${account?.userName}
                              được phép tương tác ở chức năng Quản lý cầm cố`}</span>
            }
          >
            <img className="icon" src="content/images/icons/circle-info-solid.svg" />
          </Tooltip>
        </span>
      ),
      children: <DecentralizeMemberCompanyForm handlePayload={handlePayloadMember} userLogin={account?.userLogin} />,
    },
  ];

  return (
    <Container>
      <Form className="multiple-form-horizontal-decentralize" size="large" form={form} onFinish={handleSubmit} layout="vertical">
        <Title level={3}>{`Cập nhật phân quyền cho ${account?.userName}`}</Title>
        <Form.Item>
          <Collapse defaultActiveKey={'1'} className="w-100" items={itemCollapse}></Collapse>
        </Form.Item>
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
    </Container>
  );
};
export default DecentralizeFormComponent;
