import { Button, Checkbox, Col, DatePicker, Form, InputNumber, Row, Select } from 'antd';
import Title from 'antd/es/typography/Title';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT, DATE_FORMAT_PAYLOAD, DATE_TIME_FORMAT_PAYLOAD } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { TransactionType } from 'app/shared/enum/enum';
import { IOptionProps } from 'app/shared/model/modal';
import { fetchAccountBySecuritiesCompany } from 'app/shared/reducers/account/account.reducer';
import { fetchSecuritiesCompany } from 'app/shared/reducers/company/company.reducer';
import { fetchConfigTransactionType } from 'app/shared/reducers/config/config.reducer';
import { fetchPortfolioByAccountId } from 'app/shared/reducers/portfolio/portfolio.reducer';
import { fetchStock } from 'app/shared/reducers/stock/stock.reducer';
import { createTransaction, getDetailTransaction, updateTransaction } from 'app/shared/reducers/transaction/form/transaction.reduces';
import { fetchTransactionType } from 'app/shared/reducers/transaction/type/transactionType.reducer';
import { handleBeforeunload } from 'app/shared/util/help';
import { formatVND, parseFloatVND, parseVND } from 'app/shared/util/money-utils';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { handlePopupScroll } from 'app/shared/util/select-utils';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import './style.scss';

// Extend Day.js with the UTC plugin

