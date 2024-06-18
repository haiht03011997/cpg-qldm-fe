import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, notification } from 'antd';
import Title from 'antd/es/typography/Title';
import { APP_LOCAL_DATE_FORMAT, DATE_FORMAT_PAYLOAD, DATE_TIME_FORMAT_PAYLOAD } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IOptionProps } from 'app/shared/model/modal';
import { fetchAccountCode } from 'app/shared/reducers/account/account.reducer';
import { createCollateral, getDetailCollateral, updateCollateral } from 'app/shared/reducers/collateral/form/collateral.reducers';
import { fetchCompany } from 'app/shared/reducers/company/company.reducer';
import { fetchPortfolioByAccountId } from 'app/shared/reducers/portfolio/portfolio.reducer';
import { formatVND, parseFloatVND, parseVND } from 'app/shared/util/money-utils';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { handlePopupScroll } from 'app/shared/util/select-utils';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import AppendixListComponent from './appendix/list/appendixList';
import './style.scss';
import { fetchAvailableVolumeStock } from 'app/shared/reducers/stock/stock.reducer';
import { StatusCollateralType } from 'app/shared/enum/enum';

const CollateralFormComponent = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { filter } = location.state || {};
  const { id } = useParams();
  const { data: dataAccount } = useAppSelector(state => state.account);
  const { data: dataCompany } = useAppSelector(state => state.company);
  const { data: detail } = useAppSelector(state => state.collateralForm);
  const { page, total: totalPagesStock } = useAppSelector(state => state.stock);
  const [editMode] = useState(true);
  const [arrayBorrow, setArrayBorrow] = useState([]);
  const [arrayStock, setArrayStock] = useState<IOptionProps[][]>([]);
  const [availableVolumes, setAvailableVolume] = useState<number[][]>([]);
  const [currentPageStock, setCurrentPageStock] = useState(page);
  const [idTKCKSelected, setIdTKCKSelected] = useState(null);

  // watch data
  const effectiveFromValue = Form.useWatch('effectiveFrom', form);

  useEffect(() => {
    innitData();
  }, []);

  useEffect(() => {
    if (detail && id) {
      form.setFieldsValue({
        ...detail,
        interestRated: detail.interestRated * 100,
        effectiveFrom: dayjs(detail.effectiveFrom),
        effectiveTo: dayjs(detail.effectiveTo),
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
      dispatch(getDetailCollateral(id));
    } else {
      form.resetFields();
    }
    dispatch(fetchAccountCode());
    dispatch(fetchCompany());
  };

  const handleSubmit = values => {
    const payload = {
      ...values,
      collateralId: id,
      interestRated: values.interestRated / 100,
      effectiveFrom: dayjs(values.effectiveFrom.format(DATE_TIME_FORMAT_PAYLOAD)),
      effectiveTo: dayjs(values.effectiveTo.format(DATE_TIME_FORMAT_PAYLOAD)),
      status: dayjs(values.effectiveFrom.format(DATE_TIME_FORMAT_PAYLOAD)).isAfter(dayjs().format(DATE_TIME_FORMAT_PAYLOAD))
        ? StatusCollateralType.EXPIRED
        : values.status,
    };
    if (id) {
      dispatch(updateCollateral(payload)).then(result => {
        if (result.payload) {
          handleClose();
        }
      });
    } else {
      dispatch(createCollateral(payload)).then(result => {
        if (result.payload) {
          handleClose();
        }
      });
    }
  };

  const handleClose = () => {
    form.resetFields();
    navigate('/collateral', {
      state: { filter },
    });
  };

  // Function to filter options based on the input value
  const filterOption = (inputValue, option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

  const fetchPortfolio = async (name, idTkCK: number, pageNumber = 1) => {
    const response = await dispatch(fetchPortfolioByAccountId({ page: pageNumber, limit: ITEMS_PER_PAGE, accountId: idTkCK }));
    if (response.payload) {
      const result = response.payload as any;
      if (result.data) {
        const stocks = result.data?.data.map(x => {
          return {
            value: x.stockSymbol,
            label: x.stockSymbol,
          };
        });
        const cloneArr = [...arrayStock];
        let newStocks = pageNumber > 1 ? [...cloneArr[name]] ?? [] : [];
        newStocks = newStocks.concat(stocks);
        cloneArr[name] = newStocks;
        setArrayStock(cloneArr);
      }
    }
  };

  const handleChangeTKCK = (value, name) => {
    setIdTKCKSelected(value);
    fetchPortfolio(name, value);
  };

  const handlePopupScrollStock = (e, name) => {
    const currentPage = handlePopupScroll({ e, currentPage: currentPageStock, totalPages: totalPagesStock });
    if (currentPage) {
      setCurrentPageStock(currentPage);
      fetchPortfolio(name, idTKCKSelected, currentPage);
    }
  };

  const handleChangeStock = async (value, name) => {
    const response = await dispatch(fetchAvailableVolumeStock({ stockAccountId: idTKCKSelected, stockSymbol: value }));
    if (response.payload) {
      const result = response.payload as any;
      if (result.data) {
        const newArrayAvailable = [...availableVolumes];
        newArrayAvailable[name] = result.data.availableVolume;
        setAvailableVolume(newArrayAvailable);
      }
    }
  };

  return (
    <Container>
      <Form
        initialValues={{ assetCollaterals: [{}] }}
        className="multiple-form-horizontal-collateral"
        size="large"
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Title level={3}>{`${id ? 'Cập nhật' : 'Thêm mới'} hợp đồng cầm cố`}</Title>
        <Row>
          <Col md={11}>
            <Form.Item label="Mã hợp đồng" rules={[{ required: true, message: 'Vui lòng nhập mã hợp đồng' }]} name={'contractCode'}>
              <Input disabled={!editMode} maxLength={255} className="w-100" placeholder="Nhập mã hợp đồng" />
            </Form.Item>
          </Col>
          <Col md={1} />
          <Col md={12}>
            <Form.Item label="Tên hợp đồng" rules={[{ required: true, message: 'Vui lòng nhập tên hợp đồng' }]} name={'contractName'}>
              <Input disabled={!editMode} maxLength={255} className="w-100" placeholder="Nhập tên hợp đồng" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={11}>
            <Form.Item
              label="Tổ chức cho vay"
              rules={[{ required: true, message: 'Vui lòng chọn tổ chức cho vay' }]}
              name="collateralCompanyId"
            >
              <Select
                showSearch
                disabled={!editMode}
                size="large"
                filterOption={filterOption}
                options={dataCompany.map((item: any) => {
                  return {
                    value: item.companyId,
                    label: item.companyName,
                  };
                })}
                placeholder="Chọn tổ chức cho vay"
              />
            </Form.Item>
          </Col>
          <Col md={1} />
          <Col md={12}>
            <Form.Item label="Đơn vị vay" rules={[{ required: true, message: 'Vui lòng chọn đơn vị cho vay' }]} name="borrowCompanyId">
              <Select
                showSearch
                size="large"
                disabled={!editMode}
                filterOption={filterOption}
                options={arrayBorrow}
                placeholder="Chọn đơn vị vay"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={11}>
            <Form.Item label="Người ký" name={'signedBy'}>
              <Input disabled={!editMode} maxLength={255} className="w-100" placeholder="Nhập người ký" />
            </Form.Item>
          </Col>
          <Col md={1} />
          <Col md={12}>
            <Form.Item label="Chức vụ" name={'position'}>
              <Input disabled={!editMode} maxLength={255} className="w-100" placeholder="Nhập chức vụ" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={11}>
            <Form.Item
              initialValue={dayjs()}
              label="Hiệu lực từ ngày"
              rules={[{ required: true, message: 'Vui lòng chọn' }]}
              name={'effectiveFrom'}
            >
              <DatePicker
                disabled={!editMode}
                format={APP_LOCAL_DATE_FORMAT}
                size="large"
                className="w-100"
                placeholder="Chọn ngày bắt đầu"
              />
            </Form.Item>
          </Col>
          <Col md={1} />
          <Col md={12}>
            <Form.Item label="Hiệu lực đến ngày" rules={[{ required: true, message: 'Vui lòng chọn' }]} name={'effectiveTo'}>
              <DatePicker
                disabled={!editMode}
                format={APP_LOCAL_DATE_FORMAT}
                size="large"
                disabledDate={currentDate => {
                  return dayjs(effectiveFromValue).isAfter(currentDate.subtract(1, 'days'));
                }}
                className="w-100"
                placeholder="Chọn ngày kết thúc"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={11}>
            <Form.Item
              label={
                <div>
                  <span>Hạn mức</span>
                  <span>(đ)</span>
                </div>
              }
              name={'maximumLoan'}
              rules={[{ required: true, message: 'Vui lòng nhập hạn mức' }]}
              initialValue={0}
            >
              <InputNumber disabled={!editMode} formatter={formatVND} parser={parseVND} className="w-100" placeholder="Nhập vào hạn mức" />
            </Form.Item>
          </Col>
          <Col md={1}></Col>
          <Col md={12}>
            <Form.Item
              label={
                <div>
                  <span>Lãi suất áp dụng</span>
                  <span>(%/Năm)</span>
                </div>
              }
              name={'interestRated'}
              rules={[{ required: true, message: 'Vui lòng nhập lãi suất' }]}
              initialValue={0}
            >
              <InputNumber
                disabled={!editMode}
                step={0.01}
                precision={2}
                formatter={formatVND}
                parser={parseFloatVND}
                className="w-100"
                placeholder="Nhập vào lãi suât"
                min={0}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={24}>
            <Form.Item label="Danh sách tài sản cầm cố">
              <Form.List name="assetCollaterals">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} className="form-horizontal">
                        <Row>
                          <Col md={5}>
                            <Form.Item
                              rules={[{ required: true, message: 'Vui lòng chọn tài khoản sở hữu' }]}
                              label="Tài khoản sở hữu"
                              name={[name, 'accountId']}
                            >
                              <Select
                                disabled={!editMode}
                                className="w-100"
                                size="large"
                                filterOption={filterOption}
                                options={dataAccount.map((item: any) => {
                                  return {
                                    value: item.accountId,
                                    label: `${item.companyName}-${item.accountOwnerName}-${item.accountNumber}`,
                                  };
                                })}
                                onChange={e => {
                                  handleChangeTKCK(e, name);
                                }}
                                placeholder="Chọn tài khoản sở hữu"
                              />
                            </Form.Item>
                          </Col>
                          <Col md={1} />
                          <Col md={5}>
                            <Form.Item
                              label="Mã CP"
                              rules={[{ required: true, message: 'Hãy chọn mã cổ phiếu' }]}
                              name={[name, 'stockSymbol']}
                            >
                              <Select
                                size="large"
                                className="w-100"
                                onPopupScroll={e => {
                                  handlePopupScrollStock(e, name);
                                }}
                                onChange={e => {
                                  handleChangeStock(e, name);
                                }}
                                options={arrayStock[name]}
                                placeholder="Chọn mã cổ phiếu"
                              />
                            </Form.Item>
                          </Col>
                          <Col md={1} />
                          <Col md={5}>
                            <Form.Item
                              label="Khối lượng"
                              rules={[{ required: true, message: 'Vui lòng nhập khối lượng' }]}
                              name={[name, 'stockVolume']}
                            >
                              <InputNumber
                                disabled={!editMode}
                                className="w-100"
                                size="large"
                                formatter={formatVND}
                                parser={parseVND}
                                max={availableVolumes[name]}
                                placeholder={`${
                                  availableVolumes[name] ? `KL tối đa: ${formatVND(availableVolumes[name])}` : 'Nhập khối lượng'
                                }`}
                              />
                            </Form.Item>
                          </Col>
                          <Col md={1} />
                          <Col md={5}>
                            <Form.Item label="Giá trị tài sản (đ)" name={[name, 'assetValue']}>
                              <InputNumber
                                disabled={!editMode}
                                className="w-100"
                                size="large"
                                step={0.01}
                                precision={2}
                                formatter={formatVND}
                                parser={parseFloatVND}
                                placeholder="Nhập giá trị tài sản"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        {fields.length > 1 && (
                          <MinusCircleOutlined
                            className="minus-circle-outlined"
                            onClick={() => {
                              editMode && remove(name);
                            }}
                          />
                        )}
                      </div>
                    ))}
                    <Form.Item>
                      <PlusCircleOutlined
                        className="plus-circle-outlined"
                        onClick={() => {
                          editMode && add();
                        }}
                      />
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
          </Col>
        </Row>
        {!editMode && (
          <Form.Item label="Danh sách phụ lục hợp đồng">
            <AppendixListComponent />
          </Form.Item>
        )}
        <Form.Item>
          <Row className="action-form-horizontal" justify="end">
            <Col>
              {editMode && (
                <Button type="primary" htmlType="submit">
                  Lưu
                </Button>
              )}
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

export default CollateralFormComponent;
