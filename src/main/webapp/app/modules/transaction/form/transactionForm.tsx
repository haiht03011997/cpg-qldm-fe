import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, DatePicker, Form, InputNumber, Row, Select, notification } from 'antd';
import Title from 'antd/es/typography/Title';
import { APP_LOCAL_DATE_FORMAT, DATE_FORMAT_PAYLOAD } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { TransactionType } from 'app/shared/enum/enum';
import { IOptionProps } from 'app/shared/model/modal';
import { fetchAccountBySecuritiesCompany } from 'app/shared/reducers/account/account.reducer';
import { fetchSecuritiesCompany } from 'app/shared/reducers/company/company.reducer';
import { fetchStock } from 'app/shared/reducers/stock/stock.reducer';
import { createBulkTransaction, createTransaction } from 'app/shared/reducers/transaction/form/transaction.reduces';
import { fetchTransactionType } from 'app/shared/reducers/transaction/type/transactionType.reducer';
import { formatVND, parseVND } from 'app/shared/util/money-utils';
import { handlePopupScroll } from 'app/shared/util/select-utils';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './style.scss';
import { fetchConfigTransactionType } from 'app/shared/reducers/config/config.reducer';
import { fetchPortfolioByAccountId } from 'app/shared/reducers/portfolio/portfolio.reducer';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