const TransactionDetailFormComponent = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { filter } = location.state || {};
  const { id } = useParams();
  const { data: transactionType } = useAppSelector(state => state.transactionType);
  const { dataSecurities } = useAppSelector(state => state.company);
  const { data: stock, page, total: totalPagesStock } = useAppSelector(state => state.stock);
  const { data: detail } = useAppSelector(state => state.transactionForm);
  const [currentPageStock, setCurrentPageStock] = useState(page);
  const [arrayStock, setArrayStock] = useState<IOptionProps[]>([]);
  const [securitiesCompany, setSecuritiesCompany] = useState<IOptionProps[]>([]);
  const [isChecked, setIsChecked] = useState(false); // Initial state

  // watch data
  const transactionTypeSelected = Form.useWatch('transactionTypeId', form);
  const volumeValue = Form.useWatch('volume', form);
  const marketPriceValue = Form.useWatch('marketPrice', form);
  const feeValue = Form.useWatch('fee', form);
  const taxValue = Form.useWatch('tax', form);
  const stockAccountIdValue = Form.useWatch('stockAccountId', form);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    innitData();
  }, []);

  useEffect(() => {
    if (!isDirty) return;
    // window.history.pushState(null, null, window.location.pathname);
    // Attach the event listener when the component mounts
    window.addEventListener('beforeunload', handleBeforeunload);
    // window.addEventListener('popstate', onBackButtonEvent);
    return () => {
      // Cleanup sự kiện khi component unmount
      // window.removeEventListener('popstate', onBackButtonEvent);
      window.removeEventListener('beforeunload', handleBeforeunload);
    };
  }, [isDirty]);

  useEffect(() => {
    if (detail && id) {
      setIsChecked(detail.isLimited);
      if (detail.securitiesCompanyId) {
        fetchAccountSecurities(detail.securitiesCompanyId);
      }
      if (detail.stockAccountId) {
        fetchPortfolio(detail.stockAccountId);
      }
      form.setFieldsValue({
        ...detail,
        limitedTill: detail.limitedTill && dayjs(detail.limitedTill),
        marketPrice: detail.marketPrice && detail.marketPrice / 1000,
        date: detail.date && dayjs(detail.date),
      });
    } else {
      form.resetFields();
    }
  }, [detail]);

  useEffect(() => {
    let totalPrice = 0;
    if (transactionTypeSelected) {
      if (transactionTypeSelected !== TransactionType.SELL) {
        totalPrice = (volumeValue ?? 0) * ((marketPriceValue ?? 0) * 1000) * (1 + (feeValue ?? 0) / 100 + (taxValue ?? 0.15) / 100);
      } else {
        totalPrice =
          (volumeValue ?? 0) * ((marketPriceValue ?? 0) * 1000) -
          (volumeValue ?? 0) * ((marketPriceValue ?? 0) * 1000) * ((feeValue ?? 0) / 100 + (taxValue ?? 0.15) / 100);
      }
    }
    form.setFieldValue('totalPrice', totalPrice.toFixed(2));
  }, [transactionTypeSelected, volumeValue, marketPriceValue, feeValue, taxValue]);

  useEffect(() => {
    if (transactionTypeSelected && stockAccountIdValue && transactionTypeSelected === TransactionType.SELL) {
      fetchPortfolio(stockAccountIdValue);
    } else {
      handleFetchStock();
    }
  }, [transactionTypeSelected]);

  // const onBackButtonEvent = e => {
  //   e.preventDefault();
  //   if (isDirty) {
  //     showConfirmModal({
  //       content: MESSAGE_WARNING_CHANGE_DATA,
  //       title: 'Cảnh báo',
  //       handleConfirm() {
  //         navigate(-1);
  //       },
  //     });
  //   }
  // };

  const innitData = () => {
    // get detail
    if (id) {
      dispatch(getDetailTransaction(id));
    }
    // công ty chứng khoán
    dispatch(fetchSecuritiesCompany());
    // loại giao dịch
    dispatch(fetchTransactionType());
  };

  const handleSubmit = values => {
    const endDate = isChecked ? dayjs(values.limitedTill).format(DATE_FORMAT_PAYLOAD) : undefined;
    const payload = {
      ...values,
      stockTransactionId: id,
      marketPrice: values.marketPrice * 1000,
      fee: values.fee ?? 0,
      tax: values.tax ?? 0.15,
      totalPrice: values.totalPrice ?? 0,
      date: dayjs.utc(values.date).format(),
      isLimited: isChecked,
      limitedTill: endDate,
      userId: 2,
    };
    if (id) {
      dispatch(updateTransaction(payload)).then(result => {
        if (result.payload) {
          handleClose();
        }
      });
    } else {
      dispatch(createTransaction(payload)).then(result => {
        if (result.payload) {
          handleClose();
        }
      });
    }
  };

  const handleClose = () => {
    form.resetFields();
    navigate('/transaction', {
      state: { filter },
    });
  };

  const handlePopupScrollStock = e => {
    const currentPage = handlePopupScroll({ e, currentPage: currentPageStock, totalPages: totalPagesStock });
    if (currentPage) {
      setCurrentPageStock(currentPage);
      handleFetchStock(null, currentPage);
    }
  };

  const handleChangeCTCK = (value: number) => {
    // tài khoản
    form.setFieldValue('stockAccountId', null);
    fetchAccountSecurities(value);
  };

  // Function to filter options based on the input value
  const filterOption = (inputValue, option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

  const handleCheckLimit = (value: boolean) => {
    setIsChecked(value);
  };

  const fetchDataOnSearch = (value: string) => {
    handleFetchStock(value);
  };

  const fetchAccountSecurities = async value => {
    const response = await dispatch(fetchAccountBySecuritiesCompany(value));
    if (response.payload) {
      const payload = response.payload as any;
      const result = payload.data.data?.map((item: any) => {
        return {
          value: item.accountId,
          label: item.accountBeautyName,
        };
      });
      setSecuritiesCompany(result);
    }
  };

  const handleChangeTKCK = value => {
    if (transactionTypeSelected && transactionTypeSelected !== TransactionType.BUY) {
      fetchPortfolio(value);
    } else {
      handleFetchStock();
    }
  };

  const handleFetchStock = async (search = null, pagePayLoad = 1) => {
    const response = await dispatch(fetchStock({ searchText: search, pageSize: pagePayLoad }));
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
        const pageCurrent = pagePayLoad ?? currentPageStock;
        let newStocks = pageCurrent > 1 ? [...cloneArr] : [];
        newStocks = newStocks.concat(stocks);
        setArrayStock(newStocks);
      }
    }
  };

  const fetchPortfolio = async (idTkCK: number, pageNumber = 1) => {
    const response = await dispatch(fetchPortfolioByAccountId({ page: pageNumber, limit: ITEMS_PER_PAGE, accountId: idTkCK }));
    if (response.payload) {
      const result = response.payload as any;
      if (result.data) {
        handleArrayStock(result.data?.data ?? [], pageNumber);
      }
    }
  };

  const handleChangeTransactionType = async value => {
    if (value !== TransactionType.SELL) value = TransactionType.BUY;
    // get config fee,tax
    const response = await dispatch(fetchConfigTransactionType(value));
    if (response.payload) {
      const result = response.payload as any;
      if (result.data) {
        result.data.map(x => {
          form.setFieldValue(x.configKey, x.configValue);
        });
      }
    }
  };

  const handleArrayStock = (array: any[], payLoadPage: number) => {
    const stocks = array.map(x => {
      return {
        value: x.stockSymbol,
        label: x.stockSymbol,
      };
    });
    const cloneArr = [...arrayStock];
    let newStocks = payLoadPage > 1 ? [...cloneArr] : [];
    newStocks = newStocks.concat(stocks);
    setArrayStock(newStocks);
  };

  const handleFormChange = () => {
    setIsDirty(true);
  };

  return (
    <Container>
      <Form
        onValuesChange={handleFormChange}
        className="multiple-form-horizontal"
        size="large"
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Title level={3}>{`${id ? 'Cập nhật' : 'Thêm mới'} thông tin giao dịch hàng ngày`}</Title>
        <Row>
          <Col md={11}>
            <Form.Item label="CTCK" rules={[{ required: true, message: 'Hãy chọn công ty chứng khoán' }]} name={'securitiesCompanyId'}>
              <Select
                className="w-100"
                onChange={handleChangeCTCK}
                showSearch
                filterOption={filterOption}
                options={dataSecurities}
                placeholder="Chọn công ty chứng khoán"
              />
            </Form.Item>
          </Col>
          <Col md={1}></Col>
          <Col md={12}>
            <Form.Item label="Tài khoản" rules={[{ required: true, message: 'Hãy chọn tài khoản' }]} name={'stockAccountId'}>
              <Select
                onChange={e => {
                  handleChangeTKCK(e);
                }}
                className="w-100"
                size="large"
                options={securitiesCompany}
                placeholder="Chọn tài khoản"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={11}>
            <Form.Item label="Loại GD" rules={[{ required: true, message: 'Hãy chọn loại giao dịch' }]} name={'transactionTypeId'}>
              <Select
                size="large"
                onChange={e => {
                  handleChangeTransactionType(e);
                }}
                options={transactionType.map(item => {
                  return {
                    label: item.transactionTypeName,
                    value: item.transactionTypeId,
                  };
                })}
                placeholder="Chọn loại giao dịch"
              />
            </Form.Item>
          </Col>
          <Col md={1}></Col>
          <Col md={12}>
            <Form.Item label="Mã CP" rules={[{ required: true, message: 'Hãy chọn mã cổ phiếu' }]} name={'stockSymbol'}>
              <Select
                onSearch={fetchDataOnSearch}
                showSearch
                allowClear
                onClear={() => {
                  fetchDataOnSearch('');
                }}
                size="large"
                onPopupScroll={handlePopupScrollStock}
                options={arrayStock}
                placeholder="Chọn mã cổ phiếu"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={5}>
            <Form.Item label="Số lượng" name={'volume'}>
              <InputNumber className="w-100" formatter={formatVND} parser={parseVND} placeholder="Nhập số lượng" min={1} />
            </Form.Item>
          </Col>
          <Col md={1}></Col>
          <Col md={5}>
            <Form.Item initialValue={0} label="Giá (ngđ)" name={'marketPrice'}>
              <InputNumber formatter={formatVND} parser={parseFloatVND} className="w-100" placeholder="Nhập vào giá" min={0.0} />
            </Form.Item>
          </Col>
          <Col md={1}></Col>
          <Col md={5}>
            <Form.Item initialValue={0} label="Phí (%)" name={'fee'}>
              <InputNumber step={0.01} precision={2} className="w-100" placeholder="Nhập vào phí" min={0} />
            </Form.Item>
          </Col>
          <Col md={1}></Col>
          <Col md={6}>
            <Form.Item initialValue={0.15} label="Thuế (%)" name={'tax'}>
              <InputNumber step={0.01} precision={2} className="w-100" placeholder="Nhập vào thuế" min={0} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={11}>
            <Form.Item label="Tổng giá trị(đ)" name={'totalPrice'}>
              <InputNumber formatter={formatVND} parser={parseVND} className="w-100" readOnly />
            </Form.Item>
          </Col>
          <Col md={1}></Col>
          <Col md={12}>
            <Form.Item initialValue={dayjs()} label="Ngày thực hiện" name={'date'}>
              <DatePicker showTime className="w-100" placeholder="Chọn ngày thực hiện" format={APP_DATE_FORMAT} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={5}>
            <Form.Item label="HCCN" valuePropName="checked" name={'isLimited'}>
              <Checkbox
                disabled={transactionTypeSelected === TransactionType.SELL}
                checked={isChecked}
                onChange={e => {
                  handleCheckLimit(e.target.checked);
                }}
              />
              Có
            </Form.Item>
          </Col>
          <Col md={1} />
          <Col md={5}>
            <Form.Item label="Ngày KT HCCN" rules={[{ required: isChecked, message: 'Hãy chọn ngày hết thúc HCCN' }]} name={'limitedTill'}>
              <DatePicker placeholder="Chọn ngày kết thúc" disabled={!isChecked} className="w-100" format={APP_LOCAL_DATE_FORMAT} />
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
    </Container>
  );
};

export default TransactionDetailFormComponent;
