import { PlusOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import ModalConfirmComponent from 'app/shared/component/modal/confirm';
import TableComponent from 'app/shared/component/table/table';
import { deleteCapitalRepresentative } from 'app/shared/reducers/representative/form/capitalRepresentative/form/capitalRepresentative.reducers';
import { fetchCapitalRepresentative } from 'app/shared/reducers/representative/form/capitalRepresentative/view/capitalRepresentative.reduces';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CapitalFormComponent from '../form/capitalForm';
import { columnsAppendix, columnsAppendixExpand } from './config';
import './style.scss';
import UnInvestFormComponent from '../form/unInvestForm';
import { ICapitalRepresentative } from 'app/shared/model/representative/form/capitalRepresentative/view/view.model';
import { StatusRepresentativeType } from 'app/shared/enum/enum';

const CapitalListComponent = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [visibleConfirmDelete, setVisibleConfirmDelete] = useState(false);
  const [idSelected, setIdSelected] = useState(null);
  const [dataSelected, setDataSelected] = useState<ICapitalRepresentative>(null);
  const [isOpen, setOpen] = useState(false);
  const [isOpenUnInvest, setOpenUnInvest] = useState(false);
  const { data } = useAppSelector(state => state.capitalRepresentativeView);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [expandedData, setExpandedData] = useState([]);

  const columnConfig = [
    ...columnsAppendixExpand,
    {
      title: '',
      key: 'Action',
      fixed: 'right',
      width: 100,
      render: (item: any) => (
        <div className="action">
          {item.status !== StatusRepresentativeType.INACTIVE &&
            item.status !== StatusRepresentativeType.EXPIRED &&
            (!item.unInvestId ? (
              <span className="action-adjust">
                <Tooltip title="Thôi ủy quyền">
                  <img
                    onClick={() => {
                      handleOpenUnInvest(item);
                    }}
                    className="icon"
                    src="content/images/icons/stopwatch-solid.svg"
                  />
                </Tooltip>
              </span>
            ) : (
              <span className="action-edit">
                <Tooltip title="Sửa">
                  <FontAwesomeIcon
                    onClick={() => {
                      handleOpenUnInvest(item);
                    }}
                    icon="pencil-alt"
                  />
                </Tooltip>
              </span>
            ))}
          {!item.unInvestId && (
            <span className="action-edit">
              <Tooltip title="Sửa">
                <FontAwesomeIcon
                  onClick={() => {
                    handleEdit(item.capitalRepresentativeId);
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
                  handleWarningDeleteItem(item.capitalRepresentativeId);
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
    fetchAllCapitalRepresentative();
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      setExpandedData(data[expandedRowKeys[0]]?.capitalRepresentatives);
    }
  }, [data]);

  const fetchAllCapitalRepresentative = () => {
    // get detail
    if (id) {
      dispatch(fetchCapitalRepresentative(id));
    }
  };

  const handleWarningDeleteItem = (representativeId: number) => {
    setVisibleConfirmDelete(true);
    setIdSelected(representativeId);
  };

  const handleConfirmDelete = () => {
    if (idSelected) {
      dispatch(deleteCapitalRepresentative(idSelected))
        .then(() => {
          fetchAllCapitalRepresentative();
        })
        .finally(() => {
          setVisibleConfirmDelete(false);
        });
    }
  };

  const handleCloseModal = (reloaded = false) => {
    if (reloaded) {
      fetchAllCapitalRepresentative();
    }
    setOpenUnInvest(false);
    setOpen(false);
    setDataSelected(null);
    setIdSelected(null);
  };

  const handleEdit = (capitalRepresentativeId: string) => {
    setOpen(true);
    setIdSelected(capitalRepresentativeId);
  };

  const handleOpenUnInvest = (item: ICapitalRepresentative) => {
    setOpenUnInvest(true);
    setDataSelected(item);
  };

  const handleExpandedDate = (isExpand: boolean, record: any) => {
    if (isExpand) {
      setExpandedData(record.capitalRepresentatives);
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
      <span className="title">Danh sách đại diện vốn</span>

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
        noPagination={true}
        columns={columnsAppendix}
        isFetching={false}
      />
      <ModalConfirmComponent
        visible={visibleConfirmDelete}
        onCancel={() => {
          setVisibleConfirmDelete(false);
        }}
        onConfirm={handleConfirmDelete}
        title="Bạn có muốn xóa đại diện vốn?"
      />
      <CapitalFormComponent
        isOpen={isOpen}
        id={idSelected}
        onCancel={reloaded => {
          handleCloseModal(reloaded);
        }}
      />
      <UnInvestFormComponent
        isOpen={isOpenUnInvest}
        onCancel={reloaded => {
          handleCloseModal(reloaded);
        }}
        dataSelected={dataSelected}
      />
    </div>
  );
};

export default CapitalListComponent;
