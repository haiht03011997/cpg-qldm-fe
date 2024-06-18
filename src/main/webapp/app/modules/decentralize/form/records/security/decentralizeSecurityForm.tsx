import { Tree } from 'antd';
import { ACTION } from 'app/config/constants';
import { useAppSelector } from 'app/config/store';
import { IDecentralize } from 'app/shared/model/decentralize/form/form.modal';
import * as _ from 'lodash';
import React, { useEffect, useState } from 'react';
const { TreeNode } = Tree;

type IDecentralizeRecord = {
  userLogin: string;
  handlePayload: (payload: IDecentralize[]) => void;
};

const DecentralizeSecurityCompanyForm = ({ userLogin, handlePayload }: IDecentralizeRecord) => {
  const { data: detail } = useAppSelector(state => state.decentralizeForm);
  const { data: treeSecurityCompany } = useAppSelector(state => state.buildTreeSecurityCompany);
  const [autoExpandParent] = useState(true);
  const [checkedKeyRecords, setCheckedKeyRecords] = useState([]);

  useEffect(() => {
    if (detail.length >= 0) {
      const arrayRecords = _.filter(detail, value => {
        return value.permission === 'p3';
      });
      handleDefaultCheckedKeyRecords(arrayRecords);
    }
  }, [detail]);

  useEffect(() => {
    if (checkedKeyRecords) {
      handleFormPayload();
    }
  }, [checkedKeyRecords]);

  const handleDefaultCheckedKeyRecords = arrayRecords => {
    let defaultKeys = [];
    arrayRecords.forEach(element => {
      const item = findItemByAction(element, treeSecurityCompany);
      if (item) {
        if (item.key) {
          defaultKeys = processKeys(item, defaultKeys, element.actions);
        } else {
          const childItem = findItemByAction(element, item.items);
          if (childItem) {
            defaultKeys = processKeys(childItem, defaultKeys, element.actions);
          }
        }
      }
    });
    setCheckedKeyRecords(defaultKeys);
  };

  const processKeys = (item, defaultKeys, actions) => {
    const childKeys = item.items?.map(value => value.key);
    if (_.find(actions, act => act === ACTION.ALL)) {
      defaultKeys.push(item.key);
      if (childKeys.length > 0) {
        defaultKeys = defaultKeys.concat(childKeys);
      }
    } else {
      if (childKeys.length > 0) {
        const keys = _.filter(childKeys, key => _.some(actions, act => key?.includes(act)));
        defaultKeys = defaultKeys.concat(keys);
      }
    }
    return defaultKeys;
  };

  const handleFormPayload = () => {
    let payloadRecords: IDecentralize[] = [];
    const groupedActions = checkedKeyRecords.reduce((acc, action) => {
      const [actionType, actionOperation] = action.toString().split('/');

      if (!acc[actionType]) {
        acc[actionType] = [];
      }
      if (actionOperation) {
        acc[actionType].push(actionOperation);
      }

      return acc;
    }, {});

    const arrayOfObjects = Object.entries(groupedActions).map(([companyId, actions]: any) => {
      const result: IDecentralize = {
        userLogin,
        type: 'stockAccount', // Đối tượng
        companyId, // Id công ty chứng khoán
        permission: 'p3', // policy casbin
        actions,
      };
      if (actions.includes(ACTION.ALL)) {
        return {
          ...result,
          actions: [`${ACTION.ALL}`],
        };
      } else {
        return result;
      }
    });
    payloadRecords = payloadRecords.concat(arrayOfObjects);
    handlePayload(payloadRecords);
  };

  const findItemByAction = (element, array) => {
    return _.find(array, item => {
      const [value] = item.key.split('/'); // Split each element by '/' and get the second part
      return (
        value.includes(element.companyId) || // Check if the second part is present in array2
        _.some(item.items, child => {
          const [valueChildren] = child.key.split('/'); // Split each element by '/' and get the second part
          return valueChildren.includes(element.companyId); // Check if the second part is present in array2
        })
      );
    });
  };

  const onCheck = (checkedKeysValue: React.Key[]) => {
    if (checkedKeysValue) {
      setCheckedKeyRecords(checkedKeysValue);
    }
  };

  const renderTreeNodes = nodes => {
    return nodes.map(({ title, key, items }) => {
      return (
        <TreeNode title={title} key={key}>
          {items && renderTreeNodes(items)}
        </TreeNode>
      );
    });
  };

  return (
    <Tree checkable autoExpandParent={autoExpandParent} onCheck={onCheck} checkedKeys={checkedKeyRecords}>
      {renderTreeNodes(treeSecurityCompany)}
    </Tree>
  );
};
export default DecentralizeSecurityCompanyForm;
