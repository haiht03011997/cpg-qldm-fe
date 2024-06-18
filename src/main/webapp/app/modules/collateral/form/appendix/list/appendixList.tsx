import { PlusOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip, notification } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import ModalConfirmComponent from 'app/shared/component/modal/confirm';
import TableComponent from 'app/shared/component/table/table';
import { deleteCollateral, getDetailCollateral } from 'app/shared/reducers/collateral/form/collateral.reducers';
import { fetchContractAddendum } from 'app/shared/reducers/collateral/form/contractAddendum/view/contractAddendum.reduces';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppendixFormComponent from '../form/appendixForm';
import { columnsAppendix } from './config';
import './style.scss';
import { deleteContractAddendum } from 'app/shared/reducers/collateral/form/contractAddendum/form/contractAddendum.reducers';
import AppendixAustFormComponent from '../form/appendixAustForm';

const AppendixListComponent = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [visibleConfirmDelete, setVisibleConfirmDelete] = useState(false);
  const [idDeleteSelected, setIdDeleteSelected] = useState(null);
  const [idEditSelected, setIdEditSelected] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [isOpenAdjust, setOpenAdjust] = useState(false);
  const [adjustId, setAdjustId] = useState(null);
  const { data } = useAppSelector(state => state.contractAddendumCollateralView);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [expandedData, setExpandedData] = useState([]);

  const columnConfig = [
    ...columnsAppendix,
    {
      title: '',
      key: 'Action',
      fixed: 'right',
      width: 100,
      render: (item: any) => (
        <div className="action">
          <span className="action-edit">
            <Tooltip title="Điều chỉnh">
              {!item.parentContractAddendumCollateralId ? (
                <img
                  onClick={() => {
                    handleAdjust(item);
                  }}
                  className="icon"
                  src="content/images/icons/circular-arrow.svg"
                />
              ) : (
                <Tooltip title="Sửa thông tin điều chỉnh">
                  <FontAwesomeIcon
                    onClick={() => {
                      handleAdjust(item);
                    }}
                    icon="pencil-alt"
                  />
                </Tooltip>
              )}
            </Tooltip>
          </span>
          {!item.parentContractAddendumCollateralId && (
            <span className="action-edit">
              <Tooltip title="Sửa">
                <FontAwesomeIcon
                  onClick={() => {
                    handleEdit(item.contractAddendumCollateralId);
                  }}
                  icon="pencil-alt"
                />
              </Tooltip>
            </span>
          )}
          <span className="action-delete">
            <Tooltip title="Xóa">
              <FontAwesomeIcon
                onClick={() => {
                  handleWarningDeleteItem(item.contractAddendumCollateralId);
                }}
                icon="trash"
              />
            </Tooltip>
          </span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchAllContractAddendum();
  }, []);

  useEffect(() => {
    if (data.capitalRepresentatives) {
      setExpandedData(data.capitalRepresentatives);
    }
  }, [data]);

  const fetchAllContractAddendum = () => {
    // get detail
    if (id) {
      dispatch(fetchContractAddendum(id));
      dispatch(getDetailCollateral(id));
    }
  };

  const handleWarningDeleteItem = (collateralId: number) => {
    setVisibleConfirmDelete(true);
    setIdDeleteSelected(collateralId);
  };

  const handleConfirmDelete = () => {
    if (idDeleteSelected) {
      dispatch(deleteContractAddendum(idDeleteSelected))
        .then(() => {
          fetchAllContractAddendum();
        })
        .finally(() => {
          setVisibleConfirmDelete(false);
        });
    }
  };

  const handleCloseModal = (reloaded = false) => {
    if (reloaded) {
      fetchAllContractAddendum();
    }
    setOpenAdjust(false);
    setAdjustId(null);
    setOpen(false);
    setIdEditSelected(null);
  };

  const handleEdit = (collateralId: number) => {
    setOpen(true);
    setIdEditSelected(collateralId);
  };
  const handleAdjust = (item: any) => {
    setOpenAdjust(true);
    setIdEditSelected(item.contractAddendumCollateralId);
    setAdjustId(item.parentContractAddendumCollateralId);
  };

  const handleExpandedDate = (isExpand: boolean, record: any) => {
    if (isExpand) {
      setExpandedData(record.contractAddendumCollaterals);
      setExpandedRowKeys([record.key]);
    } else {
      setExpandedRowKeys([]);
    }
  };

  const expandedRowRender = () => {
    return <TableComponent columns={columnConfig} data={expandedData} isFetching={false} noPagination={true} />;
  };

  return (
    <div className="form-list-view">
      <span className="title">Danh sách phụ lục hợp đồng</span>
      <Tooltip title="Thêm mới phụ lục">
        <Button
          className="action-add"
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => {
            setOpen(true);
          }}
        />
      </Tooltip>
      <TableComponent
        expandedRowRender={expandedRowRender}
        handleExpand={(expanded: boolean, record: any) => {
          handleExpandedDate(expanded, record);
        }}
        expandedRowKeys={expandedRowKeys}
        noBordered={true}
        data={data.map((item, index) => {
          return {
            key: index.toString(),
            ...item,
          };
        })}
        rowExpandable={record => record.contractAddendumCollaterals.length > 0}
        noPagination={true}
        columns={columnConfig}
        isFetching={false}
      />
      <ModalConfirmComponent
        visible={visibleConfirmDelete}
        onCancel={() => {
          setVisibleConfirmDelete(false);
        }}
        onConfirm={handleConfirmDelete}
        title="Bạn có muốn xóa phụ lục hợp đồng"
      />
      <AppendixFormComponent
        isOpen={isOpen}
        id={idEditSelected}
        onCancel={reloaded => {
          handleCloseModal(reloaded);
        }}
      />
      <AppendixAustFormComponent
        isOpen={isOpenAdjust}
        id={idEditSelected}
        onCancel={reloaded => {
          handleCloseModal(reloaded);
        }}
        adjustId={adjustId}
      />
    </div>
  );
};

export default AppendixListComponent;
