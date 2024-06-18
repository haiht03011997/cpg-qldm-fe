import { Button, Col, Collapse, CollapseProps, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import { useAppSelector } from 'app/config/store';
import { convertDateTimeToDisplay } from 'app/shared/util/date-utils';
import { formatVND } from 'app/shared/util/money-utils';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';
import AppendixListComponent from './appendix/list/appendixList';
import './style.scss';
import * as _ from 'lodash';

const CollateralFormDetailComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { filter } = location.state || {};
  const { data } = useAppSelector(state => state.collateralForm);
  const { data: dataAppend } = useAppSelector(state => state.contractAddendumCollateralView);

  const handleCancel = () => {
    navigate('/collateral', {
      state: { filter },
    });
  };

  const renderInformation = () => {
    return (
      <div className="form-body">
        <Row>
          <Col md={12}>
            <Row className="items">
              <Col md={7} className="title">
                Mã hợp đồng:
              </Col>
              <Col md={16}>{data.contractCode}</Col>
            </Row>
          </Col>
          <Col md={12}>
            <Row className="items">
              <Col md={8} className="title">
                Tên hợp đồng:
              </Col>
              <Col md={15}>{data.contractName}</Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Row className="items">
              <Col md={7} className="title">
                Tổ chức cho vay:
              </Col>
              <Col md={16}>{data.collateralCompanyName}</Col>
            </Row>
          </Col>
          <Col md={12}>
            <Row className="items">
              <Col md={8} className="title">
                Đơn vị vay:
              </Col>
              <Col md={15}>{data.borrowCompanyName}</Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Row className="items">
              <Col md={7} className="title">
                Người ký:
              </Col>
              <Col md={16}>{data.signedBy}</Col>
            </Row>
          </Col>
          <Col md={12}>
            <Row className="items">
              <Col md={8} className="title">
                Chức vụ:
              </Col>
              <Col md={15}>{data.position}</Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Row className="items">
              <Col md={7} className="title">
                Hiệu lực từ ngày:
              </Col>
              <Col md={16}>{convertDateTimeToDisplay(data.effectiveFrom)}</Col>
            </Row>
          </Col>
          <Col md={12}>
            <Row className="items">
              <Col md={8} className="title">
                Hiệu lực đến ngày:
              </Col>
              <Col md={15}>{convertDateTimeToDisplay(data.effectiveTo)}</Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Row className="items">
              <Col md={7} className="title">
                Hạn mức (đ):
              </Col>
              <Col md={16}>{formatVND(data.maximumLoan)}</Col>
            </Row>
          </Col>
          {/* <Col md={12}>
            <Row className="items">
              <Col md={8} className="title">
                LS áp dụng (%/Năm):
              </Col>
              <Col md={15}>{formatVND(data.interestRated)}</Col>
            </Row>
          </Col> */}
        </Row>
        <Row>
          <Col md={12}>
            <Row className="items">
              <Col md={7} className="title">
                Tổng giá trị tài sản cầm cố(đ):
              </Col>
              <Col md={16}>{formatVND(data.sumAssetValue)}</Col>
            </Row>
          </Col>
          <Col md={12}>
            <Row className="items">
              <Col md={8} className="title">
                Số tiền đã giải ngân (đ):
              </Col>
              <Col md={15}>
                {formatVND(
                  _.sumBy(dataAppend, (item: any) => {
                    if (!item.parentContractAddendumCollateralId) {
                      return item?.loanAmount;
                    }
                  }),
                )}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Row className="items">
              <Col md={7} className="title">
                Tổng tiền lãi(đ):
              </Col>
              <Col md={16}>
                {formatVND(
                  _.sumBy(dataAppend, (item: any) => {
                    if (!item.parentContractAddendumCollateralId) {
                      return item?.interestAmountByDay;
                    }
                  }),
                )}
              </Col>
            </Row>
          </Col>
          <Col md={12}>
            <Row className="items">
              <Col md={8} className="title">
                Gốc + lãi (đ):
              </Col>
              <Col md={15}>
                {formatVND(
                  _.sumBy(dataAppend, (item: any) => {
                    if (!item.parentContractAddendumCollateralId) {
                      return item?.loanAmount;
                    }
                  }) +
                    _.sumBy(dataAppend, (item: any) => {
                      if (!item.parentContractAddendumCollateralId) {
                        return item?.interestAmountByDay;
                      }
                    }),
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  };

  const renderAssetCollaterals = () => {
    {
      return data.assetCollaterals?.map(asset => {
        return (
          <div key={asset.assetCollateralId} className="form-body">
            <Row>
              <Col md={12}>
                <Row className="items">
                  <Col md={7} className="title">
                    Tài khoản sở hữu:
                  </Col>
                  <Col md={16}>{asset.accountName}</Col>
                </Row>
              </Col>
              <Col md={12}>
                <Row className="items">
                  <Col md={8} className="title">
                    Mã cổ phiếu:
                  </Col>
                  <Col md={15}>{asset.stockSymbol}</Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Row className="items">
                  <Col md={7} className="title">
                    Khối lượng:
                  </Col>
                  <Col md={16}>{formatVND(asset.stockVolume)}</Col>
                </Row>
              </Col>
              <Col md={12}>
                <Row className="items">
                  <Col md={8} className="title">
                    Giá trị tài sản (đ):
                  </Col>
                  <Col md={15}>{asset.assetValue && formatVND(asset.assetValue)}</Col>
                </Row>
              </Col>
            </Row>
          </div>
        );
      });
    }
  };

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: <span className="title">Thông tin chung</span>,
      children: renderInformation(),
    },
    {
      key: '2',
      label: <span className="title">Danh sách tài sản cầm cố</span>,
      children: renderAssetCollaterals(),
    },
  ];

  return (
    <Container className="form-mode-view-collateral">
      <Title level={3}>Xem danh sách phụ lục hợp đồng</Title>
      <Row className="w-100">
        <Collapse defaultActiveKey={'1'} className="w-100" items={items}></Collapse>
      </Row>
      <Row className="w-100">
        <Col md={24}>
          <AppendixListComponent />
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

export default CollateralFormDetailComponent;