const TransactionFormComponent = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { filter } = location.state || {};
  const { data: transactionType } = useAppSelector(state => state.transactionType);
  const { dataSecurities } = useAppSelector(state => state.company);
  const { data: stock, page, total: totalPagesStock } = useAppSelector(state => state.stock);
  const [requiredEndDate, setRequiredEndDate] = useState([]);
  const [arrayStock, setArrayStock] = useState<IOptionProps[]>([]);
  const [securitiesAccount, setSecuritiesAccount] = useState<IOptionProps[]>([]);
  const [currentPageStock, setCurrentPageStock] = useState(page);


  const transactionTypeSelected = Form.useWatch('transactionTypeId', form);
  const feeValue = Form.useWatch('fee', form);
  const taxValue = Form.useWatch('tax', form);
  const stockAccountIdValue = Form.useWatch('stockAccountId', form);

  useEffect(() => {
    innitData();
  }, []);

  useEffect(() => {
    if (transactionTypeSelected && stockAccountIdValue && transactionTypeSelected === TransactionType.SELL) {
      fetchPortfolio(stockAccountIdValue);
    } else {
      handleFetchStock();
    }
  }, [transactionTypeSelected]);

  useEffect(() => {
    if (stock.length > 0) {
      let newStocks = currentPageStock > 1 ? [...arrayStock] : [];
      newStocks = newStocks.concat(stock);
      setArrayStock(newStocks);
    }
  }, [stock]);

  const innitData = () => {
    // công ty chứng khoán
    dispatch(fetchSecuritiesCompany());
    // cổ phiếu
    dispatch(fetchStock({ pageSize: currentPageStock }));
    // loại giao dịch
    dispatch(fetchTransactionType());
  };

  const handleSubmit = values => {
    const payload = {
      ...values,
      fee: values.fee ?? 0,
      date: dayjs.utc(values.date).format(),
      tax: values.tax ?? 0.15,
      items: values.items?.map(item => {
        const endDate = item.isLimited ? dayjs(item.limitedTill).format(DATE_FORMAT_PAYLOAD) : undefined;
        return {
          ...item,
          totalPrice: item.totalPrice ?? 0,
          limitedTill: endDate,
          marketPrice: item.marketPrice * 1000,
          userId: 2,
        };
      })
    }
    dispatch(createBulkTransaction(payload))
      .then(res => {
        if (res && res.payload) {
          handleClose();
        }
      })
      .catch((error) => {
        notification.error({
          message: 'Lỗi',
          description: error.message,
        });
        return;
      });
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
      dispatch(fetchStock({ pageSize: currentPage }));
    }
  };

  const handleChangeCTCK = (value: number) => {
    // tài khoản
    form.setFieldValue('stockAccountId', null);
    fetchAccountSecurities(value);
  };

  const handleChangeTKCK = value => {
    if (transactionTypeSelected && transactionTypeSelected !== TransactionType.BUY) {
      fetchPortfolio(value);
    } else {
      handleFetchStock();
    }
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
      setSecuritiesAccount(result);
    }
  };

  const onValuesChange = (_, values) => {
    const updatedItems = values.items.map(item => {
      let total = 0;
      if (values?.transactionTypeId) {
        if (values.transactionTypeId !== TransactionType.BUY) {
          total = (item.volume ?? 0) * (item.marketPrice ?? 0) * (1 + (values.fee ?? 0) / 100 + (values.tax ?? 0.15) / 100);
        } else {
          total =
            (item.volume ?? 0) * (item.marketPrice ?? 0) -
            (item.volume ?? 0) * (item.marketPrice ?? 0) * ((values.fee ?? 0) / 100 + (values.tax ?? 0.15) / 100);
        }
      }
      return {
        ...item,
        totalPrice: total.toFixed(2),
      };
    });
    form.setFieldsValue({ items: updatedItems });
  };

  // Function to filter options based on the input value
  const filterOption = (inputValue, option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

  const fetchDataOnSearch = (value: string) => {
    dispatch(fetchStock({ searchText: value, pageSize: 1 }));
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

  const handleChangeHCCN = (e, name) => {
    const isChecked = e.target.checked;
    const cloneRequiredEndDate = [...requiredEndDate]
    cloneRequiredEndDate[name] = isChecked
    setRequiredEndDate(cloneRequiredEndDate)
    if (!isChecked) {
      form.setFieldsValue({
        items: form.getFieldValue('items').map((item, index) =>
          index === name ? { ...item, limitedTill: null } : item
        ),
      });
    }
  };

  return (
    <Form
      size="large"
      className="multiple-form-horizontal"
      form={form}
      initialValues={{ items: [{}] }}
      onFinish={handleSubmit}
      layout="vertical"
      onValuesChange={onValuesChange}
    >
      <Title level={3}>Thêm mới giao dịch hàng ngày</Title>
      <Row>
        <Col md={11}>
          <Form.Item
            label="CTCK"
            name={'securitiesCompanyId'}
            rules={[{ required: true, message: 'Hãy chọn công ty chứng khoán' }]}
          >
            <Select
              size="large"
              showSearch
              filterOption={filterOption}
              onChange={handleChangeCTCK}
              options={dataSecurities}
              placeholder="Chọn công ty chứng khoán"
            />
          </Form.Item>
        </Col>
        <Col md={1} />
        <Col md={12}>
          <Form.Item
            label="Tài khoản"
            rules={[{ required: true, message: 'Hãy chọn tài khoản' }]}
            name={'stockAccountId'}
          >
            <Select onChange={e => {
              handleChangeTKCK(e);
            }} size="large" options={securitiesAccount} placeholder="Chọn tài khoản" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col md={11}>
          <Form.Item
            label="Loại GD"
            rules={[{ required: true, message: 'Hãy chọn loại giao dịch' }]}
            name={'transactionTypeId'}
          >
            <Select
              size="large"
              onChange={e => {
                handleChangeTransactionType(e);
              }}
              filterOption={filterOption}
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
        <Col md={1} />
        <Col md={12}>
          <Form.Item rules={[{ required: true, message: 'Vui lòng chọn ngày thực hiện' }]} initialValue={dayjs()} label="Ngày thực hiện" name={'date'}>
            <DatePicker className="w-100" format={APP_LOCAL_DATE_FORMAT} placeholder='Chọn ngày thực hiện' />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col md={11}>
          <Form.Item label="Phí (%)" name={'fee'}>
            <InputNumber className="w-100" placeholder="Nhập vào phí" defaultValue={0.0} min={0.0} />
          </Form.Item>
        </Col>
        <Col md={1} />
        <Col md={12}>
          <Form.Item label="Thuế (%)" name={'tax'}>
            <InputNumber className="w-100" placeholder="Nhập vào thuế" defaultValue={0.15} min={0.0} />
          </Form.Item>
        </Col>
      </Row>
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} className="form-horizontal">
                <Row className='w-100'>
                  <Col md={4}>
                    <Form.Item label="Mã CP" rules={[{ required: true, message: 'Hãy chọn mã cổ phiếu' }]} name={[name, 'stockSymbol']}>
                      <Select
                        showSearch
                        onSearch={fetchDataOnSearch}
                        size="large"
                        onClear={() => {
                          fetchDataOnSearch('');
                        }}
                        onPopupScroll={handlePopupScrollStock}
                        options={arrayStock}
                        placeholder="Chọn mã cổ phiếu"
                      />
                    </Form.Item>
                  </Col>
                  <Col md={4}>
                    <Form.Item label="Khối lượng" name={[name, 'volume']}>
                      <InputNumber className="w-100" placeholder="Nhập số lượng" min={1} />
                    </Form.Item>
                  </Col>
                  <Col md={4}>
                    <Form.Item label="Giá (ngđ)" name={[name, 'marketPrice']}>
                      <InputNumber formatter={formatVND} parser={parseVND} className="w-100" placeholder="Nhập vào giá" min={0.0} />
                    </Form.Item>
                  </Col>
                  <Col md={4}>
                    <Form.Item label="Tổng giá trị (ngđ)" name={[name, 'totalPrice']}>
                      <InputNumber formatter={formatVND} parser={parseVND} className="w-100" readOnly />
                    </Form.Item>
                  </Col>

                  <Col md={2}>
                    <Form.Item label="HCCN" name={[name, 'isLimited']}>
                      <Checkbox onChange={(e) => handleChangeHCCN(e, name)} />
                      Có
                    </Form.Item>
                  </Col>
                  <Col md={5}>
                    <Form.Item
                      label="Ngày KT HCCN"
                      rules={[{ required: requiredEndDate[name], message: 'Hãy chọn ngày hết thúc HCCN' }]}
                      name={[name, 'limitedTill']}
                    >
                      <DatePicker
                        placeholder="Chọn ngày kết thúc"
                        disabled={!requiredEndDate[name]}
                        className="w-100"
                        format={APP_LOCAL_DATE_FORMAT}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                {name > 0 && (
                  <MinusCircleOutlined
                    className="minus-circle-outlined"
                    onClick={() => {
                      remove(name);
                    }}
                  />
                )}
              </div>
            ))}
            <Form.Item>
              <PlusCircleOutlined
                className="plus-circle-outlined"
                onClick={() => {
                  add();
                }}
              />
            </Form.Item>
          </>
        )}
      </Form.List>

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
                navigate(-1);
              }}
            >
              Hủy
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
};

export default TransactionFormComponent;
