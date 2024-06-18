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
import { createTransaction } from 'app/shared/reducers/transaction/form/transaction.reduces';
import { fetchTransactionType } from 'app/shared/reducers/transaction/type/transactionType.reducer';
import { formatVND, parseVND } from 'app/shared/util/money-utils';
import { handlePopupScroll } from 'app/shared/util/select-utils';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.scss';

const TransactionFormComponent = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: transactionType } = useAppSelector(state => state.transactionType);
  const { dataSecurities } = useAppSelector(state => state.company);
  const { data: stock, page, total: totalPagesStock } = useAppSelector(state => state.stock);
  const [isRequiredEndDate, setRequiredEndDate] = useState(false);
  const [arrayTransactionType, setArrayTransactionType] = useState<IOptionProps[][]>([]);
  const [arrayStock, setArrayStock] = useState<IOptionProps[]>([]);
  const [currentPageStock, setCurrentPageStock] = useState(page);

  useEffect(() => {
    innitData();
  }, []);

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
    const payload = values.items?.map(item => {
      const endDate = item.isLimited ? dayjs(item.limitedTill).format(DATE_FORMAT_PAYLOAD) : undefined;
      return {
        ...item,
        fee: item.fee ?? 0,
        tax: item.tax ?? 0.15,
        totalPrice: item.totalPrice ?? 0,
        date: dayjs(item.date).format(DATE_FORMAT_PAYLOAD),
        limitedTill: endDate,
        userId: 2,
      };
    });
    dispatch(createTransaction(payload))
      .then(
        () => {
          notification.success({
            message: 'Tạo mới thành công',
          });
        },
        error => {
          notification.error({
            message: 'Lỗi',
            description: error.message,
          });
        },
      )
      .finally(() => {
        handleClose();
      });
  };

  const handleClose = () => {
    form.resetFields();
    navigate(-1);
  };

  const handlePopupScrollStock = e => {
    const currentPage = handlePopupScroll({ e, currentPage: currentPageStock, totalPages: totalPagesStock });
    if (currentPage) {
      setCurrentPageStock(currentPage);
      dispatch(fetchStock({ pageSize: currentPage }));
    }
  };

  const handleChangeCTCK = async (id: number, name: number) => {
    // tài khoản
    const response = await dispatch(fetchAccountBySecuritiesCompany(id));
    if (response && response.payload) {
      const result = response.payload as any;
      const data = [...arrayTransactionType];
      (data[name] = result.data?.data?.map((item: any) => {
        return {
          label: item.accountNumber,
          value: item.accountId,
        };
      })),
        setArrayTransactionType(data);
    }
  };

  const onValuesChange = (_, values) => {
    const updatedItems = values.items.map(item => {
      let total = 0;
      if (item?.transactionTypeId) {
        if (item.transactionTypeId !== TransactionType.BUY) {
          total = (item.volume ?? 0) * (item.marketPrice ?? 0) * (1 + (item.fee ?? 0) / 100 + (item.tax ?? 0.15) / 100);
        } else {
          total =
            (item.volume ?? 0) * (item.marketPrice ?? 0) -
            (item.volume ?? 0) * (item.marketPrice ?? 0) * ((item.fee ?? 0) / 100 + (item.tax ?? 0.15) / 100);
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
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} className="form-horizontal">
                <Row>
                  <Col md={2}>
                    <Form.Item
                      label="CTCK"
                      name={[name, 'securitiesCompanyId']}
                      rules={[{ required: true, message: 'Hãy chọn công ty chứng khoán' }]}
                    >
                      <Select
                        size="large"
                        showSearch
                        filterOption={filterOption}
                        onChange={e => {
                          handleChangeCTCK(e, name);
                        }}
                        options={dataSecurities}
                        placeholder="Chọn công ty chứng khoán"
                      />
                    </Form.Item>
                  </Col>
                  <Col md={2}>
                    <Form.Item
                      label="Tài khoản"
                      rules={[{ required: true, message: 'Hãy chọn tài khoản' }]}
                      name={[name, 'stockAccountId']}
                    >
                      <Select size="large" options={arrayTransactionType[name]} placeholder="Chọn tài khoản" />
                    </Form.Item>
                  </Col>
                  <Col md={2}>
                    <Form.Item
                      label="Loại GD"
                      rules={[{ required: true, message: 'Hãy chọn loại giao dịch' }]}
                      name={[name, 'transactionTypeId']}
                    >
                      <Select
                        size="large"
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
                  <Col md={2}>
                    <Form.Item label="Mã CP" rules={[{ required: true, message: 'Hãy chọn mã cổ phiếu' }]} name={[name, 'stockSymbol']}>
                      <Select
                        showSearch
                        onSearch={fetchDataOnSearch}
                        size="large"
                        onPopupScroll={handlePopupScrollStock}
                        options={arrayStock}
                        placeholder="Chọn mã cổ phiếu"
                      />
                    </Form.Item>
                  </Col>
                  <Col md={2}>
                    <Form.Item label="Khối lượng" name={[name, 'volume']}>
                      <InputNumber className="w-100" placeholder="Nhập số lượng" min={1} />
                    </Form.Item>
                  </Col>
                  <Col md={2}>
                    <Form.Item label="Giá (ngđ)" name={[name, 'marketPrice']}>
                      <InputNumber formatter={formatVND} parser={parseVND} className="w-100" placeholder="Nhập vào giá" min={0.0} />
                    </Form.Item>
                  </Col>
                  <Col md={2}>
                    <Form.Item label="Phí (%)" name={[name, 'fee']}>
                      <InputNumber className="w-100" placeholder="Nhập vào phí" defaultValue={0.0} min={0.0} />
                    </Form.Item>
                  </Col>
                  <Col md={2}>
                    <Form.Item label="Thuế (%)" name={[name, 'tax']}>
                      <InputNumber className="w-100" placeholder="Nhập vào thuế" defaultValue={0.15} min={0.0} />
                    </Form.Item>
                  </Col>
                  <Col md={2}>
                    <Form.Item label="Tổng giá trị (ngđ)" name={[name, 'totalPrice']}>
                      <InputNumber formatter={formatVND} parser={parseVND} className="w-100" readOnly />
                    </Form.Item>
                  </Col>
                  <Col md={2}>
                    <Form.Item label="Ngày thực hiện" name={[name, 'date']}>
                      <DatePicker className="w-100" format={APP_LOCAL_DATE_FORMAT} defaultValue={dayjs()} />
                    </Form.Item>
                  </Col>
                  <Col md={1}>
                    <Form.Item label="HCCN" name={[name, 'isLimited']}>
                      <Checkbox
                        onChange={e => {
                          setRequiredEndDate(e.target.checked);
                        }}
                      />
                      Có
                    </Form.Item>
                  </Col>
                  <Col md={2}>
                    <Form.Item
                      label="Ngày KT HCCN"
                      rules={[{ required: isRequiredEndDate, message: 'Hãy chọn ngày hết thúc HCCN' }]}
                      name={[name, 'limitedTill']}
                    >
                      <DatePicker
                        placeholder="Chọn ngày kết thúc"
                        disabled={!isRequiredEndDate}
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
